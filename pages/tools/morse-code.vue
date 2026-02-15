<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>📡</span> Morse Code Translator</h1>
        <p>Convert text to Morse code and back. Includes audio playback and visual signals.</p>
      </div>

      <div class="morse-layout">
        <!-- Input Panel -->
        <div class="panel glass">
          <div class="panel-header">
            <h3>{{ direction === 'text' ? '📝 Text' : '📡 Morse Code' }}</h3>
            <button class="swap-btn" @click="swapDirection" title="Swap direction">🔄</button>
          </div>
          <textarea 
            v-model="input" 
            class="morse-input"
            :placeholder="direction === 'text' ? 'Type your text here...' : 'Type morse code (use . and -, space between letters, / between words)'"
            @input="convert"
          ></textarea>
          <div class="input-actions">
            <button class="btn btn-ghost btn-sm" @click="input = ''; output = ''">Clear</button>
            <button class="btn btn-ghost btn-sm" @click="pasteClipboard">📋 Paste</button>
            <span class="char-info">{{ input.length }} chars</span>
          </div>
        </div>

        <!-- Output Panel -->
        <div class="panel glass">
          <div class="panel-header">
            <h3>{{ direction === 'text' ? '📡 Morse Code' : '📝 Text' }}</h3>
            <button class="btn btn-ghost btn-sm" @click="copyOutput">{{ copied ? '✓ Copied!' : '📋 Copy' }}</button>
          </div>
          <div class="morse-output" :class="{ 'morse-font': direction === 'text' }">
            {{ output || 'Translation will appear here...' }}
          </div>
        </div>
      </div>

      <!-- Playback Controls -->
      <div class="playback-section glass" v-if="morseOutput">
        <h3>🔊 Audio & Visual</h3>
        <div class="playback-controls">
          <button class="btn btn-primary" @click="playMorse" :disabled="isPlaying">
            {{ isPlaying ? '🔊 Playing...' : '▶ Play Morse' }}
          </button>
          <button class="btn btn-secondary" @click="stopMorse" :disabled="!isPlaying">
            ⏹ Stop
          </button>
          <div class="speed-control">
            <label>Speed: {{ wpm }} WPM</label>
            <input type="range" min="5" max="30" v-model.number="wpm" class="slider" />
          </div>
          <div class="freq-control">
            <label>Frequency: {{ frequency }}Hz</label>
            <input type="range" min="300" max="1200" step="50" v-model.number="frequency" class="slider" />
          </div>
        </div>

        <!-- Visual Signal -->
        <div class="signal-display" v-if="isPlaying">
          <div class="signal-light" :class="{ on: signalOn }"></div>
          <span class="signal-char">{{ currentPlayChar }}</span>
        </div>
      </div>

      <!-- Morse Code Reference -->
      <div class="reference-section glass">
        <h3>📖 Morse Code Reference</h3>
        <div class="ref-tabs">
          <button class="ref-tab" :class="{ active: refTab === 'letters' }" @click="refTab = 'letters'">Letters</button>
          <button class="ref-tab" :class="{ active: refTab === 'numbers' }" @click="refTab = 'numbers'">Numbers</button>
          <button class="ref-tab" :class="{ active: refTab === 'punctuation' }" @click="refTab = 'punctuation'">Punctuation</button>
        </div>
        <div class="ref-grid">
          <div v-for="item in refItems" :key="item.char" class="ref-item" @click="input += item.char; convert()">
            <span class="ref-char">{{ item.char }}</span>
            <span class="ref-morse">{{ item.morse }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Morse Code Translator — QuickHelp.lol' })

const MORSE_MAP = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
  "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
  '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/'
}

const REVERSE_MAP = {}
for (const [k, v] of Object.entries(MORSE_MAP)) {
  if (k !== ' ') REVERSE_MAP[v] = k
}

const direction = ref('text') // 'text' or 'morse'
const input = ref('')
const output = ref('')
const copied = ref(false)
const refTab = ref('letters')
const isPlaying = ref(false)
const signalOn = ref(false)
const currentPlayChar = ref('')
const wpm = ref(15)
const frequency = ref(700)

let audioCtx = null
let playTimeout = null

const morseOutput = computed(() => direction.value === 'text' ? output.value : input.value)

const refItems = computed(() => {
  const entries = Object.entries(MORSE_MAP).filter(([k]) => k !== ' ')
  switch (refTab.value) {
    case 'letters': return entries.filter(([k]) => /[A-Z]/.test(k)).map(([char, morse]) => ({ char, morse }))
    case 'numbers': return entries.filter(([k]) => /[0-9]/.test(k)).map(([char, morse]) => ({ char, morse }))
    case 'punctuation': return entries.filter(([k]) => !/[A-Z0-9]/.test(k)).map(([char, morse]) => ({ char, morse }))
    default: return []
  }
})

const convert = () => {
  if (direction.value === 'text') {
    output.value = textToMorse(input.value)
  } else {
    output.value = morseToText(input.value)
  }
}

const textToMorse = (text) => {
  return text.toUpperCase().split('').map(ch => MORSE_MAP[ch] || ch).join(' ')
}

const morseToText = (morse) => {
  return morse.split(' / ').map(word =>
    word.split(' ').map(ch => REVERSE_MAP[ch] || ch).join('')
  ).join(' ')
}

const swapDirection = () => {
  direction.value = direction.value === 'text' ? 'morse' : 'text'
  const temp = input.value
  input.value = output.value
  output.value = temp
}

const copyOutput = async () => {
  if (!output.value) return
  try {
    await navigator.clipboard.writeText(output.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch {}
}

const pasteClipboard = async () => {
  try {
    input.value = await navigator.clipboard.readText()
    convert()
  } catch {}
}

const playMorse = async () => {
  const morse = direction.value === 'text' ? output.value : input.value
  if (!morse || isPlaying.value) return

  audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  isPlaying.value = true

  const dotDuration = 1200 / wpm.value // ms
  const dashDuration = dotDuration * 3
  const symbolGap = dotDuration
  const letterGap = dotDuration * 3
  const wordGap = dotDuration * 7

  const symbols = morse.split('')
  let delay = 0

  for (let i = 0; i < symbols.length; i++) {
    const sym = symbols[i]
    if (sym === '.') {
      scheduleBeep(delay, dotDuration * 0.9, sym)
      delay += dotDuration + symbolGap
    } else if (sym === '-') {
      scheduleBeep(delay, dashDuration * 0.9, sym)
      delay += dashDuration + symbolGap
    } else if (sym === '/') {
      delay += wordGap
    } else if (sym === ' ') {
      delay += letterGap
    }
  }

  playTimeout = setTimeout(() => {
    isPlaying.value = false
    signalOn.value = false
    currentPlayChar.value = ''
  }, delay + 200)
}

const scheduleBeep = (delay, duration, char) => {
  setTimeout(() => {
    if (!isPlaying.value) return
    currentPlayChar.value = char
    signalOn.value = true

    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.frequency.value = frequency.value
    osc.type = 'sine'
    gain.gain.value = 0.3

    const now = audioCtx.currentTime
    osc.start(now)
    osc.stop(now + duration / 1000)

    setTimeout(() => { signalOn.value = false }, duration)
  }, delay)
}

const stopMorse = () => {
  isPlaying.value = false
  signalOn.value = false
  currentPlayChar.value = ''
  clearTimeout(playTimeout)
  if (audioCtx) {
    audioCtx.close()
    audioCtx = null
  }
}

onUnmounted(() => stopMorse())
</script>

<style scoped>
.tool-page { min-height: 100vh; padding: 120px 0 80px; }
.container { max-width: 900px; margin: 0 auto; padding: 0 24px; }

.tool-header { margin-bottom: 40px; }
.back-link { color: var(--text-muted); font-size: 14px; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back-link:hover { color: var(--primary-light); }
.tool-header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.tool-header h1 span { margin-right: 12px; }
.tool-header p { font-size: 18px; color: var(--text-muted); line-height: 1.7; }

.morse-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }

.panel { padding: 24px; }
.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.panel-header h3 { font-size: 16px; }

.swap-btn {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border-light);
  cursor: pointer; font-size: 18px; transition: all 0.2s;
}
.swap-btn:hover { background: var(--surface-light); transform: rotate(180deg); }

.morse-input {
  width: 100%; min-height: 160px; padding: 16px;
  font-size: 16px; line-height: 1.8;
  background: var(--surface); border: 1px solid var(--border-light);
  border-radius: 12px; color: white; resize: vertical; font-family: inherit;
}
.morse-input:focus { outline: none; border-color: var(--primary); }
.morse-input::placeholder { color: var(--text-dim); }

.input-actions { display: flex; gap: 8px; align-items: center; margin-top: 12px; }
.char-info { font-size: 12px; color: var(--text-dim); margin-left: auto; }

.morse-output {
  min-height: 160px; padding: 16px;
  background: var(--surface); border-radius: 12px;
  font-size: 16px; line-height: 1.8; color: var(--text-secondary);
  word-break: break-all;
}

.morse-font { font-family: 'Space Grotesk', monospace; font-size: 20px; letter-spacing: 4px; color: var(--primary-light); }

.playback-section { padding: 24px; margin-bottom: 24px; }
.playback-section h3 { font-size: 18px; margin-bottom: 16px; }

.playback-controls {
  display: flex; flex-wrap: wrap; gap: 16px; align-items: center;
}

.speed-control, .freq-control { display: flex; flex-direction: column; gap: 4px; }
.speed-control label, .freq-control label { font-size: 12px; color: var(--text-muted); }

.slider {
  width: 120px; height: 6px; -webkit-appearance: none; appearance: none;
  background: var(--surface); border-radius: 3px; outline: none;
}
.slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 16px; height: 16px;
  border-radius: 50%; background: var(--primary); cursor: pointer;
}

.signal-display { display: flex; align-items: center; gap: 20px; margin-top: 20px; justify-content: center; }

.signal-light {
  width: 60px; height: 60px; border-radius: 50%;
  background: var(--surface); border: 3px solid var(--border-light);
  transition: all 0.05s;
}

.signal-light.on {
  background: #fbbf24;
  box-shadow: 0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.3);
  border-color: #fbbf24;
}

.signal-char { font-family: 'Space Grotesk', monospace; font-size: 40px; font-weight: 700; color: var(--primary-light); }

.reference-section { padding: 24px; }
.reference-section h3 { font-size: 18px; margin-bottom: 16px; }

.ref-tabs { display: flex; gap: 8px; margin-bottom: 16px; }

.ref-tab {
  padding: 8px 18px; background: var(--surface); border: 1px solid var(--border-light);
  border-radius: var(--radius-full); color: var(--text-muted); cursor: pointer;
  font-size: 13px; font-weight: 600; transition: all 0.2s;
}
.ref-tab.active { background: var(--primary); color: white; border-color: var(--primary); }

.ref-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 8px; }

.ref-item {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 12px; background: var(--surface); border-radius: 10px;
  cursor: pointer; transition: all 0.2s; border: 1px solid transparent;
}
.ref-item:hover { border-color: var(--primary); background: var(--surface-light); }

.ref-char { font-size: 20px; font-weight: 700; }
.ref-morse { font-family: 'Space Grotesk', monospace; font-size: 14px; color: var(--primary-light); letter-spacing: 2px; }

.btn { padding: 10px 20px; border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.2s; font-family: inherit; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); }
.btn-secondary { background: var(--surface-light); color: white; border: 1px solid var(--border-light); }
.btn-ghost { background: transparent; color: var(--text-muted); border: none; }
.btn-ghost:hover { color: white; }
.btn-sm { padding: 6px 14px; font-size: 13px; }

@media (max-width: 700px) {
  .morse-layout { grid-template-columns: 1fr; }
  .tool-header h1 { font-size: 28px; }
  .playback-controls { flex-direction: column; align-items: stretch; }
  .ref-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }
}
</style>
