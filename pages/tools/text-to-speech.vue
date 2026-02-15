<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>🗣️</span> Text to Speech</h1>
        <p>Convert any text to natural speech in 50+ languages. Works offline using your browser's built-in TTS engine.</p>
      </div>

      <div class="tts-layout">
        <!-- Main Input -->
        <div class="tts-main glass">
          <div class="textarea-wrapper">
            <textarea
              v-model="text"
              class="tts-input"
              placeholder="Type or paste any text here... supports all languages 🌍"
              rows="8"
            ></textarea>
            <div class="char-count">{{ text.length }} characters · {{ wordCount }} words</div>
          </div>

          <!-- Controls -->
          <div class="tts-controls">
            <button class="btn btn-primary btn-lg" @click="toggleSpeak" :disabled="!text.trim()">
              <span v-if="!isSpeaking">▶ Speak</span>
              <span v-else-if="isPaused">▶ Resume</span>
              <span v-else>⏸ Pause</span>
            </button>
            <button class="btn btn-secondary" @click="stopSpeaking" :disabled="!isSpeaking">
              ⏹ Stop
            </button>
          </div>

          <!-- Voice Settings -->
          <div class="settings-grid">
            <div class="setting-item">
              <label>Voice</label>
              <select v-model="selectedVoice" class="input select-input">
                <option v-for="voice in voices" :key="voice.name" :value="voice.name">
                  {{ voice.name }} ({{ voice.lang }})
                </option>
              </select>
            </div>
            <div class="setting-item">
              <label>Language Filter</label>
              <select v-model="langFilter" class="input select-input" @change="filterVoices">
                <option value="all">All Languages</option>
                <option v-for="lang in availableLangs" :key="lang.code" :value="lang.code">
                  {{ lang.name }}
                </option>
              </select>
            </div>
            <div class="setting-item">
              <label>Speed: {{ rate.toFixed(1) }}x</label>
              <input type="range" min="0.1" max="3" step="0.1" v-model.number="rate" class="slider" />
            </div>
            <div class="setting-item">
              <label>Pitch: {{ pitch.toFixed(1) }}</label>
              <input type="range" min="0" max="2" step="0.1" v-model.number="pitch" class="slider" />
            </div>
            <div class="setting-item">
              <label>Volume: {{ Math.round(volume * 100) }}%</label>
              <input type="range" min="0" max="1" step="0.05" v-model.number="volume" class="slider" />
            </div>
          </div>
        </div>

        <!-- Side Panel -->
        <div class="side-panel">
          <!-- Quick Phrases -->
          <div class="panel-card glass">
            <h3>⚡ Quick Phrases</h3>
            <div class="quick-phrases">
              <button v-for="phrase in quickPhrases" :key="phrase.text" class="phrase-btn" @click="text = phrase.text; toggleSpeak()">
                <span>{{ phrase.icon }}</span>
                <span>{{ phrase.label }}</span>
              </button>
            </div>
          </div>

          <!-- Presets -->
          <div class="panel-card glass">
            <h3>🎭 Voice Presets</h3>
            <div class="presets-list">
              <button class="preset-btn" @click="applyPreset('normal')">
                <span class="preset-icon">🎙️</span>
                <div>
                  <strong>Normal</strong>
                  <span>Default settings</span>
                </div>
              </button>
              <button class="preset-btn" @click="applyPreset('slow')">
                <span class="preset-icon">🐢</span>
                <div>
                  <strong>Slow & Clear</strong>
                  <span>Speed 0.6x, good for learning</span>
                </div>
              </button>
              <button class="preset-btn" @click="applyPreset('fast')">
                <span class="preset-icon">⚡</span>
                <div>
                  <strong>Speed Read</strong>
                  <span>Speed 1.8x, quick preview</span>
                </div>
              </button>
              <button class="preset-btn" @click="applyPreset('deep')">
                <span class="preset-icon">🎵</span>
                <div>
                  <strong>Deep Voice</strong>
                  <span>Low pitch, dramatic</span>
                </div>
              </button>
              <button class="preset-btn" @click="applyPreset('high')">
                <span class="preset-icon">✨</span>
                <div>
                  <strong>High Pitch</strong>
                  <span>High pitch, energetic</span>
                </div>
              </button>
            </div>
          </div>

          <!-- History -->
          <div class="panel-card glass">
            <h3>📜 Recent</h3>
            <div v-if="history.length === 0" class="empty-mini">No history yet</div>
            <div v-else class="history-list">
              <div v-for="(item, i) in history.slice(-5).reverse()" :key="i" class="history-item" @click="text = item">
                {{ item.length > 60 ? item.slice(0, 60) + '...' : item }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="tips-section">
        <div class="tip-card glass">
          <h4>🌍 Multi-language</h4>
          <p>Type in any language — the browser will auto-detect and use the right pronunciation.</p>
        </div>
        <div class="tip-card glass">
          <h4>📱 Works Offline</h4>
          <p>Uses your browser's built-in speech engine. No internet needed after page load.</p>
        </div>
        <div class="tip-card glass">
          <h4>♿ Accessibility</h4>
          <p>Perfect for screen reading, language learning, or proofreading your writing.</p>
        </div>
        <div class="tip-card glass">
          <h4>🎓 Study Aid</h4>
          <p>Listen to flashcard answers, quiz questions, or study notes while doing other tasks.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Text to Speech — QuickHelp.lol' })

const text = ref('')
const rate = ref(1)
const pitch = ref(1)
const volume = ref(1)
const isSpeaking = ref(false)
const isPaused = ref(false)
const voices = ref([])
const selectedVoice = ref('')
const langFilter = ref('all')
const history = ref([])

const wordCount = computed(() => text.value.trim().split(/\s+/).filter(w => w).length)

const availableLangs = computed(() => {
  const langs = new Map()
  for (const v of voices.value) {
    const code = v.lang.split('-')[0]
    if (!langs.has(code)) {
      const name = new Intl.DisplayNames(['en'], { type: 'language' })
      try { langs.set(code, { code, name: name.of(code) }) } catch { langs.set(code, { code, name: code }) }
    }
  }
  return [...langs.values()].sort((a, b) => a.name.localeCompare(b.name))
})

const quickPhrases = [
  { icon: '👋', label: 'Hello!', text: 'Hello! Welcome to QuickHelp. How are you today?' },
  { icon: '🇫🇷', label: 'French', text: 'Bonjour le monde! Comment ça va aujourd\'hui?' },
  { icon: '🇪🇸', label: 'Spanish', text: '¡Hola mundo! ¿Cómo estás hoy?' },
  { icon: '🇩🇪', label: 'German', text: 'Hallo Welt! Wie geht es dir heute?' },
  { icon: '🇯🇵', label: 'Japanese', text: 'こんにちは世界！今日は元気ですか？' },
  { icon: '🇰🇷', label: 'Korean', text: '안녕하세요 세계! 오늘 기분이 어떠세요?' },
  { icon: '🇨🇳', label: 'Chinese', text: '你好世界！你今天怎么样？' },
  { icon: '🇸🇦', label: 'Arabic', text: 'مرحبا بالعالم! كيف حالك اليوم؟' },
]

const loadVoices = () => {
  const synth = window.speechSynthesis
  let allVoices = synth.getVoices()
  if (allVoices.length === 0) {
    synth.onvoiceschanged = () => {
      allVoices = synth.getVoices()
      voices.value = allVoices
      if (allVoices.length > 0 && !selectedVoice.value) {
        selectedVoice.value = allVoices[0].name
      }
    }
  } else {
    voices.value = allVoices
    if (!selectedVoice.value) selectedVoice.value = allVoices[0].name
  }
}

const filterVoices = () => {
  const synth = window.speechSynthesis
  const allVoices = synth.getVoices()
  if (langFilter.value === 'all') {
    voices.value = allVoices
  } else {
    voices.value = allVoices.filter(v => v.lang.startsWith(langFilter.value))
  }
  if (voices.value.length > 0) selectedVoice.value = voices.value[0].name
}

const toggleSpeak = () => {
  if (isSpeaking.value && !isPaused.value) {
    window.speechSynthesis.pause()
    isPaused.value = true
    return
  }
  if (isPaused.value) {
    window.speechSynthesis.resume()
    isPaused.value = false
    return
  }
  startSpeak()
}

const startSpeak = () => {
  if (!text.value.trim()) return
  window.speechSynthesis.cancel()

  const utter = new SpeechSynthesisUtterance(text.value)
  const voice = window.speechSynthesis.getVoices().find(v => v.name === selectedVoice.value)
  if (voice) {
    utter.voice = voice
    utter.lang = voice.lang
  }
  utter.rate = rate.value
  utter.pitch = pitch.value
  utter.volume = volume.value
  utter.onend = () => { isSpeaking.value = false; isPaused.value = false }
  utter.onerror = () => { isSpeaking.value = false; isPaused.value = false }

  isSpeaking.value = true
  isPaused.value = false
  window.speechSynthesis.speak(utter)

  // Save to history
  if (!history.value.includes(text.value.trim())) {
    history.value.push(text.value.trim())
    if (history.value.length > 20) history.value.shift()
    localStorage.setItem('quickhelp-tts-history', JSON.stringify(history.value))
  }
}

const stopSpeaking = () => {
  window.speechSynthesis.cancel()
  isSpeaking.value = false
  isPaused.value = false
}

const applyPreset = (preset) => {
  switch (preset) {
    case 'normal': rate.value = 1; pitch.value = 1; volume.value = 1; break
    case 'slow': rate.value = 0.6; pitch.value = 1; volume.value = 1; break
    case 'fast': rate.value = 1.8; pitch.value = 1; volume.value = 1; break
    case 'deep': rate.value = 0.85; pitch.value = 0.3; volume.value = 1; break
    case 'high': rate.value = 1.1; pitch.value = 1.8; volume.value = 1; break
  }
}

onMounted(() => {
  loadVoices()
  const saved = localStorage.getItem('quickhelp-tts-history')
  if (saved) try { history.value = JSON.parse(saved) } catch {}
})

onUnmounted(() => {
  stopSpeaking()
})
</script>

<style scoped>
.tool-page { min-height: 100vh; padding: 120px 0 80px; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

.tool-header { margin-bottom: 48px; }
.back-link { color: var(--text-muted); font-size: 14px; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back-link:hover { color: var(--primary-light); }
.tool-header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.tool-header h1 span { margin-right: 12px; }
.tool-header p { font-size: 18px; color: var(--text-muted); max-width: 600px; line-height: 1.7; }

.tts-layout {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
  align-items: start;
}

.tts-main { padding: 32px; }

.textarea-wrapper { position: relative; margin-bottom: 20px; }

.tts-input {
  width: 100%;
  min-height: 200px;
  padding: 20px;
  font-size: 16px;
  line-height: 1.8;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  color: white;
  resize: vertical;
  font-family: inherit;
}

.tts-input:focus { outline: none; border-color: var(--primary); }
.tts-input::placeholder { color: var(--text-dim); }

.char-count {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 12px;
  color: var(--text-dim);
}

.tts-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.setting-item { display: flex; flex-direction: column; gap: 6px; }
.setting-item label { font-size: 13px; color: var(--text-muted); font-weight: 500; }

.slider {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--surface);
  border-radius: 3px;
  outline: none;
  margin-top: 4px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  transition: transform 0.2s;
}

.slider::-webkit-slider-thumb:hover { transform: scale(1.2); }

.side-panel { display: flex; flex-direction: column; gap: 20px; }

.panel-card { padding: 20px; }
.panel-card h3 { font-size: 16px; margin-bottom: 16px; }

.quick-phrases {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.phrase-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.phrase-btn:hover { border-color: var(--primary); background: var(--surface-light); }

.presets-list { display: flex; flex-direction: column; gap: 8px; }

.preset-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.preset-btn:hover { border-color: var(--primary); }
.preset-icon { font-size: 24px; }
.preset-btn strong { display: block; font-size: 14px; }
.preset-btn span { font-size: 12px; color: var(--text-muted); }

.history-list { display: flex; flex-direction: column; gap: 6px; }

.history-item {
  padding: 10px;
  background: var(--surface);
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover { color: white; background: var(--surface-light); }

.empty-mini { font-size: 13px; color: var(--text-dim); text-align: center; padding: 16px; }

.tips-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 48px;
}

.tip-card { padding: 24px; }
.tip-card h4 { font-size: 16px; margin-bottom: 8px; }
.tip-card p { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

.input {
  padding: 10px 14px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: white;
  font-size: 14px;
  width: 100%;
}

.input:focus { outline: none; border-color: var(--primary); }

.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  font-family: inherit;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); }
.btn-secondary { background: var(--surface-light); color: white; border: 1px solid var(--border-light); }
.btn-secondary:hover:not(:disabled) { border-color: var(--primary); }
.btn-lg { padding: 14px 32px; font-size: 16px; }

@media (max-width: 900px) {
  .tts-layout { grid-template-columns: 1fr; }
  .tips-section { grid-template-columns: repeat(2, 1fr); }
  .settings-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .tool-header h1 { font-size: 28px; }
  .tips-section { grid-template-columns: 1fr; }
  .quick-phrases { grid-template-columns: 1fr; }
}
</style>
