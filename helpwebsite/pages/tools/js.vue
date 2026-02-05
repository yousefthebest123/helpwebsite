<template>
  <div class="tool-page">
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <main class="tool-container">
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">← Back to Tools</NuxtLink>
        <div class="badge"><span>💻</span> Code Tool</div>
        <h1><span class="gradient-text">JavaScript Formatter</span></h1>
        <p>Beautify or minify your JavaScript code instantly.</p>
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
            <input type="checkbox" v-model="useSemicolons" />
            <span>Add semicolons</span>
          </label>
          <label class="option">
            <input type="checkbox" v-model="singleQuotes" />
            <span>Single quotes</span>
          </label>
        </div>

        <!-- Editor -->
        <div class="editor-section">
          <div class="section-header">
            <label>Input JavaScript</label>
            <div class="actions">
              <button @click="pasteClipboard" class="action-btn">📋 Paste</button>
              <button @click="clearInput" class="action-btn">🗑️ Clear</button>
            </div>
          </div>
          <textarea 
            v-model="inputJs"
            placeholder="Paste your JavaScript code here..."
            @input="formatJs"
          ></textarea>
        </div>

        <!-- Output -->
        <div class="output-section">
          <div class="section-header">
            <label>Formatted Output</label>
            <div class="stats">
              <span v-if="outputJs">{{ outputJs.length }} chars</span>
              <span v-if="savings !== null" :class="savings > 0 ? 'positive' : 'negative'">
                {{ savings > 0 ? '↓' : '↑' }} {{ Math.abs(savings) }}%
              </span>
            </div>
            <button @click="copyOutput" class="action-btn primary">📋 Copy</button>
          </div>
          <pre class="output-code"><code>{{ outputJs || 'Output will appear here...' }}</code></pre>
        </div>

        <!-- Sample -->
        <div class="sample-section">
          <button @click="loadSample" class="sample-btn">
            📄 Load Sample JavaScript
          </button>
        </div>

        <!-- Info -->
        <div class="info-box">
          <span class="info-icon">💡</span>
          <div>
            <strong>JavaScript Formatting Tips</strong>
            <p><strong>Beautify</strong> makes code readable with proper indentation. <strong>Minify</strong> removes whitespace and shortens variable names - can reduce file size by 30-60%!</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({ title: 'JavaScript Formatter - QuickHelp.lol' })

const mode = ref('beautify')
const indentSize = ref(2)
const useSemicolons = ref(true)
const singleQuotes = ref(false)
const inputJs = ref('')
const outputJs = ref('')

const savings = computed(() => {
  if (!inputJs.value || !outputJs.value) return null
  const diff = ((inputJs.value.length - outputJs.value.length) / inputJs.value.length) * 100
  return Math.round(diff)
})

const formatJs = () => {
  if (!inputJs.value.trim()) {
    outputJs.value = ''
    return
  }

  try {
    if (mode.value === 'beautify') {
      outputJs.value = beautifyJs(inputJs.value)
    } else {
      outputJs.value = minifyJs(inputJs.value)
    }
  } catch (e) {
    outputJs.value = 'Error: Invalid JavaScript'
  }
}

const beautifyJs = (js) => {
  const indent = ' '.repeat(indentSize.value)
  let result = ''
  let level = 0
  let inString = false
  let stringChar = ''
  let i = 0
  
  // Pre-process: normalize whitespace
  js = js.replace(/\s+/g, ' ').trim()
  
  while (i < js.length) {
    const char = js[i]
    const nextChar = js[i + 1]
    const prevChar = js[i - 1]
    
    // Handle strings
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true
        stringChar = char
      } else if (char === stringChar) {
        inString = false
      }
      result += char
      i++
      continue
    }
    
    if (inString) {
      result += char
      i++
      continue
    }
    
    // Handle brackets
    if (char === '{' || char === '[' || char === '(') {
      if (char === '{') {
        result = result.trimEnd() + ' ' + char + '\n'
        level++
      } else {
        result += char
      }
    } else if (char === '}' || char === ']' || char === ')') {
      if (char === '}') {
        level = Math.max(0, level - 1)
        if (!result.endsWith('\n')) result += '\n'
        result += indent.repeat(level) + char
      } else {
        result += char
      }
    } else if (char === ';') {
      result += (useSemicolons.value ? ';' : '') + '\n'
    } else if (char === ',') {
      result += ',\n'
    } else if (char === ':') {
      result += ': '
    } else if (char === ' ' && result.endsWith('\n')) {
      // Skip leading space after newline, add indent instead
      result += indent.repeat(level)
    } else {
      if (result.endsWith('\n')) {
        result += indent.repeat(level)
      }
      result += char
    }
    i++
  }
  
  // Convert quotes if needed
  if (singleQuotes.value) {
    result = result.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, "'$1'")
  }
  
  // Clean up
  result = result
    .replace(/\n\s*\n/g, '\n')
    .replace(/\{\s+\}/g, '{ }')
    .trim()
  
  return result
}

const minifyJs = (js) => {
  // Remove comments
  js = js
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
  
  // Preserve strings
  const strings = []
  js = js.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, (match) => {
    strings.push(match)
    return `__STRING_${strings.length - 1}__`
  })
  
  // Minify
  js = js
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}\[\]();,:<>=+\-*/%&|!?])\s*/g, '$1')
    .replace(/;\s*}/g, '}')
    .trim()
  
  // Restore strings
  js = js.replace(/__STRING_(\d+)__/g, (_, i) => strings[parseInt(i)])
  
  return js
}

const copyOutput = () => {
  navigator.clipboard.writeText(outputJs.value)
}

const clearInput = () => {
  inputJs.value = ''
  outputJs.value = ''
}

const pasteClipboard = async () => {
  try {
    inputJs.value = await navigator.clipboard.readText()
    formatJs()
  } catch (e) {
    console.error('Failed to paste')
  }
}

const loadSample = () => {
  inputJs.value = `function greet(name){const message="Hello, "+name+"!";console.log(message);return message;}const users=["Alice","Bob","Charlie"];users.forEach(function(user){greet(user);});class Calculator{constructor(){this.result=0;}add(n){this.result+=n;return this;}subtract(n){this.result-=n;return this;}getResult(){return this.result;}}`
  formatJs()
}

watch([mode, indentSize, useSemicolons, singleQuotes], formatJs)
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(234, 179, 8, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(249, 115, 22, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 900px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #eab308; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 100px; color: #eab308; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #eab308, #f97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(234, 179, 8, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.mode-tabs { display: flex; gap: 12px; margin-bottom: 24px; }
.tab { flex: 1; padding: 14px 20px; font-size: 15px; font-weight: 600; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 12px; color: #94a3b8; cursor: pointer; transition: all 0.3s; }
.tab.active { background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(249, 115, 22, 0.2)); border-color: #eab308; color: white; }

.options-row { display: flex; gap: 20px; margin-bottom: 20px; padding: 16px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; flex-wrap: wrap; }
.option { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #94a3b8; cursor: pointer; }
.option input[type="checkbox"] { accent-color: #eab308; }
.option select { padding: 8px 12px; font-size: 13px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: white; outline: none; }

.editor-section, .output-section { margin-bottom: 24px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px; flex-wrap: wrap; }
.section-header label { font-size: 14px; font-weight: 500; color: #e2e8f0; }
.actions { display: flex; gap: 8px; }
.action-btn { padding: 8px 14px; font-size: 12px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: #eab308; color: #eab308; }
.action-btn.primary { background: rgba(234, 179, 8, 0.2); border-color: rgba(234, 179, 8, 0.5); color: #eab308; }

.stats { display: flex; gap: 12px; font-size: 13px; color: #64748b; flex: 1; justify-content: flex-end; }
.stats .positive { color: #22c55e; }
.stats .negative { color: #ef4444; }

textarea { width: 100%; height: 180px; padding: 16px; font-size: 13px; font-family: 'Fira Code', monospace; line-height: 1.6; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: #e2e8f0; resize: vertical; outline: none; }
textarea:focus { border-color: #eab308; }

.output-code { width: 100%; height: 200px; padding: 16px; font-size: 13px; font-family: 'Fira Code', monospace; line-height: 1.6; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: #22c55e; overflow: auto; margin: 0; white-space: pre-wrap; word-break: break-all; }

.sample-section { text-align: center; margin-bottom: 24px; }
.sample-btn { padding: 12px 24px; font-size: 14px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 10px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.sample-btn:hover { border-color: #eab308; color: #eab308; }

.info-box { display: flex; gap: 16px; padding: 20px; background: rgba(234, 179, 8, 0.08); border: 1px solid rgba(234, 179, 8, 0.2); border-radius: 14px; }
.info-icon { font-size: 24px; }
.info-box strong { display: block; color: white; margin-bottom: 6px; }
.info-box p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; }
</style>
