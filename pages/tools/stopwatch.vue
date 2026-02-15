<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>⏱️</span> Stopwatch</h1>
        <p>Precise stopwatch with lap tracking. Perfect for workouts, cooking, and timed tasks.</p>
      </div>

      <div class="stopwatch-layout">
        <!-- Main Stopwatch -->
        <div class="stopwatch-main glass">
          <div class="time-display">
            <div class="time-ring" :class="{ running: isRunning }">
              <svg viewBox="0 0 300 300">
                <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(124,58,237,0.1)" stroke-width="4" />
                <circle cx="150" cy="150" r="140" fill="none" stroke="url(#swGrad)" stroke-width="4"
                  stroke-linecap="round"
                  :stroke-dasharray="879.6"
                  :stroke-dashoffset="879.6 - (879.6 * msProgress)"
                  transform="rotate(-90 150 150)"
                  class="progress-arc"
                />
                <defs>
                  <linearGradient id="swGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7c3aed"/>
                    <stop offset="100%" stop-color="#06b6d4"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="time-inner">
                <span class="time-main">{{ formatTime(elapsed) }}</span>
                <span class="time-ms">.{{ String(milliseconds).padStart(2, '0') }}</span>
              </div>
            </div>
          </div>

          <div class="controls">
            <button class="ctrl-btn start" v-if="!isRunning" @click="start">
              <span>▶</span> Start
            </button>
            <button class="ctrl-btn pause" v-else @click="pause">
              <span>⏸</span> Pause
            </button>
            <button class="ctrl-btn lap" @click="addLap" :disabled="!isRunning && elapsed === 0">
              <span>🏁</span> Lap
            </button>
            <button class="ctrl-btn reset" @click="reset" :disabled="elapsed === 0">
              <span>↺</span> Reset
            </button>
          </div>
        </div>

        <!-- Laps -->
        <div class="laps-panel glass" v-if="laps.length > 0">
          <div class="laps-header">
            <h3>🏁 Laps</h3>
            <span class="lap-count">{{ laps.length }} laps</span>
          </div>
          <div class="laps-list">
            <div v-for="(lap, i) in laps.slice().reverse()" :key="i" 
              class="lap-item"
              :class="{ fastest: lap.isFastest, slowest: lap.isSlowest }"
            >
              <div class="lap-num">
                <span v-if="lap.isFastest" class="lap-badge fast">⚡ Fastest</span>
                <span v-else-if="lap.isSlowest" class="lap-badge slow">🐢 Slowest</span>
                <span v-else>Lap {{ laps.length - i }}</span>
              </div>
              <div class="lap-times">
                <span class="lap-split">{{ formatTime(lap.split) }}.{{ String(Math.floor((lap.split % 1000) / 10)).padStart(2, '0') }}</span>
                <span class="lap-total">Total: {{ formatTime(lap.total) }}</span>
              </div>
            </div>
          </div>
          
          <!-- Lap Stats -->
          <div class="lap-stats" v-if="laps.length >= 2">
            <div class="ls-item">
              <span class="ls-label">Average</span>
              <span class="ls-val">{{ formatTime(avgLap) }}</span>
            </div>
            <div class="ls-item">
              <span class="ls-label">Fastest</span>
              <span class="ls-val fastest-val">{{ formatTime(fastestLap) }}</span>
            </div>
            <div class="ls-item">
              <span class="ls-label">Slowest</span>
              <span class="ls-val slowest-val">{{ formatTime(slowestLap) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Keyboard shortcut -->
      <div class="shortcut-hint">
        💡 Keyboard: <kbd>Space</kbd> start/pause · <kbd>L</kbd> lap · <kbd>R</kbd> reset
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Stopwatch — QuickHelp.lol' })

const isRunning = ref(false)
const elapsed = ref(0)
const laps = ref([])
let intervalId = null
let lastTime = 0
let lastLapTime = 0

const milliseconds = computed(() => Math.floor((elapsed.value % 1000) / 10))
const msProgress = computed(() => (elapsed.value % 60000) / 60000)

const formatTime = (ms) => {
  const totalSec = Math.floor(ms / 1000)
  const hours = Math.floor(totalSec / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const start = () => {
  isRunning.value = true
  lastTime = Date.now() - elapsed.value
  intervalId = setInterval(() => {
    elapsed.value = Date.now() - lastTime
  }, 10)
}

const pause = () => {
  isRunning.value = false
  clearInterval(intervalId)
}

const reset = () => {
  pause()
  elapsed.value = 0
  lastLapTime = 0
  laps.value = []
}

const addLap = () => {
  if (elapsed.value === 0) return
  const split = elapsed.value - lastLapTime
  laps.value.push({ split, total: elapsed.value, isFastest: false, isSlowest: false })
  lastLapTime = elapsed.value
  updateLapExtremes()
}

const updateLapExtremes = () => {
  if (laps.value.length < 2) return
  const splits = laps.value.map(l => l.split)
  const min = Math.min(...splits)
  const max = Math.max(...splits)
  laps.value.forEach(l => {
    l.isFastest = l.split === min
    l.isSlowest = l.split === max
  })
}

const avgLap = computed(() => {
  if (laps.value.length === 0) return 0
  return Math.round(laps.value.reduce((s, l) => s + l.split, 0) / laps.value.length)
})

const fastestLap = computed(() => laps.value.length ? Math.min(...laps.value.map(l => l.split)) : 0)
const slowestLap = computed(() => laps.value.length ? Math.max(...laps.value.map(l => l.split)) : 0)

const handleKeydown = (e) => {
  if (e.code === 'Space') { e.preventDefault(); isRunning.value ? pause() : start() }
  if (e.key === 'l' || e.key === 'L') addLap()
  if (e.key === 'r' || e.key === 'R') reset()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => { clearInterval(intervalId); window.removeEventListener('keydown', handleKeydown) })
</script>

<style scoped>
.tool-page { min-height: 100vh; padding: 120px 0 80px; }
.container { max-width: 800px; margin: 0 auto; padding: 0 24px; }

.tool-header { margin-bottom: 40px; }
.back-link { color: var(--text-muted); font-size: 14px; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back-link:hover { color: var(--primary-light); }
.tool-header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.tool-header h1 span { margin-right: 12px; }
.tool-header p { font-size: 18px; color: var(--text-muted); line-height: 1.7; }

.stopwatch-layout { display: flex; flex-direction: column; gap: 24px; }

.stopwatch-main { padding: 48px 32px; text-align: center; }

.time-display { display: flex; justify-content: center; margin-bottom: 40px; }

.time-ring {
  width: 280px;
  height: 280px;
  position: relative;
}

.time-ring svg { width: 100%; height: 100%; }

.time-ring .progress-arc {
  transition: stroke-dashoffset 0.1s linear;
}

.time-ring.running .progress-arc {
  filter: drop-shadow(0 0 8px rgba(124, 58, 237, 0.5));
}

.time-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-main {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 52px;
  font-weight: 700;
  letter-spacing: 2px;
}

.time-ms {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  color: var(--text-muted);
  margin-top: 12px;
}

.controls { display: flex; justify-content: center; gap: 16px; }

.ctrl-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 28px;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-full);
  background: var(--surface);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.ctrl-btn.start { border-color: var(--primary); background: rgba(124,58,237,0.15); color: var(--primary-light); }
.ctrl-btn.start:hover { background: var(--primary); color: white; }
.ctrl-btn.pause { border-color: #f59e0b; background: rgba(245,158,11,0.15); color: #fbbf24; }
.ctrl-btn.pause:hover { background: #f59e0b; color: black; }
.ctrl-btn.lap:hover:not(:disabled) { border-color: var(--secondary); }
.ctrl-btn.reset:hover:not(:disabled) { border-color: #ef4444; color: #f87171; }

.laps-panel { padding: 24px; }
.laps-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.laps-header h3 { font-size: 18px; }
.lap-count { font-size: 13px; color: var(--text-muted); padding: 4px 12px; background: var(--surface); border-radius: var(--radius-full); }

.laps-list { max-height: 300px; overflow-y: auto; margin-bottom: 16px; }

.lap-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border-light);
}

.lap-item.fastest { background: rgba(34,197,94,0.05); }
.lap-item.slowest { background: rgba(239,68,68,0.05); }

.lap-num { font-size: 14px; color: var(--text-muted); }
.lap-badge { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: var(--radius-full); }
.lap-badge.fast { background: rgba(34,197,94,0.15); color: #4ade80; }
.lap-badge.slow { background: rgba(239,68,68,0.15); color: #f87171; }

.lap-times { text-align: right; }
.lap-split { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; display: block; }
.lap-total { font-size: 12px; color: var(--text-dim); }

.lap-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-light); }
.ls-item { text-align: center; }
.ls-label { font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px; }
.ls-val { font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; }
.fastest-val { color: #4ade80; }
.slowest-val { color: #f87171; }

.shortcut-hint {
  text-align: center; font-size: 13px; color: var(--text-dim); margin-top: 24px;
}

.shortcut-hint kbd {
  display: inline-block; padding: 2px 8px; background: var(--surface); border: 1px solid var(--border-light);
  border-radius: 4px; font-size: 12px; font-family: 'Space Grotesk', monospace;
}

@media (max-width: 600px) {
  .tool-header h1 { font-size: 28px; }
  .time-ring { width: 220px; height: 220px; }
  .time-main { font-size: 38px; }
  .time-ms { font-size: 20px; }
  .controls { flex-wrap: wrap; }
  .ctrl-btn { padding: 12px 20px; font-size: 14px; }
}
</style>
