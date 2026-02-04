<template>
  <nav class="navbar" :class="{ scrolled: isScrolled, 'menu-open': menuOpen }">
    <div class="container nav-container">
      <!-- Logo -->
      <NuxtLink to="/" class="logo">
        <span class="logo-icon">⚡</span>
        <span class="logo-text">Quick<span class="gradient-text">Help</span></span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="nav-links">
        <NuxtLink to="/" class="nav-link">Home</NuxtLink>
        <div class="nav-dropdown">
          <span class="nav-link dropdown-trigger">
            Tools <span class="arrow">▾</span>
          </span>
          <div class="dropdown-menu">
            <div class="dropdown-section">
              <h4>📊 Daily Workflow</h4>
              <NuxtLink to="/tools/converter" class="dropdown-item">Unit Converter</NuxtLink>
              <NuxtLink to="/tools/pdf" class="dropdown-item">PDF Tools</NuxtLink>
              <NuxtLink to="/tools/format" class="dropdown-item">Format Shifter</NuxtLink>
            </div>
            <div class="dropdown-section">
              <h4>🧠 Brain De-Clutter</h4>
              <NuxtLink to="/tools/timer" class="dropdown-item">Focus Timer</NuxtLink>
              <NuxtLink to="/tools/notes" class="dropdown-item">Quick Notes</NuxtLink>
              <NuxtLink to="/tools/matrix" class="dropdown-item">Priority Matrix</NuxtLink>
            </div>
            <div class="dropdown-section">
              <h4>🎨 Content Creator</h4>
              <NuxtLink to="/tools/caption" class="dropdown-item">Caption Generator</NuxtLink>
              <NuxtLink to="/tools/colors" class="dropdown-item">Color Palette</NuxtLink>
              <NuxtLink to="/tools/background" class="dropdown-item">Remove Background</NuxtLink>
            </div>
            <div class="dropdown-section">
              <h4>⚙️ Technical</h4>
              <NuxtLink to="/tools/text" class="dropdown-item">Text Cleaner</NuxtLink>
              <NuxtLink to="/tools/password" class="dropdown-item">Password Generator</NuxtLink>
              <NuxtLink to="/tools/qr" class="dropdown-item">QR Code Maker</NuxtLink>
            </div>
          </div>
        </div>
        <NuxtLink to="/mental-health" class="nav-link">Mental Health</NuxtLink>
        <NuxtLink to="/learning" class="nav-link">Learning Hub</NuxtLink>
        <NuxtLink to="/about" class="nav-link">About</NuxtLink>
      </div>

      <!-- Search & Actions -->
      <div class="nav-actions">
        <button class="search-btn" @click="openSearch">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
        <button class="btn btn-primary btn-sm">
          <span>Get Help</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>

      <!-- Mobile Menu Toggle -->
      <button class="menu-toggle" @click="menuOpen = !menuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" v-show="menuOpen">
      <NuxtLink to="/" class="mobile-link" @click="menuOpen = false">Home</NuxtLink>
      <NuxtLink to="/tools" class="mobile-link" @click="menuOpen = false">All Tools</NuxtLink>
      <NuxtLink to="/mental-health" class="mobile-link" @click="menuOpen = false">Mental Health</NuxtLink>
      <NuxtLink to="/learning" class="mobile-link" @click="menuOpen = false">Learning Hub</NuxtLink>
      <NuxtLink to="/about" class="mobile-link" @click="menuOpen = false">About</NuxtLink>
    </div>

    <!-- Search Modal -->
    <Teleport to="body">
      <div class="search-modal" v-if="searchOpen" @click.self="searchOpen = false">
        <div class="search-container animate-fade-in-up">
          <div class="search-input-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              ref="searchInput"
              v-model="searchQuery" 
              type="text" 
              placeholder="Search for tools, help topics, resources..."
              class="search-input"
              @keyup.escape="searchOpen = false"
            />
            <kbd class="search-kbd">ESC</kbd>
          </div>
          <div class="search-results" v-if="searchQuery">
            <div class="search-category">
              <h4>Tools</h4>
              <div class="search-items">
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
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="search-hints" v-else>
            <p>Try searching for:</p>
            <div class="hint-tags">
              <span @click="searchQuery = 'converter'">Unit Converter</span>
              <span @click="searchQuery = 'timer'">Focus Timer</span>
              <span @click="searchQuery = 'password'">Password</span>
              <span @click="searchQuery = 'mental'">Mental Health</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </nav>
</template>

<script setup>
const isScrolled = ref(false)
const menuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const tools = [
  { name: 'Unit Converter', icon: '🔄', path: '/tools/converter', desc: 'Convert units, currencies, time zones' },
  { name: 'PDF Tools', icon: '📄', path: '/tools/pdf', desc: 'Merge, split, convert PDFs' },
  { name: 'Format Shifter', icon: '🔀', path: '/tools/format', desc: 'Convert image and video formats' },
  { name: 'Focus Timer', icon: '⏱️', path: '/tools/timer', desc: 'Pomodoro timer with ambient sounds' },
  { name: 'Quick Notes', icon: '📝', path: '/tools/notes', desc: 'Auto-saving scratchpad' },
  { name: 'Priority Matrix', icon: '📊', path: '/tools/matrix', desc: 'Eisenhower decision matrix' },
  { name: 'Caption Generator', icon: '✨', path: '/tools/caption', desc: 'AI-powered captions & bios' },
  { name: 'Color Palette', icon: '🎨', path: '/tools/colors', desc: 'Extract colors from images' },
  { name: 'Remove Background', icon: '🖼️', path: '/tools/background', desc: 'Instant background removal' },
  { name: 'Text Cleaner', icon: '🧹', path: '/tools/text', desc: 'Clean and format text' },
  { name: 'Password Generator', icon: '🔐', path: '/tools/password', desc: 'Generate secure passwords' },
  { name: 'QR Code Maker', icon: '📱', path: '/tools/qr', desc: 'Create QR codes instantly' },
  { name: 'Calculator', icon: '🧮', path: '/tools/calculator', desc: 'Advanced scientific calculator' },
  { name: 'Countdown Timer', icon: '⏳', path: '/tools/countdown', desc: 'Countdown to events' },
  { name: 'JSON Formatter', icon: '{ }', path: '/tools/json', desc: 'Format and validate JSON' },
  { name: 'Markdown Editor', icon: '📑', path: '/tools/markdown', desc: 'Live markdown preview' },
]

const filteredTools = computed(() => {
  if (!searchQuery.value) return tools
  const query = searchQuery.value.toLowerCase()
  return tools.filter(t => 
    t.name.toLowerCase().includes(query) || 
    t.desc.toLowerCase().includes(query)
  )
})

const openSearch = () => {
  searchOpen.value = true
  nextTick(() => {
    searchInput.value?.focus()
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

const handleKeydown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    openSearch()
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 0;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 12px 0;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.logo-icon {
  font-size: 28px;
  animation: pulse 2s infinite;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.nav-dropdown {
  position: relative;
}

.dropdown-trigger {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
}

.nav-dropdown:hover .arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(4, 180px);
  gap: 24px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.nav-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.dropdown-section h4 {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-item {
  display: block;
  padding: 8px 12px;
  font-size: 14px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin: 0 -12px;
}

.dropdown-item:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border-color: var(--primary);
}

.btn-sm {
  padding: 10px 20px;
  font-size: 13px;
}

.btn-arrow {
  transition: transform 0.2s ease;
}

.btn:hover .btn-arrow {
  transform: translateX(4px);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 28px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.menu-toggle span {
  display: block;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.menu-open .menu-toggle span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-open .menu-toggle span:nth-child(2) {
  opacity: 0;
}

.menu-open .menu-toggle span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

.mobile-menu {
  display: none;
  padding: 20px;
  background: var(--surface);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-link {
  display: block;
  padding: 14px 0;
  font-size: 16px;
  color: white;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Search Modal */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 200;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 100px 24px;
}

.search-container {
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  width: 100%;
  max-width: 640px;
  overflow: hidden;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-input-wrapper svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  font-size: 18px;
  color: white;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-kbd {
  padding: 4px 8px;
  font-size: 12px;
  background: var(--surface-light);
  border-radius: 6px;
  color: var(--text-muted);
}

.search-results {
  padding: 16px;
  max-height: 400px;
  overflow-y: auto;
}

.search-category h4 {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
  text-transform: uppercase;
}

.search-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.search-item:hover {
  background: rgba(99, 102, 241, 0.1);
}

.search-icon {
  font-size: 24px;
}

.search-title {
  font-size: 15px;
  font-weight: 500;
  color: white;
}

.search-desc {
  font-size: 13px;
  color: var(--text-muted);
}

.search-hints {
  padding: 20px;
  text-align: center;
}

.search-hints p {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.hint-tags {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.hint-tags span {
  padding: 6px 12px;
  font-size: 13px;
  background: var(--surface-light);
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.hint-tags span:hover {
  background: var(--primary);
}

@media (max-width: 1024px) {
  .nav-links, .nav-actions {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}
</style>
