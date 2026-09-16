mod updater;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            updater::check_for_updates_manual,
            updater::install_update_manual
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}