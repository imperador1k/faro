# Faro Custom Installer & Uninstaller

> A premium, feedback-driven, single-binary custom setup engine for Faro Desktop.

## Overview

Most applications use the standard gray Windows installers. This project provides an **Elite-level** installation experience (JetBrains / Adobe style) from the very first click.

This folder contains a completely independent **Tauri/React** project that serves as the Installation and Uninstallation engine for the main Faro Desktop application.

## Single-Binary Architecture

To save space and maintain elegance, this installer uses a **Dual-Face (Single-Binary)** architecture. A single `.exe` (~8MB) does everything depending on the filename used to invoke it:

- **SETUP mode (`*setup.exe` or `*installer.exe`):**
  - Renders an immersive Glassmorphism UI
  - Streams the latest binary silently from GitHub releases
  - Runs the NSIS installer invisibly in the background
  - Hijacks the Windows Registry to replace the default uninstaller with itself

- **UNINSTALL mode (`*uninstall.exe`):**
  - Displays a feedback form (Feedback-Driven Uninstallation)
  - Cleans shortcuts and Windows Registry keys
  - **Kamikaze Self-Destruction:** Spawns a `.bat` script in Windows cache that kills the app, deletes all local files, and deletes itself without leaving a trace

## Design System

The frontend is built with **React** and **Pure CSS**, focused on extreme performance and beauty:

- Multiple radial gradients
- Backdrop filters (Glassmorphism)
- Fluid micro-interactions
- Custom title bar (`data-tauri-drag-region`)

## Building for Production

```bash
npm install
npm run tauri build
```

The final executable will be at:
`src-tauri/target/release/faro-installer.exe`

> **Note**: Before building, ensure the download URL in `src-tauri/src/lib.rs` points to your GitHub release.
