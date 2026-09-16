use std::fs;
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
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

    if raw.version == current_version {
        return Ok(None); // already up to date
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

#[tauri::command]
pub async fn install_update_manual(app_handle: tauri::AppHandle, download_url: String) -> Result<(), String> {
    // 1. Find current .app bundle path
    let current_exe = std::env::current_exe().map_err(|e| e.to_string())?;
    // current_exe is .../YourApp.app/Contents/MacOS/YourApp — walk up to the .app folder
    let app_bundle_path = current_exe
        .parent().and_then(|p| p.parent()).and_then(|p| p.parent())
        .ok_or("Could not resolve .app bundle path")?
        .to_path_buf();

    let parent_dir = app_bundle_path
        .parent()
        .ok_or("Could not resolve parent directory")?
        .to_path_buf();

    // 2. Create temp dir INSIDE the same parent as the app (guarantees same volume)
    let temp_dir = parent_dir.join(".update_staging_tmp");
    if temp_dir.exists() {
        fs::remove_dir_all(&temp_dir).ok();
    }
    fs::create_dir_all(&temp_dir).map_err(|e| e.to_string())?;

    // 3. Download the .tar.gz
    let archive_path = temp_dir.join("update.tar.gz");
    let resp = reqwest::get(&download_url).await.map_err(|e| e.to_string())?;
    let bytes = resp.bytes().await.map_err(|e| e.to_string())?;
    fs::write(&archive_path, &bytes).map_err(|e| e.to_string())?;

    // 4. Extract it (same volume, so this is fast/local)
    let extract_dir = temp_dir.join("extracted");
    fs::create_dir_all(&extract_dir).map_err(|e| e.to_string())?;
    let tar_gz = fs::File::open(&archive_path).map_err(|e| e.to_string())?;
    let tar = flate2::read::GzDecoder::new(tar_gz);
    let mut archive = tar::Archive::new(tar);
    archive.unpack(&extract_dir).map_err(|e| e.to_string())?;

    // 5. Find the extracted .app bundle
    let extracted_app = find_app_bundle(&extract_dir)
        .ok_or("Could not find .app bundle in extracted update")?;

    // 6. Swap: remove old, move new into place.
    //    Since extracted_app and app_bundle_path share the same parent volume,
    //    fs::rename works fine here — no EXDEV.
    fs::remove_dir_all(&app_bundle_path).map_err(|e| e.to_string())?;
    fs::rename(&extracted_app, &app_bundle_path).map_err(|e| e.to_string())?;

    // 7. Clean up
    fs::remove_dir_all(&temp_dir).ok();

    // 8. Relaunch
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