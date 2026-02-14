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

const THEMES: Record<string, { primary: string; primaryDark: string; primaryLight: string; secondary: string; secondaryDark: string; accent: string; gradient1: string; label: string; emoji: string }> = {
  aurora: {
    primary: '#7c3aed',
    primaryDark: '#6d28d9',
    primaryLight: '#a78bfa',
    secondary: '#06b6d4',
    secondaryDark: '#0891b2',
    accent: '#f43f5e',
    gradient1: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
    label: 'Aurora',
    emoji: '🌌',
  },
  ocean: {
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    primaryLight: '#7dd3fc',
    secondary: '#06b6d4',
    secondaryDark: '#0891b2',
    accent: '#14b8a6',
    gradient1: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    label: 'Ocean',
    emoji: '🌊',
  },
  sunset: {
    primary: '#f97316',
    primaryDark: '#ea580c',
    primaryLight: '#fdba74',
    secondary: '#f43f5e',
    secondaryDark: '#e11d48',
    accent: '#fbbf24',
    gradient1: 'linear-gradient(135deg, #f97316 0%, #f43f5e 100%)',
    label: 'Sunset',
    emoji: '🌅',
  },
  emerald: {
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#6ee7b7',
    secondary: '#14b8a6',
    secondaryDark: '#0d9488',
    accent: '#34d399',
    gradient1: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    label: 'Emerald',
    emoji: '💎',
  },
  rose: {
    primary: '#f43f5e',
    primaryDark: '#e11d48',
    primaryLight: '#fda4af',
    secondary: '#ec4899',
    secondaryDark: '#db2777',
    accent: '#f472b6',
    gradient1: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
    label: 'Rose',
    emoji: '🌹',
  },
  midnight: {
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    primaryLight: '#a5b4fc',
    secondary: '#8b5cf6',
    secondaryDark: '#7c3aed',
    accent: '#c084fc',
    gradient1: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    label: 'Midnight',
    emoji: '🌙',
  },
  cyber: {
    primary: '#22d3ee',
    primaryDark: '#06b6d4',
    primaryLight: '#67e8f9',
    secondary: '#a3e635',
    secondaryDark: '#84cc16',
    accent: '#facc15',
    gradient1: 'linear-gradient(135deg, #22d3ee 0%, #a3e635 100%)',
    label: 'Cyber',
    emoji: '⚡',
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

    let colors: typeof THEMES.aurora
    if (t === 'custom') {
      colors = {
        primary: settings.value.customPrimary,
        primaryDark: settings.value.customPrimary,
        primaryLight: settings.value.customPrimary,
        secondary: settings.value.customSecondary,
        secondaryDark: settings.value.customSecondary,
        accent: '#f43f5e',
        gradient1: `linear-gradient(135deg, ${settings.value.customPrimary} 0%, ${settings.value.customSecondary} 100%)`,
        label: 'Custom',
        emoji: '🎨',
      }
    } else {
      colors = THEMES[t] || THEMES.aurora
    }

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
