<template>
  <div class="tools-page">
    <!-- Animated Background -->
    <div class="bg-effects">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
      <div class="gradient-sphere sphere-3"></div>
      <div class="grid-overlay"></div>
      <div class="noise-overlay"></div>
    </div>

    <div class="container">
      <!-- Hero Header -->
      <header class="page-hero">
        <div class="hero-badge animate-float">
          <span class="pulse-dot"></span>
          <span>35+ Powerful Tools</span>
        </div>
        
        <h1 class="hero-title">
          <span class="title-line">Your Ultimate</span>
          <span class="title-line gradient-text-animated">Productivity Arsenal</span>
        </h1>
        
        <p class="hero-subtitle">
          From quick conversions to advanced generators — all the tools you need, 
          beautifully crafted and ready to use.
        </p>

        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-glow"></div>
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search for any tool..."
              class="search-input"
            />
            <div v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </div>
            <kbd class="search-kbd">⌘K</kbd>
          </div>
        </div>

        <!-- Category Pills -->
        <div class="category-pills">
          <button 
            v-for="(cat, index) in categories" 
            :key="cat.id"
            :class="['pill', { active: activeCategory === cat.id }]"
            :style="{ '--delay': index * 0.05 + 's' }"
            @click="activeCategory = cat.id"
          >
            <span class="pill-icon">{{ cat.icon }}</span>
            <span class="pill-text">{{ cat.name }}</span>
            <span v-if="cat.id !== 'all'" class="pill-count">{{ getCategoryCount(cat.id) }}</span>
          </button>
        </div>
      </header>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <span class="stat-number">{{ tools.length }}</span>
          <span class="stat-label">Total Tools</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">{{ newToolsCount }}</span>
          <span class="stat-label">New This Week</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">100%</span>
          <span class="stat-label">Free Forever</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">0</span>
          <span class="stat-label">Ads</span>
        </div>
      </div>

      <!-- Tools Grid -->
      <TransitionGroup name="tools" tag="div" class="tools-grid">
        <NuxtLink 
          v-for="(tool, index) in filteredTools" 
          :key="tool.path"
          :to="tool.path"
          class="tool-card"
          :style="{ '--index': index }"
        >
          <!-- Card Glow Effect -->
          <div class="card-glow" :class="tool.color"></div>
          
          <!-- Card Content -->
          <div class="card-inner">
            <!-- Icon -->
            <div class="tool-icon-wrapper">
              <div class="icon-bg" :class="tool.color"></div>
              <span class="tool-icon">{{ tool.icon }}</span>
            </div>
            
            <!-- Badge -->
            <span v-if="tool.badge" :class="['tool-badge', tool.badge.toLowerCase()]">
              {{ tool.badge }}
            </span>
            
            <!-- Info -->
            <h3 class="tool-title">{{ tool.name }}</h3>
            <p class="tool-desc">{{ tool.desc }}</p>
            
            <!-- Footer -->
            <div class="tool-footer">
              <span class="use-tool">
                Use Tool
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </div>
          
          <!-- Hover Border -->
          <div class="card-border"></div>
        </NuxtLink>
      </TransitionGroup>

      <!-- Empty State -->
      <div v-if="filteredTools.length === 0" class="empty-state">
        <div class="empty-icon-wrapper">
          <span class="empty-icon">🔍</span>
        </div>
        <h3>No tools found</h3>
        <p>Try a different search term or category</p>
        <button @click="searchQuery = ''; activeCategory = 'all'" class="reset-btn">
          Clear Filters
        </button>
      </div>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-glow"></div>
        <div class="cta-content">
          <h2>Can't find what you need?</h2>
          <p>We're always adding new tools. Let us know what you'd like to see!</p>
          <NuxtLink to="/support" class="cta-button">
            <span>Request a Tool</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'All Tools - QuickHelp.lol'
})

const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { id: 'all', name: 'All Tools', icon: '✨' },
  { id: 'daily', name: 'Daily', icon: '📊' },
  { id: 'brain', name: 'Productivity', icon: '🧠' },
  { id: 'creator', name: 'Creative', icon: '🎨' },
  { id: 'tech', name: 'Developer', icon: '⚡' },
  { id: 'learning', name: 'Learning', icon: '📚' },
]

const tools = [
  // Daily Workflow
  { name: 'Unit Converter', icon: '🔄', path: '/tools/converter', desc: 'Convert currencies, units, time zones, and more', color: 'purple', category: 'daily' },
  { name: 'Age Calculator', icon: '🎂', path: '/tools/age-calculator', desc: 'Calculate your exact age in years, months, days', color: 'pink', category: 'daily' },
  { name: 'Tip Calculator', icon: '💵', path: '/tools/tip-calculator', desc: 'Calculate tips and split bills easily', color: 'teal', category: 'daily' },
  { name: 'Link Shortener', icon: '🔗', path: '/tools/link-shortener', desc: 'Create short, shareable links', color: 'blue', category: 'daily' },
  { name: 'IP Address Lookup', icon: '📍', path: '/tools/ip-lookup', desc: 'Get geolocation info for any IP', color: 'sky', category: 'daily', badge: 'New' },
  
  // Brain De-Clutter
  { name: 'Focus Timer', icon: '⏱️', path: '/tools/timer', desc: 'Pomodoro timer with ambient sounds', color: 'orange', category: 'brain', badge: 'Popular' },
  { name: 'Pomodoro Timer', icon: '🍅', path: '/tools/pomodoro', desc: 'Boost productivity with timed focus', color: 'violet', category: 'brain', badge: 'New' },
  { name: 'Quick Notes', icon: '📝', path: '/tools/notes', desc: 'Auto-saving scratchpad', color: 'blue', category: 'brain' },
  { name: 'Priority Matrix', icon: '📊', path: '/tools/matrix', desc: 'Eisenhower decision matrix', color: 'green', category: 'brain' },
  { name: 'Countdown Timer', icon: '⏳', path: '/tools/countdown', desc: 'Countdown to important events', color: 'purple', category: 'brain' },
  { name: 'Random Picker', icon: '🎲', path: '/tools/random-picker', desc: 'Pick random items, flip coins, roll dice', color: 'amber', category: 'brain', badge: 'New' },
  
  // Content Creator
  { name: 'Color Palette', icon: '🎨', path: '/tools/colors', desc: 'Generate beautiful color palettes', color: 'purple', category: 'creator' },
  { name: 'Color Picker', icon: '🖌️', path: '/tools/color-picker', desc: 'Advanced color picker with conversions', color: 'fuchsia', category: 'creator', badge: 'New' },
  { name: 'Lorem Ipsum', icon: '📄', path: '/tools/lorem-ipsum', desc: 'Generate placeholder text instantly', color: 'pink', category: 'creator' },
  { name: 'QR Code Maker', icon: '📱', path: '/tools/qr', desc: 'Create QR codes instantly', color: 'orange', category: 'creator', badge: 'Popular' },
  { name: 'QR Code Generator', icon: '📲', path: '/tools/qr-generator', desc: 'Advanced QR codes with customization', color: 'emerald', category: 'creator', badge: 'New' },
  { name: 'Base64 Image', icon: '🖼️', path: '/tools/base64-image', desc: 'Convert images to Base64', color: 'teal', category: 'creator' },
  { name: 'Image Compressor', icon: '🗜️', path: '/tools/image-compressor', desc: 'Compress images without quality loss', color: 'cyan', category: 'creator', badge: 'New' },
  
  // Technical
  { name: 'Text Cleaner', icon: '🧹', path: '/tools/text-cleaner', desc: 'Clean and format text', color: 'blue', category: 'tech' },
  { name: 'Password Generator', icon: '🔐', path: '/tools/password', desc: 'Generate secure passwords', color: 'green', category: 'tech', badge: 'Popular' },
  { name: 'JSON Formatter', icon: '{ }', path: '/tools/json', desc: 'Format and validate JSON', color: 'purple', category: 'tech' },
  { name: 'Markdown Preview', icon: '📑', path: '/tools/markdown', desc: 'Live markdown preview editor', color: 'pink', category: 'tech' },
  { name: 'Base64 Encoder', icon: '🔄', path: '/tools/base64', desc: 'Encode/decode Base64', color: 'teal', category: 'tech' },
  { name: 'Hash Generator', icon: '🔒', path: '/tools/hash-generator', desc: 'Generate MD5, SHA hashes', color: 'blue', category: 'tech' },
  { name: 'UUID Generator', icon: '🆔', path: '/tools/uuid-generator', desc: 'Generate unique UUIDs', color: 'green', category: 'tech' },
  { name: 'Regex Tester', icon: '🔍', path: '/tools/regex', desc: 'Test regular expressions', color: 'orange', category: 'tech' },
  { name: 'Diff Checker', icon: '📊', path: '/tools/diff', desc: 'Compare two texts', color: 'purple', category: 'tech' },
  { name: 'Timestamp Converter', icon: '🕐', path: '/tools/timestamp', desc: 'Convert Unix timestamps', color: 'pink', category: 'tech' },
  { name: 'URL Encoder', icon: '🔗', path: '/tools/url', desc: 'Encode/decode URLs', color: 'teal', category: 'tech' },
  { name: 'HTML Formatter', icon: '🌐', path: '/tools/html', desc: 'Format and minify HTML', color: 'blue', category: 'tech' },
  { name: 'CSS Formatter', icon: '🎨', path: '/tools/css', desc: 'Beautify and minify CSS', color: 'green', category: 'tech' },
  { name: 'JS Formatter', icon: '⚡', path: '/tools/js', desc: 'Format JavaScript code', color: 'orange', category: 'tech' },
  
  // Learning
  { name: 'Scientific Calculator', icon: '🧮', path: '/tools/calculator', desc: 'Advanced scientific calculator', color: 'purple', category: 'learning' },
  { name: 'Word Counter', icon: '📊', path: '/tools/word-counter', desc: 'Count words, characters, sentences', color: 'blue', category: 'learning' },
  { name: 'Grade Calculator', icon: '📝', path: '/tools/grade', desc: 'Calculate your GPA', color: 'pink', category: 'learning' },
]

const newToolsCount = computed(() => tools.filter(t => t.badge === 'New').length)

const getCategoryCount = (catId) => tools.filter(t => t.category === catId).length

const filteredTools = computed(() => {
  let result = tools
  
  if (activeCategory.value !== 'all') {
    result = result.filter(t => t.category === activeCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.desc.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Keyboard shortcut for search
onMounted(() => {
  const handleKeydown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      document.querySelector('.search-input')?.focus()
    }
  }
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>

<style scoped>
.tools-page {
  min-height: 100vh;
  padding: 120px 0 80px;
  position: relative;
  overflow: hidden;
}

/* Background Effects */
.bg-effects {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.sphere-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.sphere-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.25), transparent 70%);
  top: 50%;
  right: -150px;
  animation-delay: -7s;
}

.sphere-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent 70%);
  bottom: -100px;
  left: 30%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.05); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(20px, 10px) scale(1.02); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
}

.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* Hero Header */
.page-hero {
  text-align: center;
  margin-bottom: 60px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  color: #a78bfa;
  margin-bottom: 24px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.animate-float {
  animation: floatBadge 3s ease-in-out infinite;
}

@keyframes floatBadge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(36px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 20px;
}

.title-line {
  display: block;
  color: white;
}

.gradient-text-animated {
  background: linear-gradient(135deg, #8b5cf6, #06b6d4, #ec4899, #8b5cf6);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 5s ease infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.hero-subtitle {
  font-size: 18px;
  color: #94a3b8;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

/* Search */
.search-container {
  max-width: 600px;
  margin: 0 auto 32px;
  position: relative;
}

.search-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  border-radius: 18px;
  opacity: 0;
  transition: opacity 0.3s;
  filter: blur(8px);
}

.search-container:focus-within .search-glow {
  opacity: 0.5;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  transition: all 0.3s;
}

.search-container:focus-within .search-box {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(15, 23, 42, 0.95);
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-left: 18px;
  color: #64748b;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 16px;
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  outline: none;
}

.search-input::placeholder {
  color: #64748b;
}

.search-clear {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-clear:hover {
  background: rgba(255, 255, 255, 0.1);
}

.search-clear svg {
  width: 16px;
  height: 16px;
  color: #64748b;
}

.search-kbd {
  display: none;
  padding: 4px 8px;
  margin-right: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  font-size: 12px;
  color: #64748b;
  font-family: inherit;
}

@media (min-width: 768px) {
  .search-kbd {
    display: block;
  }
}

/* Category Pills */
.category-pills {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  animation: fadeInUp 0.5s ease backwards;
  animation-delay: var(--delay);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.pill:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: white;
  transform: translateY(-2px);
}

.pill.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(6, 182, 212, 0.2));
  border-color: rgba(139, 92, 246, 0.4);
  color: white;
}

.pill-icon {
  font-size: 16px;
}

.pill-count {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 100px;
  font-size: 12px;
}

.pill.active .pill-count {
  background: rgba(139, 92, 246, 0.3);
}

/* Stats Bar */
.stats-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  padding: 24px 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin-bottom: 48px;
  backdrop-filter: blur(10px);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: white;
  font-family: 'Space Grotesk', sans-serif;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .stats-bar {
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
  }
  
  .stat-divider {
    display: none;
  }
  
  .stat-item {
    flex: 1;
    min-width: 80px;
  }
}

/* Tools Grid */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 60px;
}

@media (max-width: 1200px) {
  .tools-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 900px) {
  .tools-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 600px) {
  .tools-grid { grid-template-columns: 1fr; }
}

/* Tool Card */
.tool-card {
  position: relative;
  text-decoration: none;
  border-radius: 20px;
  overflow: hidden;
  animation: cardFadeIn 0.5s ease backwards;
  animation-delay: calc(var(--index) * 0.03s);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.4s;
}

.card-glow.purple { background: radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.15), transparent 60%); }
.card-glow.pink { background: radial-gradient(circle at 50% 0%, rgba(236, 72, 153, 0.15), transparent 60%); }
.card-glow.blue { background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.15), transparent 60%); }
.card-glow.teal { background: radial-gradient(circle at 50% 0%, rgba(20, 184, 166, 0.15), transparent 60%); }
.card-glow.green { background: radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.15), transparent 60%); }
.card-glow.orange { background: radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.15), transparent 60%); }
.card-glow.cyan { background: radial-gradient(circle at 50% 0%, rgba(6, 182, 212, 0.15), transparent 60%); }
.card-glow.sky { background: radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15), transparent 60%); }
.card-glow.violet { background: radial-gradient(circle at 50% 0%, rgba(124, 58, 237, 0.15), transparent 60%); }
.card-glow.fuchsia { background: radial-gradient(circle at 50% 0%, rgba(192, 38, 211, 0.15), transparent 60%); }
.card-glow.emerald { background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15), transparent 60%); }
.card-glow.amber { background: radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15), transparent 60%); }

.tool-card:hover .card-glow {
  opacity: 1;
}

.card-inner {
  position: relative;
  padding: 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.tool-card:hover .card-inner {
  background: rgba(15, 23, 42, 0.8);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-4px);
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s;
}

.tool-card:hover .card-border {
  opacity: 1;
}

/* Tool Icon */
.tool-icon-wrapper {
  position: relative;
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
}

.icon-bg {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  opacity: 0.15;
  transition: all 0.3s;
}

.icon-bg.purple { background: #8b5cf6; }
.icon-bg.pink { background: #ec4899; }
.icon-bg.blue { background: #3b82f6; }
.icon-bg.teal { background: #14b8a6; }
.icon-bg.green { background: #22c55e; }
.icon-bg.orange { background: #f97316; }
.icon-bg.cyan { background: #06b6d4; }
.icon-bg.sky { background: #0ea5e9; }
.icon-bg.violet { background: #7c3aed; }
.icon-bg.fuchsia { background: #c026d3; }
.icon-bg.emerald { background: #10b981; }
.icon-bg.amber { background: #f59e0b; }

.tool-card:hover .icon-bg {
  opacity: 0.25;
  transform: scale(1.1);
}

.tool-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

/* Tool Badge */
.tool-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 100px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tool-badge.new {
  background: linear-gradient(135deg, #22c55e, #10b981);
  color: white;
}

.tool-badge.popular {
  background: linear-gradient(135deg, #f97316, #f59e0b);
  color: white;
}

/* Tool Info */
.tool-title {
  font-size: 17px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.tool-desc {
  font-size: 14px;
  color: #94a3b8;
  line-height: 1.5;
  flex: 1;
}

/* Tool Footer */
.tool-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.use-tool {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #8b5cf6;
  transition: all 0.3s;
}

.use-tool svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s;
}

.tool-card:hover .use-tool {
  color: #a78bfa;
}

.tool-card:hover .use-tool svg {
  transform: translateX(4px);
}

/* Transition Group */
.tools-move,
.tools-enter-active,
.tools-leave-active {
  transition: all 0.4s ease;
}

.tools-enter-from,
.tools-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.tools-leave-active {
  position: absolute;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon-wrapper {
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  font-size: 48px;
}

.empty-state h3 {
  font-size: 24px;
  color: white;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
}

.reset-btn {
  padding: 12px 24px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: #a78bfa;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

/* CTA Section */
.cta-section {
  position: relative;
  padding: 60px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  text-align: center;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(139, 92, 246, 0.15), transparent 70%);
  pointer-events: none;
}

.cta-content {
  position: relative;
}

.cta-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
}

.cta-section p {
  color: #94a3b8;
  margin-bottom: 24px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(139, 92, 246, 0.3);
}

.cta-button svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

.cta-button:hover svg {
  transform: translateX(4px);
}
</style>
