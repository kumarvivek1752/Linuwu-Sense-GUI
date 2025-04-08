#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use elevated_command::Command;

mod command;
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            command::keyboard_color,
            command::fan_control,
            command::get_fan_speed
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
