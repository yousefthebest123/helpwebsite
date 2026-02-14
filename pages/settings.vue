<template>
  <div class="settings-page">
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <span class="hero-badge">⚙️ Preferences</span>
          <h1>Settings</h1>
          <p>Customize your QuickHelp experience — themes, study preferences, and more.</p>
        </div>
      </div>
    </section>

    <section class="settings-content">
      <div class="container">
        <!-- Settings Navigation -->
        <div class="settings-layout">
          <nav class="settings-nav glass">
            <button 
              v-for="tab in tabs" 
              :key="tab.id" 
              class="nav-item" 
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <span class="nav-icon">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </nav>

          <div class="settings-panel">
            <!-- ═════ Theme ═════ -->
            <div v-if="activeTab === 'theme'" class="panel glass">
              <h2>🎨 Theme & Colors</h2>
              <p class="panel-desc">Choose a color theme for the entire app. Changes apply instantly.</p>

              <div class="theme-grid">
                <button 
                  v-for="(theme, key) in themes" 
                  :key="key"
                  class="theme-card"
                  :class="{ active: settings.theme === key }"
                  @click="updateSetting('theme', key)"
                >
                  <div class="theme-preview" :style="{ background: theme.gradient1 }">
                    <span class="theme-emoji">{{ theme.emoji }}</span>
                  </div>
                  <span class="theme-name">{{ theme.label }}</span>
                  <span class="theme-check" v-if="settings.theme === key">✓</span>
                </button>
              </div>

              <div class="setting-group" style="margin-top: 32px;">
                <h3>🎨 Custom Theme</h3>
                <p class="hint-text">Create your own color combination.</p>
                <div class="color-pickers">
                  <div class="color-pick">
                    <label>Primary Color</label>
                    <div class="color-input-group">
                      <input type="color" v-model="settings.customPrimary" @input="onCustomColor" class="color-picker" />
                      <input type="text" v-model="settings.customPrimary" @input="onCustomColor" class="input color-hex" placeholder="#7c3aed" />
                    </div>
                  </div>
                  <div class="color-pick">
                    <label>Secondary Color</label>
                    <div class="color-input-group">
                      <input type="color" v-model="settings.customSecondary" @input="onCustomColor" class="color-picker" />
                      <input type="text" v-model="settings.customSecondary" @input="onCustomColor" class="input color-hex" placeholder="#06b6d4" />
                    </div>
                  </div>
                </div>
                <button class="btn btn-primary btn-sm" @click="applyCustomTheme" style="margin-top: 12px;">
                  Apply Custom Theme
                </button>
              </div>

              <!-- Live Preview -->
              <div class="preview-section">
                <h3>Preview</h3>
                <div class="preview-box glass">
                  <div class="preview-row">
                    <button class="btn btn-primary">Primary Button</button>
                    <button class="btn btn-secondary">Secondary</button>
                    <button class="btn btn-ghost">Ghost</button>
                  </div>
                  <div class="preview-row">
                    <div class="preview-card">
                      <div class="preview-gradient" :style="{ background: 'var(--gradient-1)' }"></div>
                      <span>Gradient Preview</span>
                    </div>
                    <div class="preview-progress">
                      <div class="preview-bar" style="width: 65%;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═════ Appearance ═════ -->
            <div v-if="activeTab === 'appearance'" class="panel glass">
              <h2>👁️ Appearance</h2>
              <p class="panel-desc">Control visual effects and layout density.</p>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Font Size</h4>
                  <p>Adjust the base text size across the app.</p>
                </div>
                <div class="setting-control">
                  <select v-model="settings.fontSize" @change="saveSetting('fontSize', settings.fontSize)" class="input select-input">
                    <option value="small">Small (14px)</option>
                    <option value="medium">Medium (16px)</option>
                    <option value="large">Large (18px)</option>
                  </select>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Animations</h4>
                  <p>Enable smooth transitions and hover effects.</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input type="checkbox" v-model="settings.animationsEnabled" @change="saveSetting('animationsEnabled', settings.animationsEnabled)" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Glass Effect</h4>
                  <p>Enable backdrop blur on panels and cards.</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input type="checkbox" v-model="settings.glassEffect" @change="saveSetting('glassEffect', settings.glassEffect)" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Reduced Motion</h4>
                  <p>Minimize animations for accessibility.</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input type="checkbox" v-model="settings.reducedMotion" @change="saveSetting('reducedMotion', settings.reducedMotion)" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Compact Mode</h4>
                  <p>Reduce spacing and padding for denser layouts.</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input type="checkbox" v-model="settings.compactMode" @change="saveSetting('compactMode', settings.compactMode)" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- ═════ Study ═════ -->
            <div v-if="activeTab === 'study'" class="panel glass">
              <h2>📖 Study Preferences</h2>
              <p class="panel-desc">Configure your learning experience.</p>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Cards Per Session</h4>
                  <p>Maximum number of cards in a single study session.</p>
                </div>
                <div class="setting-control">
                  <input type="number" v-model.number="settings.cardsPerSession" @change="saveSetting('cardsPerSession', settings.cardsPerSession)" class="input number-input" min="5" max="100" />
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Daily Goal</h4>
                  <p>Target number of cards to review each day.</p>
                </div>
                <div class="setting-control">
                  <input type="number" v-model.number="settings.dailyGoal" @change="saveSetting('dailyGoal', settings.dailyGoal)" class="input number-input" min="5" max="200" />
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Auto-Flip Delay</h4>
                  <p>Automatically reveal the answer after X seconds. Set to 0 to disable.</p>
                </div>
                <div class="setting-control">
                  <div class="input-suffix">
                    <input type="number" v-model.number="settings.autoFlipDelay" @change="saveSetting('autoFlipDelay', settings.autoFlipDelay)" class="input number-input" min="0" max="30" />
                    <span class="suffix">sec</span>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Show Study Streak</h4>
                  <p>Display your streak counter on the Learning Hub page.</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input type="checkbox" v-model="settings.showStudyStreak" @change="saveSetting('showStudyStreak', settings.showStudyStreak)" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Default Study Mode</h4>
                  <p>Preferred mode when starting a study session.</p>
                </div>
                <div class="setting-control">
                  <select v-model="settings.defaultStudyMode" @change="saveSetting('defaultStudyMode', settings.defaultStudyMode)" class="input select-input">
                    <option value="normal">Normal</option>
                    <option value="spaced">Spaced Repetition</option>
                    <option value="quiz">Quiz Mode</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- ═════ Pomodoro ═════ -->
            <div v-if="activeTab === 'pomodoro'" class="panel glass">
              <h2>🍅 Pomodoro Settings</h2>
              <p class="panel-desc">Configure your focus timer intervals.</p>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Work Duration</h4>
                  <p>Minutes per focused work block.</p>
                </div>
                <div class="setting-control">
                  <div class="input-suffix">
                    <input type="number" v-model.number="settings.pomodoroWork" @change="saveSetting('pomodoroWork', settings.pomodoroWork)" class="input number-input" min="10" max="90" />
                    <span class="suffix">min</span>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Break Duration</h4>
                  <p>Minutes per short break between work blocks.</p>
                </div>
                <div class="setting-control">
                  <div class="input-suffix">
                    <input type="number" v-model.number="settings.pomodoroBreak" @change="saveSetting('pomodoroBreak', settings.pomodoroBreak)" class="input number-input" min="1" max="30" />
                    <span class="suffix">min</span>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Sound Notifications</h4>
                  <p>Play a sound when a timer completes.</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input type="checkbox" v-model="settings.soundEnabled" @change="saveSetting('soundEnabled', settings.soundEnabled)" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <!-- ═════ Data ═════ -->
            <div v-if="activeTab === 'data'" class="panel glass">
              <h2>💾 Data & Storage</h2>
              <p class="panel-desc">Manage your saved data and preferences.</p>

              <div class="data-stats">
                <div class="d-stat">
                  <span class="d-icon">🃏</span>
                  <div>
                    <span class="d-val">{{ dataStats.cards }}</span>
                    <span class="d-label">Flashcards</span>
                  </div>
                </div>
                <div class="d-stat">
                  <span class="d-icon">📜</span>
                  <div>
                    <span class="d-val">{{ dataStats.history }}</span>
                    <span class="d-label">History entries</span>
                  </div>
                </div>
                <div class="d-stat">
                  <span class="d-icon">💾</span>
                  <div>
                    <span class="d-val">{{ dataStats.storageSize }}</span>
                    <span class="d-label">Storage used</span>
                  </div>
                </div>
              </div>

              <div class="setting-item">
                <div class="setting-info">
                  <h4>Auto Save</h4>
                  <p>Automatically save data changes.</p>
                </div>
                <div class="setting-control">
                  <label class="toggle">
                    <input type="checkbox" v-model="settings.autoSave" @change="saveSetting('autoSave', settings.autoSave)" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div class="data-actions">
                <h3>Export & Import</h3>
                
                <div class="action-row">
                  <div>
                    <h4>Export Settings</h4>
                    <p>Download your settings as JSON.</p>
                  </div>
                  <button class="btn btn-secondary" @click="handleExportSettings">📤 Export</button>
                </div>

                <div class="action-row">
                  <div>
                    <h4>Import Settings</h4>
                    <p>Restore settings from a JSON file.</p>
                  </div>
                  <div>
                    <textarea v-model="importSettingsJson" class="input import-textarea" placeholder="Paste settings JSON..."></textarea>
                    <button class="btn btn-primary btn-sm" @click="handleImportSettings" style="margin-top: 8px;">📥 Import</button>
                  </div>
                </div>
              </div>

              <div class="danger-zone">
                <h3>⚠️ Danger Zone</h3>
                <div class="action-row danger">
                  <div>
                    <h4>Reset All Settings</h4>
                    <p>Restore all settings to their default values.</p>
                  </div>
                  <button class="btn btn-danger" @click="handleReset">Reset Settings</button>
                </div>
                <div class="action-row danger">
                  <div>
                    <h4>Clear All Data</h4>
                    <p>Delete all flashcards, history, and saved data.</p>
                  </div>
                  <button class="btn btn-danger" @click="handleClearAll">Clear Everything</button>
                </div>
              </div>
            </div>

            <!-- ═════ Keyboard ═════ -->
            <div v-if="activeTab === 'keyboard'" class="panel glass">
              <h2>⌨️ Keyboard Shortcuts</h2>
              <p class="panel-desc">Quick reference for available keyboard shortcuts.</p>

              <div class="shortcut-group">
                <h3>Flashcard Study Mode</h3>
                <div class="shortcut-list">
                  <div class="shortcut-item">
                    <kbd>Space</kbd>
                    <span>Flip card</span>
                  </div>
                  <div class="shortcut-item">
                    <kbd>1</kbd>
                    <span>Mark as Hard</span>
                  </div>
                  <div class="shortcut-item">
                    <kbd>2</kbd>
                    <span>Mark as Okay</span>
                  </div>
                  <div class="shortcut-item">
                    <kbd>3</kbd>
                    <span>Mark as Easy</span>
                  </div>
                </div>
              </div>

              <div class="shortcut-group">
                <h3>Navigation</h3>
                <div class="shortcut-list">
                  <div class="shortcut-item">
                    <kbd>Esc</kbd>
                    <span>Close modal / Exit study mode</span>
                  </div>
                  <div class="shortcut-item">
                    <kbd>Enter</kbd>
                    <span>Submit / Confirm action</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- ═════ About ═════ -->
            <div v-if="activeTab === 'about'" class="panel glass">
              <h2>ℹ️ About QuickHelp</h2>
              <p class="panel-desc">Information about this application.</p>

              <div class="about-info">
                <div class="about-logo">⚡</div>
                <h3>QuickHelp.lol</h3>
                <p class="version">Version 3.0</p>
                <p class="about-desc">
                  Your All-in-One Help Hub — Free tools for wellness, productivity, and learning.
                  Built with Nuxt 3 and Vue.js.
                </p>

                <div class="about-features">
                  <h4>Features</h4>
                  <ul>
                    <li>📚 Learning Hub with flashcards & spaced repetition</li>
                    <li>🃏 Quiz mode with timed challenges</li>
                    <li>📊 Study statistics & streak tracking</li>
                    <li>🎨 7 beautiful color themes</li>
                    <li>🛠️ 30+ productivity tools</li>
                    <li>🧘 Mental health & wellness resources</li>
                    <li>📥 Import/Export data</li>
                    <li>⌨️ Keyboard shortcuts</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useSettings } from '~/composables/useSettings'

const { settings, themes, updateSetting, resetSettings, applyTheme, saveSettings, exportSettings, importSettings } = useSettings()

useHead({
  title: 'Settings - QuickHelp.lol',
  meta: [{ name: 'description', content: 'Customize your QuickHelp experience — themes, study preferences, and more.' }]
})

const activeTab = ref('theme')
const importSettingsJson = ref('')

const tabs = [
  { id: 'theme', icon: '🎨', label: 'Theme' },
  { id: 'appearance', icon: '👁️', label: 'Appearance' },
  { id: 'study', icon: '📖', label: 'Study' },
  { id: 'pomodoro', icon: '🍅', label: 'Pomodoro' },
  { id: 'data', icon: '💾', label: 'Data' },
  { id: 'keyboard', icon: '⌨️', label: 'Shortcuts' },
  { id: 'about', icon: 'ℹ️', label: 'About' },
]

const saveSetting = (key, value) => {
  updateSetting(key, value)
}

const onCustomColor = () => {
  // Just updates the reactive values
}

const applyCustomTheme = () => {
  updateSetting('theme', 'custom')
}

const dataStats = computed(() => {
  let cards = 0, history = 0, storageSize = '0 KB'
  if (import.meta.client) {
    try {
      const c = localStorage.getItem('quickhelp-flashcards-v2')
      const h = localStorage.getItem('quickhelp-study-history')
      if (c) cards = JSON.parse(c).length
      if (h) history = JSON.parse(h).length
      
      let total = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.startsWith('quickhelp')) {
          total += (localStorage.getItem(key) || '').length * 2
        }
      }
      storageSize = total > 1024 * 1024 
        ? (total / 1024 / 1024).toFixed(1) + ' MB'
        : total > 1024 
          ? (total / 1024).toFixed(1) + ' KB'
          : total + ' B'
    } catch {}
  }
  return { cards, history, storageSize }
})

const handleExportSettings = () => {
  const data = exportSettings()
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'quickhelp-settings.json'
  a.click()
  URL.revokeObjectURL(url)
}

const handleImportSettings = () => {
  if (!importSettingsJson.value.trim()) return
  const success = importSettings(importSettingsJson.value)
  if (success) {
    importSettingsJson.value = ''
    alert('✅ Settings imported successfully!')
  } else {
    alert('❌ Invalid settings JSON')
  }
}

const handleReset = () => {
  if (confirm('Reset all settings to defaults? Your flashcards and history will not be affected.')) {
    resetSettings()
  }
}

const handleClearAll = () => {
  if (confirm('⚠️ This will delete ALL data including flashcards, history, and settings. Are you sure?')) {
    if (confirm('This action cannot be undone. Continue?')) {
      localStorage.removeItem('quickhelp-flashcards-v2')
      localStorage.removeItem('quickhelp-study-history')
      localStorage.removeItem('quickhelp-flashcards')
      resetSettings()
      alert('All data has been cleared.')
    }
  }
}
</script>

<style scoped>
.settings-page {
  padding-top: 80px;
}

.hero {
  padding: 80px 0 40px;
  text-align: center;
  background: linear-gradient(180deg, rgba(124, 58, 237, 0.08) 0%, transparent 100%);
}

.hero-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(124, 58, 237, 0.2);
  border-radius: 50px;
  font-size: 14px;
  color: var(--primary-light);
  margin-bottom: 24px;
}

.hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.hero p {
  font-size: 17px;
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto;
}

.settings-content {
  padding: 40px 0 80px;
}

.settings-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 32px;
  align-items: start;
}

/* Nav */
.settings-nav {
  padding: 12px;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: sticky;
  top: 100px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: var(--surface);
  color: white;
}

.nav-item.active {
  background: var(--primary);
  color: white;
  font-weight: 600;
}

.nav-icon { font-size: 18px; }

/* Panels */
.panel {
  padding: 32px;
  border-radius: var(--radius-lg);
}

.panel h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  margin-bottom: 8px;
}

.panel-desc {
  color: var(--text-muted);
  font-size: 14px;
  margin-bottom: 32px;
}

/* Theme Grid */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.theme-card {
  padding: 16px;
  background: var(--surface);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  position: relative;
}

.theme-card:hover { border-color: var(--border); transform: translateY(-2px); }
.theme-card.active { border-color: var(--primary); box-shadow: 0 0 20px rgba(124,58,237,0.2); }

.theme-preview {
  height: 60px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-emoji { font-size: 24px; }

.theme-name {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.theme-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
  background: var(--primary);
  border-radius: 50%;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

/* Color Pickers */
.color-pickers {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.color-pick label {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.color-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-picker {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: none;
  padding: 0;
}

.color-picker::-webkit-color-swatch-wrapper { padding: 0; }
.color-picker::-webkit-color-swatch { border: 2px solid var(--border-light); border-radius: 8px; }

.color-hex { width: 100px; font-family: 'Space Grotesk', monospace; }

/* Preview */
.preview-section {
  margin-top: 32px;
}

.preview-section h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

.preview-box {
  padding: 24px;
}

.preview-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.preview-row:last-child { margin-bottom: 0; }

.preview-card {
  padding: 16px;
  background: var(--surface);
  border-radius: 10px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}

.preview-gradient {
  height: 32px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.preview-progress {
  flex: 1;
  height: 8px;
  background: var(--surface);
  border-radius: 4px;
  overflow: hidden;
}

.preview-bar {
  height: 100%;
  background: var(--gradient-1);
  border-radius: 4px;
}

/* Setting Items */
.setting-group {
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
}

.setting-group h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-light);
  gap: 24px;
}

.setting-item:last-child { border-bottom: none; }

.setting-info h4 {
  font-size: 15px;
  margin-bottom: 4px;
}

.setting-info p {
  font-size: 13px;
  color: var(--text-muted);
}

.setting-control {
  flex-shrink: 0;
}

.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  min-width: 160px;
}

.number-input {
  width: 80px;
  text-align: center;
}

.input-suffix {
  display: flex;
  align-items: center;
  gap: 8px;
}

.suffix {
  font-size: 13px;
  color: var(--text-muted);
}

/* Toggle */
.toggle {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 28px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: var(--surface-light);
  border-radius: 14px;
  transition: all 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 22px;
  height: 22px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s;
}

.toggle input:checked + .toggle-slider {
  background: var(--primary);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* Data Section */
.data-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.d-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--surface);
  border-radius: 12px;
}

.d-icon { font-size: 24px; }

.d-val {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.d-label { font-size: 12px; color: var(--text-muted); }

.data-actions, .danger-zone {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
}

.data-actions h3, .danger-zone h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-light);
  gap: 20px;
}

.action-row:last-child { border-bottom: none; }

.action-row h4 { font-size: 14px; margin-bottom: 4px; }
.action-row p { font-size: 13px; color: var(--text-muted); }

.action-row.danger {
  padding: 16px;
  background: rgba(239,68,68,0.05);
  border-radius: 12px;
  border: 1px solid rgba(239,68,68,0.15);
  margin-bottom: 12px;
}

.import-textarea {
  width: 100%;
  min-height: 60px;
  resize: vertical;
  font-family: 'Space Grotesk', monospace;
  font-size: 12px;
}

.btn-danger {
  padding: 10px 20px;
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: var(--radius-md);
  color: #f87171;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-danger:hover { background: rgba(239,68,68,0.25); }

.btn-sm { padding: 8px 16px; font-size: 13px; }

.hint-text {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

/* Keyboard Shortcuts */
.shortcut-group {
  margin-bottom: 32px;
}

.shortcut-group:last-child { margin-bottom: 0; }

.shortcut-group h3 {
  font-size: 16px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-light);
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--surface);
  border-radius: 10px;
}

.shortcut-item kbd {
  display: inline-block;
  padding: 4px 12px;
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-family: 'Space Grotesk', monospace;
  font-size: 13px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
}

.shortcut-item span {
  font-size: 14px;
  color: var(--text-secondary);
}

/* About */
.about-info {
  text-align: center;
}

.about-logo {
  font-size: 64px;
  margin-bottom: 16px;
}

.about-info h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  margin-bottom: 8px;
}

.version {
  color: var(--primary-light);
  font-size: 14px;
  margin-bottom: 16px;
}

.about-desc {
  color: var(--text-muted);
  font-size: 15px;
  max-width: 500px;
  margin: 0 auto 32px;
  line-height: 1.7;
}

.about-features {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.about-features h4 {
  font-size: 16px;
  margin-bottom: 12px;
}

.about-features ul {
  list-style: none;
  padding: 0;
}

.about-features li {
  padding: 8px 0;
  font-size: 14px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
}

.about-features li:last-child { border-bottom: none; }

/* Responsive */
@media (max-width: 900px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }

  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
    position: static;
    gap: 4px;
    padding: 8px;
  }

  .nav-item {
    white-space: nowrap;
    padding: 10px 14px;
    font-size: 13px;
  }

  .theme-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .data-stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .hero h1 { font-size: 36px; }

  .theme-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .color-pickers {
    flex-direction: column;
  }

  .action-row {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
