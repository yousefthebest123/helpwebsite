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
        <div class="badge"><span>⏰</span> Timer Tool</div>
        <h1><span class="gradient-text">Event Countdown</span></h1>
        <p>Create beautiful countdowns for any upcoming event.</p>
      </header>

      <div class="tool-card">
        <!-- Event Setup -->
        <div class="setup-section" v-if="!isRunning">
          <div class="input-row">
            <div class="input-group">
              <label>Event Name</label>
              <input 
                v-model="eventName" 
                type="text" 
                placeholder="e.g., New Year 2025"
              />
            </div>
          </div>
          <div class="input-row">
            <div class="input-group">
              <label>Target Date & Time</label>
              <input 
                v-model="targetDate" 
                type="datetime-local"
              />
            </div>
          </div>
          
          <!-- Quick Presets -->
          <div class="presets">
            <span class="preset-label">Quick presets:</span>
            <div class="preset-buttons">
              <button 
                v-for="preset in presets" 
                :key="preset.label"
                @click="setPreset(preset)"
                class="preset-btn"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>

          <button @click="startCountdown" class="start-btn" :disabled="!targetDate">
            🚀 Start Countdown
          </button>
        </div>

        <!-- Countdown Display -->
        <div class="countdown-display" v-else>
          <h2 class="event-title">{{ eventName || 'Countdown' }}</h2>
          
          <div class="countdown-grid" v-if="!isFinished">
            <div class="time-block">
              <div class="time-value">
                <span class="digit">{{ String(timeLeft.days).padStart(2, '0')[0] }}</span>
                <span class="digit">{{ String(timeLeft.days).padStart(2, '0')[1] }}</span>
              </div>
              <div class="time-label">Days</div>
            </div>
            
            <div class="separator">:</div>
            
            <div class="time-block">
              <div class="time-value">
                <span class="digit">{{ String(timeLeft.hours).padStart(2, '0')[0] }}</span>
                <span class="digit">{{ String(timeLeft.hours).padStart(2, '0')[1] }}</span>
              </div>
              <div class="time-label">Hours</div>
            </div>
            
            <div class="separator">:</div>
            
            <div class="time-block">
              <div class="time-value">
                <span class="digit">{{ String(timeLeft.minutes).padStart(2, '0')[0] }}</span>
                <span class="digit">{{ String(timeLeft.minutes).padStart(2, '0')[1] }}</span>
              </div>
              <div class="time-label">Minutes</div>
            </div>
            
            <div class="separator">:</div>
            
            <div class="time-block">
              <div class="time-value">
                <span class="digit flip">{{ String(timeLeft.seconds).padStart(2, '0')[0] }}</span>
                <span class="digit flip">{{ String(timeLeft.seconds).padStart(2, '0')[1] }}</span>
              </div>
              <div class="time-label">Seconds</div>
            </div>
          </div>

          <!-- Finished -->
          <div class="finished" v-else>
            <div class="confetti">🎉</div>
            <h3>Event Time!</h3>
            <p>{{ eventName }} is happening now!</p>
          </div>

          <!-- Progress -->
          <div class="progress-section" v-if="!isFinished">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div class="progress-text">{{ progressPercent.toFixed(1) }}% complete</div>
          </div>

          <!-- Details -->
          <div class="details" v-if="!isFinished">
            <div class="detail-item">
              <span class="detail-label">Target:</span>
              <span class="detail-value">{{ formatTargetDate }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Total time left:</span>
              <span class="detail-value">{{ totalTimeLeft }}</span>
            </div>
          </div>

          <button @click="resetCountdown" class="reset-btn">
            ← New Countdown
          </button>
        </div>

        <!-- Saved Countdowns -->
        <div class="saved-section" v-if="savedCountdowns.length && !isRunning">
          <h3>📌 Saved Countdowns</h3>
          <div class="saved-list">
            <div 
              v-for="(saved, i) in savedCountdowns" 
              :key="i"
              class="saved-item"
              @click="loadSaved(saved)"
            >
              <div class="saved-info">
                <span class="saved-name">{{ saved.name }}</span>
                <span class="saved-date">{{ formatDate(saved.target) }}</span>
              </div>
              <button @click.stop="removeSaved(i)" class="remove-btn">×</button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
useHead({ title: 'Event Countdown - QuickHelp.lol' })

const eventName = ref('')
const targetDate = ref('')
const isRunning = ref(false)
const isFinished = ref(false)
const startTime = ref(null)
const timeLeft = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
const savedCountdowns = ref([])
let interval = null

const presets = [
  { label: '1 Hour', offset: 60 * 60 * 1000 },
  { label: '24 Hours', offset: 24 * 60 * 60 * 1000 },
  { label: '1 Week', offset: 7 * 24 * 60 * 60 * 1000 },
  { label: 'New Year', getDate: () => new Date(new Date().getFullYear() + 1, 0, 1) },
]

const progressPercent = computed(() => {
  if (!startTime.value || !targetDate.value) return 0
  const total = new Date(targetDate.value).getTime() - startTime.value
  const elapsed = Date.now() - startTime.value
  return Math.min(100, (elapsed / total) * 100)
})

const formatTargetDate = computed(() => {
  if (!targetDate.value) return ''
  return new Date(targetDate.value).toLocaleString()
})

const totalTimeLeft = computed(() => {
  const { days, hours, minutes, seconds } = timeLeft.value
  const parts = []
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`)
  if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`)
  return parts.join(', ') || 'Done!'
})

const setPreset = (preset) => {
  if (preset.getDate) {
    targetDate.value = formatForInput(preset.getDate())
    eventName.value = preset.label
  } else {
    targetDate.value = formatForInput(new Date(Date.now() + preset.offset))
    eventName.value = `In ${preset.label}`
  }
}

const formatForInput = (date) => {
  const d = new Date(date)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString()
}

const startCountdown = () => {
  if (!targetDate.value) return
  
  startTime.value = Date.now()
  isRunning.value = true
  isFinished.value = false
  
  // Save for future
  const existing = savedCountdowns.value.find(s => s.target === targetDate.value)
  if (!existing && eventName.value) {
    savedCountdowns.value.push({
      name: eventName.value,
      target: targetDate.value
    })
    localStorage.setItem('countdowns', JSON.stringify(savedCountdowns.value))
  }
  
  updateCountdown()
  interval = setInterval(updateCountdown, 1000)
}

const updateCountdown = () => {
  const target = new Date(targetDate.value).getTime()
  const now = Date.now()
  const diff = target - now
  
  if (diff <= 0) {
    isFinished.value = true
    clearInterval(interval)
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }
  
  timeLeft.value = {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

const resetCountdown = () => {
  clearInterval(interval)
  isRunning.value = false
  isFinished.value = false
  eventName.value = ''
  targetDate.value = ''
  timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
}

const loadSaved = (saved) => {
  eventName.value = saved.name
  targetDate.value = saved.target
  startCountdown()
}

const removeSaved = (index) => {
  savedCountdowns.value.splice(index, 1)
  localStorage.setItem('countdowns', JSON.stringify(savedCountdowns.value))
}

onMounted(() => {
  const saved = localStorage.getItem('countdowns')
  if (saved) {
    try {
      savedCountdowns.value = JSON.parse(saved)
    } catch (e) {}
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(245, 158, 11, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(239, 68, 68, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 700px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #f59e0b; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 100px; color: #f59e0b; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

/* Setup Section */
.setup-section { margin-bottom: 24px; }
.input-row { margin-bottom: 20px; }
.input-group label { display: block; font-size: 14px; color: #94a3b8; margin-bottom: 8px; }
.input-group input { width: 100%; padding: 16px; font-size: 16px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 12px; color: white; outline: none; }
.input-group input:focus { border-color: #f59e0b; }

.presets { margin-bottom: 24px; }
.preset-label { display: block; font-size: 13px; color: #64748b; margin-bottom: 10px; }
.preset-buttons { display: flex; flex-wrap: wrap; gap: 10px; }
.preset-btn { padding: 10px 18px; font-size: 13px; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 8px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.preset-btn:hover { border-color: #f59e0b; color: #f59e0b; }

.start-btn { width: 100%; padding: 18px; font-size: 18px; font-weight: 600; background: linear-gradient(135deg, #f59e0b, #ef4444); border: none; border-radius: 14px; color: white; cursor: pointer; transition: all 0.3s; }
.start-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(245, 158, 11, 0.3); }
.start-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Countdown Display */
.countdown-display { text-align: center; }
.event-title { font-size: 28px; font-weight: 700; color: white; margin-bottom: 32px; }

.countdown-grid { display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; }

.time-block { text-align: center; }
.time-value { display: flex; gap: 6px; }
.digit { display: flex; align-items: center; justify-content: center; width: 50px; height: 70px; font-size: 42px; font-weight: 700; font-family: 'Fira Code', monospace; background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.15)); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; color: white; }
.digit.flip { animation: pulse 1s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
.time-label { font-size: 12px; color: #64748b; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }

.separator { font-size: 36px; color: #f59e0b; font-weight: 700; padding: 0 4px; }

/* Finished */
.finished { padding: 40px; }
.confetti { font-size: 64px; margin-bottom: 16px; animation: bounce 1s ease-in-out infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.finished h3 { font-size: 32px; color: #f59e0b; margin-bottom: 8px; }
.finished p { color: #94a3b8; font-size: 18px; }

/* Progress */
.progress-section { margin-bottom: 24px; }
.progress-bar { height: 8px; background: rgba(30, 41, 59, 0.8); border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #ef4444); border-radius: 4px; transition: width 0.3s; }
.progress-text { font-size: 13px; color: #64748b; margin-top: 8px; }

/* Details */
.details { display: flex; flex-direction: column; gap: 10px; padding: 20px; background: rgba(30, 41, 59, 0.5); border-radius: 14px; margin-bottom: 24px; }
.detail-item { display: flex; justify-content: space-between; font-size: 14px; }
.detail-label { color: #64748b; }
.detail-value { color: #e2e8f0; font-family: 'Fira Code', monospace; }

.reset-btn { padding: 14px 28px; font-size: 15px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 10px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.reset-btn:hover { border-color: #f59e0b; color: #f59e0b; }

/* Saved Countdowns */
.saved-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(100, 116, 139, 0.2); }
.saved-section h3 { font-size: 16px; color: white; margin-bottom: 16px; }
.saved-list { display: flex; flex-direction: column; gap: 10px; }
.saved-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; background: rgba(30, 41, 59, 0.5); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.saved-item:hover { background: rgba(245, 158, 11, 0.1); }
.saved-info { display: flex; flex-direction: column; gap: 4px; }
.saved-name { font-size: 15px; color: #e2e8f0; }
.saved-date { font-size: 12px; color: #64748b; }
.remove-btn { padding: 4px 10px; font-size: 16px; background: transparent; border: none; color: #ef4444; cursor: pointer; opacity: 0.6; }
.remove-btn:hover { opacity: 1; }

@media (max-width: 600px) {
  .digit { width: 40px; height: 56px; font-size: 32px; }
  .separator { font-size: 28px; }
}
</style>
