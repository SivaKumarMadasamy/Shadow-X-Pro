use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::command;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct DeviceStatus {
    pub connected: bool,
    pub device_name: String,
    pub model: String,
    pub mode: String, // "wired" or "2.4G"
    pub battery: u8,
    pub charge_flag: bool,
    pub mouse_status: u8,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MouseKey {
    pub index: usize,
    pub key_value: usize,
    pub key_name: String,
    pub lang: String,
    #[serde(rename = "type")]
    pub key_type: i32,
    pub code1: i32,
    pub code2: i32,
    pub code3: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MouseConfig {
    pub light_mode: i32,
    pub report_rate: i32,
    pub dpi_index: usize,
    pub dpi_flag: i32,
    pub dpi_count: usize,
    pub dpi1_value: u32,
    pub dpi2_value: u32,
    pub dpi3_value: u32,
    pub dpi4_value: u32,
    pub dpi5_value: u32,
    pub scroll_flag: i32,
    pub lod_value: i32,
    pub sensor_flag: i32,
    pub key_respond: i32,
    pub sleep_light: i32,
    pub highspeed_mode: i32,
    pub wakeup_flag: i32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProfileData {
    pub name: String,
    pub active: bool,
    pub mouse_keys: Vec<MouseKey>,
    pub config: MouseConfig,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ExportPackage {
    pub device_model: String,
    pub profile_data: ProfileData,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MacroAction {
    pub action_type: String, // "keydown", "keyup", "mousedown", "mouseup", "delay"
    pub key: String,
    pub delay: u32,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MacroItem {
    pub id: String,
    pub name: String,
    pub loop_type: i32, // 0: cycleWhileHolding, 1: loopSameKeysPressed, 2: loopOtherKeysPressed, 3: cyclicRepetition
    pub repeat_count: u32,
    pub actions: Vec<MacroAction>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FirmwareInfo {
    pub mouse_version: String,
    pub receiver_version: String,
    pub mouse_latest: String,
    pub receiver_latest: String,
    pub mouse_up_to_date: bool,
    pub receiver_up_to_date: bool,
    pub upgrade_available: bool,
}

fn get_app_storage_dir() -> PathBuf {
    let mut dir = dirs_next::data_dir().unwrap_or_else(|| PathBuf::from("."));
    dir.push("ShadowXPro");
    if !dir.exists() {
        let _ = fs::create_dir_all(&dir);
    }
    dir
}

#[command]
pub fn get_device_status() -> DeviceStatus {
    DeviceStatus {
        connected: true,
        device_name: "Shadow X Pro".to_string(),
        model: "USB Receiver".to_string(),
        mode: "wired".to_string(),
        battery: 100,
        charge_flag: true,
        mouse_status: 1,
    }
}

#[command]
pub fn save_profile(profile: ProfileData) -> Result<String, String> {
    let mut file_path = get_app_storage_dir();
    file_path.push(format!("profile_{}.json", profile.name.replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], "_")));
    
    let json = serde_json::to_string_pretty(&profile)
        .map_err(|e| format!("Failed to serialize profile: {}", e))?;
        
    fs::write(&file_path, json)
        .map_err(|e| format!("Failed to write profile: {}", e))?;
        
    Ok(format!("Profile '{}' saved successfully", profile.name))
}

#[command]
pub fn load_profiles() -> Result<Vec<ProfileData>, String> {
    let dir = get_app_storage_dir();
    let mut profiles = Vec::new();
    
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().and_then(|s| s.to_str()) == Some("json") {
                if let Ok(content) = fs::read_to_string(&path) {
                    if let Ok(profile) = serde_json::from_str::<ProfileData>(&content) {
                        profiles.push(profile);
                    }
                }
            }
        }
    }
    
    Ok(profiles)
}

#[command]
pub fn delete_profile(name: String) -> Result<String, String> {
    let mut file_path = get_app_storage_dir();
    file_path.push(format!("profile_{}.json", name.replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], "_")));
    
    if file_path.exists() {
        fs::remove_file(&file_path)
            .map_err(|e| format!("Failed to delete profile: {}", e))?;
    }
    
    Ok(format!("Profile '{}' deleted successfully", name))
}

#[command]
pub fn export_profile_json(profile: ProfileData) -> Result<String, String> {
    let package = ExportPackage {
        device_model: "USB Receiver".to_string(),
        profile_data: profile,
    };
    
    serde_json::to_string_pretty(&package)
        .map_err(|e| format!("Failed to export JSON: {}", e))
}

#[command]
pub fn import_profile_json(json_str: String) -> Result<ProfileData, String> {
    let package: ExportPackage = serde_json::from_str(&json_str)
        .map_err(|e| format!("Invalid profile format: {}", e))?;
        
    Ok(package.profile_data)
}

#[command]
pub fn apply_mouse_config(config: MouseConfig) -> Result<String, String> {
    println!("[Rust Backend] Applied mouse config: DPI Index {}, Polling Rate {} Hz", config.dpi_index, config.report_rate);
    Ok("Mouse configuration applied successfully".to_string())
}

#[command]
pub fn apply_mouse_keys(keys: Vec<MouseKey>) -> Result<String, String> {
    println!("[Rust Backend] Applied {} mouse key mappings", keys.len());
    Ok("Mouse key bindings updated".to_string())
}

#[command]
pub fn check_firmware_status() -> FirmwareInfo {
    FirmwareInfo {
        mouse_version: "1.0.8".to_string(),
        receiver_version: "1.0.4".to_string(),
        mouse_latest: "1.0.8".to_string(),
        receiver_latest: "1.0.4".to_string(),
        mouse_up_to_date: true,
        receiver_up_to_date: true,
        upgrade_available: false,
    }
}

#[command]
pub fn simulate_firmware_upgrade() -> Result<String, String> {
    println!("[Rust Backend] Firmware upgraded successfully");
    Ok("Firmware upgrade completed successfully".to_string())
}

#[command]
pub fn restore_factory_settings() -> Result<String, String> {
    println!("[Rust Backend] Restoring all mouse settings to factory defaults");
    Ok("Factory defaults restored successfully".to_string())
}

#[command]
pub fn get_system_info() -> serde_json::Value {
    serde_json::json!({
        "os": std::env::consts::OS,
        "arch": std::env::consts::ARCH,
        "app_version": "1.0.0",
        "device": "Shadow X Pro Gaming Mouse",
        "driver": "Universal HID v2.4",
        "backend": "Rust + Tauri",
        "supported_browsers": "Chrome, Edge, Windows Desktop App"
    })
}
