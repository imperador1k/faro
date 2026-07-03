# Faro — Desktop Uninstaller UI (`uninstaller-app/`)

> A Vite + React app that powers Faro's branded uninstaller. Collects feedback before cleanly removing the application.

Built as a separate Tauri binary that handles:

- Feedback collection (reason for uninstalling)
- Registry key cleanup
- Shortcut removal
- Self-destruct (spawns a `.bat` script that deletes everything including itself)

See [src-tauri/installer/README.md](../src-tauri/installer/README.md) for architecture details.
