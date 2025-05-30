#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use elevated_command::Command;
// use std::process::Command;

mod command;
mod utils;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            command::keyboard_color,
            command::get_keybord_color_perzone,
            command::fan_control,
            command::get_fan_speed,
            command::get_backlight_timeout,
            command::set_backlight_timeout,
            command::get_usb_charging,
            command::set_usb_charging,
            command::get_lcd_override,
            command::set_lcd_override,
            command::get_battery_limiter,
            command::set_battery_limiter,
            command::get_battery_calibration,
            command::set_battery_calibration,
            command::get_boot_animation_sound,
            command::set_boot_animation_sound,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
