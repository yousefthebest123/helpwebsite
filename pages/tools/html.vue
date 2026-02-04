<template>
  <div class="tool-page">
    <NavBar />
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <main class="tool-container">
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">← Back to Tools</NuxtLink>
        <div class="badge"><span>🌐</span> Code Tool</div>
        <h1><span class="gradient-text">HTML Formatter</span></h1>
        <p>Format, beautify, or minify your HTML code instantly.</p>
      </header>

      <div class="tool-card">
        <!-- Mode Toggle -->
        <div class="mode-tabs">
          <button 
            @click="mode = 'beautify'" 
            :class="['tab', { active: mode === 'beautify' }]"
          >
            ✨ Beautify
          </button>
          <button 
            @click="mode = 'minify'" 
            :class="['tab', { active: mode === 'minify' }]"
          >
            📦 Minify
          </button>
        </div>

        <!-- Options -->
        <div class="options-row" v-if="mode === 'beautify'">
          <label class="option">
            <span>Indent Size:</span>
            <select v-model.number="indentSize">
              <option :value="2">2 spaces</option>
              <option :value="4">4 spaces</option>
              <option :value="1">1 tab</option>
            </select>
          </label>
        </div>

        <!-- Editor -->
        <div class="editor-section">
          <div class="section-header">
            <label>Input HTML</label>
            <div class="actions">
              <button @click="pasteClipboard" class="action-btn">📋 Paste</button>
              <button @click="clearInput" class="action-btn">🗑️ Clear</button>
            </div>
          </div>
          <textarea 
            v-model="inputHtml"
            placeholder="Paste your HTML code here..."
            @input="formatHtml"
          ></textarea>
        </div>

        <!-- Output -->
        <div class="output-section">
          <div class="section-header">
            <label>Formatted Output</label>
            <div class="stats">
              <span v-if="outputHtml">{{ outputHtml.length }} chars</span>
              <span v-if="savings" :class="savings > 0 ? 'positive' : 'negative'">
                {{ savings > 0 ? '↓' : '↑' }} {{ Math.abs(savings) }}%
              </span>
            </div>
            <button @click="copyOutput" class="action-btn primary">📋 Copy</button>
          </div>
          <pre class="output-code"><code>{{ outputHtml || 'Output will appear here...' }}</code></pre>
        </div>

        <!-- Sample -->
        <div class="sample-section">
          <button @click="loadSample" class="sample-btn">
            📄 Load Sample HTML
          </button>
        </div>

        <!-- Info -->
        <div class="info-box">
          <span class="info-icon">💡</span>
          <div>
            <strong>HTML Formatting Tips</strong>
            <p>Use <strong>Beautify</strong> to make your HTML readable with proper indentation. Use <strong>Minify</strong> to reduce file size by removing unnecessary whitespace, perfect for production deployment.</p>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
useHead({ title: 'HTML Formatter - QuickHelp.lol' })

const mode = ref('beautify')
const indentSize = ref(2)
const inputHtml = ref('')
const outputHtml = ref('')

const savings = computed(() => {
  if (!inputHtml.value || !outputHtml.value) return null
  const diff = ((inputHtml.value.length - outputHtml.value.length) / inputHtml.value.length) * 100
  return Math.round(diff)
})

const formatHtml = () => {
  if (!inputHtml.value.trim()) {
    outputHtml.value = ''
    return
  }

  try {
    if (mode.value === 'beautify') {
      outputHtml.value = beautifyHtml(inputHtml.value)
    } else {
      outputHtml.value = minifyHtml(inputHtml.value)
    }
  } catch (e) {
    outputHtml.value = 'Error: Invalid HTML'
  }
}

const beautifyHtml = (html) => {
  const indent = indentSize.value === 1 ? '\t' : ' '.repeat(indentSize.value)
  let result = ''
  let level = 0
  let inTag = false
  let tagName = ''
  let isClosingTag = false
  let isSelfClosing = false
  const voidElements = ['br', 'hr', 'img', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']
  
  // Simple beautifier
  html = html.replace(/>\s+</g, '><').trim()
  
  const tokens = html.match(/<[^>]+>|[^<]+/g) || []
  
  tokens.forEach((token, i) => {
    if (token.startsWith('<')) {
      const match = token.match(/<\/?(\w+)/)
      if (match) {
        tagName = match[1].toLowerCase()
        isClosingTag = token.startsWith('</')
        isSelfClosing = token.endsWith('/>') || voidElements.includes(tagName)
        
        if (isClosingTag) {
          level = Math.max(0, level - 1)
        }
        
        result += indent.repeat(level) + token + '\n'
        
        if (!isClosingTag && !isSelfClosing) {
          level++
        }
      } else {
        result += indent.repeat(level) + token + '\n'
      }
    } else {
      const text = token.trim()
      if (text) {
        result += indent.repeat(level) + text + '\n'
      }
    }
  })
  
  return result.trim()
}

const minifyHtml = (html) => {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s*=\s*/g, '=')
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim()
}

const copyOutput = () => {
  navigator.clipboard.writeText(outputHtml.value)
}

const clearInput = () => {
  inputHtml.value = ''
  outputHtml.value = ''
}

const pasteClipboard = async () => {
  try {
    inputHtml.value = await navigator.clipboard.readText()
    formatHtml()
  } catch (e) {
    console.error('Failed to paste')
  }
}

const loadSample = () => {
  inputHtml.value = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Sample Page</title><style>body{margin:0;padding:20px;}</style></head><body><header><nav><ul><li><a href="/">Home</a></li><li><a href="/about">About</a></li></ul></nav></header><main><h1>Welcome</h1><p>This is a sample HTML page.</p><img src="image.jpg" alt="Sample"/></main><footer><p>&copy; 2024</p></footer></body></html>`
  formatHtml()
}

watch([mode, indentSize], formatHtml)
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(234, 88, 12, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(220, 38, 38, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 900px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #ea580c; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(234, 88, 12, 0.1); border: 1px solid rgba(234, 88, 12, 0.3); border-radius: 100px; color: #ea580c; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #ea580c, #dc2626); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(234, 88, 12, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.mode-tabs { display: flex; gap: 12px; margin-bottom: 24px; }
.tab { flex: 1; padding: 14px 20px; font-size: 15px; font-weight: 600; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 12px; color: #94a3b8; cursor: pointer; transition: all 0.3s; }
.tab.active { background: linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(220, 38, 38, 0.2)); border-color: #ea580c; color: white; }

.options-row { display: flex; gap: 16px; margin-bottom: 20px; padding: 16px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; }
.option { display: flex; align-items: center; gap: 12px; font-size: 14px; color: #94a3b8; }
.option select { padding: 8px 12px; font-size: 13px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: white; outline: none; }

.editor-section, .output-section { margin-bottom: 24px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.section-header label { font-size: 14px; font-weight: 500; color: #e2e8f0; }
.actions { display: flex; gap: 8px; }
.action-btn { padding: 8px 14px; font-size: 12px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: #ea580c; color: #ea580c; }
.action-btn.primary { background: rgba(234, 88, 12, 0.2); border-color: rgba(234, 88, 12, 0.5); color: #ea580c; }

.stats { display: flex; gap: 12px; font-size: 13px; color: #64748b; }
.stats .positive { color: #22c55e; }
.stats .negative { color: #ef4444; }

textarea { width: 100%; height: 180px; padding: 16px; font-size: 13px; font-family: 'Fira Code', monospace; line-height: 1.6; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: #e2e8f0; resize: vertical; outline: none; }
textarea:focus { border-color: #ea580c; }

.output-code { width: 100%; height: 200px; padding: 16px; font-size: 13px; font-family: 'Fira Code', monospace; line-height: 1.6; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: #22c55e; overflow: auto; margin: 0; white-space: pre-wrap; word-break: break-all; }

.sample-section { text-align: center; margin-bottom: 24px; }
.sample-btn { padding: 12px 24px; font-size: 14px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 10px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.sample-btn:hover { border-color: #ea580c; color: #ea580c; }

.info-box { display: flex; gap: 16px; padding: 20px; background: rgba(234, 88, 12, 0.08); border: 1px solid rgba(234, 88, 12, 0.2); border-radius: 14px; }
.info-icon { font-size: 24px; }
.info-box strong { display: block; color: white; margin-bottom: 6px; }
.info-box p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; }
</style>
