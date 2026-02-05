<template>
  <div class="tool-page">
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <main class="tool-container">
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">← Back to Tools</NuxtLink>
        <div class="badge"><span>🔍</span> Developer Tool</div>
        <h1><span class="gradient-text">Regex Tester</span></h1>
        <p>Test and debug regular expressions in real-time with match highlighting.</p>
      </header>

      <div class="tool-card">
        <div class="regex-input-section">
          <label>Regular Expression</label>
          <div class="regex-row">
            <span class="regex-delimiter">/</span>
            <input
              v-model="pattern"
              type="text"
              placeholder="Enter your regex pattern..."
              class="pattern-input"
            />
            <span class="regex-delimiter">/</span>
            <input
              v-model="flags"
              type="text"
              placeholder="gi"
              class="flags-input"
              maxlength="6"
            />
          </div>
          <div v-if="regexError" class="error-msg">⚠️ {{ regexError }}</div>
        </div>

        <div class="test-string-section">
          <label>Test String</label>
          <div class="test-area" ref="testArea">
            <div class="highlighted-text" v-html="highlightedText"></div>
            <textarea
              v-model="testString"
              placeholder="Enter text to test against..."
              rows="6"
              class="test-input"
            ></textarea>
          </div>
        </div>

        <div class="results-section">
          <div class="results-header">
            <h3>📊 Match Results</h3>
            <span class="match-count" :class="{ 'has-matches': matches.length > 0 }">
              {{ matches.length }} {{ matches.length === 1 ? 'match' : 'matches' }}
            </span>
          </div>

          <div v-if="matches.length > 0" class="matches-list">
            <div v-for="(match, index) in matches" :key="index" class="match-item">
              <div class="match-header">
                <span class="match-number">#{{ index + 1 }}</span>
                <span class="match-position">Index: {{ match.index }}</span>
              </div>
              <code class="match-value">{{ match.value }}</code>
              <div v-if="match.groups && Object.keys(match.groups).length > 0" class="match-groups">
                <span class="groups-label">Groups:</span>
                <div v-for="(value, name) in match.groups" :key="name" class="group-item">
                  <span class="group-name">{{ name }}:</span>
                  <code>{{ value }}</code>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="no-matches">
            <span class="no-match-icon">🔍</span>
            <p>No matches found</p>
          </div>
        </div>

        <div class="cheatsheet">
          <h4>📖 Quick Reference</h4>
          <div class="cheatsheet-grid">
            <div class="cheat-item" v-for="item in cheatsheet" :key="item.pattern">
              <code @click="insertPattern(item.pattern)">{{ item.pattern }}</code>
              <span>{{ item.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({ title: 'Regex Tester - QuickHelp.lol' })

const pattern = ref('')
const flags = ref('g')
const testString = ref('Hello World! This is a test string with numbers 123 and email test@example.com')
const regexError = ref('')
const matches = ref([])

const cheatsheet = [
  { pattern: '.', desc: 'Any character' },
  { pattern: '\\d', desc: 'Digit (0-9)' },
  { pattern: '\\w', desc: 'Word character' },
  { pattern: '\\s', desc: 'Whitespace' },
  { pattern: '^', desc: 'Start of string' },
  { pattern: '$', desc: 'End of string' },
  { pattern: '*', desc: '0 or more' },
  { pattern: '+', desc: '1 or more' },
  { pattern: '?', desc: '0 or 1' },
  { pattern: '[abc]', desc: 'Character set' },
  { pattern: '(group)', desc: 'Capture group' },
  { pattern: '(?:abc)', desc: 'Non-capturing' },
]

const insertPattern = (p) => {
  pattern.value += p
}

const highlightedText = computed(() => {
  if (!pattern.value || !testString.value || regexError.value) {
    return escapeHtml(testString.value)
  }
  
  try {
    const regex = new RegExp(pattern.value, flags.value)
    return testString.value.replace(regex, (match) => {
      return `<mark class="highlight">${escapeHtml(match)}</mark>`
    })
  } catch {
    return escapeHtml(testString.value)
  }
})

const escapeHtml = (text) => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const updateMatches = () => {
  regexError.value = ''
  matches.value = []
  
  if (!pattern.value || !testString.value) return
  
  try {
    const regex = new RegExp(pattern.value, flags.value.includes('g') ? flags.value : flags.value + 'g')
    let match
    const results = []
    
    while ((match = regex.exec(testString.value)) !== null) {
      results.push({
        value: match[0],
        index: match.index,
        groups: match.groups || {}
      })
      if (!flags.value.includes('g')) break
    }
    
    matches.value = results
  } catch (e) {
    regexError.value = e.message
  }
}

watch([pattern, flags, testString], updateMatches, { immediate: true })
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(124, 58, 237, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 900px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; transition: color 0.2s; }
.back-btn:hover { color: #10b981; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 100px; color: #10b981; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #10b981, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.regex-input-section, .test-string-section, .results-section { margin-bottom: 28px; }
label { display: block; font-size: 14px; font-weight: 600; color: #e2e8f0; margin-bottom: 10px; }

.regex-row { display: flex; align-items: center; gap: 4px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; padding: 4px 16px; }
.regex-delimiter { font-size: 24px; color: #10b981; font-weight: 300; }
.pattern-input { flex: 1; padding: 14px 8px; font-size: 16px; font-family: 'Fira Code', monospace; background: transparent; border: none; color: white; outline: none; }
.flags-input { width: 60px; padding: 14px 8px; font-size: 16px; font-family: 'Fira Code', monospace; background: rgba(30, 41, 59, 0.8); border: none; border-radius: 8px; color: #fbbf24; text-align: center; outline: none; }
.error-msg { color: #f87171; font-size: 13px; margin-top: 10px; padding: 10px; background: rgba(239, 68, 68, 0.1); border-radius: 8px; }

.test-area { position: relative; }
.highlighted-text { position: absolute; top: 0; left: 0; right: 0; padding: 16px; font-size: 14px; font-family: 'Fira Code', monospace; line-height: 1.6; color: transparent; white-space: pre-wrap; word-wrap: break-word; pointer-events: none; }
.highlighted-text :deep(.highlight) { background: rgba(16, 185, 129, 0.3); color: #10b981; border-radius: 2px; padding: 0 2px; }
.test-input { width: 100%; padding: 16px; font-size: 14px; font-family: 'Fira Code', monospace; line-height: 1.6; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: white; resize: vertical; outline: none; }
.test-input:focus { border-color: #10b981; }

.results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.results-header h3 { font-size: 18px; color: white; }
.match-count { padding: 6px 14px; font-size: 13px; font-weight: 600; background: rgba(100, 116, 139, 0.2); border-radius: 20px; color: #94a3b8; }
.match-count.has-matches { background: rgba(16, 185, 129, 0.2); color: #10b981; }

.matches-list { display: flex; flex-direction: column; gap: 12px; max-height: 300px; overflow-y: auto; }
.match-item { padding: 16px; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 12px; }
.match-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
.match-number { font-weight: 600; color: #10b981; }
.match-position { font-size: 12px; color: #64748b; }
.match-value { display: block; padding: 10px; background: rgba(16, 185, 129, 0.1); border-radius: 8px; color: #10b981; font-size: 14px; word-break: break-all; }
.match-groups { margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(100, 116, 139, 0.2); }
.groups-label { font-size: 12px; color: #64748b; }
.group-item { display: flex; gap: 8px; margin-top: 6px; }
.group-name { color: #fbbf24; font-size: 13px; }
.group-item code { color: white; font-size: 13px; }

.no-matches { text-align: center; padding: 40px; color: #64748b; }
.no-match-icon { font-size: 48px; display: block; margin-bottom: 12px; opacity: 0.5; }

.cheatsheet { margin-top: 28px; padding-top: 24px; border-top: 1px solid rgba(100, 116, 139, 0.2); }
.cheatsheet h4 { font-size: 16px; color: white; margin-bottom: 16px; }
.cheatsheet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
.cheat-item { display: flex; flex-direction: column; gap: 4px; padding: 12px; background: rgba(30, 41, 59, 0.5); border-radius: 10px; }
.cheat-item code { color: #10b981; font-size: 14px; cursor: pointer; transition: color 0.2s; }
.cheat-item code:hover { color: #34d399; }
.cheat-item span { font-size: 11px; color: #64748b; }
</style>
