// Tauri Rust Backend Bridge with Browser Fallback Simulation

class TauriBridge {
  constructor() {
    this.isTauri = typeof window.__TAURI__ !== 'undefined';
    console.log(`[TauriBridge] Initialized. Running in ${this.isTauri ? 'Desktop (Tauri App)' : 'Browser Preview'} mode.`);
  }

  async checkFirmware() {
    return await this.invoke('check_firmware_status');
  }

  async upgradeFirmware() {
    return await this.invoke('simulate_firmware_upgrade');
  }

  async factoryReset() {
    return await this.invoke('restore_factory_settings');
  }

  async invoke(cmd, args = {}) {
    if (this.isTauri && window.__TAURI__.invoke) {
      try {
        return await window.__TAURI__.invoke(cmd, args);
      } catch (err) {
        console.warn(`[TauriBridge] Error invoking '${cmd}':`, err);
        throw err;
      }
    } else {
      // Fallback implementation in JS
      return this.mockInvoke(cmd, args);
    }
  }

  async mockInvoke(cmd, args) {
    switch (cmd) {
      case 'get_device_status':
        return {
          connected: true,
          device_name: window.appState.deviceName,
          model: window.appState.productName,
          mode: window.appState.connectMode,
          battery: window.appState.battery,
          charge_flag: window.appState.chargeFlag,
          mouse_status: 1
        };

      case 'save_profile':
        window.appState.saveProfiles();
        return `Profile '${args.profile?.name}' saved successfully`;

      case 'load_profiles':
        return window.appState.profiles;

      case 'delete_profile':
        return `Profile '${args.name}' deleted`;

      case 'export_profile_json':
        return JSON.stringify({
          deviceModel: window.appState.productName,
          profileData: args.profile
        }, null, 2);

      case 'import_profile_json':
        const parsed = JSON.parse(args.json_str);
        if (!parsed.deviceModel || !parsed.profileData) {
          throw new Error('Invalid format');
        }
        return parsed.profileData;

      case 'apply_mouse_config':
        console.log('[Mock Backend] Applied mouse config:', args.config);
        return 'Applied';

      case 'apply_mouse_keys':
        console.log('[Mock Backend] Applied keys:', args.keys);
        return 'Applied';

      case 'check_firmware_status':
        return {
          mouse_version: '1.0.8',
          receiver_version: '1.0.4',
          upgrade_available: false,
          mouse_up_to_date: true,
          receiver_up_to_date: true
        };

      case 'simulate_firmware_upgrade':
        return {
          success: true,
          message: 'Firmware upgraded successfully'
        };

      case 'restore_factory_settings':
        window.appState.restoreFactoryDefaults();
        return 'Restored';

      case 'get_system_info':
        return {
          os: 'windows',
          arch: 'x86_64',
          app_version: '1.0.0',
          device: 'Shadow X Pro Gaming Mouse',
          backend: 'Rust + Tauri v1.6',
          status: 'Operational'
        };

      default:
        console.warn(`Unknown mock command: ${cmd}`);
        return null;
    }
  }
}

window.tauriBridge = new TauriBridge();
