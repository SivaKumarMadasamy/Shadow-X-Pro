// Internationalization dictionary for Shadow X Pro
const translations = {
  en: {
    // Navigation & Common
    appTitle: "Shadow X Pro",
    myEquipment: "Shadow X Pro",
    loading: "Loading...",
    operationing: "Operating...",
    ok: "Confirm",
    cancel: "Cancel",
    save: "Save",
    reset: "Reset",
    delete: "Delete",
    rename: "Rename",
    export: "Export",
    import: "Import",
    tips: "Prompt",
    close: "Close",
    wiredConnect: "Wired",
    "2.4GConnect": "2.4G",
    charging: "Charging",
    sufficientCharge: "Sufficient power",
    
    // Discovery / Home
    addDevice: "Add Device",
    searchingDevices: "Searching for devices...",
    foundDevices: "Found {count} device(s)",
    findDevice: "Found {count} device(s)",
    onlySupportsHint: "Only supports Chrome and Edge browsers / Desktop App",
    youngerGenChoice: "The choices of the younger generation!",
    unknownDevice: "Unknown Device",
    deviceDetails: "Device Management",
    
    // Profiles Sidebar
    createConfig: "New",
    createConfigName: "Name the Configuration",
    createConfigTip: "Please enter a configuration name (1-20 characters)",
    enterConfigName: "Enter configuration name",
    onboardConfig: "Onboard configuration",
    lengthNotAllowEmpty: "Configuration name cannot be empty",
    lengthLimit: "Name length must be between 1 and 20 characters",
    haveSameName: "A configuration with this name already exists",
    specialCharError: "Configuration name cannot contain special characters",
    createSuccess: "Configuration created successfully",
    importSuccess: "Configuration imported successfully",
    importFail: "Failed to import configuration",
    exportSuccess: "Configuration exported successfully",
    succeededRename: "Renamed successfully",
    deleteSuccess: "Configuration deleted successfully",
    maxLimit: "Maximum number of profiles reached (6 profiles max)",
    notApplicable: "Profile is not compatible with this device model",
    errorType: "Invalid profile format",
    failTypeError: "File read or parse error",
    delConfigFile: "Delete Configuration",
    sureDelPre: "Are you sure you want to delete ",
    sureDelAfter: "? This action cannot be undone.",
    noAllowDel: "Onboard configuration cannot be deleted",
    
    // Main Tabs
    keySetting: "Key Setting",
    dpiSetting: "DPI Setting",
    performanceSetting: "Performance Setting",
    otherSetting: "Other Setting",
    
    // Key Assignment Drawer & Mouse Diagram
    systemKey: "System",
    keyboardKey: "Keyboard",
    order: "Shortcut Keys",
    recordMacro: "Macro",
    systemAssignTip: "Drag or click the system button to the target mouse button for allocation",
    keyAssignTip: "Drag or click keyboard keys to target device keys for allocation",
    orderAssignTip: "Drag or click the command to the target device button for allocation",
    macroAssignTip: "Drag or click the macro to the target device button for allocation",
    restoreDefault: "Restore defaults",
    restAllDefault: "Reset to default",
    restAllDefaultComfirm: "Are you sure you want to restore factory settings? This operation will clear all key settings.",
    leftBtnNoChange: "Left button cannot be modified",
    haveSet: "Assigned",
    fireKey: "Fire key",
    fireKeyTip1: "Continue clicking according to the set interval and number of times",
    fireKeyTip2: "Clicks=0: Hold to trigger continuously, release to stop.",
    fireKeyText1: "Click interval",
    fireKeyText2: "Number of clicks",
    fireKeyText3: "Times",
    fireKeyBtn: "Save",
    fireKeySelectFirst: "Please select a mouse button to configure first",
    fireKeyNotLeftBtn: "Left button cannot be configured as fire key",
    fireKeyConfigSuccess: "Fire key configured successfully",
    
    // Mouse Key Names
    leftButton: "Left Button",
    rightButton: "Right Button",
    middleButton: "Middle Button",
    forward: "Forward Button",
    backward: "Backward Button",
    scrollUp: "Scroll Wheel Up",
    scrollDown: "Scroll Wheel Down",
    dpi: "DPI Switch",
    forbidden: "Disable",
    
    // Multimedia & Shortcuts
    multimedia: "Multimedia",
    playPause: "Play / Pause",
    mute: "Mute",
    stopPlaying: "Stop",
    previousTrack: "Previous Track",
    nextTrack: "Next Track",
    volumeUp: "Volume +",
    volumeDown: "Volume -",
    system: "System",
    browserHomePage: "Browser - Home Page",
    browserRefresh: "Browser - Refresh",
    browserStop: "Browser - Stop",
    browserForward: "Browser - Forward",
    browserBackward: "Browser - Backward",
    browserFavorite: "Browser - Favorites",
    browserSearch: "Browser - Search",
    calculator: "Calculator",
    myComputer: "My Computer",
    mailbox: "Email",
    
    // Windows Shortcuts
    taskManager: "Task Manager",
    startMenu: "Start Menu",
    fileExplorer: "File Explorer",
    lockScreen: "Lock Screen",
    hideShowDesktop: "Hide / Show Desktop",
    run: "Run Dialog",
    search: "Search",
    windowsSettingsCenter: "Windows Settings",
    actionCenter: "Action Center",
    emojiPanel: "Emoji Panel",
    magnifier: "Magnifier",
    appSwitcher: "App Switcher",
    
    // DPI Settings
    currentDpi: "Current DPI",
    dpiLevel: "DPI Levels",
    slow: "Slow",
    fast: "Fast",
    restDefaultSetting: "Restore default settings",
    dpiTips: "DPI indicates mouse sensitivity. Use the DPI button to adjust swiftly.",
    
    // Performance Settings
    sleepSetting: "Hibernate setting",
    minute: "minutes",
    neverSleep: "Never sleep",
    sleepTip: "After being idle for a specified time in 2.4G and Bluetooth modes, the device will automatically enter sleep mode.",
    pollingRateSetting: "Polling rate setting",
    pollingTip: "A higher mouse polling rate can reduce the impact of input lag.",
    keyDebounceTime: "Key debounce time",
    keyDebounceTimeTip: "Lower values mean faster mouse response; higher ones offer better stability. Don't set it too low to avoid double-clicking.",
    milliseconds: "milliseconds",
    lODSilentHeight: "LOD Silent Height",
    lODSilentHeightTip: "The distance the mouse stops moving when it leaves the desktop.",
    sensorSetting: "Sensor setting",
    rippleControl: "Waveform control",
    rippleControlTip: "The mouse will perform algorithm adjustments at high speeds to eliminate wave-like jitters.",
    lineCorrection: "Line correction",
    lineCorrectionTip: "The mouse will make linear corrections when moving.",
    motionSync: "Motion Sync",
    motionSyncTip: "The accuracy of the sensor refresh cycle and the discreteness of the sensor movement data.",
    modeSetting: "Mode setting",
    esportsMode: "eSports mode",
    esportsModeTip: "In e-sports mode, both the sensor and main control enter the most active mode, responding faster, but it will increase power consumption and reduce usage time.",
    rollerDirection: "Roller direction setting",
    rollerDirectionTip: "Switch the functions of mouse wheel up and mouse wheel down.",
    forwardDirection: "Forward",
    reverseDirection: "Reverse",
    lightSetting: "Lighting Settings",
    lightSettingTip: "Change the light effect of the mouse.",
    wave: "Wave",
    neonLight: "Neon",
    touringFlash: "Touring Flash",
    yoyoBall: "YOYO Ball",
    unidirectionalFlashing: "Unidirectional Flashing",
    circularBreathing: "Circular Breathing",
    turnOffTheLight: "Turn Off The Light",
    
    // Other / Firmware Settings
    mouseFirmwareVersion: "Mouse firmware version: ",
    receiverFirmwareVersion: "Receiver firmware version: ",
    latest: "Latest",
    upgradeNow: "Upgrade",
    toBeConnected: "Pending connection",
    latestVersion: "Detected latest version",
    pleaseUpdate: "Please update",
    noNeedUpdate: "The firmware is already up to date, no update is needed",
    firmwareVersion: "Firmware version",
    upDateFirmware: "The firmware is already up to date, no update is needed",
    usbNotConnected: "USB not connected (Mouse firmware upgrade requires USB connection)",
    "2.4gNotConnected": "2.4G not connected (Receiver firmware upgrade requires connection to 2.4G)",
    restoreFactorySetting: "Restore factory settings",
    restoreFactoryTip: "All settings will be restored to factory defaults, please proceed with caution.",
    factoryRecovery: "Restore",
    resetConfirm: "This operation will clear all settings. Are you sure you want to restore factory settings?",
    mouseReset: "Mouse has been reset to factory defaults",
    
    // Macro System
    newMacro: "Create macro",
    macroName: "Naming the macro",
    pleaseEnter: "After entering the name, press Enter or click Next",
    selectMacroType: "Please select the type of macro to create",
    cycleWhileHolding: "Hold down to loop",
    cycleWhileHoldingTip: "Pressing the key will continuously execute the macro, releasing it stops.",
    loopOtherKeysPressed: "Loop until another key is pressed",
    loopOtherKeysPressedTip: "The macro will keep repeating until another key is pressed to turn it off.",
    loopSameKeysPressed: "Loop until the same key is pressed",
    loopSameKeysPressedTip: "The macro will continue to repeat until the key is pressed to turn it off.",
    cyclicRepetition: "Repeatedly loop",
    repeatTimes: "Repeat count",
    standardDelay: "Standard delay (ms)",
    startRecording: "Record",
    stopRecording: "Pause",
    continueRecording: "Resume",
    insertMouseButton: "Insert mouse button",
    insertKeyboardKeys: "Insert keyboard key",
    insertDelayTime: "Insert delay time",
    saveExit: "Save and Exit",
    directExit: "Exit directly",
    exitMacro: "Exit Macro",
    isSave: "Do you want to save the recorded macro?",
    saveSuccess: "Save successful",
    saveFail: "Save failed",
    resetMarco: "Are you sure you want to reset? This action will clear the recorded macro.",
    haveReset: "Macro has been reset"
  },
  zh: {
    appTitle: "Shadow X Pro",
    myEquipment: "Shadow X Pro",
    loading: "加载中...",
    operationing: "操作中...",
    ok: "确认",
    cancel: "取消",
    save: "保存",
    reset: "重置",
    delete: "删除",
    rename: "重命名",
    export: "导出",
    import: "导入",
    tips: "提示",
    close: "关闭",
    wiredConnect: "有线连接",
    "2.4GConnect": "2.4G无线",
    charging: "充电中",
    sufficientCharge: "电量充足",
    
    addDevice: "添加设备",
    searchingDevices: "正在搜索设备...",
    foundDevices: "发现 {count} 个设备",
    findDevice: "发现 {count} 个设备",
    onlySupportsHint: "仅支持 Chrome、Edge 浏览器及 Windows 桌面应用",
    youngerGenChoice: "年轻一代的选择！",
    unknownDevice: "未知设备",
    deviceDetails: "设备管理",
    
    createConfig: "新建",
    createConfigName: "新建配置名称",
    createConfigTip: "请输入配置名称（1-20个字符）",
    enterConfigName: "输入配置名称",
    onboardConfig: "板载配置",
    lengthNotAllowEmpty: "配置名称不能为空",
    lengthLimit: "配置名称长度限制在1-20位",
    haveSameName: "配置名称已存在",
    specialCharError: "配置名称不能包含特殊字符",
    createSuccess: "创建配置成功",
    importSuccess: "导入配置成功",
    importFail: "导入配置失败",
    exportSuccess: "导出配置成功",
    succeededRename: "重命名成功",
    deleteSuccess: "删除配置成功",
    maxLimit: "配置数量已达到上限（最多6个）",
    notApplicable: "该配置文件不适用于此设备型号",
    errorType: "文件格式不正确",
    failTypeError: "文件解析失败",
    delConfigFile: "删除配置文件",
    sureDelPre: "您确定要删除 ",
    sureDelAfter: " 吗？此操作无法撤销。",
    noAllowDel: "板载配置不允许删除",
    
    keySetting: "按键设置",
    dpiSetting: "DPI设置",
    performanceSetting: "性能设置",
    otherSetting: "其他设置",
    
    systemKey: "系统功能",
    keyboardKey: "键盘按键",
    order: "快捷按键",
    recordMacro: "宏定义",
    systemAssignTip: "拖拽或点击系统功能分配至目标按键",
    keyAssignTip: "拖拽或点击键盘按键分配至目标按键",
    orderAssignTip: "拖拽或点击快捷功能分配至目标按键",
    macroAssignTip: "拖拽或点击宏功能分配至目标按键",
    restoreDefault: "恢复默认",
    restAllDefault: "全部恢复默认",
    restAllDefaultComfirm: "您确定要恢复出厂设置吗？此操作将清除所有设置。",
    leftBtnNoChange: "鼠标左键无法更改",
    haveSet: "已设置",
    fireKey: "火力键",
    fireKeyTip1: "按照设置的时间间隔和点击次数连续触发",
    fireKeyTip2: "点击次数=0：长按持续触发，松开停止。",
    fireKeyText1: "点击间隔",
    fireKeyText2: "点击次数",
    fireKeyText3: "次",
    fireKeyBtn: "保存",
    fireKeySelectFirst: "请先选择需要配置的按键",
    fireKeyNotLeftBtn: "左键无法配置为火力键",
    fireKeyConfigSuccess: "火力键配置成功",
    
    leftButton: "鼠标左键",
    rightButton: "鼠标右键",
    middleButton: "鼠标中键",
    forward: "前进键",
    backward: "后退键",
    scrollUp: "滚轮上滚",
    scrollDown: "滚轮下滚",
    dpi: "DPI切换",
    forbidden: "禁用此键",
    
    multimedia: "多媒体",
    playPause: "播放/暂停",
    mute: "静音",
    stopPlaying: "停止",
    previousTrack: "上一曲",
    nextTrack: "下一曲",
    volumeUp: "音量+",
    volumeDown: "音量-",
    system: "系统快捷",
    browserHomePage: "浏览器主页",
    browserRefresh: "刷新网页",
    browserStop: "停止加载",
    browserForward: "前进网页",
    browserBackward: "后退网页",
    browserFavorite: "收藏夹",
    browserSearch: "网页搜索",
    calculator: "计算器",
    myComputer: "我的电脑",
    mailbox: "电子邮箱",
    
    taskManager: "任务管理器",
    startMenu: "开始菜单",
    fileExplorer: "文件资源管理器",
    lockScreen: "锁定屏幕",
    hideShowDesktop: "显示/隐藏桌面",
    run: "运行窗口",
    search: "Windows搜索",
    windowsSettingsCenter: "Windows设置",
    actionCenter: "操作中心",
    emojiPanel: "Emoji面板",
    magnifier: "放大镜",
    appSwitcher: "应用切换器",
    
    currentDpi: "当前DPI",
    dpiLevel: "DPI档位",
    slow: "慢",
    fast: "快",
    restDefaultSetting: "恢复默认设置",
    dpiTips: "DPI表示鼠标灵敏度。使用鼠标DPI按键可进行快速切换。",
    
    sleepSetting: "休眠时间设置",
    minute: "分钟",
    neverSleep: "从不休眠",
    sleepTip: "设备在2.4G或蓝牙模式空闲指定时间后自动进入省电休眠。",
    pollingRateSetting: "回报率设置",
    pollingTip: "提高鼠标回报率可有效降低输入延迟，提升操作跟手度。",
    keyDebounceTime: "按键防抖延迟",
    keyDebounceTimeTip: "数值越小响应越快，数值越大稳定性越好，请勿调得过低以防双击。",
    milliseconds: "毫秒",
    lODSilentHeight: "静默高度 (LOD)",
    lODSilentHeightTip: "鼠标离开桌面停止感应的光学感应高度距离。",
    sensorSetting: "传感器设置",
    rippleControl: "直线修正",
    rippleControlTip: "开启后算法在高速度移动时消除细微波动抖动。",
    lineCorrection: "直线补偿",
    lineCorrectionTip: "鼠标移动时将进行直线平滑补偿修正。",
    motionSync: "传感器同步 (Motion Sync)",
    motionSyncTip: "同步传感器数据刷新周期与USB回报周期，提高移动精度。",
    modeSetting: "模式设置",
    esportsMode: "电竞模式 (High-Speed)",
    esportsModeTip: "在电竞模式下，传感器和主控芯片进入最高速轮询状态，响应极速。",
    rollerDirection: "滚轮方向设置",
    rollerDirectionTip: "互换鼠标滚轮向上滚动和向下滚动的方向功能。",
    forwardDirection: "正向滚动",
    reverseDirection: "反向滚动",
    lightSetting: "灯效设置",
    lightSettingTip: "调整鼠标动态RGB灯效模式与颜色。",
    wave: "流光溢彩",
    neonLight: "炫彩霓虹",
    touringFlash: "巡航闪烁",
    yoyoBall: "悠悠跳跃",
    unidirectionalFlashing: "单向闪烁",
    circularBreathing: "循环呼吸",
    turnOffTheLight: "关闭灯效",
    
    mouseFirmwareVersion: "鼠标固件版本：",
    receiverFirmwareVersion: "接收器固件版本：",
    latest: "最新版本",
    upgradeNow: "立即升级",
    toBeConnected: "待连接",
    latestVersion: "已检测到最新版本",
    pleaseUpdate: "请更新固件",
    noNeedUpdate: "当前固件已是最新版本，无需更新",
    firmwareVersion: "固件版本",
    upDateFirmware: "固件已是最新版本",
    usbNotConnected: "USB未连接（升级鼠标固件需连接USB）",
    "2.4gNotConnected": "2.4G未连接（升级接收器固件需连接2.4G）",
    restoreFactorySetting: "恢复出厂设置",
    restoreFactoryTip: "所有自定义配置将恢复为出厂默认设置，请谨慎操作。",
    factoryRecovery: "恢复出厂",
    resetConfirm: "此操作将清除所有自定义配置与按键映射。确定要恢复出厂设置吗？",
    mouseReset: "鼠标设置已重置为出厂默认值",
    
    newMacro: "新建宏定义",
    macroName: "命名宏",
    pleaseEnter: "输入宏名称后，按回车或点击下一步",
    selectMacroType: "请选择宏的触发循环模式",
    cycleWhileHolding: "按下持续循环",
    cycleWhileHoldingTip: "按住按键时持续重复执行宏，松开按键立即停止。",
    loopOtherKeysPressed: "循环直到按下其他键",
    loopOtherKeysPressedTip: "宏将一直持续循环，直到按下键盘鼠标任意按键停止。",
    loopSameKeysPressed: "再次按下停止循环",
    loopSameKeysPressedTip: "按一次开始循环执行，再次按下相同按键停止执行。",
    cyclicRepetition: "重复循环固定次数",
    repeatTimes: "循环次数",
    standardDelay: "标准延迟 (ms)",
    startRecording: "开始录制",
    stopRecording: "暂停录制",
    continueRecording: "继续录制",
    insertMouseButton: "插入鼠标键",
    insertKeyboardKeys: "插入键盘键",
    insertDelayTime: "插入延时",
    saveExit: "保存并退出",
    directExit: "直接退出",
    exitMacro: "退出宏编辑",
    isSave: "是否保存当前录制的宏定义？",
    saveSuccess: "保存宏成功",
    saveFail: "保存失败",
    resetMarco: "确定要重置当前宏吗？此操作将清空所有已录制的按键动作。",
    haveReset: "宏已重置"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem("shadowxpro_lang") || "en";
    this.listeners = [];
  }

  setLang(lang) {
    if (lang !== "en" && lang !== "zh") lang = "en";
    this.currentLang = lang;
    localStorage.setItem("shadowxpro_lang", lang);
    document.documentElement.lang = lang;
    this.listeners.forEach(fn => fn(lang));
    this.updateDom();
  }

  setLanguage(lang) {
    return this.setLang(lang);
  }

  t(key, params = {}) {
    let str = translations[this.currentLang]?.[key] || translations["en"]?.[key] || key;
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, v);
    }
    return str;
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  updateDom() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key) {
        el.textContent = this.t(key);
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key) {
        el.setAttribute("placeholder", this.t(key));
      }
    });

    document.querySelectorAll("[data-i18n-title]").forEach(el => {
      const key = el.getAttribute("data-i18n-title");
      if (key) {
        el.setAttribute("title", this.t(key));
      }
    });
  }
}

window.i18n = new I18nManager();
window.t = (key, params) => window.i18n.t(key, params);
