<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>📜</span> JSON Formatter</h1>
        <p>Format, validate, minify, and convert JSON data. Also supports JSON to CSV conversion.</p>
      </div>

      <div class="tabs">
        <button 
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.icon }} {{ tab.name }}
        </button>
      </div>

      <div class="formatter-layout">
        <!-- Input -->
        <div class="input-section glass">
          <div class="section-header">
            <h3>Input</h3>
            <div class="header-actions">
              <button class="btn btn-ghost btn-sm" @click="pasteJson">
                📋 Paste
              </button>
              <button class="btn btn-ghost btn-sm" @click="loadSample">
                📄 Sample
              </button>
              <button class="btn btn-ghost btn-sm" @click="clearInput">
                🗑️ Clear
              </button>
            </div>
          </div>
          
          <textarea 
            v-model="inputJson"
            class="json-input"
            placeholder="Paste your JSON here..."
            @input="validateJson"
          ></textarea>
          
          <div :class="['validation-status', validationStatus]">
            <span v-if="validationStatus === 'valid'">✓ Valid JSON</span>
            <span v-else-if="validationStatus === 'invalid'">✗ {{ errorMessage }}</span>
            <span v-else>Waiting for input...</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-section">
          <button class="btn btn-primary btn-lg action-btn" @click="formatJson">
            ✨ Format
          </button>
          <button class="btn btn-secondary action-btn" @click="minifyJson">
            📦 Minify
          </button>
          <button class="btn btn-secondary action-btn" @click="sortKeys">
            🔤 Sort Keys
          </button>
          <button class="btn btn-secondary action-btn" @click="convertToYaml" v-if="activeTab === 'convert'">
            ↔️ To YAML
          </button>
          <button class="btn btn-secondary action-btn" @click="convertToCsv" v-if="activeTab === 'convert'">
            📊 To CSV
          </button>
        </div>

        <!-- Output -->
        <div class="output-section glass">
          <div class="section-header">
            <h3>Output</h3>
            <div class="header-actions">
              <button class="btn btn-ghost btn-sm" @click="copyOutput">
                📋 Copy
              </button>
              <button class="btn btn-ghost btn-sm" @click="downloadOutput">
                📥 Download
              </button>
            </div>
          </div>
          
          <div class="output-container">
            <pre v-if="outputJson" class="json-output"><code>{{ outputJson }}</code></pre>
            <div v-else class="output-placeholder">
              Output will appear here...
            </div>
          </div>
        </div>
      </div>

      <!-- JSON Path Finder -->
      <div class="path-finder glass" v-if="activeTab === 'explore'">
        <h3>🔍 JSON Path Finder</h3>
        <p>Click on any value in the tree to get its JSON path.</p>
        
        <div class="json-tree" v-if="parsedJson">
          <JsonTreeNode 
            :data="parsedJson" 
            :path="'$'"
            @path-click="handlePathClick"
          />
        </div>
        
        <div class="path-result" v-if="selectedPath">
          <label>JSON Path:</label>
          <code @click="copyPath">{{ selectedPath }}</code>
        </div>
      </div>

      <!-- Stats -->
      <div class="json-stats" v-if="parsedJson">
        <div class="stat-item">
          <span class="stat-icon">📊</span>
          <span class="stat-value">{{ jsonStats.keys }}</span>
          <span class="stat-label">Keys</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📝</span>
          <span class="stat-value">{{ jsonStats.strings }}</span>
          <span class="stat-label">Strings</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🔢</span>
          <span class="stat-value">{{ jsonStats.numbers }}</span>
          <span class="stat-label">Numbers</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📦</span>
          <span class="stat-value">{{ jsonStats.arrays }}</span>
          <span class="stat-label">Arrays</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">🏠</span>
          <span class="stat-value">{{ jsonStats.objects }}</span>
          <span class="stat-label">Objects</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">💾</span>
          <span class="stat-value">{{ jsonStats.size }}</span>
          <span class="stat-label">Bytes</span>
        </div>
      </div>

      <!-- Format Options -->
      <div class="format-options">
        <h4>Format Options</h4>
        <div class="options-grid">
          <div class="option">
            <label>Indent Size</label>
            <select v-model="indentSize" class="input">
              <option :value="2">2 spaces</option>
              <option :value="4">4 spaces</option>
              <option value="tab">Tab</option>
            </select>
          </div>
          <div class="option">
            <label class="checkbox-label">
              <input type="checkbox" v-model="sortKeysOption" />
              Sort keys alphabetically
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'JSON Formatter - QuickHelp.lol'
})

// JsonTreeNode component defined inline
const JsonTreeNode = defineComponent({
  name: 'JsonTreeNode',
  props: ['data', 'path', 'keyName'],
  emits: ['path-click'],
  setup(props, { emit }) {
    const isExpanded = ref(true)
    
    const isObject = computed(() => props.data !== null && typeof props.data === 'object' && !Array.isArray(props.data))
    const isArray = computed(() => Array.isArray(props.data))
    const isPrimitive = computed(() => !isObject.value && !isArray.value)
    
    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }
    
    const handleClick = () => {
      emit('path-click', props.path)
    }
    
    const entries = computed(() => {
      if (isObject.value) return Object.entries(props.data)
      if (isArray.value) return props.data.map((v, i) => [i, v])
      return []
    })
    
    const getChildPath = (key) => {
      if (typeof key === 'number') return `${props.path}[${key}]`
      return `${props.path}.${key}`
    }
    
    return () => {
      if (isPrimitive.value) {
        const valueClass = typeof props.data === 'string' ? 'string' : 
                          typeof props.data === 'number' ? 'number' :
                          typeof props.data === 'boolean' ? 'boolean' : 'null'
        return h('span', { 
          class: ['tree-value', valueClass],
          onClick: handleClick
        }, JSON.stringify(props.data))
      }
      
      const bracket = isArray.value ? ['[', ']'] : ['{', '}']
      
      return h('div', { class: 'tree-node' }, [
        h('span', { 
          class: 'tree-toggle',
          onClick: toggleExpand
        }, isExpanded.value ? '▼' : '▶'),
        h('span', { class: 'tree-bracket' }, bracket[0]),
        isExpanded.value ? h('div', { class: 'tree-children' }, 
          entries.value.map(([key, value]) => 
            h('div', { class: 'tree-entry', key }, [
              h('span', { class: 'tree-key' }, isArray.value ? '' : `"${key}": `),
              h(JsonTreeNode, {
                data: value,
                path: getChildPath(key),
                onPathClick: (p) => emit('path-click', p)
              })
            ])
          )
        ) : h('span', { class: 'tree-collapsed' }, `${entries.value.length} items`),
        h('span', { class: 'tree-bracket' }, bracket[1])
      ])
    }
  }
})

const tabs = [
  { id: 'format', name: 'Format', icon: '✨' },
  { id: 'convert', name: 'Convert', icon: '↔️' },
  { id: 'explore', name: 'Explore', icon: '🔍' },
]

const activeTab = ref('format')
const inputJson = ref('')
const outputJson = ref('')
const parsedJson = ref(null)
const validationStatus = ref('empty')
const errorMessage = ref('')
const selectedPath = ref('')
const indentSize = ref(2)
const sortKeysOption = ref(false)

const jsonStats = computed(() => {
  if (!parsedJson.value) return { keys: 0, strings: 0, numbers: 0, arrays: 0, objects: 0, size: 0 }
  
  let keys = 0, strings = 0, numbers = 0, arrays = 0, objects = 0
  
  const countStats = (data) => {
    if (data === null) return
    if (typeof data === 'string') strings++
    else if (typeof data === 'number') numbers++
    else if (Array.isArray(data)) {
      arrays++
      data.forEach(countStats)
    } else if (typeof data === 'object') {
      objects++
      keys += Object.keys(data).length
      Object.values(data).forEach(countStats)
    }
  }
  
  countStats(parsedJson.value)
  
  return {
    keys,
    strings,
    numbers,
    arrays,
    objects,
    size: new Blob([inputJson.value]).size
  }
})

const validateJson = () => {
  if (!inputJson.value.trim()) {
    validationStatus.value = 'empty'
    parsedJson.value = null
    return
  }
  
  try {
    parsedJson.value = JSON.parse(inputJson.value)
    validationStatus.value = 'valid'
    errorMessage.value = ''
  } catch (e) {
    validationStatus.value = 'invalid'
    errorMessage.value = e.message
    parsedJson.value = null
  }
}

const getIndent = () => {
  return indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value)
}

const sortObjectKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys)
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((sorted, key) => {
      sorted[key] = sortObjectKeys(obj[key])
      return sorted
    }, {})
  }
  return obj
}

const formatJson = () => {
  if (!parsedJson.value) return
  
  let data = parsedJson.value
  if (sortKeysOption.value) {
    data = sortObjectKeys(data)
  }
  
  outputJson.value = JSON.stringify(data, null, getIndent())
}

const minifyJson = () => {
  if (!parsedJson.value) return
  outputJson.value = JSON.stringify(parsedJson.value)
}

const sortKeys = () => {
  if (!parsedJson.value) return
  const sorted = sortObjectKeys(parsedJson.value)
  outputJson.value = JSON.stringify(sorted, null, getIndent())
}

const convertToYaml = () => {
  if (!parsedJson.value) return
  
  const toYaml = (obj, indent = 0) => {
    const spaces = '  '.repeat(indent)
    let yaml = ''
    
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === 'object' && item !== null) {
          yaml += `${spaces}-\n${toYaml(item, indent + 1)}`
        } else {
          yaml += `${spaces}- ${JSON.stringify(item)}\n`
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          yaml += `${spaces}${key}:\n${toYaml(value, indent + 1)}`
        } else {
          yaml += `${spaces}${key}: ${JSON.stringify(value)}\n`
        }
      }
    }
    
    return yaml
  }
  
  outputJson.value = toYaml(parsedJson.value)
}

const convertToCsv = () => {
  if (!parsedJson.value) return
  
  const data = Array.isArray(parsedJson.value) ? parsedJson.value : [parsedJson.value]
  
  if (data.length === 0 || typeof data[0] !== 'object') {
    outputJson.value = 'Cannot convert: JSON must be an array of objects'
    return
  }
  
  const headers = Object.keys(data[0])
  const rows = data.map(row => 
    headers.map(h => {
      const val = row[h]
      if (typeof val === 'string' && (val.includes(',') || val.includes('"'))) {
        return `"${val.replace(/"/g, '""')}"`
      }
      return val ?? ''
    }).join(',')
  )
  
  outputJson.value = [headers.join(','), ...rows].join('\n')
}

const handlePathClick = (path) => {
  selectedPath.value = path
}

const copyPath = () => {
  navigator.clipboard.writeText(selectedPath.value)
}

const pasteJson = async () => {
  try {
    inputJson.value = await navigator.clipboard.readText()
    validateJson()
  } catch {
    alert('Unable to access clipboard')
  }
}

const loadSample = () => {
  inputJson.value = JSON.stringify({
    name: "QuickHelp",
    version: "1.0.0",
    features: ["tools", "mental-health", "learning"],
    config: {
      theme: "dark",
      animations: true,
      notifications: {
        enabled: true,
        sound: false
      }
    },
    stats: {
      users: 1000,
      tools: 35,
      rating: 4.9
    }
  }, null, 2)
  validateJson()
}

const clearInput = () => {
  inputJson.value = ''
  outputJson.value = ''
  parsedJson.value = null
  validationStatus.value = 'empty'
}

const copyOutput = () => {
  navigator.clipboard.writeText(outputJson.value)
}

const downloadOutput = () => {
  const ext = activeTab.value === 'convert' && outputJson.value.includes(':') ? 'yaml' : 'json'
  const blob = new Blob([outputJson.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `output.${ext}`
  a.click()
  URL.revokeObjectURL(url)
}

watch(inputJson, validateJson)
</script>

<style scoped>
.tool-page {
  padding: 120px 0 80px;
  min-height: 100vh;
}

.tool-header {
  text-align: center;
  margin-bottom: 32px;
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

.tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 32px;
}

.tab {
  padding: 12px 24px;
  font-size: 14px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  border-color: var(--primary);
  color: white;
}

.tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.formatter-layout {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
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

.json-input {
  width: 100%;
  height: 400px;
  padding: 16px;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', monospace;
  line-height: 1.6;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  resize: vertical;
}

.json-input:focus {
  outline: none;
  border-color: var(--primary);
}

.validation-status {
  margin-top: 12px;
  padding: 8px 14px;
  font-size: 13px;
  border-radius: 8px;
}

.validation-status.valid {
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
}

.validation-status.invalid {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
}

.validation-status.empty {
  background: var(--surface);
  color: var(--text-muted);
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 60px;
}

.action-btn {
  min-width: 140px;
}

.output-container {
  height: 400px;
  overflow: auto;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.json-output {
  margin: 0;
  padding: 16px;
  font-size: 13px;
  font-family: 'Monaco', 'Menlo', monospace;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.output-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.path-finder {
  padding: 24px;
  margin-bottom: 40px;
}

.path-finder h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.path-finder p {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.json-tree {
  background: var(--surface);
  border-radius: 12px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  overflow: auto;
  max-height: 400px;
}

.path-result {
  margin-top: 20px;
  padding: 16px;
  background: var(--surface);
  border-radius: 10px;
}

.path-result label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.path-result code {
  display: block;
  padding: 12px;
  background: var(--background);
  border-radius: 8px;
  cursor: pointer;
}

.path-result code:hover {
  background: var(--primary);
}

/* Tree styles */
:deep(.tree-node) {
  padding-left: 20px;
}

:deep(.tree-toggle) {
  cursor: pointer;
  margin-right: 8px;
  color: var(--text-muted);
}

:deep(.tree-bracket) {
  color: var(--text-muted);
}

:deep(.tree-children) {
  padding-left: 20px;
}

:deep(.tree-entry) {
  padding: 2px 0;
}

:deep(.tree-key) {
  color: #a78bfa;
}

:deep(.tree-value) {
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 4px;
}

:deep(.tree-value:hover) {
  background: rgba(124, 58, 237, 0.2);
}

:deep(.tree-value.string) {
  color: #86efac;
}

:deep(.tree-value.number) {
  color: #fde047;
}

:deep(.tree-value.boolean) {
  color: #f472b6;
}

:deep(.tree-value.null) {
  color: #94a3b8;
}

:deep(.tree-collapsed) {
  color: var(--text-muted);
  font-style: italic;
}

.json-stats {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 40px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: var(--surface);
  border-radius: 12px;
}

.stat-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.format-options {
  max-width: 500px;
  margin: 0 auto;
}

.format-options h4 {
  font-size: 16px;
  margin-bottom: 16px;
  text-align: center;
}

.options-grid {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: center;
}

.option select {
  width: auto;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input {
  width: 16px;
  height: 16px;
}

@media (max-width: 1000px) {
  .formatter-layout {
    grid-template-columns: 1fr;
  }

  .actions-section {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    padding-top: 0;
  }

  .json-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .json-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .options-grid {
    flex-direction: column;
  }
}
</style>
