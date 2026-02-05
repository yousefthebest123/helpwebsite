<template>
  <div class="tool-page min-h-screen">
    <div class="cyber-grid"></div>
    <div class="animated-bg"></div>

    <main class="container mx-auto px-6 pt-32 pb-16 relative z-10">
      <!-- Header -->
      <div class="text-center mb-10">
        <NuxtLink to="/tools" class="back-link">
          <span>←</span> Back to Tools
        </NuxtLink>
        <div class="tool-badge purple">
          <span>✨</span>
          <span>Text Tool</span>
        </div>
        <h1 class="page-title">
          <span class="title-gradient">Text Cleaner</span>
        </h1>
        <p class="page-subtitle">
          Remove formatting, fix whitespace, convert case, and clean up messy text instantly.
        </p>
      </div>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Input Section -->
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon input">📝</span>
              <h3>Input Text</h3>
            </div>
            <div class="panel-actions">
              <button class="action-btn" @click="pasteFromClipboard">
                <span>📋</span> Paste
              </button>
              <button class="action-btn danger" @click="clearInput">
                <span>🗑️</span> Clear
              </button>
            </div>
          </div>
          <textarea 
            v-model="inputText"
            class="text-area"
            placeholder="Paste or type your messy text here..."
          ></textarea>
          <div class="stats-bar">
            <span class="stat">{{ inputText.length }} chars</span>
            <span class="stat-divider">•</span>
            <span class="stat">{{ wordCount }} words</span>
            <span class="stat-divider">•</span>
            <span class="stat">{{ lineCount }} lines</span>
          </div>
        </div>

        <!-- Tools Section -->
        <div class="tools-panel">
          <!-- Remove Tools -->
          <div class="tool-group">
            <div class="group-header">
              <span class="group-icon red">✂️</span>
              <h4 class="group-title">Remove</h4>
            </div>
            <div class="tool-buttons">
              <button 
                v-for="tool in removeTools"
                :key="tool.id"
                :class="['tool-btn', { active: activeTools.includes(tool.id) }]"
                @click="toggleTool(tool.id)"
              >
                <span class="tool-icon">{{ tool.icon }}</span>
                <span>{{ tool.name }}</span>
              </button>
            </div>
          </div>

          <!-- Case Tools -->
          <div class="tool-group">
            <div class="group-header">
              <span class="group-icon blue">🔤</span>
              <h4 class="group-title">Transform Case</h4>
            </div>
            <div class="tool-buttons">
              <button 
                v-for="tool in caseTools"
                :key="tool.id"
                :class="['tool-btn case', { active: selectedCase === tool.id }]"
                @click="selectCase(tool.id)"
              >
                {{ tool.name }}
              </button>
            </div>
          </div>

          <!-- Format Tools -->
          <div class="tool-group">
            <div class="group-header">
              <span class="group-icon green">🔧</span>
              <h4 class="group-title">Fix & Format</h4>
            </div>
            <div class="tool-buttons">
              <button 
                v-for="tool in formatTools"
                :key="tool.id"
                :class="['tool-btn format', { active: activeTools.includes(tool.id) }]"
                @click="toggleTool(tool.id)"
              >
                <span class="tool-icon">{{ tool.icon }}</span>
                <span>{{ tool.name }}</span>
              </button>
            </div>
          </div>

          <button class="apply-btn" @click="applyAll">
            <span>✨</span>
            Apply Transformations
          </button>
        </div>

        <!-- Output Section -->
        <div class="panel-card">
          <div class="panel-header">
            <div class="panel-title">
              <span class="panel-icon output">✅</span>
              <h3>Cleaned Output</h3>
            </div>
            <div class="panel-actions">
              <button class="action-btn success" @click="copyOutput">
                <span>📋</span> Copy
              </button>
              <button class="action-btn" @click="downloadOutput">
                <span>📥</span> Download
              </button>
            </div>
          </div>
          <textarea 
            v-model="outputText"
            class="text-area output"
            readonly
            placeholder="Your cleaned text will appear here..."
          ></textarea>
          <div class="stats-bar">
            <span class="stat">{{ outputText.length }} chars</span>
            <span v-if="inputText && outputText" class="stat-change" :class="inputText.length > outputText.length ? 'removed' : 'added'">
              ({{ Math.abs(inputText.length - outputText.length) }} {{ inputText.length > outputText.length ? 'removed' : 'added' }})
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-card">
        <div class="section-header">
          <span class="section-icon orange">⚡</span>
          <h3 class="section-title">Quick Actions</h3>
        </div>
        <div class="quick-buttons">
          <button class="quick-btn" @click="quickAction('prettifyJson')">
            <span>📄</span> Format JSON
          </button>
          <button class="quick-btn" @click="quickAction('minifyJson')">
            <span>⚡</span> Minify JSON
          </button>
          <button class="quick-btn" @click="quickAction('sortLines')">
            <span>🔤</span> Sort Lines A-Z
          </button>
          <button class="quick-btn" @click="quickAction('reverseLines')">
            <span>🔄</span> Reverse Lines
          </button>
          <button class="quick-btn" @click="quickAction('uniqueLines')">
            <span>🎯</span> Remove Duplicates
          </button>
          <button class="quick-btn" @click="quickAction('numberLines')">
            <span>🔢</span> Number Lines
          </button>
          <button class="quick-btn" @click="quickAction('shuffleLines')">
            <span>🎲</span> Shuffle Lines
          </button>
        </div>
      </div>

      <!-- Find & Replace -->
      <div class="find-replace-card">
        <div class="section-header">
          <span class="section-icon cyan">🔍</span>
          <h3 class="section-title">Find & Replace</h3>
        </div>
        <div class="find-grid">
          <div class="find-input-group">
            <label class="find-label">Find</label>
            <input 
              type="text"
              v-model="findText"
              class="find-input"
              placeholder="Text to find..."
            />
          </div>
          <div class="find-input-group">
            <label class="find-label">Replace with</label>
            <input 
              type="text"
              v-model="replaceText"
              class="find-input"
              placeholder="Replacement text..."
            />
          </div>
        </div>
        <div class="find-options">
          <div class="checkboxes">
            <label class="checkbox-label">
              <input type="checkbox" v-model="findCaseSensitive" class="checkbox" />
              <span>Case sensitive</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="findRegex" class="checkbox" />
              <span>Use regex</span>
            </label>
          </div>
          <button class="replace-btn" @click="findAndReplace">
            <span>🔄</span> Replace All
          </button>
        </div>
        <p v-if="findText" class="match-count">
          <span class="match-number">{{ matchCount }}</span> matches found
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'Text Cleaner - QuickHelp.lol'
})

const inputText = ref('')
const outputText = ref('')
const activeTools = ref([])
const selectedCase = ref(null)
const findText = ref('')
const replaceText = ref('')
const findCaseSensitive = ref(false)
const findRegex = ref(false)

const removeTools = [
  { id: 'extraSpaces', name: 'Extra Spaces', icon: '⬜' },
  { id: 'lineBreaks', name: 'Line Breaks', icon: '↵' },
  { id: 'emptyLines', name: 'Empty Lines', icon: '📄' },
  { id: 'htmlTags', name: 'HTML Tags', icon: '🏷️' },
  { id: 'specialChars', name: 'Special Chars', icon: '✳️' },
  { id: 'numbers', name: 'Numbers', icon: '🔢' },
  { id: 'punctuation', name: 'Punctuation', icon: '.' },
  { id: 'urls', name: 'URLs', icon: '🔗' },
  { id: 'emails', name: 'Emails', icon: '📧' },
]

const caseTools = [
  { id: 'lower', name: 'lowercase', icon: 'aa' },
  { id: 'upper', name: 'UPPERCASE', icon: 'AA' },
  { id: 'title', name: 'Title Case', icon: 'Aa' },
  { id: 'sentence', name: 'Sentence case', icon: 'A.' },
  { id: 'toggle', name: 'tOGGLE cASE', icon: '⇅' },
]

const formatTools = [
  { id: 'trimLines', name: 'Trim Lines', icon: '✂️' },
  { id: 'trimWhitespace', name: 'Trim All', icon: '🧹' },
  { id: 'singleSpace', name: 'Single Space', icon: '1️⃣' },
  { id: 'smartQuotes', name: 'Fix Quotes', icon: '"' },
  { id: 'fixSpacing', name: 'Fix Punctuation', icon: '.' },
]

const wordCount = computed(() => {
  return inputText.value.trim().split(/\s+/).filter(w => w).length
})

const lineCount = computed(() => {
  return inputText.value.split('\n').length
})

const matchCount = computed(() => {
  if (!findText.value || !inputText.value) return 0
  try {
    if (findRegex.value) {
      const regex = new RegExp(findText.value, findCaseSensitive.value ? 'g' : 'gi')
      return (inputText.value.match(regex) || []).length
    } else {
      const flags = findCaseSensitive.value ? 'g' : 'gi'
      const escaped = findText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escaped, flags)
      return (inputText.value.match(regex) || []).length
    }
  } catch {
    return 0
  }
})

const toggleTool = (toolId) => {
  const index = activeTools.value.indexOf(toolId)
  if (index === -1) {
    activeTools.value.push(toolId)
  } else {
    activeTools.value.splice(index, 1)
  }
}

const selectCase = (caseId) => {
  selectedCase.value = selectedCase.value === caseId ? null : caseId
}

const applyAll = () => {
  let text = inputText.value

  for (const toolId of activeTools.value) {
    switch (toolId) {
      case 'extraSpaces': text = text.replace(/  +/g, ' '); break
      case 'lineBreaks': text = text.replace(/\n/g, ' '); break
      case 'emptyLines': text = text.replace(/^\s*[\r\n]/gm, ''); break
      case 'htmlTags': text = text.replace(/<[^>]*>/g, ''); break
      case 'specialChars': text = text.replace(/[^\w\s]/g, ''); break
      case 'numbers': text = text.replace(/[0-9]/g, ''); break
      case 'punctuation': text = text.replace(/[.,!?;:'"()\[\]{}]/g, ''); break
      case 'urls': text = text.replace(/https?:\/\/[^\s]+/g, ''); break
      case 'emails': text = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, ''); break
      case 'trimLines': text = text.split('\n').map(l => l.trim()).join('\n'); break
      case 'trimWhitespace': text = text.trim(); break
      case 'singleSpace': text = text.replace(/\s+/g, ' '); break
      case 'smartQuotes': text = text.replace(/[""]/g, '"').replace(/['']/g, "'"); break
      case 'fixSpacing':
        text = text.replace(/\s+([.,!?;:])/g, '$1')
        text = text.replace(/([.,!?;:])([^\s])/g, '$1 $2')
        break
    }
  }

  if (selectedCase.value) {
    switch (selectedCase.value) {
      case 'lower': text = text.toLowerCase(); break
      case 'upper': text = text.toUpperCase(); break
      case 'title': text = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); break
      case 'sentence': text = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break
      case 'toggle': text = text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''); break
    }
  }

  outputText.value = text
}

const quickAction = (action) => {
  let text = inputText.value
  
  switch (action) {
    case 'prettifyJson':
      try { text = JSON.stringify(JSON.parse(text), null, 2) }
      catch { alert('Invalid JSON'); return }
      break
    case 'minifyJson':
      try { text = JSON.stringify(JSON.parse(text)) }
      catch { alert('Invalid JSON'); return }
      break
    case 'sortLines': text = text.split('\n').sort().join('\n'); break
    case 'reverseLines': text = text.split('\n').reverse().join('\n'); break
    case 'uniqueLines': text = [...new Set(text.split('\n'))].join('\n'); break
    case 'numberLines': text = text.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n'); break
    case 'shuffleLines':
      const lines = text.split('\n')
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[lines[i], lines[j]] = [lines[j], lines[i]]
      }
      text = lines.join('\n')
      break
  }
  
  outputText.value = text
}

const findAndReplace = () => {
  if (!findText.value) return
  try {
    let regex
    if (findRegex.value) {
      regex = new RegExp(findText.value, findCaseSensitive.value ? 'g' : 'gi')
    } else {
      const escaped = findText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      regex = new RegExp(escaped, findCaseSensitive.value ? 'g' : 'gi')
    }
    outputText.value = inputText.value.replace(regex, replaceText.value)
  } catch (e) {
    alert('Invalid regex pattern')
  }
}

const pasteFromClipboard = async () => {
  try { inputText.value = await navigator.clipboard.readText() }
  catch { alert('Unable to access clipboard') }
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
}

const copyOutput = () => {
  navigator.clipboard.writeText(outputText.value)
}

const downloadOutput = () => {
  const blob = new Blob([outputText.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cleaned-text.txt'
  a.click()
  URL.revokeObjectURL(url)
}

watch([inputText, activeTools, selectedCase], () => {
  if (inputText.value) applyAll()
}, { deep: true })
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

.back-link:hover { color: #a78bfa; }

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

.tool-badge.purple {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15));
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
}

.page-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; }

.title-gradient {
  background: linear-gradient(135deg, #a78bfa, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle { color: #94a3b8; font-size: 18px; max-width: 700px; margin: 0 auto; line-height: 1.6; }

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 320px 1fr;
  gap: 24px;
  max-width: 100%;
  margin-bottom: 32px;
}

/* Panel Cards */
.panel-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.panel-title { display: flex; align-items: center; gap: 12px; }
.panel-title h3 { color: white; font-size: 16px; font-weight: 600; }
.panel-icon { font-size: 20px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.panel-icon.input { background: rgba(139, 92, 246, 0.15); }
.panel-icon.output { background: rgba(16, 185, 129, 0.15); }

.panel-actions { display: flex; gap: 8px; }

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 10px;
  color: #a78bfa;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover { background: rgba(124, 58, 237, 0.2); }
.action-btn.danger { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.2); color: #f87171; }
.action-btn.danger:hover { background: rgba(239, 68, 68, 0.2); }
.action-btn.success { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.2); color: #34d399; }
.action-btn.success:hover { background: rgba(16, 185, 129, 0.2); }

.text-area {
  flex: 1;
  min-height: 350px;
  padding: 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 14px;
  color: #e2e8f0;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  resize: none;
}

.text-area:focus { outline: none; border-color: rgba(139, 92, 246, 0.4); }
.text-area.output { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.1); }

.stats-bar { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.stat { color: #64748b; font-size: 12px; }
.stat-divider { color: #334155; }
.stat-change { font-size: 12px; }
.stat-change.removed { color: #f87171; }
.stat-change.added { color: #34d399; }

/* Tools Panel */
.tools-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tool-group {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  padding: 20px;
}

.group-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.group-icon { font-size: 16px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
.group-icon.red { background: rgba(239, 68, 68, 0.15); }
.group-icon.blue { background: rgba(59, 130, 246, 0.15); }
.group-icon.green { background: rgba(16, 185, 129, 0.15); }
.group-title { color: #94a3b8; font-size: 13px; font-weight: 600; }

.tool-buttons { display: flex; flex-wrap: wrap; gap: 8px; }

.tool-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.3s;
}

.tool-btn:hover { border-color: rgba(124, 58, 237, 0.4); color: white; }
.tool-btn.active { background: rgba(124, 58, 237, 0.15); border-color: #a78bfa; color: #a78bfa; }
.tool-btn.case.active { background: rgba(59, 130, 246, 0.15); border-color: #3b82f6; color: #60a5fa; }
.tool-btn.format.active { background: rgba(16, 185, 129, 0.15); border-color: #10b981; color: #34d399; }
.tool-icon { font-size: 12px; }

.apply-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.apply-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4); }

/* Quick Actions */
.quick-actions-card {
  max-width: 900px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(249, 115, 22, 0.15);
  border-radius: 20px;
  padding: 28px;
}

.section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; }
.section-icon { font-size: 22px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.section-icon.orange { background: rgba(249, 115, 22, 0.15); }
.section-icon.cyan { background: rgba(124, 58, 237, 0.15); }
.section-title { color: white; font-size: 17px; font-weight: 600; }

.quick-buttons { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }

.quick-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 12px;
  color: #fb923c;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-btn:hover { background: rgba(249, 115, 22, 0.15); border-color: #fb923c; }

/* Find & Replace */
.find-replace-card {
  max-width: 700px;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 20px;
  padding: 28px;
}

.find-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.find-input-group { display: flex; flex-direction: column; gap: 8px; }
.find-label { color: #94a3b8; font-size: 13px; font-weight: 500; }

.find-input {
  padding: 14px 16px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 12px;
  color: white;
  font-size: 14px;
}

.find-input:focus { outline: none; border-color: #a78bfa; }

.find-options { display: flex; justify-content: space-between; align-items: center; }
.checkboxes { display: flex; gap: 20px; }

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  accent-color: #a78bfa;
}

.replace-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.replace-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4); }

.match-count { text-align: center; color: #64748b; font-size: 14px; margin-top: 16px; }
.match-number { color: #a78bfa; font-weight: 600; }

@media (max-width: 1200px) {
  .main-grid { grid-template-columns: 1fr; }
  .tools-panel { flex-direction: row; flex-wrap: wrap; }
  .tool-group { flex: 1; min-width: 250px; }
}

@media (max-width: 768px) {
  .page-title { font-size: 2rem; }
  .find-grid { grid-template-columns: 1fr; }
  .find-options { flex-direction: column; gap: 16px; }
  .quick-buttons { flex-direction: column; }
  .quick-btn { justify-content: center; }
}
</style>
