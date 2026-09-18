use std::fs;
use std::path::{Path, PathBuf};
use std::time::Duration;
use serde::{Deserialize, Serialize};
use semver::Version;
use tauri::{AppHandle, Emitter};


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateManifest {
    pub version: String,
    pub notes: String,
    pub pub_date: String,
    pub url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct PlatformEntry {
    signature: String,
    url: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct RawManifest {
    version: String,
    notes: String,
    pub_date: String,
    platforms: std::collections::HashMap<String, PlatformEntry>,
}

const MANIFEST_URL: &str =
    "https://github.com/akshaypalsra/Fybros-kutumb/releases/latest/download/latest.json";
const CHECK_INTERVAL_SECS: u64 = 60 * 60; // check every hour

#[tauri::command]
pub async fn check_for_updates_manual(
    current_version: String,
    manifest_url: String,
) -> Result<Option<UpdateManifest>, String> {
    let resp = reqwest::get(&manifest_url)
        .await
        .map_err(|e| format!("Failed to fetch manifest: {e}"))?;

    let raw: RawManifest = resp
        .json()
        .await
        .map_err(|e| format!("Failed to parse manifest: {e}"))?;

    let current = Version::parse(&current_version)
        .map_err(|e| format!("Invalid current version '{current_version}': {e}"))?;
    let latest = Version::parse(&raw.version)
        .map_err(|e| format!("Invalid manifest version '{}': {e}", raw.version))?;

    if latest <= current {
        return Ok(None);
    }

    let platform_key = if cfg!(target_arch = "aarch64") {
        "darwin-aarch64"
    } else {
        "darwin-x86_64"
    };

    let platform = raw
        .platforms
        .get(platform_key)
        .ok_or_else(|| format!("No entry for platform {platform_key}"))?;

    Ok(Some(UpdateManifest {
        version: raw.version,
        notes: raw.notes,
        pub_date: raw.pub_date,
        url: platform.url.clone(),
    }))
}

/// Downloads, extracts, and installs the update — but does NOT restart the app.
/// Call `restart_app` separately once the user confirms.
#[tauri::command]
pub async fn install_update_manual(download_url: String) -> Result<(), String> {
    let current_exe = std::env::current_exe().map_err(|e| e.to_string())?;
    let app_bundle_path = current_exe
        .parent().and_then(|p| p.parent()).and_then(|p| p.parent())
        .ok_or("Could not resolve .app bundle path")?
        .to_path_buf();

    let parent_dir = app_bundle_path
        .parent()
        .ok_or("Could not resolve parent directory")?
        .to_path_buf();

    let temp_dir = parent_dir.join(".update_staging_tmp");
    if temp_dir.exists() {
        fs::remove_dir_all(&temp_dir).ok();
    }
    fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;

    let archive_path = temp_dir.join("update.tar.gz");
    let resp = reqwest::get(&download_url).await.map_err(|e| e.to_string())?;
    let bytes = resp.bytes().await.map_err(|e| e.to_string())?;
    fs::write(&archive_path, &bytes).map_err(|e| e.to_string())?;

    let extract_dir = temp_dir.join("extracted");
    fs::create_dir_all(&extract_dir).map_err(|e| e.to_string())?;
    let tar_gz = fs::File::open(&archive_path).map_err(|e| e.to_string())?;
    let tar = flate2::read::GzDecoder::new(tar_gz);
    let mut archive = tar::Archive::new(tar);
    archive.unpack(&extract_dir).map_err(|e| e.to_string())?;

    let extracted_app = find_app_bundle(&extract_dir)
        .ok_or("Could not find .app bundle in extracted update")?;

    fs::remove_dir_all(&app_bundle_path).map_err(|e| e.to_string())?;
    fs::rename(&extracted_app, &app_bundle_path).map_err(|e| e.to_string())?;

    fs::remove_dir_all(&temp_dir).ok();

    // No restart here — installation is done, app is updated on disk,
    // but the currently-running process keeps running the OLD code in memory
    // until the user explicitly restarts.
    Ok(())
}

/// Called separately once the user clicks "Restart" in the UI.
#[tauri::command]
pub fn restart_app(app_handle: tauri::AppHandle) {
    app_handle.restart();
}

fn find_app_bundle(dir: &Path) -> Option<PathBuf> {
    for entry in fs::read_dir(dir).ok()? {
        let entry = entry.ok()?;
        let path = entry.path();
        if path.extension().and_then(|e| e.to_str()) == Some("app") {
            return Some(path);
        }
        if path.is_dir() {
            if let Some(found) = find_app_bundle(&path) {
                return Some(found);
            }
        }
    }
    None
}

// ---------- Auto update checker ----------

/// Runs a check on launch, then repeats every `CHECK_INTERVAL_SECS`.
/// Emits an "update-available" event to the frontend when a newer version is found.
pub async fn start_auto_update_checker(app: AppHandle, current_version: String) {
    check_and_emit(&app, &current_version).await;

    let mut interval = tokio::time::interval(Duration::from_secs(CHECK_INTERVAL_SECS));
    interval.tick().await; // skip the immediate first tick, we already checked above

    loop {
        interval.tick().await;
        check_and_emit(&app, &current_version).await;
    }
}

async fn check_and_emit(app: &AppHandle, current_version: &str) {
    match check_for_updates_manual(current_version.to_string(), MANIFEST_URL.to_string()).await {
        Ok(Some(manifest)) => {
            log::info!("Update available: {}", manifest.version);
            let _ = app.emit("update-available", manifest);
        }
        Ok(None) => {
            log::info!("No update available");
        }
        Err(e) => {
            log::error!("Auto update check failed: {e}");
        }
    }
}