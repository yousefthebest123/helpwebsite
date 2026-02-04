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
        <div class="badge"><span>📊</span> Compare Tool</div>
        <h1><span class="gradient-text">Text Diff Checker</span></h1>
        <p>Compare two texts and see the differences highlighted.</p>
      </header>

      <div class="tool-card">
        <div class="inputs-grid">
          <div class="input-section">
            <label>Original Text</label>
            <textarea
              v-model="text1"
              placeholder="Paste your original text here..."
              rows="12"
            ></textarea>
          </div>
          <div class="input-section">
            <label>Modified Text</label>
            <textarea
              v-model="text2"
              placeholder="Paste your modified text here..."
              rows="12"
            ></textarea>
          </div>
        </div>

        <div class="actions-row">
          <button @click="compare" class="compare-btn">
            <span>🔍</span> Compare Texts
          </button>
          <div class="options">
            <label class="checkbox-label">
              <input type="checkbox" v-model="ignoreWhitespace" />
              <span>Ignore whitespace</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="ignoreCase" />
              <span>Ignore case</span>
            </label>
          </div>
        </div>

        <div v-if="compared" class="results-section">
          <div class="stats-row">
            <div class="stat">
              <span class="stat-value added">+{{ stats.added }}</span>
              <span class="stat-label">Added</span>
            </div>
            <div class="stat">
              <span class="stat-value removed">-{{ stats.removed }}</span>
              <span class="stat-label">Removed</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ stats.unchanged }}</span>
              <span class="stat-label">Unchanged</span>
            </div>
          </div>

          <div class="diff-view">
            <div class="diff-header">
              <span>Diff Output</span>
              <button @click="copyDiff" class="copy-btn">
                {{ copied ? '✓ Copied' : '📋 Copy' }}
              </button>
            </div>
            <div class="diff-content">
              <div 
                v-for="(line, i) in diffLines" 
                :key="i" 
                :class="['diff-line', line.type]"
              >
                <span class="line-number">{{ i + 1 }}</span>
                <span class="line-prefix">{{ line.prefix }}</span>
                <span class="line-content">{{ line.content }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <span class="empty-icon">📝</span>
          <p>Enter two texts above and click "Compare Texts" to see the differences.</p>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
useHead({ title: 'Text Diff Checker - QuickHelp.lol' })

const text1 = ref('')
const text2 = ref('')
const ignoreWhitespace = ref(false)
const ignoreCase = ref(false)
const compared = ref(false)
const diffLines = ref([])
const copied = ref(false)
const stats = ref({ added: 0, removed: 0, unchanged: 0 })

const compare = () => {
  let t1 = text1.value
  let t2 = text2.value
  
  if (ignoreWhitespace.value) {
    t1 = t1.replace(/\s+/g, ' ').trim()
    t2 = t2.replace(/\s+/g, ' ').trim()
  }
  
  if (ignoreCase.value) {
    t1 = t1.toLowerCase()
    t2 = t2.toLowerCase()
  }
  
  const lines1 = t1.split('\n')
  const lines2 = t2.split('\n')
  
  // Simple diff algorithm
  const result = []
  let added = 0, removed = 0, unchanged = 0
  
  const maxLines = Math.max(lines1.length, lines2.length)
  
  for (let i = 0; i < maxLines; i++) {
    const l1 = lines1[i]
    const l2 = lines2[i]
    
    if (l1 === undefined && l2 !== undefined) {
      result.push({ type: 'added', prefix: '+', content: l2 })
      added++
    } else if (l2 === undefined && l1 !== undefined) {
      result.push({ type: 'removed', prefix: '-', content: l1 })
      removed++
    } else if (l1 === l2) {
      result.push({ type: 'unchanged', prefix: ' ', content: l1 })
      unchanged++
    } else {
      result.push({ type: 'removed', prefix: '-', content: l1 })
      result.push({ type: 'added', prefix: '+', content: l2 })
      added++
      removed++
    }
  }
  
  diffLines.value = result
  stats.value = { added, removed, unchanged }
  compared.value = true
}

const copyDiff = () => {
  const text = diffLines.value.map(l => l.prefix + ' ' + l.content).join('\n')
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%); top: -100px; left: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(236, 72, 153, 0.2), transparent 70%); bottom: -100px; right: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 1100px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #8b5cf6; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 100px; color: #8b5cf6; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.inputs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
@media (max-width: 768px) { .inputs-grid { grid-template-columns: 1fr; } }

.input-section label { display: block; font-size: 14px; font-weight: 600; color: #e2e8f0; margin-bottom: 10px; }
.input-section textarea { width: 100%; padding: 16px; font-size: 14px; font-family: 'Fira Code', monospace; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: white; resize: vertical; outline: none; }
.input-section textarea:focus { border-color: #8b5cf6; }

.actions-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 28px; }
.compare-btn { display: flex; align-items: center; gap: 10px; padding: 14px 28px; font-size: 15px; font-weight: 600; background: linear-gradient(135deg, #8b5cf6, #ec4899); border: none; border-radius: 12px; color: white; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4); }
.compare-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 30px rgba(139, 92, 246, 0.5); }

.options { display: flex; gap: 20px; }
.checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #94a3b8; cursor: pointer; }
.checkbox-label input { width: 18px; height: 18px; accent-color: #8b5cf6; }

.stats-row { display: flex; gap: 24px; margin-bottom: 24px; }
.stat { display: flex; flex-direction: column; align-items: center; padding: 16px 24px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; }
.stat-value { font-size: 24px; font-weight: 700; color: white; }
.stat-value.added { color: #10b981; }
.stat-value.removed { color: #f87171; }
.stat-label { font-size: 12px; color: #64748b; }

.diff-view { background: rgba(30, 41, 59, 0.5); border-radius: 14px; overflow: hidden; }
.diff-header { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-bottom: 1px solid rgba(100, 116, 139, 0.2); }
.diff-header span { font-size: 14px; font-weight: 600; color: #e2e8f0; }
.copy-btn { padding: 6px 14px; font-size: 12px; background: rgba(100, 116, 139, 0.2); border: none; border-radius: 6px; color: #94a3b8; cursor: pointer; }
.copy-btn:hover { color: white; }

.diff-content { max-height: 400px; overflow-y: auto; font-family: 'Fira Code', monospace; font-size: 13px; }
.diff-line { display: flex; padding: 4px 16px; border-bottom: 1px solid rgba(100, 116, 139, 0.1); }
.diff-line.added { background: rgba(16, 185, 129, 0.1); }
.diff-line.removed { background: rgba(248, 113, 113, 0.1); }
.line-number { width: 40px; color: #64748b; user-select: none; }
.line-prefix { width: 20px; font-weight: 600; }
.diff-line.added .line-prefix { color: #10b981; }
.diff-line.removed .line-prefix { color: #f87171; }
.line-content { flex: 1; color: #e2e8f0; }
.diff-line.added .line-content { color: #10b981; }
.diff-line.removed .line-content { color: #f87171; }

.empty-state { text-align: center; padding: 60px 20px; color: #64748b; }
.empty-icon { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.5; }
</style>
