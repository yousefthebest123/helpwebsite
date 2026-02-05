<template>
  <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="container nav-container">
      <!-- Logo -->
      <NuxtLink to="/" class="logo" @click="menuOpen = false">
        <div class="logo-icon-wrap">
          <span class="logo-icon">⚡</span>
          <span class="logo-ring"></span>
        </div>
        <span class="logo-text">Quick<span class="gradient-text">Help</span></span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="nav-links">
        <NuxtLink to="/" class="nav-link">
          <span class="nav-link-icon">🏠</span>
          <span>Home</span>
        </NuxtLink>
        
        <div class="nav-dropdown" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
          <span class="nav-link dropdown-trigger">
            <span class="nav-link-icon">🛠️</span>
            <span>Tools</span>
            <svg class="arrow-icon" :class="{ rotated: showDropdown }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </span>
          <Transition name="dropdown">
            <div class="dropdown-menu" v-show="showDropdown">
              <div class="dropdown-grid">
                <div class="dropdown-section">
                  <h4><span>📊</span> Productivity</h4>
                  <NuxtLink to="/tools/converter" class="dropdown-item" @click="showDropdown = false">🔄 Unit Converter</NuxtLink>
                  <NuxtLink to="/tools/timer" class="dropdown-item" @click="showDropdown = false">⏱️ Focus Timer</NuxtLink>
                  <NuxtLink to="/tools/notes" class="dropdown-item" @click="showDropdown = false">📝 Quick Notes</NuxtLink>
                  <NuxtLink to="/tools/matrix" class="dropdown-item" @click="showDropdown = false">📊 Priority Matrix</NuxtLink>
                  <NuxtLink to="/tools/pomodoro" class="dropdown-item" @click="showDropdown = false">🍅 Pomodoro</NuxtLink>
                </div>
                <div class="dropdown-section">
                  <h4><span>⚡</span> Developer</h4>
                  <NuxtLink to="/tools/json" class="dropdown-item" @click="showDropdown = false">{ } JSON Formatter</NuxtLink>
                  <NuxtLink to="/tools/hash-generator" class="dropdown-item" @click="showDropdown = false">🔐 Hash Generator</NuxtLink>
                  <NuxtLink to="/tools/uuid-generator" class="dropdown-item" @click="showDropdown = false">🎲 UUID Generator</NuxtLink>
                  <NuxtLink to="/tools/regex" class="dropdown-item" @click="showDropdown = false">🔍 Regex Tester</NuxtLink>
                  <NuxtLink to="/tools/diff" class="dropdown-item" @click="showDropdown = false">📋 Text Diff</NuxtLink>
                </div>
                <div class="dropdown-section">
                  <h4><span>🎨</span> Creative</h4>
                  <NuxtLink to="/tools/colors" class="dropdown-item" @click="showDropdown = false">🎨 Color Palette</NuxtLink>
                  <NuxtLink to="/tools/qr" class="dropdown-item" @click="showDropdown = false">📱 QR Code Maker</NuxtLink>
                  <NuxtLink to="/tools/lorem-ipsum" class="dropdown-item" @click="showDropdown = false">📝 Lorem Ipsum</NuxtLink>
                  <NuxtLink to="/tools/image-compressor" class="dropdown-item" @click="showDropdown = false">🖼️ Image Compressor</NuxtLink>
                  <NuxtLink to="/tools/markdown" class="dropdown-item" @click="showDropdown = false">📄 Markdown Editor</NuxtLink>
                </div>
                <div class="dropdown-section">
                  <h4><span>🔐</span> Security & Utils</h4>
                  <NuxtLink to="/tools/password" class="dropdown-item" @click="showDropdown = false">🔑 Password Generator</NuxtLink>
                  <NuxtLink to="/tools/word-counter" class="dropdown-item" @click="showDropdown = false">📊 Word Counter</NuxtLink>
                  <NuxtLink to="/tools/age-calculator" class="dropdown-item" @click="showDropdown = false">📅 Age Calculator</NuxtLink>
                  <NuxtLink to="/tools/tip-calculator" class="dropdown-item" @click="showDropdown = false">💰 Tip Calculator</NuxtLink>
                  <NuxtLink to="/tools/base64" class="dropdown-item" @click="showDropdown = false">🔄 Base64</NuxtLink>
                </div>
              </div>
              <div class="dropdown-footer">
                <NuxtLink to="/tools" class="dropdown-all" @click="showDropdown = false">
                  View all 35+ tools
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </NuxtLink>
              </div>
            </div>
          </Transition>
        </div>

        <NuxtLink to="/mental-health" class="nav-link">
          <span class="nav-link-icon">💜</span>
          <span>Mental Health</span>
        </NuxtLink>
        <NuxtLink to="/learning" class="nav-link">
          <span class="nav-link-icon">📚</span>
          <span>Learning</span>
        </NuxtLink>
        <NuxtLink to="/wellness" class="nav-link">
          <span class="nav-link-icon">🌿</span>
          <span>Wellness</span>
        </NuxtLink>
        <NuxtLink to="/about" class="nav-link">
          <span class="nav-link-icon">✨</span>
          <span>About</span>
        </NuxtLink>
      </div>

      <!-- Actions -->
      <div class="nav-actions">
        <button class="search-btn" @click="openSearch" title="Search (Ctrl+K)">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <kbd>⌘K</kbd>
        </button>
        
        <NuxtLink v-if="!isAuthenticated" to="/auth/login" class="btn btn-secondary btn-sm">
          Login
        </NuxtLink>
        <div v-else class="user-menu">
          <button @click="showUserMenu = !showUserMenu" class="user-avatar">
            {{ user?.username?.charAt(0).toUpperCase() || '?' }}
          </button>
          <Transition name="dropdown">
            <div v-if="showUserMenu" class="user-dropdown glass">
              <p class="user-name">{{ user?.username }}</p>
              <p class="user-email">{{ user?.email }}</p>
              <div class="divider"></div>
              <button @click="handleLogout" class="logout-btn">🚪 Logout</button>
            </div>
          </Transition>
        </div>
        
        <NuxtLink to="/support" class="btn btn-primary btn-sm nav-cta">
          <span>Get Help</span>
          <span class="btn-arrow">→</span>
        </NuxtLink>
      </div>

      <!-- Mobile Toggle -->
      <button class="menu-toggle" @click="menuOpen = !menuOpen" :class="{ active: menuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div class="mobile-menu" v-if="menuOpen">
        <NuxtLink to="/" class="mobile-link" @click="menuOpen = false">
          <span>🏠</span> Home
        </NuxtLink>
        <NuxtLink to="/tools" class="mobile-link" @click="menuOpen = false">
          <span>🛠️</span> All Tools
        </NuxtLink>
        <NuxtLink to="/mental-health" class="mobile-link" @click="menuOpen = false">
          <span>💜</span> Mental Health
        </NuxtLink>
        <NuxtLink to="/learning" class="mobile-link" @click="menuOpen = false">
          <span>📚</span> Learning Hub
        </NuxtLink>
        <NuxtLink to="/wellness" class="mobile-link" @click="menuOpen = false">
          <span>🌿</span> Wellness
        </NuxtLink>
        <NuxtLink to="/emergency" class="mobile-link emergency" @click="menuOpen = false">
          <span>🆘</span> Emergency Help
        </NuxtLink>
        <NuxtLink to="/about" class="mobile-link" @click="menuOpen = false">
          <span>✨</span> About
        </NuxtLink>
        <div class="mobile-divider"></div>
        <NuxtLink to="/support" class="mobile-link cta" @click="menuOpen = false">
          <span>💬</span> Get Help Now
        </NuxtLink>
      </div>
    </Transition>

    <!-- Search Modal -->
    <Teleport to="body">
      <Transition name="search-modal">
        <div class="search-modal" v-if="searchOpen" @click.self="searchOpen = false">
          <div class="search-container">
            <div class="search-input-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input 
                ref="searchInput"
                v-model="searchQuery" 
                type="text" 
                placeholder="Search tools, resources, help..."
                class="search-input"
                @keyup.escape="searchOpen = false"
              />
              <kbd class="search-kbd">ESC</kbd>
            </div>
            <div class="search-results" v-if="searchQuery">
              <NuxtLink 
                v-for="tool in filteredTools" 
                :key="tool.path"
                :to="tool.path" 
                class="search-item"
                @click="searchOpen = false"
              >
                <span class="search-icon">{{ tool.icon }}</span>
                <div>
                  <div class="search-title">{{ tool.name }}</div>
                  <div class="search-desc">{{ tool.desc }}</div>
                </div>
                <svg class="search-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </NuxtLink>
              <div v-if="filteredTools.length === 0" class="search-empty">
                <span>🔍</span>
                <p>No results for "{{ searchQuery }}"</p>
              </div>
            </div>
            <div class="search-hints" v-else>
              <p>Quick actions</p>
              <div class="hint-tags">
                <span @click="searchQuery = 'converter'">🔄 Converter</span>
                <span @click="searchQuery = 'timer'">⏱️ Timer</span>
                <span @click="searchQuery = 'password'">🔐 Password</span>
                <span @click="searchQuery = 'mental'">💜 Mental Health</span>
                <span @click="searchQuery = 'json'">{ } JSON</span>
                <span @click="searchQuery = 'color'">🎨 Colors</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<script setup>
import { useAuth } from '~/composables/useAuth'

const { user, isAuthenticated, logout, initAuth } = useAuth()

const isScrolled = ref(false)
const menuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)
const showUserMenu = ref(false)
const showDropdown = ref(false)

const tools = [
  { name: 'Unit Converter', icon: '🔄', path: '/tools/converter', desc: 'Convert units, currencies, time zones' },
  { name: 'Focus Timer', icon: '⏱️', path: '/tools/timer', desc: 'Pomodoro timer with ambient sounds' },
  { name: 'Quick Notes', icon: '📝', path: '/tools/notes', desc: 'Auto-saving scratchpad' },
  { name: 'Priority Matrix', icon: '📊', path: '/tools/matrix', desc: 'Eisenhower decision matrix' },
  { name: 'Color Palette', icon: '🎨', path: '/tools/colors', desc: 'Extract colors from images' },
  { name: 'Password Generator', icon: '🔐', path: '/tools/password', desc: 'Generate secure passwords' },
  { name: 'QR Code Maker', icon: '📱', path: '/tools/qr', desc: 'Create QR codes instantly' },
  { name: 'JSON Formatter', icon: '{ }', path: '/tools/json', desc: 'Format and validate JSON' },
  { name: 'Hash Generator', icon: '🔒', path: '/tools/hash-generator', desc: 'Generate MD5, SHA hashes' },
  { name: 'UUID Generator', icon: '🎲', path: '/tools/uuid-generator', desc: 'Generate unique identifiers' },
  { name: 'Image to Base64', icon: '🖼️', path: '/tools/base64-image', desc: 'Convert images to base64' },
  { name: 'Lorem Ipsum', icon: '📝', path: '/tools/lorem-ipsum', desc: 'Generate placeholder text' },
  { name: 'Link Shortener', icon: '🔗', path: '/tools/link-shortener', desc: 'Shorten long URLs' },
  { name: 'Word Counter', icon: '📊', path: '/tools/word-counter', desc: 'Count words and characters' },
  { name: 'Age Calculator', icon: '📅', path: '/tools/age-calculator', desc: 'Calculate your exact age' },
  { name: 'Tip Calculator', icon: '💰', path: '/tools/tip-calculator', desc: 'Calculate tips and split bills' },
  { name: 'Text Cleaner', icon: '🧹', path: '/tools/text-cleaner', desc: 'Clean and format text' },
  { name: 'BMI Calculator', icon: '⚖️', path: '/tools/bmi-calculator', desc: 'Calculate body mass index' },
  { name: 'Breathing Exercise', icon: '🌬️', path: '/tools/breathing', desc: 'Guided breathing exercises' },
  { name: 'Habit Tracker', icon: '✅', path: '/tools/habit-tracker', desc: 'Build and track daily habits' },
  { name: 'Mental Health', icon: '💜', path: '/mental-health', desc: 'Mental health resources & tools' },
  { name: 'Learning Hub', icon: '📚', path: '/learning', desc: 'Study tools and resources' },
  { name: 'Wellness', icon: '🌿', path: '/wellness', desc: 'Wellness dashboard & tracking' },
  { name: 'Emergency Help', icon: '🆘', path: '/emergency', desc: 'Crisis resources & hotlines' },
]

const filteredTools = computed(() => {
  if (!searchQuery.value) return tools
  const q = searchQuery.value.toLowerCase()
  return tools.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q))
})

const openSearch = () => {
  searchOpen.value = true
  nextTick(() => searchInput.value?.focus())
}

const handleLogout = () => {
  logout()
  showUserMenu.value = false
}

onMounted(() => {
  initAuth()
  window.addEventListener('scroll', () => { isScrolled.value = window.scrollY > 30 })
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      openSearch()
    }
  })
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) showUserMenu.value = false
  })
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 14px 0;
  transition: all 0.4s var(--ease-out-expo);
}

.navbar.scrolled {
  background: rgba(5, 5, 16, 0.85);
  backdrop-filter: blur(24px) saturate(1.8);
  -webkit-backdrop-filter: blur(24px) saturate(1.8);
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
  padding: 10px 0;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: white;
  z-index: 10;
}

.logo-icon-wrap {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon {
  font-size: 22px;
  position: relative;
  z-index: 1;
}

.logo-ring {
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  border: 2px solid rgba(124, 58, 237, 0.4);
  animation: pulse 3s infinite;
}

/* Nav Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-link-icon {
  font-size: 15px;
  transition: transform 0.3s var(--ease-spring);
}

.nav-link:hover {
  color: white;
  background: rgba(124, 58, 237, 0.1);
}

.nav-link:hover .nav-link-icon {
  transform: scale(1.2) rotate(-5deg);
}

.nav-link.router-link-active {
  color: var(--primary-light);
  background: rgba(124, 58, 237, 0.12);
}

/* Dropdown */
.nav-dropdown { position: relative; }

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.dropdown-trigger:hover { color: white; background: rgba(124, 58, 237, 0.1); }

.arrow-icon { transition: transform 0.3s ease; }
.arrow-icon.rotated { transform: rotate(180deg); }

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(17, 17, 40, 0.95);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 20px;
  padding: 20px;
  min-width: 700px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 58, 237, 0.1);
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.dropdown-section h4 {
  font-size: 12px;
  font-weight: 700;
  color: var(--primary-light);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dropdown-item {
  display: block;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  color: white;
  background: rgba(124, 58, 237, 0.1);
  transform: translateX(4px);
}

.dropdown-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.dropdown-all {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-light);
  text-decoration: none;
  transition: all 0.2s ease;
}

.dropdown-all:hover { color: white; gap: 12px; }

/* Transitions */
.dropdown-enter-active { transition: all 0.3s var(--ease-out-expo); }
.dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}

/* Actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn kbd {
  font-size: 11px;
  padding: 2px 6px;
  background: var(--surface);
  border-radius: 4px;
  color: var(--text-dim);
  font-family: inherit;
}

.search-btn:hover {
  border-color: var(--primary);
  color: white;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
}

.nav-cta { display: flex; }

/* User Menu */
.user-menu { position: relative; }

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--gradient-1);
  border: none;
  color: white;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.user-avatar:hover { transform: scale(1.1); box-shadow: 0 0 20px rgba(124, 58, 237, 0.4); }

.user-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  padding: 16px;
  min-width: 200px;
}

.user-name { font-weight: 600; font-size: 14px; color: white; }
.user-email { font-size: 13px; color: var(--text-muted); }

.logout-btn {
  width: 100%;
  padding: 10px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  color: #f87171;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.logout-btn:hover { background: rgba(239, 68, 68, 0.2); }

/* Mobile Toggle */
.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 10;
}

.menu-toggle span {
  width: 22px;
  height: 2px;
  background: var(--text-muted);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.menu-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.menu-toggle.active span:nth-child(2) { opacity: 0; }
.menu-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

/* Mobile Menu */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(5, 5, 16, 0.97);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-light);
  padding: 16px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.mobile-link:hover, .mobile-link.router-link-active {
  color: white;
  background: rgba(124, 58, 237, 0.1);
}

.mobile-link.emergency { color: #f87171; }
.mobile-link.cta { color: var(--primary-light); background: rgba(124, 58, 237, 0.1); }

.mobile-divider {
  height: 1px;
  background: var(--border-light);
  margin: 8px 0;
}

.mobile-menu-enter-active { transition: all 0.3s var(--ease-out-expo); }
.mobile-menu-leave-active { transition: all 0.2s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Search Modal */
.search-modal {
  position: fixed;
  inset: 0;
  background: rgba(5, 5, 16, 0.8);
  backdrop-filter: blur(12px);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 120px 24px 24px;
}

.search-container {
  background: var(--surface);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(124, 58, 237, 0.1);
  animation: fadeInDown 0.3s var(--ease-out-expo);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-muted);
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  font-family: inherit;
}

.search-input::placeholder { color: var(--text-dim); }

.search-kbd {
  font-size: 11px;
  padding: 4px 8px;
  background: var(--surface-light);
  border-radius: 6px;
  color: var(--text-dim);
  font-family: inherit;
  font-weight: 500;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 8px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.search-item:hover { background: rgba(124, 58, 237, 0.1); }

.search-icon { font-size: 22px; flex-shrink: 0; }
.search-title { font-size: 14px; font-weight: 600; color: white; }
.search-desc { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
.search-arrow { color: var(--text-dim); margin-left: auto; flex-shrink: 0; }

.search-empty {
  text-align: center;
  padding: 32px;
  color: var(--text-muted);
}

.search-empty span { font-size: 32px; display: block; margin-bottom: 8px; }

.search-hints {
  padding: 16px 20px;
}

.search-hints p {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

.hint-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hint-tags span {
  padding: 6px 14px;
  background: var(--surface-light);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hint-tags span:hover {
  color: white;
  border-color: var(--primary);
  background: rgba(124, 58, 237, 0.1);
}

.search-modal-enter-active { transition: all 0.3s ease; }
.search-modal-leave-active { transition: all 0.2s ease; }
.search-modal-enter-from, .search-modal-leave-to { opacity: 0; }

@media (max-width: 1100px) {
  .nav-links { display: none; }
  .menu-toggle { display: flex; }
  .nav-cta { display: none; }
}

@media (max-width: 500px) {
  .search-btn kbd { display: none; }
}
</style>
