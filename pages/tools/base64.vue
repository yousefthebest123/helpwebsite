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
        <div class="badge"><span>🔢</span> Encoding Tool</div>
        <h1><span class="gradient-text">Base64 Encoder/Decoder</span></h1>
        <p>Encode text to Base64 or decode Base64 to text instantly.</p>
      </header>

      <div class="tool-card">
        <div class="mode-tabs">
          <button 
            :class="['tab', { active: mode === 'encode' }]"
            @click="mode = 'encode'"
          >
            <span>🔐</span> Encode
          </button>
          <button 
            :class="['tab', { active: mode === 'decode' }]"
            @click="mode = 'decode'"
          >
            <span>🔓</span> Decode
          </button>
        </div>

        <div class="converter-grid">
          <div class="input-section">
            <label>{{ mode === 'encode' ? 'Plain Text' : 'Base64 String' }}</label>
            <textarea
              v-model="input"
              :placeholder="mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'"
              rows="8"
            ></textarea>
            <div class="char-count">{{ input.length }} characters</div>
          </div>

          <div class="arrow-section">
            <div class="arrow-btn" @click="convert">
              <span>{{ mode === 'encode' ? '→' : '←' }}</span>
            </div>
            <button @click="swapValues" class="swap-btn">⇄ Swap</button>
          </div>

          <div class="output-section">
            <label>{{ mode === 'encode' ? 'Base64 Output' : 'Decoded Text' }}</label>
            <textarea
              v-model="output"
              readonly
              rows="8"
              :placeholder="error || 'Output will appear here...'"
              :class="{ error: error }"
            ></textarea>
            <div class="output-actions">
              <button @click="copyOutput" class="action-btn">
                {{ copied ? '✓ Copied!' : '📋 Copy' }}
              </button>
              <button @click="clearAll" class="action-btn">🗑️ Clear</button>
            </div>
          </div>
        </div>

        <div class="info-box">
          <span class="info-icon">💡</span>
          <div>
            <strong>What is Base64?</strong>
            <p>Base64 is an encoding scheme that converts binary data into ASCII text. It's commonly used to embed images in HTML/CSS, send binary data in emails, and encode data in URLs.</p>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
useHead({ title: 'Base64 Encoder/Decoder - QuickHelp.lol' })

const mode = ref('encode')
const input = ref('')
const output = ref('')
const error = ref('')
const copied = ref(false)

const convert = () => {
  error.value = ''
  if (!input.value) {
    output.value = ''
    return
  }
  
  try {
    if (mode.value === 'encode') {
      output.value = btoa(unescape(encodeURIComponent(input.value)))
    } else {
      output.value = decodeURIComponent(escape(atob(input.value)))
    }
  } catch (e) {
    error.value = 'Invalid input for ' + (mode.value === 'encode' ? 'encoding' : 'decoding')
    output.value = ''
  }
}

const swapValues = () => {
  const temp = input.value
  input.value = output.value
  output.value = temp
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
}

const copyOutput = () => {
  if (!output.value) return
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const clearAll = () => {
  input.value = ''
  output.value = ''
  error.value = ''
}

watch(input, convert)
watch(mode, convert)
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(6, 182, 212, 0.3), transparent 70%); top: -100px; left: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 70%); bottom: -100px; right: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 1000px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; transition: color 0.2s; }
.back-btn:hover { color: #06b6d4; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 100px; color: #06b6d4; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #06b6d4, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.mode-tabs { display: flex; gap: 12px; margin-bottom: 28px; }
.tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 16px; font-size: 15px; font-weight: 600; background: rgba(30, 41, 59, 0.5); border: 2px solid transparent; border-radius: 14px; color: #94a3b8; cursor: pointer; transition: all 0.3s; }
.tab:hover { border-color: rgba(6, 182, 212, 0.3); color: white; }
.tab.active { background: linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2)); border-color: #06b6d4; color: white; }

.converter-grid { display: grid; grid-template-columns: 1fr auto 1fr; gap: 24px; align-items: start; }
@media (max-width: 768px) { .converter-grid { grid-template-columns: 1fr; } }

.input-section label, .output-section label { display: block; font-size: 14px; font-weight: 600; color: #e2e8f0; margin-bottom: 10px; }
.input-section textarea, .output-section textarea { width: 100%; padding: 16px; font-size: 14px; font-family: 'Fira Code', monospace; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 14px; color: white; resize: vertical; outline: none; transition: border-color 0.3s; }
.input-section textarea:focus, .output-section textarea:focus { border-color: #06b6d4; }
textarea.error { border-color: #ef4444; color: #f87171; }
.char-count { font-size: 12px; color: #64748b; margin-top: 8px; text-align: right; }

.arrow-section { display: flex; flex-direction: column; align-items: center; gap: 12px; padding-top: 30px; }
.arrow-btn { width: 50px; height: 50px; background: linear-gradient(135deg, #06b6d4, #3b82f6); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: white; cursor: pointer; transition: transform 0.3s, box-shadow 0.3s; box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4); }
.arrow-btn:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(6, 182, 212, 0.5); }
.swap-btn { padding: 8px 16px; font-size: 13px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 8px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.swap-btn:hover { color: white; border-color: #06b6d4; }

.output-actions { display: flex; gap: 10px; margin-top: 10px; }
.action-btn { padding: 10px 16px; font-size: 13px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 10px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.action-btn:hover { color: white; border-color: rgba(6, 182, 212, 0.4); background: rgba(6, 182, 212, 0.1); }

.info-box { display: flex; gap: 16px; padding: 20px; background: rgba(6, 182, 212, 0.08); border: 1px solid rgba(6, 182, 212, 0.2); border-radius: 14px; margin-top: 28px; }
.info-icon { font-size: 24px; }
.info-box strong { display: block; color: white; margin-bottom: 6px; }
.info-box p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; }
</style>
