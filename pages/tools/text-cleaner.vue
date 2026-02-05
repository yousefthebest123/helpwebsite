<template>
  <div class="min-h-screen">
    <main class="container mx-auto px-6 pt-20 pb-16">
      <!-- Header -->
      <div class="text-center mb-10">
        <NuxtLink to="/tools" class="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm mb-6 transition-colors">
          <span>←</span> Back to Tools
        </NuxtLink>
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-6 mx-auto block w-fit">
          <span>✨</span>
          <span>Text Tool</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Text Cleaner</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Remove formatting, fix whitespace, convert case, and clean up messy text instantly.
        </p>
      </div>

      <!-- Main Content -->
      <div class="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <!-- Input Section -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Input Text</h3>
            <div class="flex gap-2">
              <button class="btn btn-ghost btn-sm text-cyan-400" @click="pasteFromClipboard">
                📋 Paste
              </button>
              <button class="btn btn-ghost btn-sm text-slate-400" @click="clearInput">
                🗑️ Clear
              </button>
            </div>
          </div>
          <textarea 
            v-model="inputText"
            class="input min-h-[350px] font-mono text-sm resize-none"
            placeholder="Paste or type your messy text here..."
          ></textarea>
          <div class="mt-3 flex gap-4 text-xs text-slate-500">
            <span>{{ inputText.length }} characters</span>
            <span>•</span>
            <span>{{ wordCount }} words</span>
            <span>•</span>
            <span>{{ lineCount }} lines</span>
          </div>
        </div>

        <!-- Tools Section -->
        <div class="space-y-6">
          <!-- Remove Tools -->
          <div class="glass-card p-5">
            <h4 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <span class="text-red-400">✂️</span> Remove
            </h4>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="tool in removeTools"
                :key="tool.id"
                :class="[
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all border',
                  activeTools.includes(tool.id) 
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                ]"
                @click="toggleTool(tool.id)"
              >
                <span class="mr-1">{{ tool.icon }}</span>
                {{ tool.name }}
              </button>
            </div>
          </div>

          <!-- Case Tools -->
          <div class="glass-card p-5">
            <h4 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <span class="text-blue-400">🔤</span> Transform Case
            </h4>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="tool in caseTools"
                :key="tool.id"
                :class="[
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all border',
                  selectedCase === tool.id 
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                ]"
                @click="selectCase(tool.id)"
              >
                {{ tool.name }}
              </button>
            </div>
          </div>

          <!-- Format Tools -->
          <div class="glass-card p-5">
            <h4 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
              <span class="text-green-400">🔧</span> Fix & Format
            </h4>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="tool in formatTools"
                :key="tool.id"
                :class="[
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all border',
                  activeTools.includes(tool.id) 
                    ? 'bg-green-500/20 border-green-500/50 text-green-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                ]"
                @click="toggleTool(tool.id)"
              >
                <span class="mr-1">{{ tool.icon }}</span>
                {{ tool.name }}
              </button>
            </div>
          </div>

          <button class="w-full btn btn-primary btn-lg" @click="applyAll">
            ✨ Apply Transformations
          </button>
        </div>

        <!-- Output Section -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-white">Cleaned Output</h3>
            <div class="flex gap-2">
              <button class="btn btn-ghost btn-sm text-cyan-400" @click="copyOutput">
                📋 Copy
              </button>
              <button class="btn btn-ghost btn-sm text-slate-400" @click="downloadOutput">
                📥 Download
              </button>
            </div>
          </div>
          <textarea 
            v-model="outputText"
            class="input min-h-[350px] font-mono text-sm resize-none"
            readonly
            placeholder="Your cleaned text will appear here..."
          ></textarea>
          <div class="mt-3 flex gap-4 text-xs text-slate-500">
            <span>{{ outputText.length }} characters</span>
            <span v-if="inputText && outputText">
              ({{ Math.abs(inputText.length - outputText.length) }} {{ inputText.length > outputText.length ? 'removed' : 'added' }})
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="max-w-4xl mx-auto mt-10">
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h3>
          <div class="flex flex-wrap justify-center gap-3">
            <button class="btn btn-secondary" @click="quickAction('prettifyJson')">Format JSON</button>
            <button class="btn btn-secondary" @click="quickAction('minifyJson')">Minify JSON</button>
            <button class="btn btn-secondary" @click="quickAction('sortLines')">Sort Lines A-Z</button>
            <button class="btn btn-secondary" @click="quickAction('reverseLines')">Reverse Lines</button>
            <button class="btn btn-secondary" @click="quickAction('uniqueLines')">Remove Duplicates</button>
            <button class="btn btn-secondary" @click="quickAction('numberLines')">Number Lines</button>
            <button class="btn btn-secondary" @click="quickAction('shuffleLines')">Shuffle Lines</button>
          </div>
        </div>
      </div>

      <!-- Find & Replace -->
      <div class="max-w-3xl mx-auto mt-8">
        <div class="glass-card p-6">
          <h3 class="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <span>🔍</span> Find & Replace
          </h3>
          <div class="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Find</label>
              <input 
                type="text"
                v-model="findText"
                class="input"
                placeholder="Text to find..."
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Replace with</label>
              <input 
                type="text"
                v-model="replaceText"
                class="input"
                placeholder="Replacement text..."
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex gap-4">
              <label class="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" v-model="findCaseSensitive" class="rounded" />
                Case sensitive
              </label>
              <label class="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input type="checkbox" v-model="findRegex" class="rounded" />
                Use regex
              </label>
            </div>
            <button class="btn btn-primary" @click="findAndReplace">
              Replace All
            </button>
          </div>
          <p v-if="findText" class="text-center text-sm text-slate-500 mt-4">
            {{ matchCount }} matches found
          </p>
        </div>
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
.gradient-text {
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 20px;
}
</style>
