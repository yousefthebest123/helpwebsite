<template>
  <div class="tool-page min-h-screen">
    <div class="cyber-grid"></div>
    <div class="animated-bg"></div>

    <main class="container mx-auto px-6 pt-32 pb-16 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <NuxtLink to="/tools" class="back-link">
          <span>←</span> Back to Tools
        </NuxtLink>
        <div class="tool-badge red">
          <span>📝</span>
          <span>Text Tool</span>
        </div>
        <h1 class="page-title">
          <span class="title-gradient">Lorem Ipsum Generator</span>
        </h1>
        <p class="page-subtitle">
          Generate beautiful placeholder text for your designs, mockups, and prototypes.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="tool-card">
          <!-- Options Section -->
          <div class="card-section">
            <div class="section-header">
              <div class="section-icon orange">⚙️</div>
              <h2 class="section-title">Generation Options</h2>
            </div>

            <div class="options-grid">
              <!-- Type Selection -->
              <div class="option-group">
                <label class="option-label">📄 Content Type</label>
                <div class="type-buttons">
                  <button 
                    v-for="t in ['paragraphs', 'sentences', 'words']" 
                    :key="t"
                    @click="type = t as any"
                    :class="['type-btn', { active: type === t }]"
                  >
                    <span class="type-icon">{{ t === 'paragraphs' ? '📄' : t === 'sentences' ? '💬' : '🔤' }}</span>
                    <span>{{ t.charAt(0).toUpperCase() + t.slice(1) }}</span>
                  </button>
                </div>
              </div>

              <!-- Amount -->
              <div class="option-group">
                <label class="option-label">🔢 Amount</label>
                <div class="amount-control">
                  <button @click="amount = Math.max(1, amount - 1)" class="amount-btn">−</button>
                  <input v-model.number="amount" type="number" min="1" max="100" class="amount-input" />
                  <button @click="amount = Math.min(100, amount + 1)" class="amount-btn">+</button>
                </div>
                <span class="amount-hint">{{ type }}</span>
              </div>

              <!-- Format -->
              <div class="option-group">
                <label class="option-label">🏷️ Output Format</label>
                <div class="format-buttons">
                  <button 
                    @click="format = 'plain'"
                    :class="['format-btn', { active: format === 'plain' }]"
                  >
                    <span>📝</span> Plain Text
                  </button>
                  <button 
                    @click="format = 'html'"
                    :class="['format-btn', { active: format === 'html' }]"
                  >
                    <span>🏷️</span> HTML Tags
                  </button>
                </div>
              </div>
            </div>

            <button @click="generate" class="generate-btn">
              <span>✨</span>
              Generate Lorem Ipsum
            </button>
          </div>

          <!-- Output Section -->
          <div v-if="output" class="card-section">
            <div class="output-header">
              <div class="output-title">
                <div class="section-icon cyan">📋</div>
                <h2 class="section-title">Generated Text</h2>
              </div>
              <button @click="copyText" :class="['copy-btn', { copied }]">
                {{ copied ? '✓ Copied!' : '📋 Copy All' }}
              </button>
            </div>

            <div class="output-box">
              <div v-if="format === 'html'" class="output-text html" v-html="output"></div>
              <p v-else class="output-text">{{ output }}</p>
            </div>

            <!-- Stats -->
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-icon">📝</span>
                <span class="stat-value">{{ wordCount }}</span>
                <span class="stat-label">words</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-icon">🔤</span>
                <span class="stat-value">{{ charCount }}</span>
                <span class="stat-label">characters</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-icon">📄</span>
                <span class="stat-value">{{ amount }}</span>
                <span class="stat-label">{{ type }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon">📜</div>
            <h3 class="info-title">What is Lorem Ipsum?</h3>
            <p class="info-text">Lorem Ipsum is dummy text used in the printing and typesetting industry since the 1500s.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">🎨</div>
            <h3 class="info-title">Perfect for Design</h3>
            <p class="info-text">Use placeholder text to focus on layout and visual design without distracting content.</p>
          </div>
          <div class="info-card">
            <div class="info-icon">⚡</div>
            <h3 class="info-title">Instant Generation</h3>
            <p class="info-text">Generate any amount of paragraphs, sentences, or words with a single click.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const type = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const amount = ref(3)
const format = ref<'plain' | 'html'>('plain')
const output = ref('')
const copied = ref(false)

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde', 
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque', 
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta'
]

const getRandomWord = () => loremWords[Math.floor(Math.random() * loremWords.length)]

const generateSentence = (wordCount: number = 0) => {
  const count = wordCount || Math.floor(Math.random() * 10) + 5
  const words = Array.from({ length: count }, getRandomWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

const generateParagraph = () => {
  const sentenceCount = Math.floor(Math.random() * 4) + 4
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ')
}

const generate = () => {
  let result: string[] = []

  if (type.value === 'words') {
    result = [Array.from({ length: amount.value }, getRandomWord).join(' ')]
  } else if (type.value === 'sentences') {
    result = Array.from({ length: amount.value }, () => generateSentence())
  } else {
    result = Array.from({ length: amount.value }, generateParagraph)
  }

  if (format.value === 'html') {
    output.value = result.map(p => `<p>${p}</p>`).join('\n')
  } else {
    output.value = result.join('\n\n')
  }
}

const wordCount = computed(() => output.value.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length)
const charCount = computed(() => output.value.replace(/<[^>]*>/g, '').length)

const copyText = () => {
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

onMounted(generate)

useHead({ title: 'Lorem Ipsum Generator - QuickHelp.lol' })
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

.back-link:hover { color: #f87171; }

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

.tool-badge.red {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(249, 115, 22, 0.15));
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.page-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; }

.title-gradient {
  background: linear-gradient(135deg, #f87171, #fb923c, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle { color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto; line-height: 1.6; }

.tool-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 24px;
  overflow: hidden;
}

.card-section { padding: 32px; border-bottom: 1px solid rgba(239, 68, 68, 0.1); }
.card-section:last-child { border-bottom: none; }

.section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.section-icon { font-size: 24px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 14px; }
.section-icon.orange { background: rgba(249, 115, 22, 0.15); }
.section-icon.cyan { background: rgba(6, 182, 212, 0.15); }
.section-title { color: white; font-size: 18px; font-weight: 600; }

/* Options Grid */
.options-grid { display: flex; flex-direction: column; gap: 24px; margin-bottom: 32px; }
.option-group { display: flex; flex-direction: column; gap: 12px; }
.option-label { color: #94a3b8; font-size: 14px; font-weight: 500; }

.type-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
.type-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.type-btn:hover { border-color: rgba(239, 68, 68, 0.4); color: white; }
.type-btn.active { background: rgba(239, 68, 68, 0.15); border-color: #f87171; color: #f87171; }
.type-icon { font-size: 18px; }

.amount-control { display: flex; align-items: center; gap: 12px; }
.amount-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: #f87171;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.amount-btn:hover { background: rgba(239, 68, 68, 0.15); }

.amount-input {
  width: 100px;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  text-align: center;
}

.amount-input:focus { outline: none; border-color: #f87171; }
.amount-hint { color: #64748b; font-size: 13px; margin-left: 12px; }

.format-buttons { display: flex; gap: 12px; }
.format-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.format-btn:hover { border-color: rgba(239, 68, 68, 0.4); color: white; }
.format-btn.active { background: rgba(239, 68, 68, 0.15); border-color: #f87171; color: #f87171; }

.generate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 32px;
  background: linear-gradient(135deg, #ef4444, #f97316);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(239, 68, 68, 0.4); }

/* Output Section */
.output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.output-title { display: flex; align-items: center; gap: 14px; }

.copy-btn {
  padding: 12px 24px;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  color: #22d3ee;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover { background: rgba(6, 182, 212, 0.2); }
.copy-btn.copied { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); color: #34d399; }

.output-box {
  padding: 24px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: 16px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.output-text { color: #e2e8f0; font-size: 15px; line-height: 1.8; white-space: pre-wrap; }
.output-text.html p { margin-bottom: 16px; }
.output-text.html p:last-child { margin-bottom: 0; }

/* Stats Row */
.stats-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 14px;
}

.stat-item { display: flex; align-items: center; gap: 8px; }
.stat-icon { font-size: 16px; }
.stat-value { color: white; font-size: 16px; font-weight: 600; }
.stat-label { color: #64748b; font-size: 14px; }
.stat-divider { width: 1px; height: 24px; background: rgba(100, 116, 139, 0.3); }

/* Info Grid */
.info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 32px; }

.info-card {
  padding: 24px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  border: 1px solid rgba(239, 68, 68, 0.1);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
}

.info-card:hover { border-color: rgba(239, 68, 68, 0.3); transform: translateY(-4px); }
.info-icon { font-size: 32px; margin-bottom: 12px; }
.info-title { color: white; font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.info-text { color: #64748b; font-size: 13px; line-height: 1.5; }

@media (max-width: 768px) {
  .page-title { font-size: 2rem; }
  .type-buttons { flex-direction: column; }
  .format-buttons { flex-direction: column; }
  .stats-row { flex-direction: column; gap: 16px; }
  .stat-divider { display: none; }
  .info-grid { grid-template-columns: 1fr; }
}
</style>
