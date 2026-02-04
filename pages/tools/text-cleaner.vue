<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>✨</span> Text Cleaner</h1>
        <p>Remove formatting, fix whitespace, convert case, and clean up messy text instantly.</p>
      </div>

      <div class="cleaner-layout">
        <!-- Input -->
        <div class="input-section glass">
          <div class="section-header">
            <h3>Input Text</h3>
            <div class="header-actions">
              <button class="btn btn-ghost btn-sm" @click="pasteFromClipboard">
                📋 Paste
              </button>
              <button class="btn btn-ghost btn-sm" @click="clearInput">
                🗑️ Clear
              </button>
            </div>
          </div>
          <textarea 
            v-model="inputText"
            class="text-area"
            placeholder="Paste or type your messy text here..."
          ></textarea>
          <div class="input-stats">
            <span>{{ inputText.length }} characters</span>
            <span>•</span>
            <span>{{ wordCount }} words</span>
            <span>•</span>
            <span>{{ lineCount }} lines</span>
          </div>
        </div>

        <!-- Tools -->
        <div class="tools-section">
          <div class="tools-category">
            <h4>✂️ Remove</h4>
            <div class="tools-grid">
              <button 
                v-for="tool in removeTools"
                :key="tool.id"
                :class="['tool-btn', { active: activeTools.includes(tool.id) }]"
                @click="toggleTool(tool.id)"
              >
                <span class="tool-icon">{{ tool.icon }}</span>
                <span class="tool-name">{{ tool.name }}</span>
              </button>
            </div>
          </div>

          <div class="tools-category">
            <h4>🔤 Transform Case</h4>
            <div class="tools-grid">
              <button 
                v-for="tool in caseTools"
                :key="tool.id"
                :class="['tool-btn', { active: selectedCase === tool.id }]"
                @click="selectCase(tool.id)"
              >
                <span class="tool-icon">{{ tool.icon }}</span>
                <span class="tool-name">{{ tool.name }}</span>
              </button>
            </div>
          </div>

          <div class="tools-category">
            <h4>🔧 Fix & Format</h4>
            <div class="tools-grid">
              <button 
                v-for="tool in formatTools"
                :key="tool.id"
                :class="['tool-btn', { active: activeTools.includes(tool.id) }]"
                @click="toggleTool(tool.id)"
              >
                <span class="tool-icon">{{ tool.icon }}</span>
                <span class="tool-name">{{ tool.name }}</span>
              </button>
            </div>
          </div>

          <button class="btn btn-primary btn-lg apply-btn" @click="applyAll">
            ✨ Apply Transformations
          </button>
        </div>

        <!-- Output -->
        <div class="output-section glass">
          <div class="section-header">
            <h3>Cleaned Output</h3>
            <div class="header-actions">
              <button class="btn btn-ghost btn-sm" @click="copyOutput">
                📋 Copy
              </button>
              <button class="btn btn-ghost btn-sm" @click="downloadOutput">
                📥 Download
              </button>
            </div>
          </div>
          <textarea 
            v-model="outputText"
            class="text-area"
            readonly
            placeholder="Your cleaned text will appear here..."
          ></textarea>
          <div class="output-stats">
            <span>{{ outputText.length }} characters</span>
            <span v-if="inputText && outputText">
              ({{ Math.abs(inputText.length - outputText.length) }} {{ inputText.length > outputText.length ? 'removed' : 'added' }})
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>⚡ Quick Actions</h3>
        <div class="quick-btns">
          <button class="btn btn-secondary" @click="quickAction('prettifyJson')">
            Format JSON
          </button>
          <button class="btn btn-secondary" @click="quickAction('minifyJson')">
            Minify JSON
          </button>
          <button class="btn btn-secondary" @click="quickAction('sortLines')">
            Sort Lines A-Z
          </button>
          <button class="btn btn-secondary" @click="quickAction('reverseLines')">
            Reverse Lines
          </button>
          <button class="btn btn-secondary" @click="quickAction('uniqueLines')">
            Remove Duplicate Lines
          </button>
          <button class="btn btn-secondary" @click="quickAction('numberLines')">
            Number Lines
          </button>
          <button class="btn btn-secondary" @click="quickAction('shuffleLines')">
            Shuffle Lines
          </button>
        </div>
      </div>

      <!-- Find & Replace -->
      <div class="find-replace glass">
        <h3>🔍 Find & Replace</h3>
        <div class="find-replace-inputs">
          <div class="input-group">
            <label>Find</label>
            <input 
              type="text"
              v-model="findText"
              class="input"
              placeholder="Text to find..."
            />
          </div>
          <div class="input-group">
            <label>Replace with</label>
            <input 
              type="text"
              v-model="replaceText"
              class="input"
              placeholder="Replacement text..."
            />
          </div>
          <div class="find-options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="findCaseSensitive" />
              Case sensitive
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="findRegex" />
              Use regex
            </label>
          </div>
          <button class="btn btn-primary" @click="findAndReplace">
            Replace All
          </button>
        </div>
        <div class="match-count" v-if="findText">
          {{ matchCount }} matches found
        </div>
      </div>
    </div>
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

  // Apply remove tools
  for (const toolId of activeTools.value) {
    switch (toolId) {
      case 'extraSpaces':
        text = text.replace(/  +/g, ' ')
        break
      case 'lineBreaks':
        text = text.replace(/\n/g, ' ')
        break
      case 'emptyLines':
        text = text.replace(/^\s*[\r\n]/gm, '')
        break
      case 'htmlTags':
        text = text.replace(/<[^>]*>/g, '')
        break
      case 'specialChars':
        text = text.replace(/[^\w\s]/g, '')
        break
      case 'numbers':
        text = text.replace(/[0-9]/g, '')
        break
      case 'punctuation':
        text = text.replace(/[.,!?;:'"()\[\]{}]/g, '')
        break
      case 'urls':
        text = text.replace(/https?:\/\/[^\s]+/g, '')
        break
      case 'emails':
        text = text.replace(/[\w.-]+@[\w.-]+\.\w+/g, '')
        break
      case 'trimLines':
        text = text.split('\n').map(l => l.trim()).join('\n')
        break
      case 'trimWhitespace':
        text = text.trim()
        break
      case 'singleSpace':
        text = text.replace(/\s+/g, ' ')
        break
      case 'smartQuotes':
        text = text.replace(/[""]/g, '"').replace(/['']/g, "'")
        break
      case 'fixSpacing':
        text = text.replace(/\s+([.,!?;:])/g, '$1')
        text = text.replace(/([.,!?;:])([^\s])/g, '$1 $2')
        break
    }
  }

  // Apply case transformation
  if (selectedCase.value) {
    switch (selectedCase.value) {
      case 'lower':
        text = text.toLowerCase()
        break
      case 'upper':
        text = text.toUpperCase()
        break
      case 'title':
        text = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
        break
      case 'sentence':
        text = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
        break
      case 'toggle':
        text = text.split('').map(c => 
          c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
        ).join('')
        break
    }
  }

  outputText.value = text
}

const quickAction = (action) => {
  let text = inputText.value
  
  switch (action) {
    case 'prettifyJson':
      try {
        const parsed = JSON.parse(text)
        text = JSON.stringify(parsed, null, 2)
      } catch {
        alert('Invalid JSON')
        return
      }
      break
    case 'minifyJson':
      try {
        const parsed = JSON.parse(text)
        text = JSON.stringify(parsed)
      } catch {
        alert('Invalid JSON')
        return
      }
      break
    case 'sortLines':
      text = text.split('\n').sort().join('\n')
      break
    case 'reverseLines':
      text = text.split('\n').reverse().join('\n')
      break
    case 'uniqueLines':
      text = [...new Set(text.split('\n'))].join('\n')
      break
    case 'numberLines':
      text = text.split('\n').map((l, i) => `${i + 1}. ${l}`).join('\n')
      break
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
  try {
    inputText.value = await navigator.clipboard.readText()
  } catch {
    alert('Unable to access clipboard')
  }
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

// Auto-apply on changes
watch([inputText, activeTools, selectedCase], () => {
  if (inputText.value) {
    applyAll()
  }
}, { deep: true })
</script>

<style scoped>
.tool-page {
  padding: 120px 0 80px;
  min-height: 100vh;
}

.tool-header {
  text-align: center;
  margin-bottom: 48px;
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary);
}

.tool-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.tool-header p {
  font-size: 16px;
  color: var(--text-muted);
}

.cleaner-layout {
  display: grid;
  grid-template-columns: 1fr 300px 1fr;
  gap: 24px;
  margin-bottom: 40px;
}

.input-section,
.output-section {
  padding: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.text-area {
  width: 100%;
  height: 350px;
  padding: 16px;
  font-size: 14px;
  font-family: monospace;
  line-height: 1.6;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  resize: vertical;
}

.text-area:focus {
  outline: none;
  border-color: var(--primary);
}

.input-stats,
.output-stats {
  margin-top: 12px;
  font-size: 12px;
  color: var(--text-muted);
  display: flex;
  gap: 8px;
}

.tools-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.tools-category h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.tools-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tool-btn {
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tool-btn:hover {
  border-color: var(--primary);
}

.tool-btn.active {
  background: rgba(99, 102, 241, 0.2);
  border-color: var(--primary);
}

.tool-icon {
  font-size: 14px;
}

.tool-name {
  font-size: 12px;
  color: white;
}

.apply-btn {
  margin-top: auto;
}

.quick-actions {
  margin-bottom: 40px;
  text-align: center;
}

.quick-actions h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.quick-btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.find-replace {
  max-width: 700px;
  margin: 0 auto;
  padding: 32px;
}

.find-replace h3 {
  font-size: 18px;
  margin-bottom: 24px;
}

.find-replace-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 16px;
  align-items: end;
}

.input-group label {
  display: block;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.find-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
}

.match-count {
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-muted);
  text-align: center;
}

@media (max-width: 1100px) {
  .cleaner-layout {
    grid-template-columns: 1fr;
  }

  .tools-section {
    order: -1;
  }
}

@media (max-width: 700px) {
  .find-replace-inputs {
    grid-template-columns: 1fr;
  }
}
</style>
