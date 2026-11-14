// Key Assignment Drawer for Shadow X Pro

class KeyDrawer {
  constructor(drawerId) {
    this.drawer = document.getElementById(drawerId);
    if (!this.drawer) return;

    this.activeTab = "system"; // "system", "keyboard", "order", "macro"
    this.fireInterval = 20;
    this.fireClicks = 0;
    this.render();
  }

  open(keyIndex) {
    window.appState.selKeyIndex = keyIndex;
    this.drawer.classList.add('open');
    this.render();
  }

  close() {
    window.appState.selKeyIndex = -1;
    this.drawer.classList.remove('open');
    if (window.mouseDiagram) window.mouseDiagram.render();
  }

  update() {
    this.render();
  }

  setTab(tab) {
    this.activeTab = tab;
    this.render();
  }

  assignKey(keyName, type, code1, code2 = 0, code3 = 0) {
    const selIdx = window.appState.selKeyIndex;
    if (selIdx === 0) {
      window.showToast(window.t('leftBtnNoChange'), 'info');
      return;
    }
    if (selIdx < 0) {
      window.showToast(window.t('fireKeySelectFirst'), 'info');
      return;
    }

    window.appState.updateSingleKey(selIdx, {
      keyName: keyName,
      type: type,
      code1: code1,
      code2: code2,
      code3: code3
    });

    const display = window.t(keyName) || keyName;
    window.showToast(`${window.t('haveSet')}: ${display}`, 'success');

    if (window.mouseDiagram) window.mouseDiagram.render();
    this.close();
  }

  assignFireKey() {
    const selIdx = window.appState.selKeyIndex;
    if (selIdx === 0) {
      window.showToast(window.t('fireKeyNotLeftBtn'), 'error');
      return;
    }
    if (selIdx < 0) {
      window.showToast(window.t('fireKeySelectFirst'), 'info');
      return;
    }

    const interval = Math.max(5, parseInt(this.fireInterval, 10) || 20);
    const clicks = Math.max(0, parseInt(this.fireClicks, 10) || 0);

    window.appState.updateSingleKey(selIdx, {
      keyName: `Fire (${interval}ms, ${clicks === 0 ? 'Hold' : clicks + 'x'})`,
      type: 110, // Fire Key type
      code1: interval,
      code2: clicks,
      code3: 0
    });

    window.showToast(window.t('fireKeyConfigSuccess'), 'success');
    if (window.mouseDiagram) window.mouseDiagram.render();
    this.close();
  }

  render() {
    const selIdx = window.appState.selKeyIndex;
    const keys = window.appState.getCurrentKeys();
    const currentKey = selIdx >= 0 ? keys[selIdx] : null;
    const targetName = currentKey ? window.t(currentKey.keyName) || currentKey.keyName : '';

    let html = `
      <div class="key-drawer-header">
        <div class="drawer-title-group">
          <span class="drawer-title">${window.t('keySetting')}</span>
          ${selIdx >= 0 ? `<span class="target-key-badge">${targetName}</span>` : ''}
        </div>
        <button class="drawer-close-btn" onclick="window.keyDrawer.close()">×</button>
      </div>

      <!-- Drawer Tabs -->
      <div class="drawer-tabs-nav">
        <button class="drawer-tab ${this.activeTab === 'system' ? 'active' : ''}" 
                onclick="window.keyDrawer.setTab('system')">
          ${window.t('systemKey')}
        </button>
        <button class="drawer-tab ${this.activeTab === 'keyboard' ? 'active' : ''}" 
                onclick="window.keyDrawer.setTab('keyboard')">
          ${window.t('keyboardKey')}
        </button>
        <button class="drawer-tab ${this.activeTab === 'order' ? 'active' : ''}" 
                onclick="window.keyDrawer.setTab('order')">
          ${window.t('order')}
        </button>
        <button class="drawer-tab ${this.activeTab === 'macro' ? 'active' : ''}" 
                onclick="window.keyDrawer.setTab('macro')">
          ${window.t('recordMacro')}
        </button>
      </div>

      <div class="drawer-tab-content">
    `;

    if (this.activeTab === 'system') {
      html += this.renderSystemTab();
    } else if (this.activeTab === 'keyboard') {
      html += this.renderKeyboardTab();
    } else if (this.activeTab === 'order') {
      html += this.renderOrderTab();
    } else if (this.activeTab === 'macro') {
      html += this.renderMacroTab();
    }

    html += `</div>`;
    this.drawer.innerHTML = html;
  }

  renderSystemTab() {
    return `
      <div class="drawer-section">
        <p class="section-tip">${window.t('systemAssignTip')}</p>
        
        <!-- Standard Mouse Functions -->
        <span class="sub-section-title">${window.t('myEquipment')}</span>
        <div class="key-grid">
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('leftButton', 32, 1)">${window.t('leftButton')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('rightButton', 32, 2)">${window.t('rightButton')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('middleButton', 32, 4)">${window.t('middleButton')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('backward', 32, 8)">${window.t('backward')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('forward', 32, 16)">${window.t('forward')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('scrollUp', 33, 56, 1)">${window.t('scrollUp')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('scrollDown', 33, 56, 255)">${window.t('scrollDown')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('dpi', 33, 85)">${window.t('dpi')}</button>
          <button class="key-item-btn danger" onclick="window.keyDrawer.assignKey('forbidden', 0, 0)">${window.t('forbidden')}</button>
        </div>

        <!-- Fire Key Configuration -->
        <span class="sub-section-title">${window.t('fireKey')}</span>
        <div class="fire-key-card">
          <p class="text-xs text-white-dim mb-2">${window.t('fireKeyTip1')}</p>
          <p class="text-xs text-white-dim mb-3">${window.t('fireKeyTip2')}</p>
          <div class="fire-input-row">
            <label class="fire-label">${window.t('fireKeyText1')} (ms):</label>
            <input type="number" class="input fire-num-input" value="${this.fireInterval}" min="5" max="1000" 
                   oninput="window.keyDrawer.fireInterval = this.value" />
          </div>
          <div class="fire-input-row">
            <label class="fire-label">${window.t('fireKeyText2')} (0=Hold):</label>
            <input type="number" class="input fire-num-input" value="${this.fireClicks}" min="0" max="100" 
                   oninput="window.keyDrawer.fireClicks = this.value" />
          </div>
          <button class="btn btn-primary w-full mt-3" onclick="window.keyDrawer.assignFireKey()">
            ${window.t('fireKeyBtn')}
          </button>
        </div>

        <!-- Multimedia Functions -->
        <span class="sub-section-title">${window.t('multimedia')}</span>
        <div class="key-grid">
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('volumeUp', 48, 169)">${window.t('volumeUp')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('volumeDown', 48, 170)">${window.t('volumeDown')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('mute', 48, 168)">${window.t('mute')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('playPause', 48, 129)">${window.t('playPause')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('stopPlaying', 48, 130)">${window.t('stopPlaying')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('previousTrack', 48, 131)">${window.t('previousTrack')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('nextTrack', 48, 132)">${window.t('nextTrack')}</button>
        </div>

        <!-- Browser & System App Shortcuts -->
        <span class="sub-section-title">${window.t('system')}</span>
        <div class="key-grid">
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('browserHomePage', 48, 134)">${window.t('browserHomePage')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('browserRefresh', 48, 135)">${window.t('browserRefresh')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('browserStop', 48, 136)">${window.t('browserStop')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('browserForward', 48, 137)">${window.t('browserForward')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('browserBackward', 48, 138)">${window.t('browserBackward')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('browserFavorite', 48, 139)">${window.t('browserFavorite')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('browserSearch', 48, 140)">${window.t('browserSearch')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('calculator', 48, 141)">${window.t('calculator')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('myComputer', 48, 142)">${window.t('myComputer')}</button>
          <button class="key-item-btn" onclick="window.keyDrawer.assignKey('mailbox', 48, 143)">${window.t('mailbox')}</button>
        </div>
      </div>
    `;
  }

  renderKeyboardTab() {
    const fKeys = ['Esc', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
    const numRow = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'];
    const rowQ = ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'];
    const rowA = ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'];
    const rowZ = ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'];
    const bottomRow = ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl'];
    const navKeys = ['Print', 'Scroll', 'Pause', 'Insert', 'Home', 'PgUp', 'Delete', 'End', 'PgDn', '↑', '←', '↓', '→'];
    const numpad = ['Num', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '1', '2', '3', 'Ent', '0', '.'];

    const makeRow = arr => arr.map(k => `
      <button class="kb-key-btn" onclick="window.keyDrawer.assignKey('${k}', 16, 0, ${k.charCodeAt(0)})">
        ${k}
      </button>
    `).join('');

    return `
      <div class="drawer-section">
        <p class="section-tip">${window.t('keyAssignTip')}</p>
        
        <div class="virtual-keyboard-grid">
          <div class="kb-row">${makeRow(fKeys)}</div>
          <div class="kb-row">${makeRow(numRow)}</div>
          <div class="kb-row">${makeRow(rowQ)}</div>
          <div class="kb-row">${makeRow(rowA)}</div>
          <div class="kb-row">${makeRow(rowZ)}</div>
          <div class="kb-row">${makeRow(bottomRow)}</div>
        </div>

        <span class="sub-section-title mt-4">Navigation & Numpad</span>
        <div class="virtual-keyboard-grid">
          <div class="kb-row">${makeRow(navKeys)}</div>
          <div class="kb-row">${makeRow(numpad)}</div>
        </div>
      </div>
    `;
  }

  renderOrderTab() {
    const shortcuts = [
      { name: window.t('taskManager'), code: 'Ctrl+Shift+Esc' },
      { name: window.t('startMenu'), code: 'Win' },
      { name: window.t('fileExplorer'), code: 'Win+E' },
      { name: window.t('lockScreen'), code: 'Win+L' },
      { name: window.t('hideShowDesktop'), code: 'Win+D' },
      { name: window.t('run'), code: 'Win+R' },
      { name: window.t('search'), code: 'Win+S' },
      { name: window.t('windowsSettingsCenter'), code: 'Win+I' },
      { name: window.t('actionCenter'), code: 'Win+A' },
      { name: window.t('emojiPanel'), code: 'Win+.' },
      { name: window.t('magnifier'), code: 'Win++' },
      { name: window.t('appSwitcher'), code: 'Alt+Tab' }
    ];

    return `
      <div class="drawer-section">
        <p class="section-tip">${window.t('orderAssignTip')}</p>
        <div class="shortcuts-grid">
          ${shortcuts.map(s => `
            <div class="shortcut-card" onclick="window.keyDrawer.assignKey('${s.name}', 64, 0)">
              <span class="shortcut-name">${s.name}</span>
              <span class="shortcut-combo">${s.code}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderMacroTab() {
    const macros = window.appState.macroList || [];
    if (macros.length === 0) {
      return `
        <div class="drawer-section">
          <p class="section-tip">${window.t('macroAssignTip')}</p>
          <div style="text-align: center; color: var(--text-muted); padding: 30px 10px;">
            <p>No macros created yet.</p>
            <button class="btn btn-primary" style="margin-top: 14px;" onclick="document.getElementById('macro-editor-modal').classList.add('open')">
              ${window.t('macroManager')}
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div class="drawer-section">
        <p class="section-tip">${window.t('macroAssignTip')}</p>
        <div class="shortcuts-grid">
          ${macros.map(m => `
            <div class="shortcut-card" onclick="window.keyDrawer.assignKey('${m.name}', 112, 0)">
              <span class="shortcut-name">${m.name}</span>
              <span class="shortcut-combo">${m.actions ? m.actions.length : 0} steps</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

window.KeyDrawer = KeyDrawer;
