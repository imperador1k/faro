#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_deep_link::init())
    .plugin(tauri_plugin_process::init())
    .plugin(tauri_plugin_single_instance::init(|_app, _args, _cwd| {}))
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // [Injeção do Desinstalador Customizado]
      #[cfg(windows)]
      {
          use winreg::enums::*;
          use winreg::RegKey;
          use std::env;

          if let Ok(current_exe) = env::current_exe() {
              if let Some(install_dir) = current_exe.parent() {
                  let uninstaller_path = install_dir.join("faro-uninstaller.exe");
                  
                  if uninstaller_path.exists() {
                      // O NSIS escreve no HKCU se o installMode for currentUser (nosso caso)
                      let hkcu = RegKey::predef(HKEY_CURRENT_USER);
                      if let Ok((key, _)) = hkcu.create_subkey(r"Software\Microsoft\Windows\CurrentVersion\Uninstall\Faro") {
                          let path_str = uninstaller_path.to_string_lossy().to_string();
                          // Substituir a chave UninstallString pelo nosso uninstaller
                          let _ = key.set_value("UninstallString", &format!("\"{}\"", path_str));
                          let _ = key.set_value("QuietUninstallString", &format!("\"{}\"", path_str));
                      }
                  }
              }
          }
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
