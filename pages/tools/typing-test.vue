<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>⌨️</span> Typing Speed Test</h1>
        <p>Test your typing speed and accuracy with real-time WPM tracking. Practice and improve!</p>
      </div>

      <!-- Mode selector -->
      <div class="mode-bar glass" v-if="!isActive && !isFinished">
        <button v-for="mode in modes" :key="mode.id" class="mode-btn" :class="{ active: selectedMode === mode.id }" @click="selectedMode = mode.id">
          <span>{{ mode.icon }}</span>
          <span>{{ mode.name }}</span>
        </button>
      </div>

      <!-- Duration selector -->
      <div class="duration-bar" v-if="!isActive && !isFinished">
        <button v-for="d in durations" :key="d" class="dur-btn" :class="{ active: duration === d }" @click="duration = d">
          {{ d }}s
        </button>
      </div>

      <!-- Main test area -->
      <div class="test-area glass">
        <!-- Stats bar during test -->
        <div class="live-stats" v-if="isActive">
          <div class="live-stat">
            <span class="live-val">{{ liveWPM }}</span>
            <span class="live-label">WPM</span>
          </div>
          <div class="live-stat">
            <span class="live-val">{{ liveAccuracy }}%</span>
            <span class="live-label">Accuracy</span>
          </div>
          <div class="live-stat">
            <span class="live-val timer-val" :class="{ warning: timeLeft <= 10 }">{{ timeLeft }}s</span>
            <span class="live-label">Time Left</span>
          </div>
        </div>

        <!-- Text display -->
        <div class="text-display" :class="{ active: isActive }" @click="focusInput">
          <span v-for="(char, i) in displayChars" :key="i"
            :class="['char', char.status, { current: i === currentIndex && isActive }]"
          >{{ char.char === ' ' ? '\u00A0' : char.char }}</span>
          <span class="cursor-blink" v-if="!isActive && !isFinished">|</span>
        </div>

        <!-- Hidden input -->
        <input 
          ref="inputRef"
          class="hidden-input"
          @input="handleInput"
          @keydown="handleKeydown"
          :disabled="isFinished"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />

        <!-- Start prompt -->
        <div class="start-prompt" v-if="!isActive && !isFinished" @click="focusInput">
          <p>Click here or start typing to begin</p>
        </div>

        <!-- Controls -->
        <div class="test-controls">
          <button class="btn btn-primary" @click="resetTest">
            🔄 {{ isFinished ? 'Try Again' : 'Reset' }}
          </button>
          <button class="btn btn-secondary" @click="generateText" v-if="!isActive">
            🎲 New Text
          </button>
        </div>
      </div>

      <!-- Results -->
      <div class="results-panel glass" v-if="isFinished">
        <h2>🏆 Results</h2>
        <div class="results-grid">
          <div class="result-card">
            <span class="r-icon">⚡</span>
            <span class="r-val">{{ finalWPM }}</span>
            <span class="r-label">WPM</span>
          </div>
          <div class="result-card">
            <span class="r-icon">🎯</span>
            <span class="r-val">{{ finalAccuracy }}%</span>
            <span class="r-label">Accuracy</span>
          </div>
          <div class="result-card">
            <span class="r-icon">✅</span>
            <span class="r-val">{{ correctChars }}</span>
            <span class="r-label">Correct</span>
          </div>
          <div class="result-card">
            <span class="r-icon">❌</span>
            <span class="r-val">{{ incorrectChars }}</span>
            <span class="r-label">Errors</span>
          </div>
          <div class="result-card">
            <span class="r-icon">📝</span>
            <span class="r-val">{{ totalCharsTyped }}</span>
            <span class="r-label">Characters</span>
          </div>
          <div class="result-card">
            <span class="r-icon">🏅</span>
            <span class="r-val">{{ wpmRank }}</span>
            <span class="r-label">Rank</span>
          </div>
        </div>

        <!-- WPM message -->
        <div class="wpm-message">
          <p>{{ wpmMessage }}</p>
        </div>
      </div>

      <!-- Personal Best -->
      <div class="best-panel glass" v-if="personalBest > 0">
        <div class="best-inner">
          <span class="best-icon">🏅</span>
          <div>
            <strong>Personal Best: {{ personalBest }} WPM</strong>
            <span>Keep practicing to beat your record!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Typing Speed Test — QuickHelp.lol' })

const modes = [
  { id: 'common', name: 'Common Words', icon: '📝' },
  { id: 'quotes', name: 'Quotes', icon: '💬' },
  { id: 'code', name: 'Code', icon: '💻' },
  { id: 'numbers', name: 'Numbers', icon: '🔢' },
]

const durations = [15, 30, 60, 120]

const selectedMode = ref('common')
const duration = ref(30)
const isActive = ref(false)
const isFinished = ref(false)
const timeLeft = ref(30)
const currentIndex = ref(0)
const inputRef = ref(null)
const personalBest = ref(0)

const correctChars = ref(0)
const incorrectChars = ref(0)
const totalCharsTyped = ref(0)

const sourceText = ref('')
const displayChars = ref([])

let timerInterval = null
let startTime = null

const wordLists = {
  common: 'the be to of and a in that have i it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us',
  quotes: 'the only way to do great work is to love what you do if you can dream it you can do it the future belongs to those who believe in the beauty of their dreams it does not matter how slowly you go as long as you do not stop in the middle of difficulty lies opportunity the best time to plant a tree was twenty years ago the second best time is now',
  code: 'function const let var return if else for while switch case break continue class import export default async await try catch throw new this console log error map filter reduce forEach push pop slice splice length toString parseInt',
  numbers: '1234 5678 9012 3456 7890 2468 1357 9876 5432 1098 7654 3210 4567 8901 2345 6789 1470 2580 3690 8520 9630 7410 1593 4826 7159',
}

const generateText = () => {
  const pool = wordLists[selectedMode.value]
  const words = pool.split(' ')
  const shuffled = []
  const count = duration.value <= 30 ? 50 : 120
  for (let i = 0; i < count; i++) {
    shuffled.push(words[Math.floor(Math.random() * words.length)])
  }
  sourceText.value = shuffled.join(' ')
  displayChars.value = sourceText.value.split('').map(char => ({ char, status: 'pending' }))
  currentIndex.value = 0
  correctChars.value = 0
  incorrectChars.value = 0
  totalCharsTyped.value = 0
}

const liveWPM = computed(() => {
  if (!startTime) return 0
  const elapsed = (Date.now() - startTime) / 1000 / 60
  if (elapsed < 0.01) return 0
  return Math.round((correctChars.value / 5) / elapsed)
})

const liveAccuracy = computed(() => {
  if (totalCharsTyped.value === 0) return 100
  return Math.round((correctChars.value / totalCharsTyped.value) * 100)
})

const finalWPM = ref(0)
const finalAccuracy = ref(0)

const wpmRank = computed(() => {
  const w = finalWPM.value
  if (w >= 120) return 'Legend'
  if (w >= 90) return 'Expert'
  if (w >= 70) return 'Advanced'
  if (w >= 50) return 'Proficient'
  if (w >= 35) return 'Average'
  if (w >= 20) return 'Beginner'
  return 'Novice'
})

const wpmMessage = computed(() => {
  const w = finalWPM.value
  if (w >= 120) return '🔥 Incredible! You type faster than 99% of people!'
  if (w >= 90) return '🌟 Amazing speed! You\'re a typing expert!'
  if (w >= 70) return '💪 Great job! Above average typing speed!'
  if (w >= 50) return '👍 Nice work! You\'re at a solid professional level.'
  if (w >= 35) return '📈 Good start! Keep practicing to improve.'
  return '🌱 Everyone starts somewhere. Keep at it!'
})

const focusInput = () => {
  inputRef.value?.focus()
}

const handleInput = (e) => {
  if (isFinished.value) return
  
  if (!isActive.value) {
    isActive.value = true
    startTime = Date.now()
    timeLeft.value = duration.value
    timerInterval = setInterval(() => {
      timeLeft.value--
      if (timeLeft.value <= 0) finishTest()
    }, 1000)
  }

  const typed = e.data
  if (!typed) return

  for (const char of typed) {
    if (currentIndex.value >= displayChars.value.length) {
      finishTest()
      return
    }

    totalCharsTyped.value++
    if (char === displayChars.value[currentIndex.value].char) {
      displayChars.value[currentIndex.value].status = 'correct'
      correctChars.value++
    } else {
      displayChars.value[currentIndex.value].status = 'incorrect'
      incorrectChars.value++
    }
    currentIndex.value++
  }

  // Clear input to keep it short
  if (inputRef.value) inputRef.value.value = ''
}

const handleKeydown = (e) => {
  if (e.key === 'Backspace' && currentIndex.value > 0) {
    e.preventDefault()
    currentIndex.value--
    displayChars.value[currentIndex.value].status = 'pending'
    totalCharsTyped.value = Math.max(0, totalCharsTyped.value - 1)
  }
}

const finishTest = () => {
  clearInterval(timerInterval)
  isActive.value = false
  isFinished.value = true

  const elapsed = (Date.now() - startTime) / 1000 / 60
  finalWPM.value = Math.round((correctChars.value / 5) / Math.max(elapsed, 0.01))
  finalAccuracy.value = totalCharsTyped.value > 0
    ? Math.round((correctChars.value / totalCharsTyped.value) * 100)
    : 0

  if (finalWPM.value > personalBest.value) {
    personalBest.value = finalWPM.value
    localStorage.setItem('quickhelp-typing-best', String(personalBest.value))
  }
}

const resetTest = () => {
  clearInterval(timerInterval)
  isActive.value = false
  isFinished.value = false
  startTime = null
  timeLeft.value = duration.value
  currentIndex.value = 0
  correctChars.value = 0
  incorrectChars.value = 0
  totalCharsTyped.value = 0
  finalWPM.value = 0
  finalAccuracy.value = 0
  generateText()
  nextTick(() => focusInput())
}

onMounted(() => {
  generateText()
  const saved = localStorage.getItem('quickhelp-typing-best')
  if (saved) personalBest.value = parseInt(saved) || 0
})

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

<style scoped>
.tool-page { min-height: 100vh; padding: 120px 0 80px; }
.container { max-width: 900px; margin: 0 auto; padding: 0 24px; }

.tool-header { margin-bottom: 40px; }
.back-link { color: var(--text-muted); font-size: 14px; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back-link:hover { color: var(--primary-light); }
.tool-header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.tool-header h1 span { margin-right: 12px; }
.tool-header p { font-size: 18px; color: var(--text-muted); max-width: 600px; line-height: 1.7; }

.mode-bar {
  display: flex;
  gap: 8px;
  padding: 8px;
  margin-bottom: 20px;
  width: fit-content;
}

.mode-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 18px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.mode-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
.mode-btn:hover:not(.active) { color: white; border-color: var(--border); }

.duration-bar { display: flex; gap: 8px; margin-bottom: 24px; }

.dur-btn {
  padding: 8px 20px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-full);
  color: var(--text-muted);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s;
}

.dur-btn.active { background: var(--surface-lighter); color: white; border-color: var(--primary); }

.test-area { padding: 32px; margin-bottom: 24px; }

.live-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
}

.live-stat { text-align: center; }
.live-val { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: var(--primary-light); }
.live-val.warning { color: #ef4444; }
.live-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }

.text-display {
  font-size: 20px;
  line-height: 2;
  padding: 24px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-light);
  margin-bottom: 20px;
  cursor: text;
  user-select: none;
  min-height: 150px;
  position: relative;
  overflow: hidden;
  max-height: 200px;
}

.text-display.active { border-color: var(--primary); }

.char { transition: color 0.1s; }
.char.pending { color: var(--text-dim); }
.char.correct { color: #4ade80; }
.char.incorrect { color: #ef4444; background: rgba(239,68,68,0.15); border-radius: 2px; }
.char.current { border-bottom: 2px solid var(--primary); }

.cursor-blink { animation: blink 1s infinite; color: var(--primary); font-weight: 100; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

.hidden-input { position: absolute; opacity: 0; width: 1px; height: 1px; }

.start-prompt {
  text-align: center;
  padding: 16px;
  cursor: pointer;
}

.start-prompt p { color: var(--text-muted); font-size: 16px; }

.test-controls { display: flex; gap: 12px; justify-content: center; }

.results-panel { padding: 40px; text-align: center; margin-bottom: 24px; }
.results-panel h2 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; margin-bottom: 28px; }

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.result-card {
  padding: 20px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  text-align: center;
}

.r-icon { font-size: 24px; display: block; margin-bottom: 8px; }
.r-val { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 32px; font-weight: 700; color: var(--primary-light); }
.r-label { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

.wpm-message { font-size: 18px; color: var(--text-secondary); padding: 16px; }

.best-panel { padding: 20px; margin-bottom: 24px; }
.best-inner { display: flex; align-items: center; gap: 16px; }
.best-icon { font-size: 36px; }
.best-inner strong { display: block; font-size: 16px; color: #fbbf24; }
.best-inner span { font-size: 13px; color: var(--text-muted); }

.btn { padding: 12px 24px; border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.2s; font-family: inherit; }
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-secondary { background: var(--surface-light); color: white; border: 1px solid var(--border-light); }
.btn-secondary:hover { border-color: var(--primary); }

@media (max-width: 600px) {
  .tool-header h1 { font-size: 28px; }
  .mode-bar { flex-wrap: wrap; width: 100%; }
  .results-grid { grid-template-columns: repeat(2, 1fr); }
  .live-stats { gap: 20px; }
  .live-val { font-size: 24px; }
  .text-display { font-size: 16px; }
}
</style>
