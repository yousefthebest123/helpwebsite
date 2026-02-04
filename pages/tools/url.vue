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
        <div class="badge"><span>🔗</span> Web Tool</div>
        <h1><span class="gradient-text">URL Encoder/Decoder</span></h1>
        <p>Encode or decode URLs and query parameters safely.</p>
      </header>

      <div class="tool-card">
        <!-- Mode Tabs -->
        <div class="mode-tabs">
          <button 
            @click="mode = 'encode'" 
            :class="['tab', { active: mode === 'encode' }]"
          >
            🔐 Encode URL
          </button>
          <button 
            @click="mode = 'decode'" 
            :class="['tab', { active: mode === 'decode' }]"
          >
            🔓 Decode URL
          </button>
        </div>

        <!-- Encoding Options -->
        <div class="options" v-if="mode === 'encode'">
          <label class="option-item">
            <input type="radio" v-model="encodeType" value="component" />
            <span class="option-label">
              <strong>encodeURIComponent</strong>
              <small>Encode all special characters (use for query params)</small>
            </span>
          </label>
          <label class="option-item">
            <input type="radio" v-model="encodeType" value="uri" />
            <span class="option-label">
              <strong>encodeURI</strong>
              <small>Preserve URL structure (use for full URLs)</small>
            </span>
          </label>
        </div>

        <div class="converter-layout">
          <div class="input-section">
            <div class="section-header">
              <label>{{ mode === 'encode' ? 'Original Text' : 'Encoded URL' }}</label>
              <span class="char-count">{{ input.length }} chars</span>
            </div>
            <textarea 
              v-model="input"
              :placeholder="mode === 'encode' ? 'Enter text or URL to encode...' : 'Enter encoded URL to decode...'"
              @input="convert"
            ></textarea>
            <button @click="pasteFromClipboard" class="action-btn">📋 Paste</button>
          </div>

          <button @click="swapValues" class="swap-btn">⇅</button>

          <div class="output-section">
            <div class="section-header">
              <label>{{ mode === 'encode' ? 'Encoded Output' : 'Decoded Output' }}</label>
              <button @click="copyOutput" class="copy-btn-inline">📋 Copy</button>
            </div>
            <textarea 
              v-model="output"
              readonly
              placeholder="Result will appear here..."
            ></textarea>
          </div>
        </div>

        <!-- Common Encodings Reference -->
        <div class="reference-section">
          <h3>📚 Common URL Encodings</h3>
          <div class="encoding-grid">
            <div v-for="item in commonEncodings" :key="item.char" class="encoding-item">
              <span class="enc-char">{{ item.char }}</span>
              <span class="enc-arrow">→</span>
              <span class="enc-code">{{ item.encoded }}</span>
              <span class="enc-name">{{ item.name }}</span>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="info-box">
          <span class="info-icon">💡</span>
          <div>
            <strong>When to Use URL Encoding?</strong>
            <p>URL encoding converts special characters to a format that can be safely transmitted over the internet. Use it when passing data as query parameters, handling form submissions, or working with APIs.</p>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
useHead({ title: 'URL Encoder/Decoder - QuickHelp.lol' })

const mode = ref('encode')
const encodeType = ref('component')
const input = ref('')
const output = ref('')

const commonEncodings = [
  { char: ' ', encoded: '%20', name: 'Space' },
  { char: '!', encoded: '%21', name: 'Exclamation' },
  { char: '#', encoded: '%23', name: 'Hash' },
  { char: '$', encoded: '%24', name: 'Dollar' },
  { char: '&', encoded: '%26', name: 'Ampersand' },
  { char: "'", encoded: '%27', name: 'Apostrophe' },
  { char: '(', encoded: '%28', name: 'Open paren' },
  { char: ')', encoded: '%29', name: 'Close paren' },
  { char: '+', encoded: '%2B', name: 'Plus' },
  { char: ',', encoded: '%2C', name: 'Comma' },
  { char: '/', encoded: '%2F', name: 'Slash' },
  { char: ':', encoded: '%3A', name: 'Colon' },
  { char: '=', encoded: '%3D', name: 'Equals' },
  { char: '?', encoded: '%3F', name: 'Question' },
  { char: '@', encoded: '%40', name: 'At sign' },
]

const convert = () => {
  if (!input.value) {
    output.value = ''
    return
  }

  try {
    if (mode.value === 'encode') {
      output.value = encodeType.value === 'component'
        ? encodeURIComponent(input.value)
        : encodeURI(input.value)
    } else {
      output.value = decodeURIComponent(input.value)
    }
  } catch (e) {
    output.value = 'Error: Invalid input for decoding'
  }
}

const swapValues = () => {
  const temp = input.value
  input.value = output.value
  output.value = temp
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

const copyOutput = () => {
  navigator.clipboard.writeText(output.value)
}

const pasteFromClipboard = async () => {
  try {
    input.value = await navigator.clipboard.readText()
    convert()
  } catch (e) {
    console.error('Failed to paste')
  }
}

watch([mode, encodeType], convert)
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(14, 165, 233, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(34, 197, 94, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 900px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #0ea5e9; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 100px; color: #0ea5e9; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #0ea5e9, #22c55e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.mode-tabs { display: flex; gap: 12px; margin-bottom: 24px; }
.tab { flex: 1; padding: 14px 20px; font-size: 15px; font-weight: 600; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 12px; color: #94a3b8; cursor: pointer; transition: all 0.3s; }
.tab.active { background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(34, 197, 94, 0.2)); border-color: #0ea5e9; color: white; }
.tab:hover:not(.active) { border-color: rgba(100, 116, 139, 0.4); }

.options { display: flex; gap: 16px; margin-bottom: 24px; }
@media (max-width: 640px) { .options { flex-direction: column; } }
.option-item { display: flex; align-items: flex-start; gap: 12px; padding: 16px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; cursor: pointer; flex: 1; }
.option-item input[type="radio"] { margin-top: 4px; accent-color: #0ea5e9; }
.option-label { display: flex; flex-direction: column; gap: 4px; }
.option-label strong { color: white; font-size: 14px; }
.option-label small { color: #64748b; font-size: 12px; }

.converter-layout { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
.input-section, .output-section { flex: 1; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.section-header label { font-size: 14px; font-weight: 500; color: #e2e8f0; }
.char-count { font-size: 12px; color: #64748b; }
.copy-btn-inline { padding: 6px 12px; font-size: 12px; background: rgba(14, 165, 233, 0.2); border: none; border-radius: 6px; color: #0ea5e9; cursor: pointer; }

textarea { width: 100%; height: 140px; padding: 16px; font-size: 14px; font-family: 'Fira Code', monospace; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: #e2e8f0; resize: vertical; outline: none; }
textarea:focus { border-color: #0ea5e9; }
textarea[readonly] { background: rgba(15, 23, 42, 0.9); color: #22c55e; }

.action-btn { margin-top: 10px; padding: 10px 18px; font-size: 13px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { border-color: #0ea5e9; color: #0ea5e9; }

.swap-btn { align-self: center; padding: 10px 20px; font-size: 20px; background: rgba(14, 165, 233, 0.15); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 10px; color: #0ea5e9; cursor: pointer; transition: all 0.3s; }
.swap-btn:hover { background: rgba(14, 165, 233, 0.25); transform: scale(1.05); }

.reference-section { margin-bottom: 28px; }
.reference-section h3 { font-size: 16px; color: white; margin-bottom: 16px; }
.encoding-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.encoding-item { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(30, 41, 59, 0.5); border-radius: 8px; font-size: 13px; }
.enc-char { font-family: 'Fira Code', monospace; color: #f59e0b; min-width: 20px; text-align: center; }
.enc-arrow { color: #64748b; }
.enc-code { font-family: 'Fira Code', monospace; color: #22c55e; }
.enc-name { color: #64748b; font-size: 11px; margin-left: auto; }

.info-box { display: flex; gap: 16px; padding: 20px; background: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 14px; }
.info-icon { font-size: 24px; }
.info-box strong { display: block; color: white; margin-bottom: 6px; }
.info-box p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; }
</style>
