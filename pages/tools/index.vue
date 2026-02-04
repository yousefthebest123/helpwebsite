<template>
  <div class="tools-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">All <span class="gradient-text">Tools</span></h1>
        <p class="page-subtitle">
          35+ free tools to help you with daily tasks, productivity, creativity, and more.
        </p>
        
        <!-- Search & Filter -->
        <div class="tools-filter">
          <div class="search-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search tools..."
              class="input"
            />
          </div>
          <div class="filter-tags">
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              :class="['filter-tag', { active: activeCategory === cat.id }]"
              @click="activeCategory = cat.id"
            >
              <span>{{ cat.icon }}</span>
              <span>{{ cat.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tools Grid -->
      <div class="tools-grid">
        <NuxtLink 
          v-for="tool in filteredTools" 
          :key="tool.path"
          :to="tool.path"
          class="tool-card card card-gradient"
        >
          <div class="tool-icon" :class="tool.color">{{ tool.icon }}</div>
          <h3>{{ tool.name }}</h3>
          <p>{{ tool.desc }}</p>
          <span class="tool-badge" v-if="tool.badge">{{ tool.badge }}</span>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTools.length === 0" class="empty-state">
        <span class="empty-icon">🔍</span>
        <h3>No tools found</h3>
        <p>Try a different search term or category</p>
      </div>
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
  { id: 'all', name: 'All Tools', icon: '🛠️' },
  { id: 'daily', name: 'Daily Workflow', icon: '📊' },
  { id: 'brain', name: 'Brain De-Clutter', icon: '🧠' },
  { id: 'creator', name: 'Content Creator', icon: '🎨' },
  { id: 'tech', name: 'Technical', icon: '⚙️' },
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
</script>

<style scoped>
.tools-page {
  padding: 140px 0 80px;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 60px;
}

.page-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 40px;
}

.tools-filter {
  max-width: 900px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-box svg {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-box .input {
  padding-left: 50px;
  font-size: 16px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.filter-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-size: 14px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  border-color: var(--primary);
  color: white;
}

.filter-tag.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.tool-card {
  padding: 28px;
  text-decoration: none;
  position: relative;
}

.tool-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.tool-card p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
}

.tool-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  background: var(--gradient-1);
  border-radius: 20px;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
}

.empty-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 24px;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-muted);
}

@media (max-width: 1200px) {
  .tools-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .tools-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-title {
    font-size: 42px;
  }
}

@media (max-width: 600px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }

  .filter-tags {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 10px;
  }
}
</style>
