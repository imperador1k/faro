use std::process::Command;
use std::env;
use std::fs;
use std::path::PathBuf;
use sysinfo::System;
use winreg::enums::*;
use winreg::RegKey;

#[tauri::command]
fn get_faro_status() -> Result<String, String> {
    // Procura se o processo Faro.exe ou myduolingo.exe existe
    let mut sys = System::new_all();
    sys.refresh_all();
    
    let mut found = false;
    for process in sys.processes().values() {
        let name = process.name().to_string_lossy().to_lowercase();
        if name == "faro.exe" || name == "myduolingo.exe" {
            found = true;
            break;
        }
    }
    
    Ok(if found { "running".to_string() } else { "stopped".to_string() })
}

#[tauri::command]
fn perform_uninstall() -> Result<(), String> {
    // 1. Matar o processo Faro se estiver a correr
    let mut sys = System::new_all();
    sys.refresh_all();
    for process in sys.processes().values() {
        let name = process.name().to_string_lossy().to_lowercase();
        if name == "faro.exe" || name == "myduolingo.exe" {
            process.kill();
        }
    }

    // 2. Apagar AppData (Local e Roaming)
    if let Some(local_appdata) = env::var_os("LOCALAPPDATA") {
        let mut path = PathBuf::from(local_appdata);
        path.push("faro");
        let _ = fs::remove_dir_all(&path);
        
        path.pop();
        path.push("com.miguelsantos.myduolingo");
        let _ = fs::remove_dir_all(&path);
    }

    // 3. Remover chaves de registo do desinstalador padrão se existirem
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let _ = hkcu.delete_subkey_all(r"Software\Microsoft\Windows\CurrentVersion\Uninstall\Faro");
    let _ = hkcu.delete_subkey_all(r"Software\miguelsantos\Faro");
    
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let _ = hklm.delete_subkey_all(r"Software\Microsoft\Windows\CurrentVersion\Uninstall\Faro");

    // 4. Iniciar script Houdini (Auto-Destruição)
    let current_exe = env::current_exe().map_err(|e| e.to_string())?;
    let install_dir = current_exe.parent()
        .ok_or("Erro ao encontrar pasta de instalação")?
        .to_str()
        .ok_or("Erro no caminho")?;

    let temp_dir = env::temp_dir();
    let bat_path = temp_dir.join("faro-kamikaze.bat");

    let bat_content = format!(
        "@echo off\r\n\
        echo A aguardar que o desinstalador feche...\r\n\
        timeout /t 3 /nobreak > NUL\r\n\
        rmdir /s /q \"{install_dir}\"\r\n\
        del \"%~f0\"\r\n",
        install_dir = install_dir
    );

    fs::write(&bat_path, bat_content).map_err(|e| e.to_string())?;

    // Lançar o BAT em modo detached
    Command::new("cmd")
        .args(["/C", "start", "/MIN", "", bat_path.to_str().unwrap()])
        .spawn()
        .map_err(|e| format!("Erro a lançar houdini: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_faro_status, perform_uninstall])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
