// DPI Settings Component for Shadow X Pro

class DpiManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.marks = [200, 500, 800, 1200, 1600, 2000, 2400, 2800, 3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400];
    this.render();
  }

  getActiveStage() {
    const stages = window.appState.getCurrentDpiStages();
    const config = window.appState.getCurrentConfig();
    const idx = config.dpi_index ?? 0;
    return stages[idx] || stages[0];
  }

  render() {
    const stages = window.appState.getCurrentDpiStages();
    const config = window.appState.getCurrentConfig();
    const activeStage = this.getActiveStage();
    const activeDpi = activeStage.dpiValue;

    let html = `
      <div class="dpi-setting-page">
        <!-- Top Toolbar -->
        <div class="dpi-toolbar">
          <div class="dpi-level-info">
            <span class="text-white-dim text-sm">${window.t('dpiTips')}</span>
          </div>
          <button class="btn btn-outline reset-dpi-btn" onclick="window.dpiManager.restoreDefaults()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            ${window.t('restDefaultSetting')}
          </button>
        </div>

        <!-- 5 DPI Stage Cards -->
        <div class="dpi-cards-grid">
    `;

    stages.forEach((stage, idx) => {
      const isSelected = idx === (config.dpi_index ?? 0);
      const color = stage.dpiColor;
      const bgColor = isSelected ? stage.dpiBgColor : 'rgba(255, 255, 255, 0.04)';
      const borderColor = isSelected ? color : 'rgba(255, 255, 255, 0.1)';

      html += `
        <div class="dpi-card ${isSelected ? 'selected' : ''}" 
             style="border-color: ${borderColor}; background-color: ${bgColor};"
             onclick="window.dpiManager.selectStage(${idx})">
          
          <div class="dpi-card-header">
            <label class="custom-radio">
              <input type="radio" name="dpi_active_radio" ${isSelected ? 'checked' : ''} 
                     onchange="window.dpiManager.selectStage(${idx})" />
              <span class="radio-indicator" style="--indicator-color: ${color}"></span>
            </label>
            <span class="dpi-badge" style="color: ${color};">
              ${isSelected ? window.t('currentDpi') : `Stage ${idx + 1}`}
            </span>
          </div>

          <div class="dpi-value-box" style="border-color: ${isSelected ? color : 'transparent'};">
            <input type="number" 
                   class="dpi-number-input" 
                   value="${stage.dpiValue}" 
                   min="200" 
                   max="6400" 
                   step="50"
                   style="color: ${color};"
                   onclick="event.stopPropagation();"
                   onchange="window.dpiManager.updateStageValue(${idx}, this.value)"
                   onkeydown="if(event.key==='Enter') this.blur();" />
            <span class="dpi-unit" style="color: ${color};">DPI</span>
          </div>
        </div>
      `;
    });

    html += `
        </div>

        <!-- Interactive DPI Slider Area -->
        <div class="dpi-slider-section">
          <div class="dpi-slider-header">
            <span class="speed-label slow">${window.t('slow')}</span>
            <div class="current-slider-readout" style="color: ${activeStage.dpiColor};">
              <span class="readout-num">${activeDpi}</span>
              <span class="readout-unit">DPI</span>
            </div>
            <span class="speed-label fast">${window.t('fast')}</span>
          </div>

          <div class="slider-track-container" style="--accent-color: ${activeStage.dpiColor};">
            <input type="range" 
                   id="dpiRangeSlider" 
                   class="custom-range-slider" 
                   min="200" 
                   max="6400" 
                   step="50" 
                   value="${activeDpi}"
                   oninput="window.dpiManager.onSliderInput(this.value)"
                   onchange="window.dpiManager.onSliderChange(this.value)" />
          </div>

          <!-- Tick Marks -->
          <div class="slider-tick-marks">
            ${this.marks.map(m => `
              <span class="tick ${m === activeDpi ? 'active' : ''}" 
                    style="left: ${((m - 200) / (6400 - 200)) * 100}%;"
                    onclick="window.dpiManager.onSliderInput(${m}); window.dpiManager.onSliderChange(${m});">
                ${m}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;
  }

  selectStage(idx) {
    window.appState.updateConfig({ dpi_index: idx });
    this.render();
  }

  updateStageValue(idx, val) {
    let num = parseInt(val, 10);
    if (isNaN(num)) num = 800;
    num = Math.max(200, Math.min(6400, num));

    const stages = window.appState.getCurrentDpiStages();
    stages[idx].dpiValue = num;
    window.appState.saveProfiles();
    this.render();
  }

  onSliderInput(val) {
    const num = parseInt(val, 10);
    const stages = window.appState.getCurrentDpiStages();
    const config = window.appState.getCurrentConfig();
    const idx = config.dpi_index ?? 0;
    stages[idx].dpiValue = num;

    const readout = this.container.querySelector('.readout-num');
    if (readout) readout.textContent = num;

    const input = this.container.querySelectorAll('.dpi-number-input')[idx];
    if (input) input.value = num;
  }

  onSliderChange(val) {
    window.appState.saveProfiles();
    this.render();
    window.showToast(`${window.t('currentDpi')}: ${val} DPI`, 'success');
  }

  restoreDefaults() {
    const stages = window.appState.getCurrentDpiStages();
    const defaults = [800, 1200, 1600, 3200, 6400];
    stages.forEach((s, i) => {
      s.dpiValue = defaults[i];
    });
    window.appState.updateConfig({ dpi_index: 1 }); // Stage 2 default
    this.render();
    window.showToast(window.t('restDefaultSetting'), 'success');
  }
}

window.DpiManager = DpiManager;
