// Mouse Diagram & Key Mapping Visualizer for Shadow X Pro

class MouseDiagram {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.layout = [
      {
        index: 0,
        side: "left",
        top: 18,
        right: 285,
        left: null,
        line1: { left: -43, top: 32, width: 44 },
        line2: { left: -4, top: 48, width: 76, rotate: 26 },
        dot: { left: 68, top: 62 }
      },
      {
        index: 1,
        side: "right",
        top: 18,
        right: null,
        left: 280,
        line1: { left: 245, top: 32, width: 44 },
        line2: { left: 173, top: 49, width: 76, rotate: -26 },
        dot: { left: 173, top: 62 }
      },
      {
        index: 2,
        side: "right",
        top: 72,
        right: null,
        left: 280,
        line1: { left: 155, top: 88, width: 135 },
        line2: { left: 230, top: 90, width: 0, rotate: 0 },
        dot: { left: 150, top: 86 }
      },
      {
        index: 4, // Forward
        side: "left",
        top: 135,
        right: 285,
        left: null,
        line1: { left: -43, top: 152, width: 89 },
        line2: { left: -4, top: 153, width: 0, rotate: 0 },
        dot: { left: 42, top: 148 }
      },
      {
        index: 3, // Backward
        side: "left",
        top: 195,
        right: 285,
        left: null,
        line1: { left: -43, top: 212, width: 90 },
        line2: { left: -4, top: 213, width: 0, rotate: 0 },
        dot: { left: 47, top: 208 }
      }
    ];

    this.render();
  }

  isKeyDefault(keyIndex) {
    const keys = window.appState.getCurrentKeys();
    const key = keys[keyIndex];
    if (!key) return true;
    if (keyIndex === 0) return key.type === 32 && key.code1 === 1;
    if (keyIndex === 1) return key.type === 32 && key.code1 === 2;
    if (keyIndex === 2) return key.type === 32 && key.code1 === 4;
    if (keyIndex === 3) return key.type === 32 && key.code1 === 8;
    if (keyIndex === 4) return key.type === 32 && key.code1 === 16;
    return true;
  }

  areAllKeysDefault() {
    return [0, 1, 2, 3, 4].every(i => this.isKeyDefault(i));
  }

  getKeyDisplayName(key) {
    if (!key) return "";
    if (key.type === 112) {
      // Macro
      return key.keyName || "Macro";
    }
    return window.t(key.keyName) || key.keyName;
  }

  render() {
    const keys = window.appState.getCurrentKeys();
    const selIndex = window.appState.selKeyIndex;
    const allDefault = this.areAllKeysDefault();

    let html = `
      <div class="mouse-diagram-wrapper">
        <div class="mouse-center-stage">
          <div class="mouse-body-box">
            <img src="assets/mouse_p6.png" class="mouse-body-img" alt="Shadow X Pro" draggable="false" />
            <div class="mouse-led-glow" id="mouseLedGlow"></div>
          </div>
    `;

    // Render 5 Key Hotspots and SVG Lines
    for (const item of this.layout) {
      const k = keys[item.index];
      const isSelected = selIndex === item.index;
      const isDefault = this.isKeyDefault(item.index);
      const name = this.getKeyDisplayName(k);

      const stylePos = [];
      if (item.left !== null) stylePos.push(`left: ${item.left}px;`);
      if (item.right !== null) stylePos.push(`right: ${item.right}px;`);
      stylePos.push(`top: ${item.top}px;`);

      const strokeColor = isSelected ? '#FF5019' : '#d7dee3';
      const dotColor = isSelected ? '#FF5019' : '#d7dee3';

      html += `
        <!-- Key Button ${item.index} -->
        <div class="key-callout-item" style="${stylePos.join(' ')}" data-key-index="${item.index}">
          <button class="key-pill ${isSelected ? 'active' : ''} ${!isDefault ? 'modified' : ''}" 
                  onclick="window.mouseDiagram.selectKey(${item.index})"
                  title="${name}">
            <span class="key-pill-label">${name}</span>
          </button>
          
          ${!isDefault ? `
            <div class="restore-single-popover">
              <button class="restore-single-btn" onclick="event.stopPropagation(); window.mouseDiagram.restoreSingle(${item.index})">
                ${window.t('restoreDefault')}
              </button>
            </div>
          ` : ''}

          <!-- Line 1: Horizontal -->
          <div class="callout-line1" style="
            left: ${item.line1.left}px;
            top: ${item.line1.top}px;
            width: ${item.line1.width}px;
            background-color: ${strokeColor};
          "></div>

          <!-- Line 2: Angled -->
          ${item.line2.width > 0 ? `
            <div class="callout-line2" style="
              left: ${item.line2.left}px;
              top: ${item.line2.top}px;
              width: ${item.line2.width}px;
              transform: rotate(${item.line2.rotate}deg);
              background-color: ${strokeColor};
            "></div>
          ` : ''}

          <!-- Pinpoint Dot on Mouse -->
          <div class="callout-dot" style="
            left: ${item.dot.left}px;
            top: ${item.dot.top}px;
            background-color: ${dotColor};
            box-shadow: ${isSelected ? '0 0 10px #FF5019' : 'none'};
          "></div>
        </div>
      `;
    }

    html += `
        </div>
        
        <!-- Reset All to Default Button -->
        <div class="reset-all-container">
          <button class="btn btn-outline reset-all-btn ${allDefault ? 'disabled' : ''}" 
                  ${allDefault ? 'disabled' : ''} 
                  onclick="window.mouseDiagram.openResetAllModal()">
            ${window.t('restAllDefault')}
          </button>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
    this.updateLedGlow();
  }

  selectKey(index) {
    if (index === 0) {
      window.showToast(window.t('leftBtnNoChange'), 'info');
      // Still open drawer for inspection
    }
    window.appState.selKeyIndex = index;
    this.render();
    if (window.keyDrawer) {
      window.keyDrawer.open(index);
    }
  }

  restoreSingle(index) {
    window.appState.resetSingleKey(index);
    window.showToast(`${window.t('restoreDefault')}: ${window.t(DEFAULT_MOUSE_KEYS[index].keyName)}`, 'success');
    this.render();
    if (window.keyDrawer) {
      window.keyDrawer.update();
    }
  }

  openResetAllModal() {
    window.openConfirmModal({
      title: window.t('tips'),
      message: window.t('restAllDefaultComfirm'),
      confirmText: window.t('reset'),
      cancelText: window.t('cancel'),
      danger: true,
      onConfirm: () => {
        window.appState.resetAllKeys();
        window.appState.selKeyIndex = -1;
        this.render();
        if (window.keyDrawer) {
          window.keyDrawer.close();
        }
        window.showToast(window.t('restoreDefault'), 'success');
      }
    });
  }

  updateLedGlow() {
    const glow = document.getElementById('mouseLedGlow');
    if (!glow) return;
    const config = window.appState.getCurrentConfig();
    const modes = [
      'radial-gradient(circle, rgba(255,80,25,0.6) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(0,255,200,0.6) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(0,102,255,0.6) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(255,220,0,0.6) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(200,50,255,0.6) 0%, transparent 70%)',
      'radial-gradient(circle, rgba(50,200,100,0.6) 0%, transparent 70%)',
      'none'
    ];
    glow.style.background = modes[config.light_mode] || modes[0];
  }
}

window.MouseDiagram = MouseDiagram;
