// State Management for Shadow X Pro Desktop Application

const DEFAULT_MOUSE_KEYS = [
  { index: 0, keyValue: 0, keyName: "leftButton", lang: "102", type: 32, code1: 1, code2: 0, code3: 0 },
  { index: 1, keyValue: 1, keyName: "rightButton", lang: "104", type: 32, code1: 2, code2: 0, code3: 0 },
  { index: 2, keyValue: 2, keyName: "middleButton", lang: "105", type: 32, code1: 4, code2: 0, code3: 0 },
  { index: 3, keyValue: 3, keyName: "backward", lang: "107", type: 32, code1: 8, code2: 0, code3: 0 },
  { index: 4, keyValue: 4, keyName: "forward", lang: "106", type: 32, code1: 16, code2: 0, code3: 0 }
];

const DEFAULT_DPI_STAGES = [
  { key: "0", dpiIndex: 0, dpiValue: 800, dpiColor: "#ea5e56", dpiBgColor: "rgba(234, 94, 86, 0.15)" },
  { key: "1", dpiIndex: 1, dpiValue: 1200, dpiColor: "#32aa70", dpiBgColor: "rgba(50, 170, 112, 0.15)" },
  { key: "2", dpiIndex: 2, dpiValue: 1600, dpiColor: "#0066ff", dpiBgColor: "rgba(0, 102, 255, 0.15)" },
  { key: "3", dpiIndex: 3, dpiValue: 3200, dpiColor: "#00DDE4", dpiBgColor: "rgba(0, 221, 228, 0.15)" },
  { key: "4", dpiIndex: 4, dpiValue: 6400, dpiColor: "#ffffff", dpiBgColor: "rgba(255, 255, 255, 0.15)" }
];

const DEFAULT_CONFIG = {
  light_mode: 0, // 0: wave, 1: neon, 2: touringFlash, 3: yoyoBall, 4: unidirectionalFlashing, 5: circularBreathing, 6: turnOffTheLight
  report_rate: 1000, // 125, 250, 500, 1000
  dpi_index: 0,
  dpi_count: 5,
  scroll_flag: 0, // 0: forward, 1: reverse
  lod_value: 1, // 1: 1mm, 2: 2mm
  sensor_flag: 0, // bitmask: 1 = lineCorrection, 16 = rippleControl, 32 = motionSync
  key_respond: 8, // 0 - 20 ms
  sleep_light: 10, // 0 - 100 minutes (0 = never sleep)
  highspeed_mode: 0, // 0: normal, 1: esports
  wakeup_flag: 0 // 0: click, 1: move
};

class AppState {
  constructor() {
    this.currentPage = "detail"; // "home" or "detail"
    this.currentTab = "mousekey"; // "mousekey", "mousedpi", "mouseconfig", "mousesetting"
    this.deviceName = "Shadow X Pro";
    this.productName = "USB Receiver";
    this.connectMode = "wired"; // "wired" or "2.4G"
    this.battery = 100;
    this.chargeFlag = true;
    this.isDeviceOnline = true;
    this.selKeyIndex = -1; // index of key currently open in Drawer (-1 = closed)
    
    // Profiles
    this.profileIndex = 0;
    this.profiles = this.loadStoredProfiles();
    
    // Macros
    this.macroList = this.loadStoredMacros();
    
    this.listeners = [];
  }

  loadStoredProfiles() {
    try {
      const stored = localStorage.getItem("shadowxpro_profiles");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read stored profiles:", e);
    }

    return [
      {
        name: "Onboard configuration",
        active: true,
        isOnboard: true,
        mouseKeys: JSON.parse(JSON.stringify(DEFAULT_MOUSE_KEYS)),
        dpiStages: JSON.parse(JSON.stringify(DEFAULT_DPI_STAGES)),
        config: JSON.parse(JSON.stringify(DEFAULT_CONFIG))
      }
    ];
  }

  loadStoredMacros() {
    try {
      const stored = localStorage.getItem("shadowxpro_macros");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}

    return [
      {
        id: "macro_1",
        name: "Triple Click",
        type: 0, // cycleWhileHolding
        repeatCount: 1,
        actions: [
          { actionType: "mousedown", key: "leftButton", delay: 10 },
          { actionType: "mouseup", key: "leftButton", delay: 20 },
          { actionType: "delay", key: "", delay: 30 },
          { actionType: "mousedown", key: "leftButton", delay: 10 },
          { actionType: "mouseup", key: "leftButton", delay: 20 },
          { actionType: "delay", key: "", delay: 30 },
          { actionType: "mousedown", key: "leftButton", delay: 10 },
          { actionType: "mouseup", key: "leftButton", delay: 20 }
        ]
      },
      {
        id: "macro_2",
        name: "Quick Reload",
        type: 0,
        repeatCount: 1,
        actions: [
          { actionType: "keydown", key: "R", delay: 15 },
          { actionType: "keyup", key: "R", delay: 15 },
          { actionType: "delay", key: "", delay: 100 },
          { actionType: "keydown", key: "1", delay: 15 },
          { actionType: "keyup", key: "1", delay: 15 }
        ]
      }
    ];
  }

  saveProfiles() {
    try {
      localStorage.setItem("shadowxpro_profiles", JSON.stringify(this.profiles));
    } catch (e) {}
    this.notify();
  }

  saveMacros() {
    try {
      localStorage.setItem("shadowxpro_macros", JSON.stringify(this.macroList));
    } catch (e) {}
    this.notify();
  }

  getCurrentProfile() {
    return this.profiles[this.profileIndex] || this.profiles[0];
  }

  getCurrentConfig() {
    return this.getCurrentProfile().config;
  }

  getCurrentKeys() {
    return this.getCurrentProfile().mouseKeys;
  }

  getCurrentDpiStages() {
    return this.getCurrentProfile().dpiStages || DEFAULT_DPI_STAGES;
  }

  selectProfile(index) {
    if (index >= 0 && index < this.profiles.length) {
      this.profileIndex = index;
      this.profiles.forEach((p, i) => (p.active = i === index));
      this.saveProfiles();
    }
  }

  createProfile(name) {
    if (this.profiles.length >= 6) {
      throw new Error("maxLimit");
    }
    const current = this.getCurrentProfile();
    const newProfile = {
      name: name,
      active: false,
      isOnboard: false,
      mouseKeys: JSON.parse(JSON.stringify(current.mouseKeys)),
      dpiStages: JSON.parse(JSON.stringify(current.dpiStages)),
      config: JSON.parse(JSON.stringify(current.config))
    };
    this.profiles.push(newProfile);
    this.saveProfiles();
  }

  renameProfile(index, newName) {
    if (index > 0 && index < this.profiles.length) {
      this.profiles[index].name = newName;
      this.saveProfiles();
    }
  }

  deleteProfile(index) {
    if (index > 0 && index < this.profiles.length) {
      this.profiles.splice(index, 1);
      if (this.profileIndex >= this.profiles.length) {
        this.profileIndex = this.profiles.length - 1;
      }
      this.profiles[this.profileIndex].active = true;
      this.saveProfiles();
    }
  }

  updateSingleKey(keyIndex, keyInfo) {
    const keys = this.getCurrentKeys();
    if (keyIndex >= 0 && keyIndex < keys.length) {
      keys[keyIndex] = { ...keys[keyIndex], ...keyInfo };
      this.saveProfiles();
    }
  }

  resetSingleKey(keyIndex) {
    const defaultKey = DEFAULT_MOUSE_KEYS[keyIndex];
    if (defaultKey) {
      this.updateSingleKey(keyIndex, defaultKey);
    }
  }

  resetAllKeys() {
    const profile = this.getCurrentProfile();
    profile.mouseKeys = JSON.parse(JSON.stringify(DEFAULT_MOUSE_KEYS));
    this.saveProfiles();
  }

  restoreFactoryDefaults() {
    const profile = this.getCurrentProfile();
    profile.mouseKeys = JSON.parse(JSON.stringify(DEFAULT_MOUSE_KEYS));
    profile.dpiStages = JSON.parse(JSON.stringify(DEFAULT_DPI_STAGES));
    profile.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    this.saveProfiles();
  }

  updateConfig(patch) {
    const profile = this.getCurrentProfile();
    profile.config = { ...profile.config, ...patch };
    this.saveProfiles();
  }

  setConnectMode(mode) {
    this.connectMode = mode;
    if (mode === "wired") {
      this.chargeFlag = true;
      this.battery = 100;
    } else {
      this.chargeFlag = false;
      this.battery = 85;
    }
    this.notify();
  }

  subscribe(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }
}

window.appState = new AppState();
