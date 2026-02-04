<template>
  <div class="tool-page">
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <main class="tool-container">
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">← Back to Tools</NuxtLink>
        <div class="badge"><span>🕐</span> Time Tool</div>
        <h1><span class="gradient-text">Unix Timestamp Converter</span></h1>
        <p>Convert between Unix timestamps and human-readable dates.</p>
      </header>

      <div class="tool-card">
        <!-- Current Time Display -->
        <div class="current-time">
          <div class="time-label">Current Unix Timestamp</div>
          <div class="time-value">{{ currentTimestamp }}</div>
          <div class="time-human">{{ currentDate }}</div>
        </div>

        <div class="converter-grid">
          <!-- Timestamp to Date -->
          <div class="converter-section">
            <h3>🔢 Timestamp → Date</h3>
            <div class="input-group">
              <label>Unix Timestamp</label>
              <input
                v-model="timestampInput"
                type="number"
                placeholder="e.g., 1704067200"
                @input="convertToDate"
              />
            </div>
            <div class="result-box" v-if="dateOutput">
              <div class="result-row">
                <span class="result-label">Local Time:</span>
                <span class="result-value">{{ dateOutput.local }}</span>
              </div>
              <div class="result-row">
                <span class="result-label">UTC:</span>
                <span class="result-value">{{ dateOutput.utc }}</span>
              </div>
              <div class="result-row">
                <span class="result-label">ISO 8601:</span>
                <span class="result-value">{{ dateOutput.iso }}</span>
              </div>
              <div class="result-row">
                <span class="result-label">Relative:</span>
                <span class="result-value">{{ dateOutput.relative }}</span>
              </div>
            </div>
          </div>

          <!-- Date to Timestamp -->
          <div class="converter-section">
            <h3>📅 Date → Timestamp</h3>
            <div class="input-group">
              <label>Date & Time</label>
              <input
                v-model="dateInput"
                type="datetime-local"
                @input="convertToTimestamp"
              />
            </div>
            <div class="result-box" v-if="timestampOutput">
              <div class="result-row">
                <span class="result-label">Unix (seconds):</span>
                <span class="result-value highlight">{{ timestampOutput.seconds }}</span>
                <button @click="copy(timestampOutput.seconds)" class="copy-btn">📋</button>
              </div>
              <div class="result-row">
                <span class="result-label">Unix (milliseconds):</span>
                <span class="result-value">{{ timestampOutput.milliseconds }}</span>
                <button @click="copy(timestampOutput.milliseconds)" class="copy-btn">📋</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Timestamps -->
        <div class="quick-section">
          <h3>⚡ Quick Timestamps</h3>
          <div class="quick-grid">
            <button 
              v-for="item in quickTimestamps" 
              :key="item.label"
              @click="setTimestamp(item.value)"
              class="quick-btn"
            >
              <span class="quick-label">{{ item.label }}</span>
              <span class="quick-value">{{ item.value }}</span>
            </button>
          </div>
        </div>

        <!-- Info -->
        <div class="info-box">
          <span class="info-icon">💡</span>
          <div>
            <strong>What is a Unix Timestamp?</strong>
            <p>A Unix timestamp is the number of seconds since January 1, 1970 (UTC). It's widely used in programming and databases to store date/time information in a universal format.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({ title: 'Unix Timestamp Converter - QuickHelp.lol' })

const currentTimestamp = ref(0)
const currentDate = ref('')
const timestampInput = ref('')
const dateInput = ref('')
const dateOutput = ref(null)
const timestampOutput = ref(null)

const quickTimestamps = computed(() => {
  const now = Math.floor(Date.now() / 1000)
  return [
    { label: 'Now', value: now },
    { label: 'Today Start', value: Math.floor(new Date().setHours(0, 0, 0, 0) / 1000) },
    { label: 'Tomorrow', value: now + 86400 },
    { label: 'Next Week', value: now + 604800 },
    { label: 'Next Month', value: now + 2592000 },
    { label: 'Next Year', value: now + 31536000 },
  ]
})

const updateCurrentTime = () => {
  currentTimestamp.value = Math.floor(Date.now() / 1000)
  currentDate.value = new Date().toLocaleString()
}

const convertToDate = () => {
  if (!timestampInput.value) {
    dateOutput.value = null
    return
  }
  
  let ts = parseInt(timestampInput.value)
  // Auto-detect if milliseconds
  if (ts > 9999999999) ts = Math.floor(ts / 1000)
  
  const date = new Date(ts * 1000)
  
  if (isNaN(date.getTime())) {
    dateOutput.value = null
    return
  }
  
  dateOutput.value = {
    local: date.toLocaleString(),
    utc: date.toUTCString(),
    iso: date.toISOString(),
    relative: getRelativeTime(date)
  }
}

const convertToTimestamp = () => {
  if (!dateInput.value) {
    timestampOutput.value = null
    return
  }
  
  const date = new Date(dateInput.value)
  
  if (isNaN(date.getTime())) {
    timestampOutput.value = null
    return
  }
  
  timestampOutput.value = {
    seconds: Math.floor(date.getTime() / 1000),
    milliseconds: date.getTime()
  }
}

const getRelativeTime = (date) => {
  const now = new Date()
  const diff = (date - now) / 1000
  
  if (Math.abs(diff) < 60) return 'Just now'
  if (Math.abs(diff) < 3600) return `${Math.round(diff / 60)} minutes ${diff > 0 ? 'from now' : 'ago'}`
  if (Math.abs(diff) < 86400) return `${Math.round(diff / 3600)} hours ${diff > 0 ? 'from now' : 'ago'}`
  if (Math.abs(diff) < 2592000) return `${Math.round(diff / 86400)} days ${diff > 0 ? 'from now' : 'ago'}`
  return `${Math.round(diff / 2592000)} months ${diff > 0 ? 'from now' : 'ago'}`
}

const setTimestamp = (ts) => {
  timestampInput.value = ts
  convertToDate()
}

const copy = (value) => {
  navigator.clipboard.writeText(String(value))
}

onMounted(() => {
  updateCurrentTime()
  setInterval(updateCurrentTime, 1000)
  
  // Set default to now
  const now = new Date()
  dateInput.value = now.toISOString().slice(0, 16)
  convertToTimestamp()
})
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(236, 72, 153, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(139, 92, 246, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 1000px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #ec4899; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(236, 72, 153, 0.1); border: 1px solid rgba(236, 72, 153, 0.3); border-radius: 100px; color: #ec4899; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #ec4899, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(236, 72, 153, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.current-time { text-align: center; padding: 28px; background: linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1)); border-radius: 16px; margin-bottom: 32px; }
.time-label { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
.time-value { font-size: 42px; font-weight: 700; font-family: 'Fira Code', monospace; color: #ec4899; margin-bottom: 8px; }
.time-human { font-size: 14px; color: #64748b; }

.converter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
@media (max-width: 768px) { .converter-grid { grid-template-columns: 1fr; } }

.converter-section { background: rgba(30, 41, 59, 0.5); border-radius: 16px; padding: 24px; }
.converter-section h3 { font-size: 16px; color: white; margin-bottom: 20px; }

.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
.input-group input { width: 100%; padding: 14px 16px; font-size: 15px; font-family: 'Fira Code', monospace; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 12px; color: white; outline: none; }
.input-group input:focus { border-color: #ec4899; }

.result-box { background: rgba(15, 23, 42, 0.8); border-radius: 12px; padding: 16px; }
.result-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(100, 116, 139, 0.1); }
.result-row:last-child { border-bottom: none; }
.result-label { font-size: 12px; color: #64748b; min-width: 100px; }
.result-value { flex: 1; font-size: 14px; font-family: 'Fira Code', monospace; color: #e2e8f0; word-break: break-all; }
.result-value.highlight { color: #ec4899; font-weight: 600; }
.copy-btn { padding: 4px 8px; font-size: 12px; background: transparent; border: none; cursor: pointer; opacity: 0.6; }
.copy-btn:hover { opacity: 1; }

.quick-section { margin-bottom: 28px; }
.quick-section h3 { font-size: 16px; color: white; margin-bottom: 16px; }
.quick-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
.quick-btn { display: flex; flex-direction: column; gap: 4px; padding: 14px; background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 12px; cursor: pointer; transition: all 0.2s; text-align: left; }
.quick-btn:hover { border-color: #ec4899; background: rgba(236, 72, 153, 0.1); }
.quick-label { font-size: 12px; color: #94a3b8; }
.quick-value { font-size: 14px; font-family: 'Fira Code', monospace; color: white; }

.info-box { display: flex; gap: 16px; padding: 20px; background: rgba(236, 72, 153, 0.08); border: 1px solid rgba(236, 72, 153, 0.2); border-radius: 14px; }
.info-icon { font-size: 24px; }
.info-box strong { display: block; color: white; margin-bottom: 6px; }
.info-box p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0; }
</style>
