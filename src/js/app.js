/**
 * Shadow X Pro - Main Application Controller
 * Coordinates Views, Tabs, Profile CRUD, Hardware Settings, Modals, and Notifications.
 */

(function () {
  'use strict';

  // Global Toast Notification Helper
  window.showToast = function (message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-pill ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 250);
    }, 2800);
  };

  // Global Confirmation Modal Helper
  window.openConfirmModal = function ({ title, message, confirmText, cancelText, danger = false, onConfirm }) {
    const modal = document.getElementById('generic-confirm-modal');
    if (!modal) return;

    const titleEl = modal.querySelector('.modal-title');
    const messageEl = modal.querySelector('.confirm-modal-message');
    const confirmBtn = modal.querySelector('.btn-confirm-action');
    const cancelBtn = modal.querySelector('.btn-cancel-action');

    if (titleEl) titleEl.textContent = title || window.t('tips');
    if (messageEl) messageEl.textContent = message || '';
    if (confirmBtn) {
      confirmBtn.textContent = confirmText || window.t('ok');
      confirmBtn.className = danger ? 'btn btn-danger btn-confirm-action' : 'btn btn-primary btn-confirm-action';
      confirmBtn.onclick = () => {
        modal.classList.remove('open');
        if (typeof onConfirm === 'function') onConfirm();
      };
    }
    if (cancelBtn) {
      cancelBtn.textContent = cancelText || window.t('cancel');
      cancelBtn.onclick = () => {
        modal.classList.remove('open');
      };
    }

    modal.classList.add('open');
  };

  // Main Application Initializer
  class ShadowApp {
    constructor() {
      this.selectedProfileIndex = 0;
    }

    init() {
      console.log('Initializing Shadow X Pro Desktop Software...');

      // 1. Initialize Cosmic Canvas Background on Discovery Page
      if (document.getElementById('cosmic-canvas') && window.CosmicStarsBackground) {
        this.starsBg = new window.CosmicStarsBackground('cosmic-canvas');
      }

      // 2. Initialize Components
      if (window.MouseDiagram) {
        window.mouseDiagram = new window.MouseDiagram('mouseCalloutStage');
      }
      if (window.DpiManager) {
        window.dpiManager = new window.DpiManager('dpiMountStage');
      }
      if (window.KeyDrawer) {
        window.keyDrawer = new window.KeyDrawer('keyDrawerMount');
      }
      if (window.MacroEditor) {
        window.macroEditor = new window.MacroEditor('macroModalMount');
      }

      // 3. Setup Navigation & Actions
      this.setupViewNavigation();
      this.setupHeaderActions();
      this.setupLanguageSwitcher();
      this.setupProfileSidebar();
      this.setupTabsNavigation();
      this.setupPerformanceControls();
      this.setupOtherSettings();
      this.setupProfileModals();
      this.setupContextMenu();

      // 4. Subscribe to AppState updates
      window.appState.subscribe(() => {
        this.renderProfileList();
        this.syncHeaderDeviceStatus();
        this.syncPerformanceUI();
        this.syncLightingUI();
        if (window.mouseDiagram) window.mouseDiagram.render();
      });

      // 5. Initial UI Sync
      this.renderProfileList();
      this.syncHeaderDeviceStatus();
      this.syncPerformanceUI();
      this.syncLightingUI();
      window.i18n.updateDom();

      console.log('Shadow X Pro initialized successfully.');
    }

    // View Switching: Discovery <-> Detail
    setupViewNavigation() {
      const viewDiscovery = document.getElementById('view-discovery');
      const viewDetail = document.getElementById('view-detail');
      const deviceCard = document.getElementById('device-card');
      const btnBack = document.getElementById('btn-back');
      const btnAddDevice = document.getElementById('btn-add-device');

      const switchView = (targetView) => {
        window.appState.currentPage = targetView;
        if (targetView === 'detail') {
          viewDiscovery.classList.remove('active');
          viewDetail.classList.add('active');
          if (window.mouseDiagram) window.mouseDiagram.render();
          if (window.dpiManager) window.dpiManager.render();
        } else {
          viewDetail.classList.remove('active');
          viewDiscovery.classList.add('active');
        }
      };

      if (deviceCard) {
        deviceCard.addEventListener('click', () => switchView('detail'));
      }

      if (btnBack) {
        btnBack.addEventListener('click', () => switchView('home'));
      }

      if (btnAddDevice) {
        btnAddDevice.addEventListener('click', () => {
          const radar = btnAddDevice.querySelector('.search-radar-icon');
          if (radar) radar.style.animationDuration = '0.8s';
          btnAddDevice.disabled = true;
          window.showToast(window.t('searchingDevices') || 'Scanning for devices...', 'info');

          setTimeout(() => {
            if (radar) radar.style.animationDuration = '3s';
            btnAddDevice.disabled = false;
            window.showToast(window.t('findDevice', { count: 1 }) || 'Found 1 device: USB Receiver', 'success');
          }, 1400);
        });
      }
    }

    // Header Controls: Battery, Mode Toggle
    setupHeaderActions() {
      const modePill = document.getElementById('mode-toggle-pill');
      if (modePill) {
        modePill.addEventListener('click', () => {
          const next = window.appState.connectMode === '2.4G' ? 'wired' : '2.4G';
          window.appState.setConnectMode(next);
          this.syncHeaderDeviceStatus();
          window.showToast(
            `Connection Mode: ${next === '2.4G' ? window.t('2.4GConnect') : window.t('wiredConnect')}`,
            'info'
          );
        });
      }
    }

    syncHeaderDeviceStatus() {
      const state = window.appState;
      const batteryPercent = document.getElementById('battery-percentage');
      const modeText = document.getElementById('mode-text');
      const modeIcon = document.getElementById('mode-icon-img');

      if (batteryPercent) {
        batteryPercent.textContent = `${state.battery}%`;
      }
      if (modeText) {
        modeText.textContent = state.connectMode === '2.4G' ? window.t('2.4GConnect') : window.t('wiredConnect');
      }
      if (modeIcon) {
        modeIcon.src = state.connectMode === '2.4G' ? 'assets/mode_dongle.svg' : 'assets/mode_usb.svg';
      }
    }

    // Language Dropdown
    setupLanguageSwitcher() {
      const setupSelector = (btnId, dropdownId) => {
        const btn = document.getElementById(btnId);
        const dropdown = document.getElementById(dropdownId);
        if (!btn || !dropdown) return;

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('open');
        });

        dropdown.querySelectorAll('.lang-option').forEach((opt) => {
          opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = opt.getAttribute('data-lang');
            dropdown.classList.remove('open');
            window.i18n.setLanguage(lang);
            this.updateLanguageLabels(lang);
            this.renderProfileList();
            if (window.mouseDiagram) window.mouseDiagram.render();
            if (window.dpiManager) window.dpiManager.render();
            if (window.keyDrawer) window.keyDrawer.render();
            window.showToast(lang === 'zh' ? '已切换至 简体中文' : 'Switched to English', 'success');
          });
        });
      };

      setupSelector('lang-btn-discovery', 'lang-menu-discovery');
      setupSelector('lang-btn-detail', 'lang-menu-detail');

      document.addEventListener('click', () => {
        document.querySelectorAll('.lang-dropdown-menu').forEach((m) => m.classList.remove('open'));
      });
    }

    updateLanguageLabels(lang) {
      const name = lang === 'zh' ? '简体中文' : 'English';
      document.querySelectorAll('.current-lang-name').forEach((el) => {
        el.textContent = name;
      });
    }

    // Profile Sidebar CRUD
    setupProfileSidebar() {
      const btnAdd = document.getElementById('btn-add-profile');
      const btnImport = document.getElementById('btn-import-profile');
      const fileInput = document.getElementById('import-profile-file-input');

      if (btnAdd) {
        btnAdd.addEventListener('click', () => {
          if (window.appState.profiles.length >= 6) {
            window.showToast(window.t('maxLimit'), 'error');
            return;
          }
          const modal = document.getElementById('modal-create-profile');
          const input = document.getElementById('input-create-profile-name');
          if (modal && input) {
            input.value = `Profile ${window.appState.profiles.length + 1}`;
            modal.classList.add('open');
            input.focus();
          }
        });
      }

      if (btnImport && fileInput) {
        btnImport.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (evt) => {
            try {
              const data = JSON.parse(evt.target.result);
              if (data && data.mouseKeys && data.dpiStages && data.config) {
                if (window.appState.profiles.length >= 6) {
                  window.showToast(window.t('maxLimit'), 'error');
                  return;
                }
                const newProfile = {
                  name: data.name || `Imported Profile ${window.appState.profiles.length + 1}`,
                  active: true,
                  isOnboard: false,
                  mouseKeys: data.mouseKeys,
                  dpiStages: data.dpiStages,
                  config: data.config
                };
                window.appState.profiles.forEach(p => p.active = false);
                window.appState.profiles.push(newProfile);
                window.appState.profileIndex = window.appState.profiles.length - 1;
                window.appState.saveProfiles();
                window.showToast(window.t('importSuccess'), 'success');
              } else {
                window.showToast(window.t('importFail'), 'error');
              }
            } catch (err) {
              window.showToast(window.t('importFail'), 'error');
            }
            fileInput.value = '';
          };
          reader.readAsText(file);
        });
      }
    }

    renderProfileList() {
      const container = document.getElementById('profile-list-group');
      if (!container) return;

      container.innerHTML = '';
      const profiles = window.appState.profiles;
      const activeIdx = window.appState.profileIndex;

      profiles.forEach((profile, idx) => {
        const item = document.createElement('div');
        item.className = `profile-item-row ${idx === activeIdx ? 'active' : ''}`;
        item.setAttribute('data-profile-idx', idx);

        const displayName = profile.isOnboard ? window.t('onboardConfig') : profile.name;

        item.innerHTML = `
          <span class="profile-item-title" title="${displayName}">${displayName}</span>
          ${!profile.isOnboard ? `
            <button class="profile-item-menu-btn" title="Options">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="12" cy="19" r="2"></circle>
              </svg>
            </button>
          ` : ''}
        `;

        item.addEventListener('click', (e) => {
          if (e.target.closest('.profile-item-menu-btn')) return;
          window.appState.selectProfile(idx);
          if (window.mouseDiagram) window.mouseDiagram.render();
          if (window.dpiManager) window.dpiManager.render();
        });

        const menuBtn = item.querySelector('.profile-item-menu-btn');
        if (menuBtn) {
          menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openProfileContextMenu(e, idx);
          });
        }

        container.appendChild(item);
      });
    }

    // Profile Context Menu (Rename, Export, Delete)
    setupContextMenu() {
      const menu = document.getElementById('profile-context-menu');
      if (!menu) return;

      document.addEventListener('click', () => {
        menu.classList.remove('open');
      });

      const optRename = document.getElementById('ctx-profile-rename');
      const optExport = document.getElementById('ctx-profile-export');
      const optDelete = document.getElementById('ctx-profile-delete');

      if (optRename) {
        optRename.addEventListener('click', () => {
          const idx = this.selectedProfileIndex;
          if (idx <= 0) return;
          const profile = window.appState.profiles[idx];
          const modal = document.getElementById('modal-rename-profile');
          const input = document.getElementById('input-rename-profile-name');
          if (modal && input) {
            input.value = profile.name;
            modal.classList.add('open');
            input.focus();
          }
        });
      }

      if (optExport) {
        optExport.addEventListener('click', () => {
          const idx = this.selectedProfileIndex;
          const profile = window.appState.profiles[idx];
          if (!profile) return;
          const exportData = {
            name: profile.name,
            mouseKeys: profile.mouseKeys,
            dpiStages: profile.dpiStages,
            config: profile.config
          };
          const jsonStr = JSON.stringify(exportData, null, 2);
          const blob = new Blob([jsonStr], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${profile.name.replace(/\s+/g, '_')}_config.json`;
          a.click();
          URL.revokeObjectURL(url);
          window.showToast(window.t('exportSuccess'), 'success');
        });
      }

      if (optDelete) {
        optDelete.addEventListener('click', () => {
          const idx = this.selectedProfileIndex;
          if (idx <= 0) {
            window.showToast('Cannot delete onboard configuration.', 'error');
            return;
          }
          const profile = window.appState.profiles[idx];
          window.openConfirmModal({
            title: window.t('delete'),
            message: `Are you sure you want to delete profile "${profile.name}"?`,
            confirmText: window.t('delete'),
            danger: true,
            onConfirm: () => {
              window.appState.deleteProfile(idx);
              window.showToast(window.t('deleteSuccess'), 'success');
            }
          });
        });
      }
    }

    openProfileContextMenu(e, profileIndex) {
      this.selectedProfileIndex = profileIndex;
      const menu = document.getElementById('profile-context-menu');
      if (!menu) return;

      menu.style.top = `${e.clientY + 5}px`;
      menu.style.left = `${e.clientX + 5}px`;
      menu.classList.add('open');
    }

    // Profile Modals
    setupProfileModals() {
      // Create Modal
      const modalCreate = document.getElementById('modal-create-profile');
      const inputCreate = document.getElementById('input-create-profile-name');
      const btnConfirmCreate = document.getElementById('btn-confirm-create-profile');
      const btnCancelCreate = document.getElementById('btn-cancel-create-profile');

      if (btnConfirmCreate && modalCreate && inputCreate) {
        const doCreate = () => {
          const name = inputCreate.value.trim();
          if (!name) {
            window.showToast(window.t('lengthNotAllowEmpty'), 'error');
            return;
          }
          if (window.appState.profiles.some(p => p.name === name)) {
            window.showToast(window.t('haveSameName'), 'error');
            return;
          }
          try {
            window.appState.createProfile(name);
            modalCreate.classList.remove('open');
            window.showToast(window.t('createSuccess'), 'success');
          } catch (err) {
            window.showToast(window.t('maxLimit'), 'error');
          }
        };

        btnConfirmCreate.addEventListener('click', doCreate);
        inputCreate.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doCreate();
        });
      }

      if (btnCancelCreate && modalCreate) {
        btnCancelCreate.addEventListener('click', () => modalCreate.classList.remove('open'));
      }

      // Rename Modal
      const modalRename = document.getElementById('modal-rename-profile');
      const inputRename = document.getElementById('input-rename-profile-name');
      const btnConfirmRename = document.getElementById('btn-confirm-rename-profile');
      const btnCancelRename = document.getElementById('btn-cancel-rename-profile');

      if (btnConfirmRename && modalRename && inputRename) {
        const doRename = () => {
          const newName = inputRename.value.trim();
          if (!newName) {
            window.showToast(window.t('lengthNotAllowEmpty'), 'error');
            return;
          }
          window.appState.renameProfile(this.selectedProfileIndex, newName);
          modalRename.classList.remove('open');
          window.showToast(window.t('succeededRename'), 'success');
        };

        btnConfirmRename.addEventListener('click', doRename);
        inputRename.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') doRename();
        });
      }

      if (btnCancelRename && modalRename) {
        btnCancelRename.addEventListener('click', () => modalRename.classList.remove('open'));
      }
    }

    // Tabs Navigation (Key, DPI, Performance, Other)
    setupTabsNavigation() {
      const tabs = document.querySelectorAll('.nav-tab-item');
      const panes = document.querySelectorAll('.tab-pane');

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          const targetTab = tab.getAttribute('data-tab');
          window.appState.currentTab = targetTab;

          tabs.forEach((t) => t.classList.remove('active'));
          panes.forEach((p) => p.classList.remove('active'));

          tab.classList.add('active');
          const targetPane = document.getElementById(`tab-content-${targetTab}`);
          if (targetPane) {
            targetPane.classList.add('active');
          }

          if (targetTab === 'mousekey' && window.mouseDiagram) {
            window.mouseDiagram.render();
          } else if (targetTab === 'mousedpi' && window.dpiManager) {
            window.dpiManager.render();
          } else if (targetTab === 'mouseconfig') {
            this.syncPerformanceUI();
            this.syncLightingUI();
          }
        });
      });
    }

    // Performance Settings Controls
    setupPerformanceControls() {
      // 1. Report Rate Radios
      const reportRateInputs = document.querySelectorAll('input[name="report-rate"]');
      reportRateInputs.forEach((input) => {
        input.addEventListener('change', () => {
          if (input.checked) {
            const val = parseInt(input.value, 10);
            window.appState.updateConfig({ report_rate: val });
            window.showToast(`Report rate: ${val}Hz`, 'info');
          }
        });
      });

      // 2. Sleep Time Slider & Never Sleep Checkbox
      const sleepSlider = document.getElementById('perf-sleep-slider');
      const sleepReadout = document.getElementById('perf-sleep-readout');
      const neverSleepCheck = document.getElementById('perf-never-sleep-check');

      if (sleepSlider && sleepReadout) {
        sleepSlider.addEventListener('input', () => {
          const val = parseInt(sleepSlider.value, 10);
          sleepReadout.textContent = val === 0 ? `0 min (${window.t('neverSleep') || 'Never'})` : `${val} min`;
          if (neverSleepCheck) neverSleepCheck.checked = (val === 0);
          window.appState.updateConfig({ sleep_light: val });
        });
      }

      if (neverSleepCheck && sleepSlider && sleepReadout) {
        neverSleepCheck.addEventListener('change', () => {
          if (neverSleepCheck.checked) {
            sleepSlider.value = 0;
            sleepReadout.textContent = `0 min (${window.t('neverSleep') || 'Never'})`;
            window.appState.updateConfig({ sleep_light: 0 });
          } else {
            sleepSlider.value = 10;
            sleepReadout.textContent = '10 min';
            window.appState.updateConfig({ sleep_light: 10 });
          }
        });
      }

      // 3. Debounce Slider
      const debounceSlider = document.getElementById('perf-debounce-slider');
      const debounceReadout = document.getElementById('perf-debounce-readout');

      if (debounceSlider && debounceReadout) {
        debounceSlider.addEventListener('input', () => {
          const val = parseInt(debounceSlider.value, 10);
          debounceReadout.textContent = `${val} ms`;
          window.appState.updateConfig({ key_respond: val });
        });
      }

      // 4. Sensor LOD
      const lodInputs = document.querySelectorAll('input[name="sensor-lod"]');
      lodInputs.forEach((input) => {
        input.addEventListener('change', () => {
          if (input.checked) {
            const val = parseInt(input.value, 10);
            window.appState.updateConfig({ lod_value: val });
            window.showToast(`Sensor LOD: ${val}mm`, 'info');
          }
        });
      });

      // 5. Sensor Flags (bitmask: 1 = lineCorrection, 16 = rippleControl, 32 = motionSync)
      const lineCorrection = document.getElementById('switch-line-correction');
      const rippleControl = document.getElementById('switch-ripple-control');
      const motionSync = document.getElementById('switch-motion-sync');

      const updateSensorFlag = () => {
        let mask = 0;
        if (lineCorrection && lineCorrection.checked) mask |= 1;
        if (rippleControl && rippleControl.checked) mask |= 16;
        if (motionSync && motionSync.checked) mask |= 32;
        window.appState.updateConfig({ sensor_flag: mask });
      };

      if (lineCorrection) lineCorrection.addEventListener('change', updateSensorFlag);
      if (rippleControl) rippleControl.addEventListener('change', updateSensorFlag);
      if (motionSync) motionSync.addEventListener('change', updateSensorFlag);

      // 6. eSports Mode Switch
      const esportsSwitch = document.getElementById('switch-esports-mode');
      if (esportsSwitch) {
        esportsSwitch.addEventListener('change', () => {
          const val = esportsSwitch.checked ? 1 : 0;
          window.appState.updateConfig({ highspeed_mode: val });
          window.showToast(`eSports Mode ${val ? 'Enabled' : 'Disabled'}`, 'info');
        });
      }

      // 7. Roller Direction
      const rollerInputs = document.querySelectorAll('input[name="roller-direction"]');
      rollerInputs.forEach((input) => {
        input.addEventListener('change', () => {
          if (input.checked) {
            const val = parseInt(input.value, 10);
            window.appState.updateConfig({ scroll_flag: val });
          }
        });
      });

      // 8. RGB Lighting Mode
      const lightModeSelect = document.getElementById('select-lighting-mode');
      if (lightModeSelect) {
        lightModeSelect.addEventListener('change', () => {
          const val = parseInt(lightModeSelect.value, 10);
          window.appState.updateConfig({ light_mode: val });
          if (window.mouseDiagram) window.mouseDiagram.updateLedGlow();
        });
      }
    }

    syncPerformanceUI() {
      const cfg = window.appState.getCurrentConfig();
      if (!cfg) return;

      // Report Rate
      const rateInput = document.querySelector(`input[name="report-rate"][value="${cfg.report_rate}"]`);
      if (rateInput) rateInput.checked = true;

      // Sleep
      const sleepSlider = document.getElementById('perf-sleep-slider');
      const sleepReadout = document.getElementById('perf-sleep-readout');
      const neverSleepCheck = document.getElementById('perf-never-sleep-check');
      if (sleepSlider && sleepReadout) {
        sleepSlider.value = cfg.sleep_light;
        sleepReadout.textContent = cfg.sleep_light === 0 ? `0 min (${window.t('neverSleep') || 'Never'})` : `${cfg.sleep_light} min`;
        if (neverSleepCheck) neverSleepCheck.checked = (cfg.sleep_light === 0);
      }

      // Debounce
      const debounceSlider = document.getElementById('perf-debounce-slider');
      const debounceReadout = document.getElementById('perf-debounce-readout');
      if (debounceSlider && debounceReadout) {
        debounceSlider.value = cfg.key_respond;
        debounceReadout.textContent = `${cfg.key_respond} ms`;
      }

      // LOD
      const lodInput = document.querySelector(`input[name="sensor-lod"][value="${cfg.lod_value}"]`);
      if (lodInput) lodInput.checked = true;

      // Sensor Bitmasks
      const mask = cfg.sensor_flag || 0;
      const lineCorrection = document.getElementById('switch-line-correction');
      if (lineCorrection) lineCorrection.checked = (mask & 1) !== 0;

      const rippleControl = document.getElementById('switch-ripple-control');
      if (rippleControl) rippleControl.checked = (mask & 16) !== 0;

      const motionSync = document.getElementById('switch-motion-sync');
      if (motionSync) motionSync.checked = (mask & 32) !== 0;

      // eSports
      const esports = document.getElementById('switch-esports-mode');
      if (esports) esports.checked = (cfg.highspeed_mode === 1);

      // Roller Direction
      const rollerInput = document.querySelector(`input[name="roller-direction"][value="${cfg.scroll_flag}"]`);
      if (rollerInput) rollerInput.checked = true;
    }

    syncLightingUI() {
      const cfg = window.appState.getCurrentConfig();
      if (!cfg) return;

      const lightModeSelect = document.getElementById('select-lighting-mode');
      if (lightModeSelect) lightModeSelect.value = cfg.light_mode;

      if (window.mouseDiagram) window.mouseDiagram.updateLedGlow();
    }

    // Other Settings (Firmware Updates, Factory Reset, Macro Manager)
    setupOtherSettings() {
      const btnUpgrade = document.getElementById('btn-firmware-upgrade');
      const btnResetFactory = document.getElementById('btn-factory-reset');
      const btnOpenMacros = document.getElementById('btn-open-macros-tab');
      const btnCloseMacros = document.getElementById('btn-close-macro-modal');
      const macroModal = document.getElementById('macro-editor-modal');

      if (btnUpgrade) {
        btnUpgrade.addEventListener('click', async () => {
          btnUpgrade.disabled = true;
          btnUpgrade.textContent = window.t('operationing') || 'Checking updates...';
          const status = await window.tauriBridge.checkFirmware();

          if (status.upgrade_available) {
            btnUpgrade.textContent = 'Upgrading...';
            window.showToast(window.t('startUpgrade') || 'Firmware upgrade started...', 'info');
            await window.tauriBridge.upgradeFirmware();
            btnUpgrade.textContent = window.t('latestVersion') || 'Up to Date';
            btnUpgrade.classList.remove('btn-primary');
            btnUpgrade.classList.add('btn-outline');
            window.showToast(window.t('firmwareUpgradeSuccess') || 'Firmware upgraded to latest version!', 'success');
          } else {
            btnUpgrade.textContent = window.t('latestVersion') || 'Up to Date';
            btnUpgrade.disabled = false;
            window.showToast(window.t('latestVersion') || 'Your firmware is already up to date.', 'info');
          }
        });
      }

      if (btnResetFactory) {
        btnResetFactory.addEventListener('click', () => {
          window.openConfirmModal({
            title: window.t('tips'),
            message: window.t('restAllDefaultComfirm') || 'All custom settings and DPI stages will be restored to factory defaults. Continue?',
            confirmText: window.t('reset'),
            cancelText: window.t('cancel'),
            danger: true,
            onConfirm: async () => {
              window.appState.restoreFactoryDefaults();
              await window.tauriBridge.factoryReset();
              if (window.mouseDiagram) window.mouseDiagram.render();
              if (window.dpiManager) window.dpiManager.render();
              this.syncPerformanceUI();
              this.syncLightingUI();
              window.showToast(window.t('restoreDefault') || 'Factory settings restored.', 'success');
            }
          });
        });
      }

      if (btnOpenMacros && macroModal) {
        btnOpenMacros.addEventListener('click', () => {
          macroModal.classList.add('open');
          if (window.macroEditor) window.macroEditor.render();
        });
      }

      if (btnCloseMacros && macroModal) {
        btnCloseMacros.addEventListener('click', () => {
          macroModal.classList.remove('open');
        });
      }
    }
  }

  // Launch on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    window.shadowApp = new ShadowApp();
    window.shadowApp.init();
  });
})();
