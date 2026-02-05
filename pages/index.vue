<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-particles" aria-hidden="true">
        <span v-for="i in 30" :key="i" class="particle" :style="particleStyle(i)"></span>
      </div>
      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-pill glass">
            <span class="pill-dot"></span>
            <span>All-in-One Help Hub — Free Forever</span>
          </div>
          <h1 class="hero-title">
            Your go-to place for<br/>
            <span class="typed-wrapper">
              <span class="typed-text gradient-text">{{ displayText }}</span>
              <span class="cursor" :class="{ blink: !isTyping }">|</span>
            </span>
          </h1>
          <p class="hero-desc">
            40+ free tools, mental health resources, wellness tracking, and learning 
            aids — all in one beautiful, private place. No ads. No tracking. Just help.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/tools" class="btn btn-primary btn-lg">
              <span>Explore Tools</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
            <NuxtLink to="/mental-health" class="btn btn-glass btn-lg">
              <span>💜</span>
              <span>Mental Health</span>
            </NuxtLink>
          </div>
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">40+</span>
              <span class="stat-label">Free Tools</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">100%</span>
              <span class="stat-label">Privacy First</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">0</span>
              <span class="stat-label">Ads Shown</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-card-stack">
            <div class="hero-card card-1 glass" @mouseenter="activeCard = 1" @mouseleave="activeCard = 0">
              <div class="card-icon">🧠</div>
              <h3>Mental Health</h3>
              <p>Breathing exercises, mood tracking & journaling</p>
            </div>
            <div class="hero-card card-2 glass" @mouseenter="activeCard = 2" @mouseleave="activeCard = 0">
              <div class="card-icon">⚡</div>
              <h3>Quick Tools</h3>
              <p>Passwords, QR codes, converters & more</p>
            </div>
            <div class="hero-card card-3 glass" @mouseenter="activeCard = 3" @mouseleave="activeCard = 0">
              <div class="card-icon">📚</div>
              <h3>Learning Hub</h3>
              <p>Flashcards, calculators & study aids</p>
            </div>
            <div class="hero-card card-4 glass" @mouseenter="activeCard = 4" @mouseleave="activeCard = 0">
              <div class="card-icon">🌿</div>
              <h3>Wellness</h3>
              <p>Habit tracker, hydration & sleep tools</p>
            </div>
          </div>
          <div class="hero-glow"></div>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <div class="scroll-mouse">
          <div class="scroll-dot"></div>
        </div>
      </div>
    </section>

    <!-- Quick Access Toolbar -->
    <section class="quick-access scroll-reveal">
      <div class="container">
        <div class="quick-bar glass">
          <NuxtLink v-for="tool in quickTools" :key="tool.to" :to="tool.to" class="quick-item">
            <span class="quick-icon">{{ tool.icon }}</span>
            <span class="quick-label">{{ tool.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Featured Tools Section -->
    <section class="section featured-tools scroll-reveal">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Most Popular</span>
          <h2>Tools people love <span class="gradient-text">most</span></h2>
          <p>The essentials that keep people coming back every day.</p>
        </div>
        <div class="featured-grid">
          <NuxtLink 
            v-for="tool in featuredTools" 
            :key="tool.to" 
            :to="tool.to" 
            class="featured-card glass"
          >
            <div class="featured-icon-wrap" :style="{ background: tool.gradient }">
              <span>{{ tool.icon }}</span>
            </div>
            <div class="featured-info">
              <h3>{{ tool.name }}</h3>
              <p>{{ tool.desc }}</p>
            </div>
            <div class="featured-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Wellness Spotlight -->
    <section class="section wellness-spotlight scroll-reveal reveal-left">
      <div class="container">
        <div class="wellness-grid">
          <div class="wellness-content">
            <span class="section-label">Your Wellbeing Matters</span>
            <h2>Take care of your mind <span class="gradient-text">&amp; body</span></h2>
            <p class="wellness-desc">
              We believe technology should help you feel better, not worse. 
              Our wellness tools are designed with care and backed by science.
            </p>
            <div class="wellness-features">
              <div class="wellness-feat">
                <div class="feat-icon">🧘</div>
                <div>
                  <h4>Guided Breathing</h4>
                  <p>4-7-8, box breathing, and custom patterns</p>
                </div>
              </div>
              <div class="wellness-feat">
                <div class="feat-icon">📊</div>
                <div>
                  <h4>Mood Tracking</h4>
                  <p>Track emotions, identify patterns, grow</p>
                </div>
              </div>
              <div class="wellness-feat">
                <div class="feat-icon">💧</div>
                <div>
                  <h4>Hydration Tracker</h4>
                  <p>Stay hydrated with gentle reminders</p>
                </div>
              </div>
              <div class="wellness-feat">
                <div class="feat-icon">🌙</div>
                <div>
                  <h4>Sleep Logger</h4>
                  <p>Track sleep quality and build better habits</p>
                </div>
              </div>
            </div>
            <div class="wellness-actions">
              <NuxtLink to="/mental-health" class="btn btn-primary">
                Mental Health Tools
              </NuxtLink>
              <NuxtLink to="/wellness" class="btn btn-glass">
                Wellness Dashboard
              </NuxtLink>
            </div>
          </div>
          <div class="wellness-visual">
            <div class="breathing-demo glass">
              <div class="breathing-circle" :class="{ active: breathingActive }">
                <div class="breathing-inner">
                  <span class="breathing-label">{{ breathingPhase }}</span>
                </div>
                <svg class="breathing-ring" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(124,58,237,0.15)" stroke-width="4"/>
                  <circle 
                    cx="100" cy="100" r="90" fill="none" 
                    stroke="url(#breathGradient)" stroke-width="4" 
                    stroke-linecap="round"
                    :stroke-dasharray="565.48"
                    :stroke-dashoffset="breathingProgress"
                    transform="rotate(-90 100 100)"
                  />
                  <defs>
                    <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#7c3aed"/>
                      <stop offset="100%" stop-color="#06b6d4"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <button class="btn btn-glass btn-sm" @click="toggleBreathing">
                {{ breathingActive ? 'Pause' : 'Try Breathing Exercise' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tool Categories -->
    <section class="section tool-categories scroll-reveal">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Everything You Need</span>
          <h2>Browse by <span class="gradient-text">category</span></h2>
          <p>Organized so you can find exactly what you need, fast.</p>
        </div>
        <div class="categories-grid">
          <NuxtLink 
            v-for="cat in categories" 
            :key="cat.label" 
            :to="cat.to" 
            class="category-card glass"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <h3>{{ cat.label }}</h3>
            <p>{{ cat.desc }}</p>
            <span class="cat-count">{{ cat.count }} tools</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Emergency Help Banner -->
    <section class="section emergency-banner scroll-reveal reveal-scale">
      <div class="container">
        <div class="emergency-card glass">
          <div class="emergency-pulse"></div>
          <div class="emergency-content">
            <h3>🆘 Need Immediate Help?</h3>
            <p>
              If you're in crisis or need urgent support, free help is available 24/7.
            </p>
          </div>
          <NuxtLink to="/emergency" class="btn btn-danger btn-lg">
            Get Emergency Help
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Learning Section -->
    <section class="section learning-section scroll-reveal reveal-right">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Level Up</span>
          <h2>Learn &amp; grow with <span class="gradient-text">smart tools</span></h2>
          <p>From flashcards to writing helpers — tools for curious minds.</p>
        </div>
        <div class="learning-grid">
          <NuxtLink to="/learning" class="learning-card card-large glass">
            <div class="lc-icon">📖</div>
            <h3>Learning Hub</h3>
            <p>Flashcards, study timers, math tools, and writing helpers all in one place.</p>
            <span class="lc-link">Open Hub →</span>
          </NuxtLink>
          <NuxtLink to="/tools/grade" class="learning-card glass">
            <div class="lc-icon">📝</div>
            <h3>Grade Calculator</h3>
            <p>Weighted and simple averages</p>
          </NuxtLink>
          <NuxtLink to="/tools/word-counter" class="learning-card glass">
            <div class="lc-icon">🔤</div>
            <h3>Word Counter</h3>
            <p>Count words, characters & reading time</p>
          </NuxtLink>
          <NuxtLink to="/tools/calculator" class="learning-card glass">
            <div class="lc-icon">🧮</div>
            <h3>Calculator</h3>
            <p>Scientific calculations made simple</p>
          </NuxtLink>
          <NuxtLink to="/tools/notes" class="learning-card glass">
            <div class="lc-icon">📓</div>
            <h3>Notes</h3>
            <p>Quick notes that save locally</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Developer Tools Section -->
    <section class="section dev-tools scroll-reveal reveal-left">
      <div class="container">
        <div class="section-header">
          <span class="section-label">For Developers</span>
          <h2>Build faster with <span class="gradient-text">dev tools</span></h2>
          <p>JSON formatting, regex testing, hashing, and more.</p>
        </div>
        <div class="dev-grid">
          <NuxtLink 
            v-for="tool in devTools" 
            :key="tool.to" 
            :to="tool.to" 
            class="dev-card glass"
          >
            <span class="dev-icon">{{ tool.icon }}</span>
            <div>
              <h4>{{ tool.name }}</h4>
              <p>{{ tool.desc }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="section final-cta scroll-reveal reveal-scale">
      <div class="container">
        <div class="cta-card glass">
          <div class="cta-glow"></div>
          <h2>Ready to get stuff done?</h2>
          <p>Jump in — everything is free, private, and built for you.</p>
          <div class="cta-actions">
            <NuxtLink to="/tools" class="btn btn-primary btn-lg">
              Browse All Tools
            </NuxtLink>
            <NuxtLink to="/about" class="btn btn-glass btn-lg">
              Learn More
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

useHead({
  title: 'QuickHelp.lol — Your All-in-One Help Hub',
  meta: [
    { name: 'description', content: 'Free tools, mental health resources, wellness tracking, and learning aids. No ads, no tracking — just help.' },
  ],
})

// Typed text animation
const phrases = [
  'quick help.',
  'mental wellness.',
  'smart tools.',
  'learning aids.',
  'better habits.',
  'focus & flow.',
]
const displayText = ref('')
const isTyping = ref(true)
let phraseIndex = 0
let charIndex = 0
let typingTimeout = null

const typeText = () => {
  const current = phrases[phraseIndex]
  if (charIndex < current.length) {
    isTyping.value = true
    displayText.value = current.substring(0, charIndex + 1)
    charIndex++
    typingTimeout = setTimeout(typeText, 60 + Math.random() * 40)
  } else {
    isTyping.value = false
    typingTimeout = setTimeout(deleteText, 2500)
  }
}

const deleteText = () => {
  if (charIndex > 0) {
    isTyping.value = true
    charIndex--
    displayText.value = phrases[phraseIndex].substring(0, charIndex)
    typingTimeout = setTimeout(deleteText, 30)
  } else {
    phraseIndex = (phraseIndex + 1) % phrases.length
    typingTimeout = setTimeout(typeText, 400)
  }
}

// Breathing exercise demo
const breathingActive = ref(false)
const breathingPhase = ref('Breathe')
const breathingProgress = ref(565.48)
let breathingInterval = null
let breathingTimer = null

const toggleBreathing = () => {
  breathingActive.value = !breathingActive.value
  if (breathingActive.value) {
    startBreathing()
  } else {
    stopBreathing()
  }
}

const startBreathing = () => {
  let elapsed = 0
  const totalCycle = 16000 // 4-4-4-4 cycle in ms
  
  const update = () => {
    elapsed += 50
    const cycle = elapsed % totalCycle
    const phase = Math.floor(cycle / 4000)
    const phaseProgress = (cycle % 4000) / 4000
    
    if (phase === 0) {
      breathingPhase.value = 'Breathe In'
      breathingProgress.value = 565.48 - (565.48 * phaseProgress * 0.25)
    } else if (phase === 1) {
      breathingPhase.value = 'Hold'
      breathingProgress.value = 565.48 * 0.75 - (565.48 * phaseProgress * 0.25)
    } else if (phase === 2) {
      breathingPhase.value = 'Breathe Out'
      breathingProgress.value = 565.48 * 0.5 + (565.48 * phaseProgress * 0.25)
    } else {
      breathingPhase.value = 'Hold'
      breathingProgress.value = 565.48 * 0.75 + (565.48 * phaseProgress * 0.25)
    }
  }
  
  breathingInterval = setInterval(update, 50)
}

const stopBreathing = () => {
  clearInterval(breathingInterval)
  breathingPhase.value = 'Breathe'
  breathingProgress.value = 565.48
}

// Floating hero cards
const activeCard = ref(0)

// Particle styles
const particleStyle = (i) => {
  const size = 2 + Math.random() * 4
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${6 + Math.random() * 10}s`,
    opacity: 0.2 + Math.random() * 0.4,
  }
}

// Quick access tools
const quickTools = [
  { icon: '🔐', label: 'Password', to: '/tools/password' },
  { icon: '⏱️', label: 'Timer', to: '/tools/timer' },
  { icon: '📦', label: 'Converter', to: '/tools/converter' },
  { icon: '📱', label: 'QR Code', to: '/tools/qr' },
  { icon: '🎨', label: 'Colors', to: '/tools/colors' },
  { icon: '📝', label: 'Notes', to: '/tools/notes' },
  { icon: '🧠', label: 'Mental Health', to: '/mental-health' },
  { icon: '💚', label: 'Wellness', to: '/wellness' },
]

// Featured tools
const featuredTools = [
  { name: 'Password Generator', desc: 'Create uncrackable passwords with custom rules', icon: '🔐', to: '/tools/password', gradient: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(124,58,237,0.05))' },
  { name: 'QR Code Generator', desc: 'Generate and scan QR codes instantly', icon: '📱', to: '/tools/qr-generator', gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))' },
  { name: 'Unit Converter', desc: 'Length, weight, temperature, and more', icon: '📦', to: '/tools/converter', gradient: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.05))' },
  { name: 'JSON Formatter', desc: 'Beautify, validate, and minify JSON data', icon: '{ }', to: '/tools/json', gradient: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))' },
  { name: 'Color Picker', desc: 'Pick, convert, and explore color palettes', icon: '🎨', to: '/tools/color-picker', gradient: 'linear-gradient(135deg, rgba(251,146,60,0.2), rgba(251,146,60,0.05))' },
  { name: 'Focus Timer', desc: 'Pomodoro timer with ambient sounds', icon: '⏱️', to: '/tools/pomodoro', gradient: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))' },
]

// Categories
const categories = [
  { icon: '🛠️', label: 'Productivity', desc: 'Timers, notes, converters, and more', count: 12, to: '/tools' },
  { icon: '💻', label: 'Developer', desc: 'JSON, regex, hashing, encoding', count: 10, to: '/tools' },
  { icon: '🧠', label: 'Mental Health', desc: 'Breathing, mood tracking, journaling', count: 5, to: '/mental-health' },
  { icon: '🌿', label: 'Wellness', desc: 'Habits, hydration, sleep, BMI', count: 4, to: '/wellness' },
  { icon: '📚', label: 'Learning', desc: 'Flashcards, grades, calculators', count: 6, to: '/learning' },
  { icon: '🆘', label: 'Emergency', desc: 'Crisis hotlines and resources', count: 3, to: '/emergency' },
]

// Dev tools
const devTools = [
  { name: 'JSON Formatter', desc: 'Beautify & validate', icon: '{ }', to: '/tools/json' },
  { name: 'Regex Tester', desc: 'Test patterns live', icon: '.*', to: '/tools/regex' },
  { name: 'Hash Generator', desc: 'MD5, SHA-256 & more', icon: '#️⃣', to: '/tools/hash-generator' },
  { name: 'Base64 Encoder', desc: 'Encode & decode', icon: '🔄', to: '/tools/base64' },
  { name: 'Diff Checker', desc: 'Compare text side-by-side', icon: '📄', to: '/tools/diff' },
  { name: 'UUID Generator', desc: 'Generate unique IDs', icon: '🆔', to: '/tools/uuid-generator' },
  { name: 'URL Encoder', desc: 'Encode URL components', icon: '🔗', to: '/tools/url' },
  { name: 'CSS Formatter', desc: 'Beautify stylesheets', icon: '🎨', to: '/tools/css' },
]

onMounted(() => {
  typingTimeout = setTimeout(typeText, 600)
})

onUnmounted(() => {
  clearTimeout(typingTimeout)
  clearInterval(breathingInterval)
})
</script>

<style scoped>
/* Hero */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  background: var(--primary);
  border-radius: 50%;
  animation: particleFloat linear infinite;
}

@keyframes particleFloat {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  10% { opacity: var(--opacity, 0.3); }
  90% { opacity: var(--opacity, 0.3); }
  100% { transform: translateY(-200px) scale(0); opacity: 0; }
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 28px;
  border: 1px solid rgba(124, 58, 237, 0.2);
  background: rgba(124, 58, 237, 0.05);
}

.pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--success);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { opacity: 0.8; box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 24px;
  color: white;
}

.typed-wrapper {
  display: inline-flex;
  align-items: baseline;
}

.typed-text {
  font-style: normal;
}

.cursor {
  display: inline-block;
  color: var(--primary);
  font-weight: 300;
  margin-left: 2px;
}

.cursor.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-desc {
  font-size: 17px;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 36px;
  max-width: 480px;
}

.hero-actions {
  display: flex;
  gap: 14px;
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 28px;
}

.stat-item { text-align: center; }

.stat-number {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 12px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--border-light);
}

/* Hero Visual - Card stack */
.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.hero-card-stack {
  position: relative;
  width: 320px;
  height: 380px;
}

.hero-card {
  position: absolute;
  padding: 28px;
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 0.6s var(--ease-out-expo);
  width: 260px;
  border: 1px solid rgba(124, 58, 237, 0.15);
}

.hero-card:hover {
  border-color: rgba(124, 58, 237, 0.4);
}

.card-1 {
  top: 0; left: 0;
  z-index: 4;
  transform: rotate(-2deg);
}
.card-1:hover { transform: rotate(0deg) translateY(-8px) scale(1.03); z-index: 10; }

.card-2 {
  top: 30px; left: 60px;
  z-index: 3;
  transform: rotate(3deg);
}
.card-2:hover { transform: rotate(0deg) translateY(-8px) scale(1.03); z-index: 10; }

.card-3 {
  top: 120px; left: 20px;
  z-index: 2;
  transform: rotate(-1deg);
}
.card-3:hover { transform: rotate(0deg) translateY(-8px) scale(1.03); z-index: 10; }

.card-4 {
  top: 180px; left: 80px;
  z-index: 1;
  transform: rotate(2deg);
}
.card-4:hover { transform: rotate(0deg) translateY(-8px) scale(1.03); z-index: 10; }

.card-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.hero-card h3 {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 6px;
}

.hero-card p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.hero-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent 70%);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

/* Scroll indicator */
.hero-scroll-indicator {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
}

.scroll-mouse {
  width: 24px;
  height: 38px;
  border: 2px solid rgba(124, 58, 237, 0.3);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  padding-top: 8px;
}

.scroll-dot {
  width: 4px;
  height: 8px;
  background: var(--primary);
  border-radius: 4px;
  animation: scrollDown 2s ease-in-out infinite;
}

@keyframes scrollDown {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(12px); opacity: 0; }
}

/* Quick Access */
.quick-access {
  margin-top: -30px;
  position: relative;
  z-index: 2;
}

.quick-bar {
  display: flex;
  justify-content: center;
  gap: 6px;
  padding: 12px 20px;
  border-radius: var(--radius-xl);
  background: rgba(17, 17, 40, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.15);
  overflow-x: auto;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: var(--text-muted);
  transition: all 0.3s ease;
  white-space: nowrap;
  min-width: 80px;
}

.quick-item:hover {
  background: rgba(124, 58, 237, 0.1);
  color: white;
  transform: translateY(-2px);
}

.quick-icon { font-size: 22px; }

.quick-label {
  font-size: 11px;
  font-weight: 500;
}

/* Section Styling */
.section {
  padding: 100px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 56px;
}

.section-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-light);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 12px;
}

.section-header h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  margin-bottom: 12px;
}

.section-header p {
  color: var(--text-muted);
  font-size: 16px;
  max-width: 500px;
  margin: 0 auto;
}

/* Featured Grid */
.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.featured-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--border-light);
  transition: all 0.4s var(--ease-out-expo);
}

.featured-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.15);
}

.featured-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.featured-info h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.featured-info p {
  font-size: 13px;
  color: var(--text-muted);
}

.featured-arrow {
  margin-left: auto;
  color: var(--text-dim);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.featured-card:hover .featured-arrow {
  color: var(--primary);
  transform: translate(3px, -3px);
}

/* Wellness Spotlight */
.wellness-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.wellness-desc {
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 20px 0 32px;
}

.wellness-features {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 36px;
}

.wellness-feat {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.feat-icon {
  font-size: 24px;
  margin-top: 2px;
}

.wellness-feat h4 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.wellness-feat p {
  font-size: 13px;
  color: var(--text-muted);
}

.wellness-actions { display: flex; gap: 12px; }

/* Breathing Demo */
.breathing-demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 48px 40px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(124, 58, 237, 0.15);
}

.breathing-circle {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.breathing-inner {
  position: absolute;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 4s ease-in-out;
}

.breathing-circle.active .breathing-inner {
  animation: breathScale 16s ease-in-out infinite;
}

@keyframes breathScale {
  0%, 100% { transform: scale(0.8); background: rgba(124, 58, 237, 0.08); }
  25% { transform: scale(1.1); background: rgba(124, 58, 237, 0.15); }
  50% { transform: scale(1.1); background: rgba(6, 182, 212, 0.15); }
  75% { transform: scale(0.8); background: rgba(6, 182, 212, 0.08); }
}

.breathing-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.breathing-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.category-card {
  padding: 32px 28px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--border-light);
  transition: all 0.4s var(--ease-out-expo);
  position: relative;
  overflow: hidden;
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-6px);
  box-shadow: 0 16px 48px rgba(124, 58, 237, 0.12);
}

.category-card:hover::before { opacity: 1; }

.cat-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 16px;
}

.category-card h3 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
}

.category-card p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 16px;
}

.cat-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--primary-light);
}

/* Emergency Banner */
.emergency-card {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 40px 48px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(239, 68, 68, 0.2);
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(17, 17, 40, 0.9));
  position: relative;
  overflow: hidden;
}

.emergency-pulse {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  background: #ef4444;
  border-radius: 50%;
  animation: emergencyPulse 2s ease-in-out infinite;
}

@keyframes emergencyPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
  50% { box-shadow: 0 0 0 16px rgba(239, 68, 68, 0); }
}

.emergency-content { flex: 1; padding-left: 16px; }

.emergency-content h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
}

.emergency-content p {
  color: var(--text-muted);
  font-size: 14px;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  padding: 14px 28px;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
}

/* Learning Grid */
.learning-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 20px;
}

.learning-card {
  padding: 28px;
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--border-light);
  transition: all 0.4s var(--ease-out-expo);
}

.learning-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.1);
}

.learning-card.card-large {
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.08), rgba(17, 17, 40, 0.9));
}

.lc-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.learning-card h3 {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
}

.learning-card p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.lc-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-light);
}

/* Dev Tools Grid */
.dev-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.dev-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.dev-card:hover {
  border-color: rgba(124, 58, 237, 0.25);
  transform: translateY(-3px);
  background: rgba(124, 58, 237, 0.04);
}

.dev-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.dev-card h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
}

.dev-card p {
  font-size: 12px;
  color: var(--text-dim);
}

/* CTA */
.cta-card {
  text-align: center;
  padding: 80px 40px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(124, 58, 237, 0.15);
  position: relative;
  overflow: hidden;
}

.cta-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(124, 58, 237, 0.15), transparent 70%);
  pointer-events: none;
}

.cta-card h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
}

.cta-card p {
  color: var(--text-muted);
  font-size: 16px;
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-container { grid-template-columns: 1fr; gap: 48px; text-align: center; }
  .hero-desc { margin: 0 auto 36px; }
  .hero-actions { justify-content: center; }
  .hero-stats { justify-content: center; }
  .hero-visual { display: none; }
  .featured-grid { grid-template-columns: repeat(2, 1fr); }
  .wellness-grid { grid-template-columns: 1fr; gap: 48px; }
  .dev-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hero { min-height: auto; padding: 100px 0 40px; }
  .featured-grid { grid-template-columns: 1fr; }
  .categories-grid { grid-template-columns: repeat(2, 1fr); }
  .learning-grid { grid-template-columns: 1fr; }
  .learning-card.card-large { grid-row: auto; }
  .dev-grid { grid-template-columns: 1fr; }
  .emergency-card { flex-direction: column; text-align: center; padding: 32px 24px; }
  .emergency-pulse { display: none; }
  .cta-card { padding: 48px 24px; }
  .cta-card h2 { font-size: 28px; }
  .cta-actions { flex-direction: column; align-items: center; }
  .quick-bar { justify-content: flex-start; }
}
</style>
