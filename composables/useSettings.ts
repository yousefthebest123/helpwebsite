// Global Settings Composable — persisted in localStorage
export interface AppSettings {
  // Theme
  theme: 'aurora' | 'ocean' | 'sunset' | 'emerald' | 'rose' | 'midnight' | 'cyber' | 'custom'
  customPrimary: string
  customSecondary: string

  // Appearance
  fontSize: 'small' | 'medium' | 'large'
  animationsEnabled: boolean
  glassEffect: boolean
  reducedMotion: boolean
  compactMode: boolean

  // Study Preferences
  defaultStudyMode: 'normal' | 'spaced' | 'quiz'
  cardsPerSession: number
  autoFlipDelay: number // 0 = off, else ms
  showStudyStreak: boolean
  dailyGoal: number // cards per day
  pomodoroWork: number
  pomodoroBreak: number

  // Notifications
  soundEnabled: boolean
  studyReminder: boolean
  reminderTime: string

  // Data
  autoSave: boolean
  autoSaveInterval: number // seconds
}

interface ThemeColors {
  primary: string; primaryDark: string; primaryLight: string
  secondary: string; secondaryDark: string; accent: string
  gradient1: string; label: string; emoji: string
  // Backgrounds
  bg: string; bg2: string
  surface: string; surfaceLight: string; surfaceLighter: string
  surfaceGlass: string
  // Aurora blobs
  aurora1: string; aurora2: string; aurora3: string
  gridTint: string
}

const THEMES: Record<string, ThemeColors> = {
  aurora: {
    primary: '#7c3aed', primaryDark: '#6d28d9', primaryLight: '#a78bfa',
    secondary: '#06b6d4', secondaryDark: '#0891b2', accent: '#f43f5e',
    gradient1: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    label: 'Aurora', emoji: '🌌',
    bg: '#050510', bg2: '#0a0a1f',
    surface: '#111128', surfaceLight: '#1a1a3e', surfaceLighter: '#252552',
    surfaceGlass: 'rgba(17, 17, 40, 0.75)',
    aurora1: 'rgba(124, 58, 237, 0.35)', aurora2: 'rgba(6, 182, 212, 0.25)', aurora3: 'rgba(236, 72, 153, 0.2)',
    gridTint: 'rgba(124, 58, 237, 0.03)',
  },
  ocean: {
    primary: '#0ea5e9', primaryDark: '#0284c7', primaryLight: '#7dd3fc',
    secondary: '#06b6d4', secondaryDark: '#0891b2', accent: '#14b8a6',
    gradient1: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    label: 'Ocean', emoji: '🌊',
    bg: '#020c1b', bg2: '#071a2f',
    surface: '#0a1e36', surfaceLight: '#112d4e', surfaceLighter: '#1a3d66',
    surfaceGlass: 'rgba(10, 30, 54, 0.75)',
    aurora1: 'rgba(14, 165, 233, 0.3)', aurora2: 'rgba(6, 182, 212, 0.25)', aurora3: 'rgba(20, 184, 166, 0.2)',
    gridTint: 'rgba(14, 165, 233, 0.03)',
  },
  sunset: {
    primary: '#f97316', primaryDark: '#ea580c', primaryLight: '#fdba74',
    secondary: '#f43f5e', secondaryDark: '#e11d48', accent: '#fbbf24',
    gradient1: 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
    label: 'Sunset', emoji: '🌅',
    bg: '#120805', bg2: '#1a0e0a',
    surface: '#291510', surfaceLight: '#3a1f18', surfaceLighter: '#4d2a20',
    surfaceGlass: 'rgba(41, 21, 16, 0.75)',
    aurora1: 'rgba(249, 115, 22, 0.3)', aurora2: 'rgba(244, 63, 94, 0.25)', aurora3: 'rgba(251, 191, 36, 0.2)',
    gridTint: 'rgba(249, 115, 22, 0.03)',
  },
  emerald: {
    primary: '#10b981', primaryDark: '#059669', primaryLight: '#6ee7b7',
    secondary: '#14b8a6', secondaryDark: '#0d9488', accent: '#34d399',
    gradient1: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    label: 'Emerald', emoji: '💎',
    bg: '#030f0b', bg2: '#071a14',
    surface: '#0c261c', surfaceLight: '#133628', surfaceLighter: '#1c4a38',
    surfaceGlass: 'rgba(12, 38, 28, 0.75)',
    aurora1: 'rgba(16, 185, 129, 0.3)', aurora2: 'rgba(20, 184, 166, 0.25)', aurora3: 'rgba(52, 211, 153, 0.2)',
    gridTint: 'rgba(16, 185, 129, 0.03)',
  },
  rose: {
    primary: '#f43f5e', primaryDark: '#e11d48', primaryLight: '#fda4af',
    secondary: '#ec4899', secondaryDark: '#db2777', accent: '#f472b6',
    gradient1: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
    label: 'Rose', emoji: '🌹',
    bg: '#120508', bg2: '#1c0a10',
    surface: '#2a101a', surfaceLight: '#3a1826', surfaceLighter: '#4d2035',
    surfaceGlass: 'rgba(42, 16, 26, 0.75)',
    aurora1: 'rgba(244, 63, 94, 0.3)', aurora2: 'rgba(236, 72, 153, 0.25)', aurora3: 'rgba(244, 114, 182, 0.2)',
    gridTint: 'rgba(244, 63, 94, 0.03)',
  },
  midnight: {
    primary: '#6366f1', primaryDark: '#4f46e5', primaryLight: '#a5b4fc',
    secondary: '#8b5cf6', secondaryDark: '#7c3aed', accent: '#c084fc',
    gradient1: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    label: 'Midnight', emoji: '🌙',
    bg: '#06060f', bg2: '#0c0c1e',
    surface: '#141430', surfaceLight: '#1e1e45', surfaceLighter: '#2a2a5c',
    surfaceGlass: 'rgba(20, 20, 48, 0.75)',
    aurora1: 'rgba(99, 102, 241, 0.3)', aurora2: 'rgba(139, 92, 246, 0.25)', aurora3: 'rgba(192, 132, 252, 0.2)',
    gridTint: 'rgba(99, 102, 241, 0.03)',
  },
  cyber: {
    primary: '#22d3ee', primaryDark: '#06b6d4', primaryLight: '#67e8f9',
    secondary: '#a3e635', secondaryDark: '#84cc16', accent: '#facc15',
    gradient1: 'linear-gradient(135deg, #22d3ee 0%, #a3e635 100%)',
    label: 'Cyber', emoji: '⚡',
    bg: '#020d0d', bg2: '#061616',
    surface: '#0c2222', surfaceLight: '#143333', surfaceLighter: '#1e4545',
    surfaceGlass: 'rgba(12, 34, 34, 0.75)',
    aurora1: 'rgba(34, 211, 238, 0.3)', aurora2: 'rgba(163, 230, 53, 0.25)', aurora3: 'rgba(250, 204, 21, 0.18)',
    gridTint: 'rgba(34, 211, 238, 0.03)',
  },
}

const DEFAULTS: AppSettings = {
  theme: 'aurora',
  customPrimary: '#7c3aed',
  customSecondary: '#06b6d4',
  fontSize: 'medium',
  animationsEnabled: true,
  glassEffect: true,
  reducedMotion: false,
  compactMode: false,
  defaultStudyMode: 'normal',
  cardsPerSession: 20,
  autoFlipDelay: 0,
  showStudyStreak: true,
  dailyGoal: 30,
  pomodoroWork: 25,
  pomodoroBreak: 5,
  soundEnabled: true,
  studyReminder: false,
  reminderTime: '09:00',
  autoSave: true,
  autoSaveInterval: 30,
}

const STORAGE_KEY = 'quickhelp-settings'

export const useSettings = () => {
  const settings = useState<AppSettings>('app-settings', () => ({ ...DEFAULTS }))
  const loaded = useState('settings-loaded', () => false)

  const loadSettings = () => {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        settings.value = { ...DEFAULTS, ...parsed }
      }
      loaded.value = true
    } catch { /* ignore */ }
  }

  const saveSettings = () => {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
  }

  const applyTheme = () => {
    if (import.meta.server) return
    const t = settings.value.theme
    const root = document.documentElement

    let colors: ThemeColors
    if (t === 'custom') {
      const p = settings.value.customPrimary
      const s = settings.value.customSecondary
      // Derive dark bg from primary hue
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
        return { r, g, b }
      }
      const rgb = hexToRgb(p)
      colors = {
        primary: p, primaryDark: p, primaryLight: p,
        secondary: s, secondaryDark: s, accent: '#f43f5e',
        gradient1: `linear-gradient(135deg, ${p} 0%, ${s} 100%)`,
        label: 'Custom', emoji: '🎨',
        bg: `#0${Math.round(rgb.r/60).toString(16)}0${Math.round(rgb.g/60).toString(16)}0${Math.round(rgb.b/60).toString(16)}`.slice(0,7).padEnd(7,'0'),
        bg2: `#0${Math.round(rgb.r/40).toString(16)}0${Math.round(rgb.g/40).toString(16)}0${Math.round(rgb.b/40).toString(16)}`.slice(0,7).padEnd(7,'0'),
        surface: `rgba(${Math.round(rgb.r/5)}, ${Math.round(rgb.g/5)}, ${Math.round(rgb.b/5)}, 1)`,
        surfaceLight: `rgba(${Math.round(rgb.r/4)}, ${Math.round(rgb.g/4)}, ${Math.round(rgb.b/4)}, 1)`,
        surfaceLighter: `rgba(${Math.round(rgb.r/3)}, ${Math.round(rgb.g/3)}, ${Math.round(rgb.b/3)}, 1)`,
        surfaceGlass: `rgba(${Math.round(rgb.r/5)}, ${Math.round(rgb.g/5)}, ${Math.round(rgb.b/5)}, 0.75)`,
        aurora1: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`,
        aurora2: `${s}40`,
        aurora3: 'rgba(236, 72, 153, 0.2)',
        gridTint: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.03)`,
      }
    } else {
      colors = THEMES[t] || THEMES.aurora
    }

    // Accent colors
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--primary-dark', colors.primaryDark)
    root.style.setProperty('--primary-light', colors.primaryLight)
    root.style.setProperty('--secondary', colors.secondary)
    root.style.setProperty('--secondary-dark', colors.secondaryDark)
    root.style.setProperty('--accent', colors.accent)
    root.style.setProperty('--gradient-1', colors.gradient1)
    root.style.setProperty('--glow', `${colors.primary}80`)
    root.style.setProperty('--glow-cyan', `${colors.secondary}80`)
    root.style.setProperty('--border', `${colors.primary}33`)
    root.style.setProperty('--shadow-glow', `0 0 30px ${colors.primary}4D`)
    root.style.setProperty('--shadow-glow-cyan', `0 0 30px ${colors.secondary}4D`)

    // Backgrounds & surfaces
    root.style.setProperty('--background', colors.bg)
    root.style.setProperty('--background-2', colors.bg2)
    root.style.setProperty('--surface', colors.surface)
    root.style.setProperty('--surface-light', colors.surfaceLight)
    root.style.setProperty('--surface-lighter', colors.surfaceLighter)
    root.style.setProperty('--surface-glass', colors.surfaceGlass)

    // Aurora background blobs
    root.style.setProperty('--aurora-1', colors.aurora1)
    root.style.setProperty('--aurora-2', colors.aurora2)
    root.style.setProperty('--aurora-3', colors.aurora3)
    root.style.setProperty('--grid-tint', colors.gridTint)

    // Font size
    const sizeMap = { small: '14px', medium: '16px', large: '18px' }
    root.style.setProperty('--base-font-size', sizeMap[settings.value.fontSize])

    // Animations
    if (!settings.value.animationsEnabled || settings.value.reducedMotion) {
      root.classList.add('no-animations')
    } else {
      root.classList.remove('no-animations')
    }

    // Compact mode
    if (settings.value.compactMode) {
      root.classList.add('compact-mode')
    } else {
      root.classList.remove('compact-mode')
    }
  }

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    settings.value[key] = value
    saveSettings()
    applyTheme()
  }

  const resetSettings = () => {
    settings.value = { ...DEFAULTS }
    saveSettings()
    applyTheme()
  }

  const exportSettings = () => {
    return JSON.stringify(settings.value, null, 2)
  }

  const importSettings = (json: string) => {
    try {
      const parsed = JSON.parse(json)
      settings.value = { ...DEFAULTS, ...parsed }
      saveSettings()
      applyTheme()
      return true
    } catch {
      return false
    }
  }

  // Init on client
  if (import.meta.client && !loaded.value) {
    loadSettings()
    applyTheme()
  }

  return {
    settings,
    themes: THEMES,
    updateSetting,
    resetSettings,
    applyTheme,
    loadSettings,
    saveSettings,
    exportSettings,
    importSettings,
  }
}
