<template>
  <div class="tool-page">
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <main class="tool-container">
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">← Back to Tools</NuxtLink>
        <div class="badge"><span>🎨</span> Code Tool</div>
        <h1><span class="gradient-text">CSS Formatter</span></h1>
        <p>Beautify or minify your CSS code for better readability or smaller file size.</p>
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
            <span>Indent:</span>
            <select v-model.number="indentSize">
              <option :value="2">2 spaces</option>
              <option :value="4">4 spaces</option>
            </select>
          </label>
          <label class="option">
            <input type="checkbox" v-model="sortProperties" />
            <span>Sort properties</span>
          </label>
        </div>

        <!-- Editor -->
        <div class="editor-section">
          <div class="section-header">
            <label>Input CSS</label>
            <div class="actions">
              <button @click="pasteClipboard" class="action-btn">📋 Paste</button>
              <button @click="clearInput" class="action-btn">🗑️ Clear</button>
            </div>
          </div>
          <textarea 
            v-model="inputCss"
            placeholder="Paste your CSS code here..."
            @input="formatCss"
          ></textarea>
        </div>

        <!-- Output -->
        <div class="output-section">
          <div class="section-header">
            <label>Formatted Output</label>
            <div class="stats">
              <span v-if="outputCss">{{ outputCss.length }} chars</span>
              <span v-if="savings !== null" :class="savings > 0 ? 'positive' : 'negative'">
                {{ savings > 0 ? '↓' : '↑' }} {{ Math.abs(savings) }}%
              </span>
            </div>
            <button @click="copyOutput" class="action-btn primary">📋 Copy</button>
          </div>
          <pre class="output-code"><code>{{ outputCss || 'Output will appear here...' }}</code></pre>
        </div>

        <!-- Sample -->
        <div class="sample-section">
          <button @click="loadSample" class="sample-btn">
            📄 Load Sample CSS
          </button>
        </div>

        <!-- Info -->
        <div class="info-box">
          <span class="info-icon">💡</span>
          <div>
            <strong>CSS Formatting Tips</strong>
            <p><strong>Beautify</strong> adds proper indentation and line breaks for readability. <strong>Minify</strong> removes whitespace, comments, and shortens values to reduce file size - often saving 20-40%!</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({ title: 'CSS Formatter - QuickHelp.lol' })

const mode = ref('beautify')
const indentSize = ref(2)
const sortProperties = ref(false)
const inputCss = ref('')
const outputCss = ref('')

const savings = computed(() => {
  if (!inputCss.value || !outputCss.value) return null
  const diff = ((inputCss.value.length - outputCss.value.length) / inputCss.value.length) * 100
  return Math.round(diff)
})

const formatCss = () => {
  if (!inputCss.value.trim()) {
    outputCss.value = ''
    return
  }

  try {
    if (mode.value === 'beautify') {
      outputCss.value = beautifyCss(inputCss.value)
    } else {
      outputCss.value = minifyCss(inputCss.value)
    }
  } catch (e) {
    outputCss.value = 'Error: Invalid CSS'
  }
}

const beautifyCss = (css) => {
  const indent = ' '.repeat(indentSize.value)
  
  // Remove existing whitespace
  css = css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments temporarily
    .replace(/\s+/g, ' ')
    .trim()
  
  let result = ''
  let level = 0
  let inProperty = false
  
  for (let i = 0; i < css.length; i++) {
    const char = css[i]
    
    if (char === '{') {
      result += ' {\n'
      level++
    } else if (char === '}') {
      level = Math.max(0, level - 1)
      result += indent.repeat(level) + '}\n\n'
    } else if (char === ';') {
      result += ';\n'
    } else if (char === ':' && !inProperty) {
      result += ': '
      inProperty = true
    } else if (char === '\n' || (result.endsWith('\n') && char === ' ')) {
      continue
    } else {
      if (result.endsWith('\n') && char !== '}') {
        result += indent.repeat(level)
      }
      result += char
      if (char === ';') inProperty = false
    }
  }
  
  // Clean up extra spaces and newlines
  result = result
    .replace(/\n\n+/g, '\n\n')
    .replace(/{\s+}/g, '{ }')
    .replace(/\s+;/g, ';')
    .replace(/:\s+/g, ': ')
    .trim()
  
  if (sortProperties.value) {
    result = sortCssProperties(result)
  }
  
  return result
}

const sortCssProperties = (css) => {
  return css.replace(/\{([^}]+)\}/g, (match, content) => {
    const properties = content
      .split(';')
      .map(p => p.trim())
      .filter(p => p)
      .sort()
    return '{\n  ' + properties.join(';\n  ') + ';\n}'
  })
}

const minifyCss = (css) => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*{\s*/g, '{') // Remove space around {
    .replace(/\s*}\s*/g, '}') // Remove space around }
    .replace(/\s*;\s*/g, ';') // Remove space around ;
    .replace(/\s*:\s*/g, ':') // Remove space around :
    .replace(/\s*,\s*/g, ',') // Remove space around ,
    .replace(/;}/g, '}') // Remove last semicolon before }
    .replace(/\s*>\s*/g, '>') // Remove space around >
    .replace(/\s*\+\s*/g, '+') // Remove space around +
    .replace(/\s*~\s*/g, '~') // Remove space around ~
    .trim()
}

const copyOutput = () => {
  navigator.clipboard.writeText(outputCss.value)
}

const clearInput = () => {
  inputCss.value = ''
  outputCss.value = ''
}

const pasteClipboard = async () => {
  try {
    inputCss.value = await navigator.clipboard.readText()
    formatCss()
  } catch (e) {
    console.error('Failed to paste')
  }
}

const loadSample = () => {
  inputCss.value = `.container{display:flex;flex-direction:column;align-items:center;padding:20px;margin:0 auto;max-width:1200px;}.header{background-color:#1a1a2e;color:#ffffff;padding:15px 30px;border-radius:8px;}.button{background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:12px 24px;border:none;border-radius:6px;cursor:pointer;transition:all 0.3s ease;}.button:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(102,126,234,0.4);}`
  formatCss()
}

watch([mode, indentSize, sortProperties], formatCss)
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(147, 51, 234, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 900px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #3b82f6; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 100px; color: #3b82f6; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #3b82f6, #9333ea); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.mode-tabs { display: flex; gap: 12px; margin-bottom: 24px; }
.tab { flex: 1; padding: 14px 20px; font-size: 15px; font-weight: 600; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 12px; color: #94a3b8; cursor: pointer; transition: all 0.3s; }
.tab.active { background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2)); border-color: #3b82f6; color: white; }

.options-row { display: flex; gap: 20px; margin-bottom: 20px; padding: 16px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; flex-wrap: wrap; }
.option { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #94a3b8; cursor: pointer; }
.option input[type="checkbox"] { accent-color: #3b82f6; }
.option select { padding: 8px 12px; font-size: 13px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: white; outline: none; }

.editor-section, .output-section { margin-bottom: 24px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px; flex-wrap: wrap; }
.section-header label { font-size: 14px; font-weight: 500; color: #e2e8f0; }
.actions { display: flex; gap: 8px; }
.action-btn { padding: 8px 14px; font-size: 12px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: #3b82f6; color: #3b82f6; }
.action-btn.primary { background: rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.5); color: #3b82f6; }

.stats { display: flex; gap: 12px; font-size: 13px; color: #64748b; flex: 1; justify-content: flex-end; }
.stats .positive { color: #22c55e; }
.stats .negative { color: #ef4444; }

textarea { width: 100%; height: 180px; padding: 16px; font-size: 13px; font-family: 'Fira Code', monospace; line-height: 1.6; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: #e2e8f0; resize: vertical; outline: none; }
textarea:focus { border-color: #3b82f6; }

.output-code { width: 100%; height: 200px; padding: 16px; font-size: 13px; font-family: 'Fira Code', monospace; line-height: 1.6; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: #22c55e; overflow: auto; margin: 0; white-space: pre-wrap; word-break: break-all; }

.sample-section { text-align: center; margin-bottom: 24px; }
.sample-btn { padding: 12px 24px; font-size: 14px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 10px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.sample-btn:hover { border-color: #3b82f6; color: #3b82f6; }

.info-box { display: flex; gap: 16px; padding: 20px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 14px; }
.info-icon { font-size: 24px; }
.info-box strong { display: block; color: white; margin-bottom: 6px; }
.info-box p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; }
</style>
