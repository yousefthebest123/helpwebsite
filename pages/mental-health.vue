<template>
  <div class="mental-health-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <span class="hero-badge">💜 You Matter</span>
          <h1>Mental Health Support</h1>
          <p>
            It's okay to not be okay. We're here to help with breathing exercises, 
            mood tracking, coping techniques, and resources to support your well-being.
          </p>
        </div>
      </div>
    </section>

    <!-- Quick Actions -->
    <section class="quick-actions scroll-reveal">
      <div class="container">
        <div class="actions-grid">
          <button class="action-card" @click="openBreathing">
            <span class="action-icon">🌬️</span>
            <h3>Breathing Exercise</h3>
            <p>Calm your mind with guided breathing</p>
          </button>
          <NuxtLink to="/tools/timer" class="action-card">
            <span class="action-icon">🧘</span>
            <h3>Meditation Timer</h3>
            <p>Focus and relax with ambient sounds</p>
          </NuxtLink>
          <button class="action-card" @click="openMoodTracker">
            <span class="action-icon">📊</span>
            <h3>Mood Check-In</h3>
            <p>Track how you're feeling today</p>
          </button>
          <button class="action-card" @click="openJournal">
            <span class="action-icon">📔</span>
            <h3>Quick Journal</h3>
            <p>Write down your thoughts privately</p>
          </button>
        </div>
      </div>
    </section>

    <!-- Breathing Exercise Modal -->
    <div class="modal-overlay" v-if="showBreathing" @click.self="showBreathing = false">
      <div class="breathing-modal glass animate-fade-in-up">
        <button class="modal-close" @click="showBreathing = false">×</button>
        
        <h2>🌬️ Breathing Exercise</h2>
        <p class="breathing-instruction">{{ breathingInstruction }}</p>
        
        <div class="breathing-visual">
          <div :class="['breath-circle', breathingPhase]">
            <span class="breath-timer">{{ breathingTimer }}</span>
          </div>
        </div>
        
        <div class="breathing-controls">
          <button 
            v-if="!breathingActive"
            class="btn btn-primary btn-lg"
            @click="startBreathing"
          >
            Start Breathing
          </button>
          <button 
            v-else
            class="btn btn-secondary btn-lg"
            @click="stopBreathing"
          >
            Stop
          </button>
        </div>
        
        <div class="breathing-patterns">
          <button 
            v-for="pattern in breathingPatterns"
            :key="pattern.name"
            :class="['pattern-btn', { active: currentPattern.name === pattern.name }]"
            @click="selectPattern(pattern)"
          >
            {{ pattern.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Mood Tracker Modal -->
    <div class="modal-overlay" v-if="showMoodTracker" @click.self="showMoodTracker = false">
      <div class="mood-modal glass animate-fade-in-up">
        <button class="modal-close" @click="showMoodTracker = false">×</button>
        
        <h2>📊 How are you feeling?</h2>
        <p>Select the emoji that best describes your mood right now.</p>
        
        <div class="mood-selector">
          <button 
            v-for="mood in moods"
            :key="mood.value"
            :class="['mood-btn', { selected: selectedMood === mood.value }]"
            @click="selectedMood = mood.value"
          >
            <span class="mood-emoji">{{ mood.emoji }}</span>
            <span class="mood-label">{{ mood.label }}</span>
          </button>
        </div>
        
        <div class="mood-note" v-if="selectedMood">
          <label>What's on your mind? (optional)</label>
          <textarea 
            v-model="moodNote"
            class="input"
            placeholder="Write anything that comes to mind..."
            rows="3"
          ></textarea>
        </div>
        
        <button 
          class="btn btn-primary btn-lg"
          :disabled="!selectedMood"
          @click="saveMood"
        >
          Save Check-In
        </button>
        
        <div class="mood-history" v-if="moodHistory.length > 0">
          <h4>Recent Check-Ins</h4>
          <div class="history-list">
            <div v-for="entry in recentMoods" :key="entry.id" class="history-item">
              <span class="history-emoji">{{ getMoodEmoji(entry.mood) }}</span>
              <div class="history-info">
                <span class="history-date">{{ formatDate(entry.date) }}</span>
                <span class="history-note" v-if="entry.note">{{ entry.note }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Journal Modal -->
    <div class="modal-overlay" v-if="showJournal" @click.self="showJournal = false">
      <div class="journal-modal glass animate-fade-in-up">
        <button class="modal-close" @click="showJournal = false">×</button>
        
        <h2>📔 Quick Journal</h2>
        <p>Write freely. Your thoughts stay private in your browser.</p>
        
        <div class="journal-prompts">
          <span>Try: </span>
          <button @click="journalEntry = 'Today I am grateful for...'">Gratitude</button>
          <button @click="journalEntry = 'Right now I am feeling...'">Feelings</button>
          <button @click="journalEntry = 'Something that made me smile today was...'">Positivity</button>
        </div>
        
        <textarea 
          v-model="journalEntry"
          class="journal-textarea"
          placeholder="Start writing..."
        ></textarea>
        
        <div class="journal-actions">
          <button class="btn btn-secondary" @click="clearJournal">
            Clear
          </button>
          <button class="btn btn-primary" @click="saveJournal">
            Save Entry
          </button>
        </div>
      </div>
    </div>

    <!-- Coping Techniques -->
    <section class="coping-section section scroll-reveal reveal-left">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Coping Techniques</h2>
          <p class="section-subtitle">
            Simple strategies to help manage stress, anxiety, and difficult emotions.
          </p>
        </div>
        
        <div class="techniques-grid">
          <div class="technique-card" v-for="technique in techniques" :key="technique.title">
            <span class="technique-icon">{{ technique.icon }}</span>
            <h3>{{ technique.title }}</h3>
            <p>{{ technique.description }}</p>
            <ul>
              <li v-for="step in technique.steps" :key="step">{{ step }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Positive Affirmations -->
    <section class="affirmations-section section scroll-reveal reveal-scale">
      <div class="container">
        <div class="affirmation-card glass">
          <span class="affirmation-icon">✨</span>
          <h3>Daily Affirmation</h3>
          <p class="affirmation-text">"{{ currentAffirmation }}"</p>
          <button class="btn btn-secondary" @click="newAffirmation">
            🔄 New Affirmation
          </button>
        </div>
      </div>
    </section>

    <!-- Crisis Resources -->
    <section class="crisis-section section scroll-reveal">
      <div class="container">
        <div class="crisis-card">
          <div class="crisis-header">
            <span class="crisis-icon">📞</span>
            <h2>Need Immediate Help?</h2>
            <p>If you're in crisis or having thoughts of self-harm, please reach out.</p>
          </div>
          
          <div class="crisis-resources">
            <div class="resource-item">
              <h4>🇺🇸 National Suicide Prevention Lifeline</h4>
              <a href="tel:988" class="resource-link">988</a>
              <span>24/7, free, confidential</span>
            </div>
            <div class="resource-item">
              <h4>🌍 Crisis Text Line</h4>
              <span class="resource-link">Text HOME to 741741</span>
              <span>24/7 support via text</span>
            </div>
            <div class="resource-item">
              <h4>🇬🇧 Samaritans (UK)</h4>
              <a href="tel:116123" class="resource-link">116 123</a>
              <span>Free 24-hour helpline</span>
            </div>
            <div class="resource-item">
              <h4>🌐 International Association for Suicide Prevention</h4>
              <a href="https://www.iasp.info/resources/Crisis_Centres/" target="_blank" class="resource-link">
                Find local resources →
              </a>
            </div>
          </div>
          
          <p class="crisis-note">
            Remember: Reaching out for help is a sign of strength, not weakness. 💜
          </p>
        </div>
      </div>
    </section>

    <!-- Self-Care Reminders -->
    <section class="selfcare-section section scroll-reveal reveal-right">
      <div class="container">
        <h2 class="section-title">Daily Self-Care Checklist</h2>
        <p class="section-subtitle">Small actions can make a big difference.</p>
        
        <div class="selfcare-grid">
          <div 
            v-for="item in selfcareItems"
            :key="item.id"
            :class="['selfcare-item', { checked: item.checked }]"
            @click="item.checked = !item.checked"
          >
            <div :class="['checkbox', { checked: item.checked }]"></div>
            <span class="selfcare-icon">{{ item.icon }}</span>
            <span class="selfcare-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

useHead({
  title: 'Mental Health Support - QuickHelp.lol',
  meta: [
    { name: 'description', content: 'Free mental health resources including breathing exercises, mood tracking, coping techniques, and crisis support.' }
  ]
})

// Breathing Exercise
const showBreathing = ref(false)
const breathingActive = ref(false)
const breathingPhase = ref('inhale')
const breathingTimer = ref(4)
const breathingInstruction = ref('Press start to begin')
let breathingInterval = null

const breathingPatterns = [
  { name: '4-7-8 Relaxing', inhale: 4, hold: 7, exhale: 8 },
  { name: 'Box Breathing', inhale: 4, hold: 4, exhale: 4, holdAfter: 4 },
  { name: 'Simple Calm', inhale: 4, hold: 2, exhale: 6 },
]

const currentPattern = ref(breathingPatterns[0])

const openBreathing = () => {
  showBreathing.value = true
  stopBreathing()
}

const selectPattern = (pattern) => {
  currentPattern.value = pattern
  stopBreathing()
}

const startBreathing = () => {
  breathingActive.value = true
  breathingPhase.value = 'inhale'
  breathingTimer.value = currentPattern.value.inhale
  breathingInstruction.value = 'Breathe in slowly...'
  
  breathingInterval = setInterval(() => {
    breathingTimer.value--
    
    if (breathingTimer.value <= 0) {
      if (breathingPhase.value === 'inhale') {
        breathingPhase.value = 'hold'
        breathingTimer.value = currentPattern.value.hold
        breathingInstruction.value = 'Hold your breath...'
      } else if (breathingPhase.value === 'hold') {
        breathingPhase.value = 'exhale'
        breathingTimer.value = currentPattern.value.exhale
        breathingInstruction.value = 'Breathe out slowly...'
      } else {
        if (currentPattern.value.holdAfter) {
          breathingPhase.value = 'holdAfter'
          breathingTimer.value = currentPattern.value.holdAfter
          breathingInstruction.value = 'Hold empty...'
        } else {
          breathingPhase.value = 'inhale'
          breathingTimer.value = currentPattern.value.inhale
          breathingInstruction.value = 'Breathe in slowly...'
        }
      }
    }
  }, 1000)
}

const stopBreathing = () => {
  breathingActive.value = false
  clearInterval(breathingInterval)
  breathingInstruction.value = 'Press start to begin'
  breathingTimer.value = currentPattern.value.inhale
  breathingPhase.value = 'inhale'
}

// Mood Tracker
const showMoodTracker = ref(false)
const selectedMood = ref(null)
const moodNote = ref('')
const moodHistory = ref([])

const moods = [
  { value: 5, emoji: '😊', label: 'Great' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 2, emoji: '😔', label: 'Low' },
  { value: 1, emoji: '😢', label: 'Struggling' },
]

const recentMoods = computed(() => moodHistory.value.slice(0, 5))

const openMoodTracker = () => {
  showMoodTracker.value = true
  selectedMood.value = null
  moodNote.value = ''
  loadMoodHistory()
}

const getMoodEmoji = (value) => {
  const mood = moods.find(m => m.value === value)
  return mood ? mood.emoji : '😐'
}

const saveMood = () => {
  const entry = {
    id: Date.now(),
    mood: selectedMood.value,
    note: moodNote.value,
    date: Date.now()
  }
  moodHistory.value.unshift(entry)
  localStorage.setItem('quickhelp-moods', JSON.stringify(moodHistory.value))
  selectedMood.value = null
  moodNote.value = ''
}

const loadMoodHistory = () => {
  const saved = localStorage.getItem('quickhelp-moods')
  if (saved) {
    moodHistory.value = JSON.parse(saved)
  }
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Journal
const showJournal = ref(false)
const journalEntry = ref('')

const openJournal = () => {
  showJournal.value = true
  journalEntry.value = ''
}

const clearJournal = () => {
  journalEntry.value = ''
}

const saveJournal = () => {
  if (journalEntry.value.trim()) {
    const entries = JSON.parse(localStorage.getItem('quickhelp-journal') || '[]')
    entries.unshift({
      id: Date.now(),
      content: journalEntry.value,
      date: Date.now()
    })
    localStorage.setItem('quickhelp-journal', JSON.stringify(entries))
    journalEntry.value = ''
    showJournal.value = false
  }
}

// Coping Techniques
const techniques = [
  {
    icon: '🌊',
    title: 'Grounding (5-4-3-2-1)',
    description: 'Bring yourself back to the present moment.',
    steps: [
      '5 things you can see',
      '4 things you can touch',
      '3 things you can hear',
      '2 things you can smell',
      '1 thing you can taste'
    ]
  },
  {
    icon: '🧊',
    title: 'Ice Cube Technique',
    description: 'Use cold sensation to interrupt overwhelming emotions.',
    steps: [
      'Hold an ice cube in your hand',
      'Focus on the cold sensation',
      'Notice how it feels as it melts',
      'The physical sensation helps ground you'
    ]
  },
  {
    icon: '📝',
    title: 'Thought Reframing',
    description: 'Challenge negative thoughts with evidence.',
    steps: [
      'Write down the negative thought',
      'Ask: Is this thought factual?',
      'What evidence contradicts it?',
      'Rewrite with a balanced perspective'
    ]
  },
  {
    icon: '🚶',
    title: 'Movement Break',
    description: 'Physical activity releases stress and improves mood.',
    steps: [
      'Take a 5-minute walk',
      'Do 10 jumping jacks',
      'Stretch your body',
      'Dance to a favorite song'
    ]
  }
]

// Affirmations
const affirmations = [
  "I am worthy of love and respect.",
  "My feelings are valid, and it's okay to feel them.",
  "I am doing the best I can, and that is enough.",
  "I choose to focus on what I can control.",
  "Every day is a new opportunity to grow.",
  "I am stronger than my challenges.",
  "It's okay to take things one step at a time.",
  "I deserve peace and happiness.",
  "My struggles do not define me.",
  "I am capable of overcoming difficult times.",
  "I give myself permission to rest.",
  "Progress, not perfection.",
  "I am not alone in this.",
  "My mental health is a priority.",
  "I am learning and growing every day."
]

const currentAffirmation = ref(affirmations[0])

const newAffirmation = () => {
  const current = currentAffirmation.value
  let newOne = current
  while (newOne === current) {
    newOne = affirmations[Math.floor(Math.random() * affirmations.length)]
  }
  currentAffirmation.value = newOne
}

// Self-care checklist
const selfcareItems = ref([
  { id: 1, icon: '💧', text: 'Drink water', checked: false },
  { id: 2, icon: '🍎', text: 'Eat something nutritious', checked: false },
  { id: 3, icon: '🚶', text: 'Move your body', checked: false },
  { id: 4, icon: '☀️', text: 'Get some sunlight', checked: false },
  { id: 5, icon: '💤', text: 'Rest when needed', checked: false },
  { id: 6, icon: '🗣️', text: 'Connect with someone', checked: false },
  { id: 7, icon: '🎵', text: 'Do something you enjoy', checked: false },
  { id: 8, icon: '🧘', text: 'Take a mindful moment', checked: false },
])

// Cleanup
onUnmounted(() => {
  stopBreathing()
})

// Initialize
onMounted(() => {
  newAffirmation()
})
</script>

<style scoped>
.mental-health-page {
  padding-top: 80px;
}

.hero {
  padding: 100px 0;
  text-align: center;
  background: linear-gradient(180deg, rgba(124, 58, 237, 0.1) 0%, transparent 100%);
}

.hero-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(124, 58, 237, 0.2);
  border-radius: 50px;
  font-size: 14px;
  color: #c4b5fd;
  margin-bottom: 24px;
}

.hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

.quick-actions {
  padding: 60px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.action-card {
  padding: 32px 24px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: block;
}

.action-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.action-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.action-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.action-card p {
  font-size: 14px;
  color: var(--text-muted);
}

/* Breathing Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.breathing-modal, .mood-modal, .journal-modal {
  width: 100%;
  max-width: 480px;
  padding: 40px;
  text-align: center;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--surface-light);
  border: none;
  color: var(--text-muted);
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--primary);
  color: white;
}

.breathing-modal h2, .mood-modal h2, .journal-modal h2 {
  font-size: 28px;
  margin-bottom: 8px;
}

.breathing-instruction {
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 40px;
}

.breathing-visual {
  margin-bottom: 40px;
}

.breath-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(236, 72, 153, 0.3));
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 4s ease-in-out;
}

.breath-circle.inhale {
  animation: breatheIn 4s ease-in-out;
}

.breath-circle.hold {
  transform: scale(1.2);
}

.breath-circle.exhale {
  animation: breatheOut 8s ease-in-out;
}

@keyframes breatheIn {
  from { transform: scale(1); }
  to { transform: scale(1.2); }
}

@keyframes breatheOut {
  from { transform: scale(1.2); }
  to { transform: scale(1); }
}

.breath-timer {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: white;
}

.breathing-controls {
  margin-bottom: 32px;
}

.breathing-patterns {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pattern-btn {
  padding: 8px 16px;
  font-size: 13px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.pattern-btn:hover, .pattern-btn.active {
  border-color: var(--primary);
  color: white;
}

.pattern-btn.active {
  background: var(--primary);
}

/* Mood Modal */
.mood-modal p {
  color: var(--text-muted);
  margin-bottom: 32px;
}

.mood-selector {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.mood-btn {
  padding: 16px;
  background: var(--surface);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.mood-btn:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.mood-btn.selected {
  border-color: var(--primary);
  background: rgba(124, 58, 237, 0.1);
}

.mood-emoji {
  font-size: 36px;
}

.mood-label {
  font-size: 12px;
  color: var(--text-muted);
}

.mood-note {
  margin-bottom: 24px;
  text-align: left;
}

.mood-note label {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.mood-history {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-light);
  text-align: left;
}

.mood-history h4 {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: var(--surface);
  border-radius: 10px;
}

.history-emoji {
  font-size: 24px;
}

.history-info {
  display: flex;
  flex-direction: column;
}

.history-date {
  font-size: 12px;
  color: var(--text-muted);
}

.history-note {
  font-size: 13px;
  color: white;
  margin-top: 4px;
}

/* Journal Modal */
.journal-modal {
  max-width: 600px;
}

.journal-modal p {
  color: var(--text-muted);
  margin-bottom: 20px;
}

.journal-prompts {
  margin-bottom: 20px;
}

.journal-prompts span {
  font-size: 13px;
  color: var(--text-muted);
}

.journal-prompts button {
  padding: 6px 12px;
  margin-left: 8px;
  font-size: 12px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.journal-prompts button:hover {
  border-color: var(--primary);
}

.journal-textarea {
  width: 100%;
  min-height: 200px;
  padding: 20px;
  font-size: 16px;
  line-height: 1.7;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  color: white;
  resize: vertical;
  margin-bottom: 20px;
}

.journal-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.journal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Coping Techniques */
.techniques-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.technique-card {
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
}

.technique-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 16px;
}

.technique-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.technique-card p {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.technique-card ul {
  list-style: none;
  padding: 0;
}

.technique-card li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--text-muted);
}

.technique-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--secondary);
}

/* Affirmations */
.affirmations-section {
  text-align: center;
}

.affirmation-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 48px;
}

.affirmation-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.affirmation-card h3 {
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.affirmation-text {
  font-size: 24px;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 32px;
  color: white;
}

/* Crisis Section */
.crisis-section {
  padding: 80px 0;
}

.crisis-card {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 24px;
  padding: 48px;
  max-width: 900px;
  margin: 0 auto;
}

.crisis-header {
  text-align: center;
  margin-bottom: 40px;
}

.crisis-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.crisis-header h2 {
  font-size: 32px;
  margin-bottom: 12px;
}

.crisis-header p {
  font-size: 16px;
  color: var(--text-muted);
}

.crisis-resources {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.resource-item {
  padding: 24px;
  background: var(--surface);
  border-radius: var(--radius-lg);
}

.resource-item h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.resource-link {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  text-decoration: none;
  margin-bottom: 8px;
}

.resource-item span:last-child {
  font-size: 13px;
  color: var(--text-muted);
}

.crisis-note {
  text-align: center;
  font-size: 16px;
  color: var(--text-muted);
}

/* Self-care */
.selfcare-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.selfcare-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.selfcare-item:hover {
  border-color: var(--primary);
}

.selfcare-item.checked {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
}

.selfcare-icon {
  font-size: 20px;
}

.selfcare-text {
  font-size: 14px;
  color: white;
}

@media (max-width: 900px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .techniques-grid {
    grid-template-columns: 1fr;
  }

  .crisis-resources {
    grid-template-columns: 1fr;
  }

  .selfcare-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .hero h1 {
    font-size: 36px;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .mood-selector {
    flex-wrap: wrap;
  }

  .selfcare-grid {
    grid-template-columns: 1fr;
  }
}
</style>
