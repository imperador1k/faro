#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Emitter, Manager};
use tauri_plugin_deep_link::DeepLinkExt;


fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = app.emit("app-instance-opened", argv);
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            // Register the custom URI scheme (myduolingo://) in the OS registry.
            // In production this is handled by the NSIS installer; calling it here
            // ensures it also works in development and after manual .exe installs.
            #[cfg(desktop)]
            app.deep_link().register_all()?;

            // Em produção, forçamos a navegação para o URL da Vercel
            #[cfg(not(debug_assertions))]
            {
                use tauri::Manager;
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.navigate("https://myduolingo.vercel.app".parse().unwrap());
                }
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
