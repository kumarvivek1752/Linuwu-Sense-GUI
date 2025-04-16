use serde_json::Number;
use std::process::Command;

use crate::utils::{full_sysfs_path, read_sysfs, run_command, write_sysfs};
use serde::{Deserialize, Serialize};

#[allow(dead_code)]
#[tauri::command]
pub fn keyboard_color(zone1: &str, zone2: &str, zone3: &str, zone4: &str) -> String {
    let zone1color = zone1.replace("#", "");
    let zone2color = zone2.replace("#", "");
    let zone3color = zone3.replace("#", "");
    let zone4color = zone4.replace("#", "");
    let command = format!(
        "echo {z1},{z2},{z3},{z4},{brightness} | tee /sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/four_zoned_kb/per_zone_mode",
        z1 = zone1color,
        z2 = zone2color,
        z3 = zone3color,
        z4 = zone4color,
        brightness = 100
    );

    // Execute the command using `sh -c` for complex commands
    let output = Command::new("sh")
        .arg("-c")
        .arg(&command)
        .output();

    match output {
        Ok(output) => {
            if output.status.success() {
                format!("Command executed successfully {} ", command)
            } else {
                format!("Command failed with status: {}", String::from_utf8_lossy(&output.stderr))
            }
        }
        Err(e) => format!("Failed to execute command: {}", e),
    }
}

#[tauri::command]
pub fn get_keybord_color_perzone() -> Result<(String, String, String, String, u8), String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("cat /sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/four_zoned_kb/per_zone_mode")
        .output()
        .map_err(|e| format!("Failed to run sensors: {}", e))?;

    if output.status.success() {
        let raw_output = String::from_utf8_lossy(&output.stdout).to_string();

        let result = raw_output
            .trim()
            .split(",")
            .collect::<Vec<_>>();
        Ok((
            result[0].to_string(),
            result[1].to_string(),
            result[2].to_string(),
            result[3].to_string(),
            result[4].parse().unwrap_or(0),
        ))
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
pub fn fan_control(cpu: Number, gpu: Number) -> String {
    let value = format!("{},{}", cpu, gpu);
    write_sysfs(&full_sysfs_path("fan_speed"), &value).expect("unable to set fan speed")
}

#[tauri::command]
pub fn get_fan_speed() -> Result<String, String> {
    run_command("sensors | grep fan")
}

#[derive(Debug, Serialize, Deserialize)]
pub enum State {
    On,
    Off,
}
impl State {
    pub fn as_u8(&self) -> u8 {
        match self {
            State::Off => 0,
            State::On => 1,
        }
    }
}

#[tauri::command]
pub fn get_backlight_timeout() -> Result<String, String> {
    read_sysfs(&full_sysfs_path("backlight_timeout"))
}

#[tauri::command]
pub fn set_backlight_timeout(state: State) -> Result<String, String> {
    let value = state.as_u8().to_string();
    write_sysfs(&full_sysfs_path("backlight_timeout"), &value)
}

#[tauri::command]
pub fn get_usb_charging() -> Result<String, String> {
    read_sysfs(&full_sysfs_path("usb_charging"))
}

#[tauri::command]
pub fn set_usb_charging(state: State) -> Result<String, String> {
    let value = state.as_u8().to_string();
    write_sysfs(&full_sysfs_path("usb_charging"), &value)
}

#[tauri::command]
pub fn get_lcd_override() -> Result<String, String> {
    read_sysfs(&full_sysfs_path("lcd_override"))
}

#[tauri::command]
pub fn set_lcd_override(state: State) -> Result<String, String> {
    let value = state.as_u8().to_string();
    write_sysfs(&full_sysfs_path("lcd_override"), &value)
}

#[tauri::command]
pub fn get_battery_limiter() -> Result<String, String> {
    read_sysfs(&full_sysfs_path("battery_limiter"))
}

#[tauri::command]
pub fn set_battery_limiter(state: State) -> Result<String, String> {
    let value = state.as_u8().to_string();
    write_sysfs(&full_sysfs_path("battery_limiter"), &value)
}

#[tauri::command]
pub fn get_battery_calibration() -> Result<String, String> {
    read_sysfs(&full_sysfs_path("battery_calibration"))
}

#[tauri::command]
pub fn set_battery_calibration(state: State) -> Result<String, String> {
    let value = state.as_u8().to_string();
    write_sysfs(&full_sysfs_path("battery_calibration"), &value)
}

#[tauri::command]
pub fn get_boot_animation_sound() -> Result<String, String> {
    read_sysfs(&full_sysfs_path("boot_animation_sound"))
}

#[tauri::command]
pub fn set_boot_animation_sound(state: State) -> Result<String, String> {
    let value = state.as_u8().to_string();
    write_sysfs(&full_sysfs_path("boot_animation_sound"), &value)
}
