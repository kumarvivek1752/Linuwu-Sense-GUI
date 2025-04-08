use serde_json::Number;
use std::process::Command;
#[allow(dead_code)]
#[tauri::command]
pub fn keyboard_color(zone1: &str, zone2: &str, zone3: &str, zone4: &str) -> String {
    let zone1color = zone1.replace("#", "");
    let zone2color = zone2.replace("#", "");
    let zone3color = zone3.replace("#", "");
    let zone4color = zone4.replace("#", "");
    let command = format!(
        "echo {z1},{z2},{z3},{z4} | sudo tee /sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/four_zoned_kb/per_zone_mode",
        z1 = zone1color,
        z2 = zone2color,
        z3 = zone3color,
        z4 = zone4color,
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

#[allow(dead_code)]
#[tauri::command]
pub fn fan_control(cpu: Number, gpu: Number) -> String {
    let command = format!(
        "echo {cpu_fan},{gpu_fan} | sudo tee /sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/predator_sense/fan_speed",
        cpu_fan = cpu,
        gpu_fan = gpu,
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

#[allow(dead_code)]
#[tauri::command]
pub fn get_fan_speed() -> Result<String, String> {
    let output = Command::new("sh")
        .arg("-c")
        .arg("sensors | grep fan")
        .output()
        .map_err(|e| format!("Failed to run sensors: {}", e))?;

    if output.status.success() {
        let result = String::from_utf8_lossy(&output.stdout).to_string();
        Ok(result)
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
