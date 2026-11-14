# Shadow X Pro — Modern Windows Desktop Software

[![Tauri](https://img.shields.io/badge/Tauri-1.6-24C8D8?logo=tauri&logoColor=white)](https://tauri.app/)
[![Rust](https://img.shields.io/badge/Rust-1.80%2B-black?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20x64-0078D6?logo=windows&logoColor=white)](https://microsoft.com/windows)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A high-performance, standalone Windows desktop application for managing and configuring **Shadow X Pro** gaming hardware (USB Receiver / P6 / G3 PRO). Engineered with **Rust** and **Tauri** for maximum speed, security, and a minimal memory footprint, featuring a pixel-perfect dark theme UI recreating the official web application with responsive desktop capabilities.

---

## 🌟 Key Features

### 1. Interactive Device Discovery (Home Screen)
- **Deep Space Nebula Particle Canvas**: Smooth, hardware-accelerated interactive starfield with dynamic mouse repulsion and twinkling effects (`canvas-stars.js`).
- **Device Detection**: Animated radar scan detecting connected receiver dongles and USB mice.
- **Device Card**: Real-time status badge ("Connected"), high-resolution hardware renders, and one-click navigation to the Management Center.
- **Bilingual Interface**: Quick language switcher supporting **English** and **简体中文** (Simplified Chinese) across all 325+ hardware settings and menus.

### 2. Button Mapping & Visualizer (Key Assignment)
- **Interactive Mouse Diagram**: Accurate hardware visualizer for the 5 mouse buttons:
  - Button 1: Left Button (Fixed primary click)
  - Button 2: Right Button
  - Button 3: Middle Button / Scroll Click
  - Button 4: Backward (Side Button 1)
  - Button 5: Forward (Side Button 2)
- **Dynamic Pointer Lines**: Responsive pinpoint dots and angled connector lines highlighting the selected button in real time.
- **Full-Featured Key Assignment Drawer**:
  - **System**: Multimedia controls (Play/Pause, Prev/Next, Volume +/-, Mute), Browser navigation (Home, Back, Forward, Refresh, Stop), Windows tools (Calculator, Mail, My Computer).
  - **Fire Key**: Configurable auto-fire burst clicks (interval from 5ms–1000ms, burst click count or continuous hold).
  - **Keyboard**: Interactive virtual keyboard layout (F1–F12, alphanumeric, modifiers, navigation, numpad) for single or combination key remaps.
  - **Shortcuts**: 1-click Windows shortcuts (Task Manager, Show Desktop, File Explorer, Run dialog, Action Center, Lock Screen, Alt+Tab, etc.).
  - **Macro**: Bind recorded macros directly to any button.
- **Single & Bulk Resets**: Per-button hover restore popover and global "Restore All to Default" with safety confirmation.

### 3. Precision DPI Settings
- **5-Stage Color-Coded DPI Cards**:
  - **Stage 1 (Red)**: 800 DPI
  - **Stage 2 (Green)**: 1200 DPI
  - **Stage 3 (Blue)**: 1600 DPI
  - **Stage 4 (Cyan)**: 3200 DPI
  - **Stage 5 (White)**: 6400 DPI
- **Interactive Range Slider**: 200 to 6400 DPI with 50 DPI precision steps, real-time accent color matching, and clickable tick marks.
- **Direct Numeric Input**: Type exact DPI values directly with automatic validation and clamp logic.

### 4. Professional Performance & Sensor Tuning
- **Polling Rate (Report Rate)**: 125 Hz (8ms), 250 Hz (4ms), 500 Hz (2ms), 1000 Hz (1ms).
- **Sleep / Hibernate Timer**: Continuous slider from 0 to 100 minutes with dedicated **"Never Sleep"** toggle.
- **Key Debounce Time**: 0 to 20 ms adjustment slider to prevent accidental double clicks without adding input lag.
- **Lift-Off Distance (LOD)**: 1 mm and 2 mm optical sensor cutoff modes.
- **Sensor Calibration**:
  - **Line Correction** (Angle Snapping): Straightens cursor motion for horizontal/vertical precision.
  - **Ripple Control**: Algorithmically eliminates jitter at high DPI values.
  - **Motion Sync**: Synchronizes sensor reports with USB polling frames for zero-jitter cursor tracking.
- **eSports Mode**: Low-latency mode bypassing power-saving routines for competitive gaming.
- **Scroll Wheel Direction**: Standard forward or inverted reverse scrolling.
- **RGB Lighting Modes**: Wave, Neon, Touring Flash, Yoyo Ball, Unidirectional Flashing, Circular Breathing, or Turn Off Light, complete with virtual mouse LED glow preview.

### 5. Macro Studio
- **Real-Time Event Recorder**: Records keystrokes, mouse buttons, and millisecond delays.
- **Event Timeline Editor**: Reorder events (Move Up / Move Down), adjust delay values (1ms–5000ms), or delete specific actions.
- **Loop Settings**:
  - Play Once
  - Repeat N Times (custom loop counter)
  - Continuous Loop while holding button
  - Toggle Continuous Loop on/off
- **Import / Export**: Save and load custom macro libraries.

### 6. Profile Management
- **Multi-Profile System**: Up to 6 distinct profiles (including protected Onboard Configuration).
- **CRUD Operations**: Create new profile, rename, delete, switch active profile.
- **JSON Import & Export**: Export profiles to `.json` files to share configurations across machines, with full schema validation on import.

### 7. Firmware & Device Maintenance
- **Receiver & Mouse Firmware Status**: Independent version verification (Receiver `v1.0.4`, Mouse `v1.0.8`).
- **Simulate Upgrade**: Update verification flow with progress feedback and status banners.
- **Factory Reset**: Restores all hardware registers, mappings, and profiles to factory default state.

---

## 🛠️ Technology Stack & Architecture

```
Shadow X Pro Desktop Application
├── Rust Backend (src-tauri/)
│   ├── main.rs                  # Tauri Application entrypoint and IPC handler registry
│   ├── commands.rs              # Hardware emulation, Profile CRUD, Macro persistence, FW logic
│   ├── build.rs                 # Tauri build script with Windows resource & junction linker
│   ├── Cargo.toml               # Native dependencies (tauri, serde, serde_json, dirs-next)
│   └── tauri.conf.json          # Window configuration (1280x840), permissions & icons
│
└── Modern Web UI (src/)
    ├── index.html               # Semantic application shell & modal structures
    ├── css/
    │   ├── app.css              # Dark theme tokens (#211a31, #FF5019), responsive layout, animations
    │   └── components.css       # Mouse diagram, DPI cards, sliders, iOS toggles, modals, toasts
    ├── js/
    │   ├── app.js               # Application coordinator, navigation, modal management, toasts
    │   ├── canvas-stars.js      # Cosmic starfield particle animation on HTML5 Canvas
    │   ├── mouse-diagram.js     # 5-button mouse interactive visualizer & SVG connector lines
    │   ├── dpi-slider.js        # 5-stage DPI manager, gradient range slider & tick marks
    │   ├── key-drawer.js        # Key assignment drawer (System, Keyboard, Shortcuts, Macro)
    │   ├── macro-editor.js      # Keystroke recorder, action timeline, and loop settings
    │   ├── state.js             # Reactive centralized state store with local persistence
    │   ├── tauri-bridge.js      # Tauri IPC bridge with browser localStorage fallback
    │   └── i18n.js              # Complete English & Chinese (zh_CN) localization dictionary
    └── assets/                  # High-res logos, mouse renders (mouse_p6.png), and SVG icons
```

---

## 🚀 Getting Started

### Prerequisites
- **Operating System**: Windows 10 or Windows 11 (64-bit)
- **Node.js**: v18.0.0 or higher
- **Rust**: `stable-x86_64-pc-windows-gnu` or `stable-x86_64-pc-windows-msvc`
- **WebView2 Runtime**: Pre-installed on Windows 10/11

---

## 💻 Running the Application

### Option A: Launching from Visual Studio Code (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Press **`F5`** or go to the **Run & Debug** pane (`Ctrl+Shift+D`).
3. Select **"Launch Shadow X Pro (Tauri Desktop App)"** and click **Start Debugging**.
4. To test frontend changes directly in a browser, select **"Preview Frontend (Browser)"**.

### Option B: Running via Command Line
Open PowerShell in the project directory:

```powershell
# 1. Set environment paths (if using custom portable toolchains)
$env:PATH = "C:\Users\ELCOT\tools\node-v20.18.0-win-x64;C:\Users\ELCOT\.cargo\bin;C:\Users\ELCOT\tools\w64devkit\bin;" + $env:PATH
$env:CARGO_TARGET_DIR = "C:\Users\ELCOT\AppData\Local\Temp\shadowxpro-target"

# 2. Launch the desktop application in development mode
npm run dev
# or:
npx tauri dev
```

---

## 📦 Building the Windows Executable (.exe)

To compile the standalone optimized Windows executable:

```powershell
# 1. Set environment paths
$env:PATH = "C:\Users\ELCOT\tools\node-v20.18.0-win-x64;C:\Users\ELCOT\.cargo\bin;C:\Users\ELCOT\tools\w64devkit\bin;" + $env:PATH
$env:CARGO_TARGET_DIR = "C:\Users\ELCOT\AppData\Local\Temp\shadowxpro-target"

# 2. Build the release binary
cd "C:\Users\ELCOT\DOWNLO~1\EVOFOX~1\src-tauri"
cargo build --release
```

The compiled release executable will be available at:
```
C:\Users\ELCOT\AppData\Local\Temp\shadowxpro-target\release\shadow-x-pro.exe
```

---

## 🌐 Running the Frontend Preview

You can also run the web interface directly in any modern browser:

```powershell
npm run preview
```
Then navigate to: **`http://localhost:3000`**

---

## 📄 License
This project is licensed under the MIT License.
