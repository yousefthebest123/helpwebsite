<template>
  <div class="tool-page min-h-screen">
    <div class="cyber-grid"></div>
    <div class="animated-bg"></div>

    <main class="container mx-auto px-6 pt-24 pb-16 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <NuxtLink to="/tools" class="back-link">
          <span>←</span> Back to Tools
        </NuxtLink>
        <div class="tool-badge green">
          <span>📝</span>
          <span>Writing Tool</span>
        </div>
        <h1 class="page-title">
          <span class="title-gradient">Word Counter</span>
        </h1>
        <p class="page-subtitle">
          Count words, characters, sentences, and estimate reading time instantly.
        </p>
      </div>

      <div class="max-w-5xl mx-auto">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card cyan">
            <div class="stat-icon">📝</div>
            <div class="stat-value">{{ stats.words }}</div>
            <div class="stat-label">Words</div>
          </div>
          <div class="stat-card blue">
            <div class="stat-icon">🔤</div>
            <div class="stat-value">{{ stats.characters }}</div>
            <div class="stat-label">Characters</div>
          </div>
          <div class="stat-card purple">
            <div class="stat-icon">💬</div>
            <div class="stat-value">{{ stats.sentences }}</div>
            <div class="stat-label">Sentences</div>
          </div>
          <div class="stat-card green">
            <div class="stat-icon">📄</div>
            <div class="stat-value">{{ stats.paragraphs }}</div>
            <div class="stat-label">Paragraphs</div>
          </div>
          <div class="stat-card orange">
            <div class="stat-icon">⏱️</div>
            <div class="stat-value">{{ stats.readingTime }}</div>
            <div class="stat-label">Min Read</div>
          </div>
        </div>

        <!-- Main Card -->
        <div class="tool-card">
          <div class="card-section">
            <div class="textarea-header">
              <div class="header-left">
                <span class="header-icon">✍️</span>
                <span class="header-title">Your Text</span>
              </div>
              <div class="header-actions">
                <button @click="copyText" class="action-btn">
                  <span>📋</span> Copy
                </button>
                <button @click="clearText" class="action-btn danger">
                  <span>🗑️</span> Clear
                </button>
              </div>
            </div>
            <textarea
              v-model="text"
              class="text-area"
              placeholder="Start typing or paste your text here to see statistics..."
            ></textarea>
          </div>

          <!-- Additional Stats -->
          <div class="card-section extra-stats">
            <div class="extra-stat">
              <span class="extra-icon">⬜</span>
              <span class="extra-label">Characters (no spaces):</span>
              <span class="extra-value">{{ stats.charactersNoSpaces }}</span>
            </div>
            <div class="extra-stat">
              <span class="extra-icon">📏</span>
              <span class="extra-label">Avg word length:</span>
              <span class="extra-value">{{ stats.avgWordLength }}</span>
            </div>
            <div class="extra-stat">
              <span class="extra-icon">🎤</span>
              <span class="extra-label">Speaking time:</span>
              <span class="extra-value">{{ stats.speakingTime }} min</span>
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">📖</div>
            <h3 class="info-title">Reading Speed</h3>
            <p class="info-text">Average adult reads at 200-250 words per minute.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">🎯</div>
            <h3 class="info-title">Tweet Length</h3>
            <p class="info-text">Twitter allows 280 characters per tweet.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">📧</div>
            <h3 class="info-title">Email Subject</h3>
            <p class="info-text">Keep email subjects under 50 characters.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const text = ref('')

const stats = computed(() => {
  const t = text.value.trim()
  
  const words = t ? t.split(/\s+/).filter(w => w.length > 0).length : 0
  const characters = text.value.length
  const charactersNoSpaces = text.value.replace(/\s/g, '').length
  const sentences = t ? (t.match(/[.!?]+/g) || []).length : 0
  const paragraphs = t ? t.split(/\n\n+/).filter(p => p.trim()).length : 0
  const readingTime = Math.ceil(words / 200)
  const speakingTime = Math.ceil(words / 150)
  const avgWordLength = words ? (charactersNoSpaces / words).toFixed(1) : '0'

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime,
    speakingTime,
    avgWordLength
  }
})

const copyText = () => {
  navigator.clipboard.writeText(text.value)
}

const clearText = () => {
  text.value = ''
}

useHead({ title: 'Word Counter - QuickHelp.lol' })
</script>

<style scoped>
.tool-page {
  position: relative;
  background: linear-gradient(180deg, #030712 0%, #0a1628 50%, #030712 100%);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.3s;
}

.back-link:hover { color: #34d399; }

.tool-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}

.tool-badge.green {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(34, 197, 94, 0.15));
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.page-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; }

.title-gradient {
  background: linear-gradient(135deg, #34d399, #22d3ee, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle { color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto; line-height: 1.6; }

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  padding: 24px 16px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s;
}

.stat-card:hover { transform: translateY(-4px); }

.stat-card.cyan { border: 1px solid rgba(6, 182, 212, 0.3); }
.stat-card.blue { border: 1px solid rgba(59, 130, 246, 0.3); }
.stat-card.purple { border: 1px solid rgba(139, 92, 246, 0.3); }
.stat-card.green { border: 1px solid rgba(16, 185, 129, 0.3); }
.stat-card.orange { border: 1px solid rgba(249, 115, 22, 0.3); }

.stat-icon { font-size: 28px; margin-bottom: 12px; }

.stat-value { font-size: 32px; font-weight: 800; margin-bottom: 4px; }
.stat-card.cyan .stat-value { color: #22d3ee; }
.stat-card.blue .stat-value { color: #3b82f6; }
.stat-card.purple .stat-value { color: #a78bfa; }
.stat-card.green .stat-value { color: #34d399; }
.stat-card.orange .stat-value { color: #fb923c; }

.stat-label { color: #64748b; font-size: 13px; font-weight: 500; }

/* Main Card */
.tool-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 32px;
}

.card-section { padding: 28px; border-bottom: 1px solid rgba(16, 185, 129, 0.1); }
.card-section:last-child { border-bottom: none; }

.textarea-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.header-left { display: flex; align-items: center; gap: 10px; }
.header-icon { font-size: 20px; }
.header-title { color: white; font-size: 16px; font-weight: 600; }

.header-actions { display: flex; gap: 10px; }

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  color: #34d399;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover { background: rgba(16, 185, 129, 0.2); }
.action-btn.danger { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #f87171; }
.action-btn.danger:hover { background: rgba(239, 68, 68, 0.2); }

.text-area {
  width: 100%;
  min-height: 350px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 16px;
  color: #e2e8f0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.8;
  resize: vertical;
}

.text-area:focus { outline: none; border-color: rgba(16, 185, 129, 0.4); }
.text-area::placeholder { color: #64748b; }

/* Extra Stats */
.extra-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 32px;
  padding: 20px 28px !important;
  background: rgba(0, 0, 0, 0.2);
}

.extra-stat { display: flex; align-items: center; gap: 10px; }
.extra-icon { font-size: 16px; }
.extra-label { color: #94a3b8; font-size: 14px; }
.extra-value { color: #22d3ee; font-size: 15px; font-weight: 600; font-family: 'Fira Code', monospace; }

/* Info Grid */
.info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

.info-card {
  padding: 24px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  border: 1px solid rgba(16, 185, 129, 0.1);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
}

.info-card:hover { border-color: rgba(16, 185, 129, 0.3); transform: translateY(-4px); }
.info-icon { font-size: 32px; margin-bottom: 12px; }
.info-title { color: white; font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.info-text { color: #64748b; font-size: 13px; line-height: 1.5; }

@media (max-width: 1024px) {
  .stats-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 768px) {
  .page-title { font-size: 2rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .extra-stats { flex-direction: column; gap: 16px; }
  .info-grid { grid-template-columns: 1fr; }
}
</style>
