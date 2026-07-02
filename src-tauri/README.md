# Faro — Desktop Native Layer (Tauri / Rust)

> The Rust-powered desktop shell for Faro. Replaces Electron with a 10x lighter memory footprint.

## Overview

This directory (`src-tauri/`) contains the Rust source code that wraps Faro's web app into a native desktop application for Windows, macOS, and Linux.

## Responsibilities

| Area                     | Description                                   |
| ------------------------ | --------------------------------------------- |
| **Window Management**    | Native window creation, sizing, and lifecycle |
| **Deep Links**           | Handles `myduolingo://` custom URL scheme     |
| **Auto-Updater**         | Checks for updates via GitHub Releases        |
| **Single Instance**      | Prevents multiple app instances               |
| **Custom Installer**     | NSIS-based installer with branded UI          |
| **Process Management**   | App restart, process lifecycle                |
| **Registry Integration** | Windows uninstaller override via Winreg       |

## Structure

```
src-tauri/
├── src/
│   ├── main.rs          # Desktop entry point (plugins + window setup)
│   └── lib.rs           # Shared library (mobile entry + Windows registry hack)
├── capabilities/
│   ├── default.json     # Core permissions (WebView, deep-link, opener, updater, process)
│   └── desktop.json     # Desktop-specific permissions (updater)
├── tauri.conf.json      # App config (window, CSP, bundle, icons)
├── Cargo.toml           # Rust dependencies
├── build.rs             # Build script
├── icons/               # App icons (all formats)
└── installer/           # Custom NSIS installer (Vite + React UI)
```

## Key Files

### `src/main.rs` — Desktop Entry Point

```rust
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(...))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            // Production: navigate to Vercel URL
            // Development: uses localhost:3000
            Ok(())
        })
        .run(tauri::generate_context!())
}
```

### `src/lib.rs` — Shared Logic

- Mobile entry point (`#[cfg_attr(mobile, tauri::mobile_entry_point)]`)
- Logging via `tauri-plugin-log` (debug builds only)
- Windows registry hack: overrides `UninstallString` to point to the custom uninstaller

## Permissions

### `capabilities/default.json`

```json
{
  "permissions": [
    "core:default",
    "opener:default",
    "opener:allow-open-url",
    "deep-link:default",
    "updater:default",
    "process:allow-restart"
  ],
  "remote": {
    "urls": ["http://localhost:3000/**", "https://myduolingo.vercel.app/**"]
  }
}
```

## Building

```bash
# From the project root:
npm run tauri build
```

This produces:

- **Windows**: `.msi` + `.exe` (NSIS installer)
- **macOS**: `.dmg`
- **Linux**: `.AppImage` or `.deb`

See [DEPLOYMENT.md](../DEPLOYMENT.md) for full build and deployment instructions.

## Dependencies (Rust)

| Crate                          | Version | Purpose                     |
| ------------------------------ | ------- | --------------------------- |
| `tauri`                        | 2.10.3  | Core framework              |
| `tauri-plugin-deep-link`       | 2.0.0   | Custom URL scheme handling  |
| `tauri-plugin-single-instance` | 2.0.0   | Single instance enforcement |
| `tauri-plugin-opener`          | 2.0.0   | Open external URLs          |
| `tauri-plugin-process`         | 2       | Process management          |
| `tauri-plugin-updater`         | 2       | Auto-updates                |
| `tauri-plugin-log`             | 2       | Logging                     |
| `winreg`                       | 0.56.0  | Windows registry access     |
| `serde` / `serde_json`         | 1.0     | Serialization               |

## Custom Installer

The `installer/` directory contains a separate UI project (Vite + React) that provides a branded installation experience. This is built as part of the NSIS installer.

## Custom Uninstaller

The `uninstaller-app/` at the project root is a separate Tauri application that handles clean uninstallation, including registry cleanup.
