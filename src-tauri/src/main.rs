#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::get_device_status,
            commands::save_profile,
            commands::load_profiles,
            commands::delete_profile,
            commands::export_profile_json,
            commands::import_profile_json,
            commands::apply_mouse_config,
            commands::apply_mouse_keys,
            commands::check_firmware_status,
            commands::simulate_firmware_upgrade,
            commands::restore_factory_settings,
            commands::get_system_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running Shadow X Pro application");
}
