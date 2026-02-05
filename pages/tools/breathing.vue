<template>
  <div class="breathing-page">
    <section class="breathing-hero">
      <div class="container">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1>🧘 Breathing <span class="gradient-text">Exercises</span></h1>
        <p>Calm your mind and body with guided breathing patterns.</p>
      </div>
    </section>

    <section class="container breathing-content">
      <!-- Pattern Selector -->
      <div class="patterns-bar glass">
        <button 
          v-for="p in patterns" 
          :key="p.name"
          class="pattern-btn"
          :class="{ active: selectedPattern === p.name }"
          @click="selectPattern(p)"
        >
          <span>{{ p.icon }}</span>
          <span>{{ p.name }}</span>
        </button>
      </div>

      <!-- Main Breathing Circle -->
      <div class="breathing-main">
        <div class="circle-container">
          <div class="ambient-ring ring-1" :class="{ active: isRunning }"></div>
          <div class="ambient-ring ring-2" :class="{ active: isRunning }"></div>
          
          <div class="breathing-circle" :class="{ active: isRunning, [currentPhase]: true }">
            <svg class="progress-ring" viewBox="0 0 240 240">
              <circle cx="120" cy="120" r="108" fill="none" stroke="rgba(124,58,237,0.08)" stroke-width="3"/>
              <circle 
                cx="120" cy="120" r="108" fill="none" 
                stroke="url(#breathGrad)" stroke-width="3"
                stroke-linecap="round"
                :stroke-dasharray="678.58"
                :stroke-dashoffset="progressOffset"
                transform="rotate(-90 120 120)"
                class="progress-arc"
              />
              <defs>
                <linearGradient id="breathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#7c3aed"/>
                  <stop offset="50%" stop-color="#06b6d4"/>
                  <stop offset="100%" stop-color="#ec4899"/>
                </linearGradient>
              </defs>
            </svg>

            <div class="circle-inner" :class="{ expanded: isExpanded }">
              <div class="phase-label">{{ phaseLabel }}</div>
              <div class="phase-timer">{{ phaseTimer }}</div>
            </div>
          </div>
        </div>

        <div class="controls">
          <button class="btn btn-primary btn-lg" @click="toggleBreathing">
            {{ isRunning ? '⏸ Pause' : '▶ Start' }}
          </button>
          <button class="btn btn-glass" @click="resetBreathing">
            ↺ Reset
          </button>
        </div>

        <div class="session-stats" v-if="totalBreaths > 0">
          <div class="stat-pill glass">
            <span>🫁</span> {{ totalBreaths }} breaths
          </div>
          <div class="stat-pill glass">
            <span>⏱️</span> {{ formatTime(totalSeconds) }}
          </div>
          <div class="stat-pill glass">
            <span>🔄</span> {{ totalCycles }} cycles
          </div>
        </div>
      </div>

      <!-- Pattern Details -->
      <div class="pattern-details glass">
        <h3>{{ activePattern.name }} — {{ activePattern.subtitle }}</h3>
        <p>{{ activePattern.description }}</p>
        <div class="phase-breakdown">
          <div class="phase-item" v-for="(phase, idx) in activePattern.phases" :key="idx">
            <span class="phase-dot" :style="{ background: phaseColors[idx] }"></span>
            <span class="phase-name">{{ phase.name }}</span>
            <span class="phase-duration">{{ phase.duration }}s</span>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="tips-grid">
        <div class="tip-card glass">
          <h4>🪑 Position</h4>
          <p>Sit comfortably with a straight back. Place hands on knees or in your lap.</p>
        </div>
        <div class="tip-card glass">
          <h4>👃 Technique</h4>
          <p>Breathe in through your nose, out through your mouth. Focus on your diaphragm.</p>
        </div>
        <div class="tip-card glass">
          <h4>🎯 Focus</h4>
          <p>Close your eyes if comfortable. Let go of thoughts without judging them.</p>
        </div>
        <div class="tip-card glass">
          <h4>📅 Consistency</h4>
          <p>Even 2-3 minutes daily can reduce anxiety and improve focus over time.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'

useHead({ title: 'Breathing Exercises — QuickHelp.lol' })

const phaseColors = ['#7c3aed', '#06b6d4', '#ec4899', '#f59e0b']

const patterns = [
  {
    name: '4-7-8 Relaxing',
    icon: '🌙',
    subtitle: 'Deep relaxation',
    description: 'The 4-7-8 pattern activates your parasympathetic nervous system, slowing your heart rate and promoting calm. Great for sleep and anxiety.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 7 },
      { name: 'Exhale', duration: 8 },
    ],
  },
  {
    name: 'Box Breathing',
    icon: '📦',
    subtitle: 'Focus & calm',
    description: 'Used by Navy SEALs and first responders. Equal phases bring a balanced sense of calm and focus, perfect for stressful situations.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 4 },
      { name: 'Exhale', duration: 4 },
      { name: 'Hold', duration: 4 },
    ],
  },
  {
    name: 'Energizing',
    icon: '⚡',
    subtitle: 'Wake up',
    description: 'Quick, energizing breaths to boost alertness. Short inhale and exhale cycles stimulate your sympathetic nervous system.',
    phases: [
      { name: 'Inhale', duration: 2 },
      { name: 'Exhale', duration: 2 },
    ],
  },
  {
    name: 'Deep Calm',
    icon: '🌊',
    subtitle: 'Extended exhale',
    description: 'A longer exhale than inhale signals safety to your brain. This pattern is especially good for panic attacks and high anxiety moments.',
    phases: [
      { name: 'Inhale', duration: 4 },
      { name: 'Hold', duration: 2 },
      { name: 'Exhale', duration: 8 },
    ],
  },
]

const selectedPattern = ref('4-7-8 Relaxing')
const activePattern = ref(patterns[0])
const isRunning = ref(false)
const currentPhase = ref('idle')
const phaseLabel = ref('Ready')
const phaseTimer = ref('')
const isExpanded = ref(false)
const progressOffset = ref(678.58)

const totalBreaths = ref(0)
const totalSeconds = ref(0)
const totalCycles = ref(0)

let intervalId = null
let phaseIndex = 0
let phaseSec = 0
let secondsCounter = null

const selectPattern = (p) => {
  resetBreathing()
  selectedPattern.value = p.name
  activePattern.value = p
}

const toggleBreathing = () => {
  if (isRunning.value) {
    pauseBreathing()
  } else {
    startBreathing()
  }
}

const startBreathing = () => {
  isRunning.value = true
  phaseIndex = 0
  phaseSec = 0
  setPhaseState()
  
  intervalId = setInterval(() => {
    phaseSec++
    const phase = activePattern.value.phases[phaseIndex]
    const remaining = phase.duration - phaseSec

    if (remaining <= 0) {
      // Next phase
      if (phase.name === 'Inhale') totalBreaths.value++
      phaseIndex = (phaseIndex + 1) % activePattern.value.phases.length
      if (phaseIndex === 0) totalCycles.value++
      phaseSec = 0
      setPhaseState()
    } else {
      phaseTimer.value = remaining.toString()
      const totalPhaseDuration = phase.duration
      const elapsed = phaseSec / totalPhaseDuration
      // Progress for full cycle
      updateProgress()
    }
  }, 1000)

  secondsCounter = setInterval(() => { totalSeconds.value++ }, 1000)
}

const setPhaseState = () => {
  const phase = activePattern.value.phases[phaseIndex]
  phaseLabel.value = phase.name
  phaseTimer.value = phase.duration.toString()
  currentPhase.value = phase.name.toLowerCase().replace(' ', '-')
  isExpanded.value = phase.name === 'Inhale' || phase.name === 'Hold'
  updateProgress()
}

const updateProgress = () => {
  const phases = activePattern.value.phases
  const totalDuration = phases.reduce((s, p) => s + p.duration, 0)
  let elapsed = 0
  for (let i = 0; i < phaseIndex; i++) elapsed += phases[i].duration
  elapsed += phaseSec
  const pct = elapsed / totalDuration
  progressOffset.value = 678.58 * (1 - pct)
}

const pauseBreathing = () => {
  isRunning.value = false
  clearInterval(intervalId)
  clearInterval(secondsCounter)
}

const resetBreathing = () => {
  pauseBreathing()
  phaseLabel.value = 'Ready'
  phaseTimer.value = ''
  currentPhase.value = 'idle'
  isExpanded.value = false
  progressOffset.value = 678.58
  totalBreaths.value = 0
  totalSeconds.value = 0
  totalCycles.value = 0
  phaseIndex = 0
  phaseSec = 0
}

const formatTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

onUnmounted(() => {
  clearInterval(intervalId)
  clearInterval(secondsCounter)
})
</script>

<style scoped>
.breathing-hero {
  padding: 120px 0 40px;
  text-align: center;
}

.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--text-dim);
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.2s ease;
}
.back-link:hover { color: var(--primary-light); }

.breathing-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 700;
  margin-bottom: 12px;
}

.breathing-hero p { color: var(--text-muted); font-size: 16px; }

.breathing-content {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 80px;
}

/* Pattern Selector */
.patterns-bar {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-radius: var(--radius-xl);
  margin-bottom: 48px;
  border: 1px solid var(--border-light);
  justify-content: center;
  flex-wrap: wrap;
}

.pattern-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pattern-btn:hover { color: white; background: var(--surface-light); }
.pattern-btn.active {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.3);
}

/* Main breathing area */
.breathing-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 48px;
}

.circle-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin-bottom: 36px;
}

.ambient-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(124, 58, 237, 0.08);
  transition: all 1s ease;
}

.ring-1 {
  inset: -20px;
}

.ring-2 {
  inset: -44px;
}

.ring-1.active {
  animation: pulseRing 4s ease-in-out infinite;
}

.ring-2.active {
  animation: pulseRing 4s ease-in-out infinite 1s;
}

@keyframes pulseRing {
  0%, 100% { border-color: rgba(124, 58, 237, 0.05); transform: scale(1); }
  50% { border-color: rgba(124, 58, 237, 0.15); transform: scale(1.04); }
}

.breathing-circle {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  position: absolute;
  width: 100%;
  height: 100%;
}

.progress-arc {
  transition: stroke-dashoffset 0.8s ease;
}

.circle-inner {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 4s cubic-bezier(0.4, 0, 0.6, 1);
  border: 1px solid rgba(124, 58, 237, 0.1);
}

.circle-inner.expanded {
  transform: scale(1.15);
  background: rgba(124, 58, 237, 0.1);
  border-color: rgba(124, 58, 237, 0.25);
}

.phase-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-secondary);
}

.phase-timer {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: white;
}

.controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.session-stats {
  display: flex;
  gap: 12px;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 13px;
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

/* Pattern Details */
.pattern-details {
  padding: 28px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  margin-bottom: 32px;
}

.pattern-details h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
.pattern-details > p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }

.phase-breakdown { display: flex; gap: 16px; flex-wrap: wrap; }

.phase-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--surface-light);
  border-radius: var(--radius-sm);
  font-size: 13px;
}

.phase-dot { width: 8px; height: 8px; border-radius: 50%; }
.phase-name { font-weight: 500; }
.phase-duration { color: var(--text-dim); }

/* Tips */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.tip-card {
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.tip-card h4 { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
.tip-card p { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

@media (max-width: 768px) {
  .patterns-bar { flex-direction: column; }
  .tips-grid { grid-template-columns: 1fr; }
  .session-stats { flex-direction: column; align-items: center; }
}
</style>
