use serde_json::Number;
use std::path::Path;
use std::process::Command;
use std::sync::OnceLock;

pub fn run_command(command: &str) -> Result<String, String> {
    Command::new("sh")
        .arg("-c")
        .arg(command)
        .output()
        .map_err(|e| format!("Failed to execute command: {}", e))
        .and_then(|output| {
            if output.status.success() {
                Ok(String::from_utf8_lossy(&output.stdout)
                    .trim()
                    .to_string())
            } else {
                Err(String::from_utf8_lossy(&output.stderr).to_string())
            }
        })
}

pub fn write_sysfs(path: &str, value: &str) -> Result<String, String> {
    let cmd = format!("echo {} | tee {}", value, path);
    run_command(&cmd)
}

pub fn read_sysfs(path: &str) -> Result<String, String> {
    let cmd = format!("cat {}", path);
    run_command(&cmd)
}

static MODULE_PATH: OnceLock<&'static str> = OnceLock::new();

fn get_module_path() -> &'static str {
    MODULE_PATH.get_or_init(|| {
        if Path::new("/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/predator_sense")
            .exists()
        {
            "predator_sense"
        } else {
            "nitro_sense"
        }
    })
}

pub fn full_sysfs_path(subpath: &str) -> String {
    format!(
        "/sys/module/linuwu_sense/drivers/platform:acer-wmi/acer-wmi/{}/{}",
        get_module_path(),
        subpath
    )
}
