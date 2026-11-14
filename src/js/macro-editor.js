// Macro Recording and Configuration Component for Shadow X Pro

class MacroEditor {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentMacro = null;
    this.isRecording = false;
    this.recordingStartTime = 0;
    this.lastEventTime = 0;
    this.standardDelay = 50;
    this.useStandardDelay = false;

    this.bindKeyListeners();
    this.render();
  }

  bindKeyListeners() {
    this.onKeyDown = e => {
      if (!this.isRecording || !this.currentMacro) return;
      e.preventDefault();
      const now = Date.now();
      const delay = this.useStandardDelay ? this.standardDelay : (now - this.lastEventTime || 15);
      this.lastEventTime = now;

      // Add delay if not first action
      if (this.currentMacro.actions.length > 0 && delay > 0) {
        this.currentMacro.actions.push({ actionType: 'delay', key: '', delay: Math.min(delay, 2000) });
      }

      this.currentMacro.actions.push({
        actionType: 'keydown',
        key: e.key.toUpperCase(),
        delay: 0
      });
      this.render();
    };

    this.onKeyUp = e => {
      if (!this.isRecording || !this.currentMacro) return;
      e.preventDefault();
      const now = Date.now();
      const delay = this.useStandardDelay ? this.standardDelay : (now - this.lastEventTime || 15);
      this.lastEventTime = now;

      if (this.currentMacro.actions.length > 0 && delay > 0) {
        this.currentMacro.actions.push({ actionType: 'delay', key: '', delay: Math.min(delay, 2000) });
      }

      this.currentMacro.actions.push({
        actionType: 'keyup',
        key: e.key.toUpperCase(),
        delay: 0
      });
      this.render();
    };

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  openNewMacro() {
    this.currentMacro = {
      id: 'macro_' + Date.now(),
      name: `Macro ${window.appState.macroList.length + 1}`,
      type: 0, // cycleWhileHolding
      repeatCount: 1,
      actions: []
    };
    this.isRecording = false;
    this.render();
  }

  editMacro(id) {
    const found = window.appState.macroList.find(m => m.id === id);
    if (found) {
      this.currentMacro = JSON.parse(JSON.stringify(found));
      this.isRecording = false;
      this.render();
    }
  }

  toggleRecording() {
    if (!this.currentMacro) return;
    this.isRecording = !this.isRecording;
    if (this.isRecording) {
      this.lastEventTime = Date.now();
      window.showToast(window.t('startRecording'), 'info');
    } else {
      window.showToast(window.t('stopRecording'), 'info');
    }
    this.render();
  }

  insertDelay() {
    if (!this.currentMacro) return;
    this.currentMacro.actions.push({
      actionType: 'delay',
      key: '',
      delay: this.standardDelay
    });
    this.render();
  }

  insertMouseAction(actionType, btnName) {
    if (!this.currentMacro) return;
    this.currentMacro.actions.push({
      actionType: actionType,
      key: btnName,
      delay: 0
    });
    this.render();
  }

  deleteAction(index) {
    if (!this.currentMacro) return;
    this.currentMacro.actions.splice(index, 1);
    this.render();
  }

  moveAction(index, dir) {
    if (!this.currentMacro) return;
    const target = index + dir;
    if (target < 0 || target >= this.currentMacro.actions.length) return;
    const item = this.currentMacro.actions.splice(index, 1)[0];
    this.currentMacro.actions.splice(target, 0, item);
    this.render();
  }

  saveCurrentMacro() {
    if (!this.currentMacro) return;
    if (!this.currentMacro.name.trim()) {
      window.showToast(window.t('lengthNotAllowEmpty'), 'error');
      return;
    }

    const idx = window.appState.macroList.findIndex(m => m.id === this.currentMacro.id);
    if (idx >= 0) {
      window.appState.macroList[idx] = this.currentMacro;
    } else {
      if (window.appState.macroList.length >= 32) {
        window.showToast('Macro limit reached (max 32)', 'error');
        return;
      }
      window.appState.macroList.push(this.currentMacro);
    }

    window.appState.saveMacros();
    window.showToast(window.t('saveSuccess'), 'success');
    this.isRecording = false;
    this.currentMacro = null;
    this.render();
    if (window.keyDrawer) window.keyDrawer.update();
  }

  resetCurrentMacro() {
    if (!this.currentMacro) return;
    this.currentMacro.actions = [];
    this.isRecording = false;
    this.render();
    window.showToast(window.t('haveReset'), 'info');
  }

  exitEditor() {
    this.isRecording = false;
    this.currentMacro = null;
    this.render();
  }

  assignMacroToSelectedKey(macro) {
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
      keyName: macro.name,
      type: 112, // Macro type
      code1: window.appState.macroList.findIndex(m => m.id === macro.id),
      code2: 0,
      code3: macro.type
    });

    window.showToast(`${window.t('haveSet')}: ${macro.name}`, 'success');
    if (window.mouseDiagram) window.mouseDiagram.render();
    if (window.keyDrawer) window.keyDrawer.close();
  }

  render() {
    if (this.currentMacro) {
      this.renderEditorView();
    } else {
      this.renderListView();
    }
  }

  renderListView() {
    const macros = window.appState.macroList;
    let html = `
      <div class="macro-list-container">
        <div class="macro-list-header">
          <button class="btn btn-primary w-full new-macro-btn" 
                  ${macros.length >= 32 ? 'disabled' : ''}
                  onclick="window.macroEditor.openNewMacro()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            ${window.t('newMacro')} (${macros.length}/32)
          </button>
        </div>

        <div class="macro-items-scroll">
    `;

    if (macros.length === 0) {
      html += `
        <div class="empty-state">
          <p class="text-white-dim text-sm">${window.t('selectMacroType')}</p>
        </div>
      `;
    } else {
      macros.forEach(m => {
        html += `
          <div class="macro-card-item">
            <div class="macro-info" onclick="window.macroEditor.assignMacroToSelectedKey(window.appState.macroList.find(x => x.id === '${m.id}'))">
              <span class="macro-card-title">${m.name}</span>
              <span class="macro-card-meta">${m.actions.length} actions</span>
            </div>
            <div class="macro-card-actions">
              <button class="icon-btn edit-macro-btn" title="Edit" onclick="window.macroEditor.editMacro('${m.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
              </button>
              <button class="icon-btn delete-macro-btn" title="Delete" onclick="window.macroEditor.deleteMacro('${m.id}')">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        `;
      });
    }

    html += `
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  deleteMacro(id) {
    const idx = window.appState.macroList.findIndex(m => m.id === id);
    if (idx >= 0) {
      window.appState.macroList.splice(idx, 1);
      window.appState.saveMacros();
      this.render();
      window.showToast(window.t('deleteSuccess'), 'success');
    }
  }

  renderEditorView() {
    const m = this.currentMacro;
    const loopTypes = [
      { id: 0, name: window.t('cycleWhileHolding'), tip: window.t('cycleWhileHoldingTip') },
      { id: 1, name: window.t('loopSameKeysPressed'), tip: window.t('loopSameKeysPressedTip') },
      { id: 2, name: window.t('loopOtherKeysPressed'), tip: window.t('loopOtherKeysPressedTip') },
      { id: 3, name: window.t('cyclicRepetition'), tip: 'Repeat N times' }
    ];

    let html = `
      <div class="macro-editor-view">
        <!-- Top Toolbar -->
        <div class="editor-top-bar">
          <div class="macro-name-group">
            <input type="text" class="input macro-name-input" 
                   value="${m.name}" 
                   maxlength="20"
                   placeholder="${window.t('enterConfigName')}"
                   oninput="window.macroEditor.currentMacro.name = this.value" />
            <span class="char-counter">${m.name.length}/20</span>
          </div>

          <div class="editor-top-actions">
            <button class="btn btn-outline save-btn" onclick="window.macroEditor.saveCurrentMacro()">
              ${window.t('save')}
            </button>
            <button class="btn btn-outline reset-btn" onclick="window.macroEditor.resetCurrentMacro()">
              ${window.t('reset')}
            </button>
            <button class="btn btn-primary exit-btn" onclick="window.macroEditor.exitEditor()">
              ${window.t('exitMacro')}
            </button>
          </div>
        </div>

        <!-- Loop Mode Selector -->
        <div class="macro-loop-selector">
          <span class="section-label">${window.t('selectMacroType')}</span>
          <div class="loop-options-grid">
            ${loopTypes.map(t => `
              <label class="loop-option-card ${m.type === t.id ? 'active' : ''}">
                <input type="radio" name="macro_loop_type" ${m.type === t.id ? 'checked' : ''} 
                       onchange="window.macroEditor.currentMacro.type = ${t.id}; window.macroEditor.render();" />
                <div class="loop-text">
                  <span class="loop-title">${t.name}</span>
                  <span class="loop-tip">${t.tip}</span>
                </div>
              </label>
            `).join('')}
          </div>
        </div>

        <!-- Recording & Insert Controls -->
        <div class="macro-controls-bar">
          <button class="btn ${this.isRecording ? 'btn-danger recording-pulse' : 'btn-primary'}" 
                  onclick="window.macroEditor.toggleRecording()">
            ${this.isRecording ? window.t('stopRecording') : window.t('startRecording')}
          </button>
          <button class="btn btn-outline" onclick="window.macroEditor.insertDelay()">
            ${window.t('insertDelayTime')}
          </button>
          <div class="insert-mouse-dropdown">
            <select class="select custom-select" onchange="if(this.value){ window.macroEditor.insertMouseAction('mousedown', this.value); window.macroEditor.insertMouseAction('mouseup', this.value); this.value=''; }">
              <option value="">${window.t('insertMouseButton')}</option>
              <option value="leftButton">${window.t('leftButton')}</option>
              <option value="rightButton">${window.t('rightButton')}</option>
              <option value="middleButton">${window.t('middleButton')}</option>
              <option value="forward">${window.t('forward')}</option>
              <option value="backward">${window.t('backward')}</option>
            </select>
          </div>
        </div>

        <!-- Actions Timeline List -->
        <div class="macro-actions-timeline">
          <div class="timeline-header">
            <span>#</span>
            <span>${window.t('keyboardKey')} / Action</span>
            <span>Delay</span>
            <span>Operations</span>
          </div>
          <div class="timeline-items">
    `;

    if (m.actions.length === 0) {
      html += `
        <div class="empty-timeline">
          <p>${this.isRecording ? 'Press keys on your keyboard to record...' : 'Click Record or Insert to add actions'}</p>
        </div>
      `;
    } else {
      m.actions.forEach((act, idx) => {
        const isDown = act.actionType === 'keydown' || act.actionType === 'mousedown';
        const isDelay = act.actionType === 'delay';

        html += `
          <div class="timeline-row ${isDelay ? 'delay-row' : ''}">
            <span class="row-num">${idx + 1}</span>
            <div class="row-action">
              ${isDelay ? `
                <span class="badge delay-badge">DELAY</span>
              ` : `
                <span class="action-dir ${isDown ? 'down' : 'up'}">
                  ${isDown ? '↓' : '↑'}
                </span>
                <span class="badge key-badge">${act.key}</span>
                <span class="action-text">${isDown ? 'Down' : 'Up'}</span>
              `}
            </div>
            <div class="row-delay">
              ${isDelay ? `
                <input type="number" class="delay-input" value="${act.delay}" min="1" max="5000" 
                       onchange="window.macroEditor.currentMacro.actions[${idx}].delay = parseInt(this.value, 10) || 50" /> ms
              ` : '-'}
            </div>
            <div class="row-ops">
              <button class="op-btn" title="Move Up" onclick="window.macroEditor.moveAction(${idx}, -1)" ${idx === 0 ? 'disabled' : ''}>↑</button>
              <button class="op-btn" title="Move Down" onclick="window.macroEditor.moveAction(${idx}, 1)" ${idx === m.actions.length - 1 ? 'disabled' : ''}>↓</button>
              <button class="op-btn delete" title="Delete" onclick="window.macroEditor.deleteAction(${idx})">×</button>
            </div>
          </div>
        `;
      });
    }

    html += `
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }
}

window.MacroEditor = MacroEditor;
