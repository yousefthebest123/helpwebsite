<template>
  <div class="learning-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <span class="hero-badge">📚 Learn & Grow</span>
          <h1>Learning Hub</h1>
          <p>
            Free tools and resources to help you learn math, improve your writing, 
            study more effectively, and master new skills.
          </p>
        </div>
      </div>
    </section>

    <!-- Quick Tools -->
    <section class="quick-tools scroll-reveal">
      <div class="container">
        <div class="tools-grid">
          <div class="tool-card" @click="activeSection = 'calculator'">
            <span class="tool-icon">🧮</span>
            <h3>Smart Calculator</h3>
            <p>Scientific calculator with step-by-step solutions</p>
          </div>
          <div class="tool-card" @click="activeSection = 'flashcards'">
            <span class="tool-icon">🃏</span>
            <h3>Flashcards</h3>
            <p>Create and study with spaced repetition</p>
          </div>
          <div class="tool-card" @click="activeSection = 'writing'">
            <span class="tool-icon">✍️</span>
            <h3>Writing Helper</h3>
            <p>Grammar check and writing tips</p>
          </div>
          <div class="tool-card" @click="activeSection = 'pomodoro'">
            <span class="tool-icon">🍅</span>
            <h3>Study Timer</h3>
            <p>Pomodoro technique for focused learning</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Calculator Section -->
    <section class="section calc-section" v-if="activeSection === 'calculator'">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🧮 Smart Calculator</h2>
          <button class="btn btn-ghost" @click="activeSection = null">Close</button>
        </div>
        
        <div class="calculator glass">
          <div class="calc-display">
            <div class="calc-expression">{{ expression || '0' }}</div>
            <div class="calc-result">{{ result }}</div>
          </div>
          
          <div class="calc-buttons">
            <button class="calc-btn func" @click="clearCalc">C</button>
            <button class="calc-btn func" @click="deleteChar">⌫</button>
            <button class="calc-btn func" @click="addToExpression('(')">(</button>
            <button class="calc-btn func" @click="addToExpression(')')">)</button>
            
            <button class="calc-btn" @click="addToExpression('7')">7</button>
            <button class="calc-btn" @click="addToExpression('8')">8</button>
            <button class="calc-btn" @click="addToExpression('9')">9</button>
            <button class="calc-btn op" @click="addToExpression('/')">÷</button>
            
            <button class="calc-btn" @click="addToExpression('4')">4</button>
            <button class="calc-btn" @click="addToExpression('5')">5</button>
            <button class="calc-btn" @click="addToExpression('6')">6</button>
            <button class="calc-btn op" @click="addToExpression('*')">×</button>
            
            <button class="calc-btn" @click="addToExpression('1')">1</button>
            <button class="calc-btn" @click="addToExpression('2')">2</button>
            <button class="calc-btn" @click="addToExpression('3')">3</button>
            <button class="calc-btn op" @click="addToExpression('-')">−</button>
            
            <button class="calc-btn" @click="addToExpression('0')">0</button>
            <button class="calc-btn" @click="addToExpression('.')">.</button>
            <button class="calc-btn equals" @click="calculate">=</button>
            <button class="calc-btn op" @click="addToExpression('+')">+</button>
          </div>
          
          <div class="calc-scientific">
            <button class="calc-btn sci" @click="addFunction('sin')">sin</button>
            <button class="calc-btn sci" @click="addFunction('cos')">cos</button>
            <button class="calc-btn sci" @click="addFunction('tan')">tan</button>
            <button class="calc-btn sci" @click="addToExpression('Math.PI')">π</button>
            <button class="calc-btn sci" @click="addFunction('sqrt')">√</button>
            <button class="calc-btn sci" @click="addToExpression('**2')">x²</button>
            <button class="calc-btn sci" @click="addToExpression('**')">xʸ</button>
            <button class="calc-btn sci" @click="addFunction('log')">log</button>
          </div>
          
          <div class="calc-history" v-if="history.length > 0">
            <h4>History</h4>
            <div class="history-list">
              <div v-for="(item, idx) in history.slice().reverse()" :key="idx" class="history-item"
                @click="expression = item.expr">
                {{ item.expr }} = {{ item.result }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Flashcards Section -->
    <section class="section flashcards-section" v-if="activeSection === 'flashcards'">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🃏 Flashcards</h2>
          <button class="btn btn-ghost" @click="activeSection = null">Close</button>
        </div>
        
        <div class="flashcard-creator glass" v-if="!studyMode">
          <h3>Create New Card</h3>
          <div class="card-form">
            <input 
              type="text"
              v-model="newCard.front"
              class="input"
              placeholder="Front (Question)"
            />
            <input 
              type="text"
              v-model="newCard.back"
              class="input"
              placeholder="Back (Answer)"
            />
            <button class="btn btn-primary" @click="addCard">Add Card</button>
          </div>
        </div>
        
        <div class="flashcard-deck" v-if="!studyMode && cards.length > 0">
          <h3>Your Cards ({{ cards.length }})</h3>
          <div class="deck-list">
            <div v-for="card in cards" :key="card.id" class="deck-card">
              <span class="front">{{ card.front }}</span>
              <span class="back">{{ card.back }}</span>
              <button class="delete-btn" @click="deleteCard(card.id)">×</button>
            </div>
          </div>
          <button class="btn btn-primary btn-lg" @click="startStudy">
            📖 Start Studying
          </button>
        </div>
        
        <div class="study-area" v-if="studyMode">
          <div class="progress-bar">
            <div class="progress" :style="{ width: studyProgress + '%' }"></div>
          </div>
          
          <div 
            :class="['flashcard', { flipped: isFlipped }]"
            @click="isFlipped = !isFlipped"
          >
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <span>{{ currentCard?.front }}</span>
                <p class="flip-hint">Click to reveal answer</p>
              </div>
              <div class="flashcard-back">
                <span>{{ currentCard?.back }}</span>
              </div>
            </div>
          </div>
          
          <div class="study-controls" v-if="isFlipped">
            <button class="btn btn-secondary" @click="markCard('hard')">
              😓 Hard
            </button>
            <button class="btn btn-secondary" @click="markCard('okay')">
              🤔 Okay
            </button>
            <button class="btn btn-primary" @click="markCard('easy')">
              😊 Easy
            </button>
          </div>
          
          <button class="btn btn-ghost" @click="studyMode = false">
            Exit Study Mode
          </button>
        </div>
      </div>
    </section>

    <!-- Writing Section -->
    <section class="section writing-section" v-if="activeSection === 'writing'">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">✍️ Writing Helper</h2>
          <button class="btn btn-ghost" @click="activeSection = null">Close</button>
        </div>
        
        <div class="writing-tool glass">
          <textarea 
            v-model="writingText"
            class="writing-input"
            placeholder="Start typing your essay, email, or any text..."
          ></textarea>
          
          <div class="writing-stats">
            <div class="stat">
              <span class="value">{{ writingStats.words }}</span>
              <span class="label">Words</span>
            </div>
            <div class="stat">
              <span class="value">{{ writingStats.sentences }}</span>
              <span class="label">Sentences</span>
            </div>
            <div class="stat">
              <span class="value">{{ writingStats.paragraphs }}</span>
              <span class="label">Paragraphs</span>
            </div>
            <div class="stat">
              <span class="value">{{ writingStats.readTime }}</span>
              <span class="label">Min Read</span>
            </div>
          </div>
          
          <div class="writing-tips">
            <h4>💡 Writing Tips</h4>
            <ul>
              <li v-if="writingStats.avgSentenceLength > 20">
                ⚠️ Your sentences are quite long (avg {{ writingStats.avgSentenceLength }} words). Try breaking them up.
              </li>
              <li v-if="writingStats.words > 0 && writingStats.paragraphs === 1 && writingStats.words > 100">
                💡 Consider adding paragraph breaks to improve readability.
              </li>
              <li v-if="writingStats.words < 50 && writingText.length > 0">
                ✨ Keep going! You're off to a good start.
              </li>
              <li v-if="writingStats.words >= 50">
                ✅ Good progress! Your text is becoming substantial.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Study Tips Section -->
    <section class="study-tips section scroll-reveal reveal-left">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">📖 Study Techniques</h2>
          <p class="section-subtitle">Science-backed methods to learn more effectively</p>
        </div>
        
        <div class="tips-grid">
          <div class="tip-card">
            <div class="tip-icon">🔄</div>
            <h3>Spaced Repetition</h3>
            <p>Review material at increasing intervals to strengthen long-term memory.</p>
            <ul>
              <li>Review after 1 day</li>
              <li>Review after 3 days</li>
              <li>Review after 1 week</li>
              <li>Review after 2 weeks</li>
            </ul>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">🎯</div>
            <h3>Active Recall</h3>
            <p>Test yourself instead of passively re-reading. This strengthens neural pathways.</p>
            <ul>
              <li>Use flashcards</li>
              <li>Practice problems</li>
              <li>Teach others</li>
              <li>Write from memory</li>
            </ul>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">🍅</div>
            <h3>Pomodoro Technique</h3>
            <p>Work in focused 25-minute bursts with short breaks to maintain concentration.</p>
            <ul>
              <li>25 min focus</li>
              <li>5 min break</li>
              <li>After 4 cycles: long break</li>
              <li>No distractions during focus</li>
            </ul>
          </div>
          
          <div class="tip-card">
            <div class="tip-icon">🧠</div>
            <h3>Feynman Technique</h3>
            <p>Explain concepts in simple terms to identify gaps in understanding.</p>
            <ul>
              <li>Choose a concept</li>
              <li>Explain it simply</li>
              <li>Identify gaps</li>
              <li>Review and simplify</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Resources Section -->
    <section class="resources section scroll-reveal">
      <div class="container">
        <h2 class="section-title">🔗 Free Learning Resources</h2>
        
        <div class="resources-grid">
          <a href="https://www.khanacademy.org" target="_blank" class="resource-card">
            <span class="resource-icon">📐</span>
            <h4>Khan Academy</h4>
            <p>Free courses in math, science, and more</p>
          </a>
          <a href="https://www.coursera.org" target="_blank" class="resource-card">
            <span class="resource-icon">🎓</span>
            <h4>Coursera</h4>
            <p>University courses online</p>
          </a>
          <a href="https://www.duolingo.com" target="_blank" class="resource-card">
            <span class="resource-icon">🌍</span>
            <h4>Duolingo</h4>
            <p>Learn languages for free</p>
          </a>
          <a href="https://www.codecademy.com" target="_blank" class="resource-card">
            <span class="resource-icon">💻</span>
            <h4>Codecademy</h4>
            <p>Learn to code interactively</p>
          </a>
          <a href="https://www.edx.org" target="_blank" class="resource-card">
            <span class="resource-icon">🏛️</span>
            <h4>edX</h4>
            <p>Courses from top universities</p>
          </a>
          <a href="https://www.wolframalpha.com" target="_blank" class="resource-card">
            <span class="resource-icon">🔬</span>
            <h4>Wolfram Alpha</h4>
            <p>Computational knowledge engine</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

useHead({
  title: 'Learning Hub - QuickHelp.lol',
  meta: [
    { name: 'description', content: 'Free learning tools including calculator, flashcards, writing helper, and study techniques.' }
  ]
})

const activeSection = ref(null)

// Calculator
const expression = ref('')
const result = ref('')
const history = ref([])

const addToExpression = (val) => {
  expression.value += val
  try {
    const expr = expression.value
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/−/g, '-')
    result.value = eval(expr)
  } catch {
    result.value = ''
  }
}

const addFunction = (func) => {
  expression.value += `Math.${func}(`
}

const calculate = () => {
  if (!expression.value) return
  try {
    const expr = expression.value
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/−/g, '-')
    const res = eval(expr)
    history.value.push({ expr: expression.value, result: res })
    result.value = res
    expression.value = String(res)
  } catch {
    result.value = 'Error'
  }
}

const clearCalc = () => {
  expression.value = ''
  result.value = ''
}

const deleteChar = () => {
  expression.value = expression.value.slice(0, -1)
}

// Flashcards
const cards = ref([])
const newCard = ref({ front: '', back: '' })
const studyMode = ref(false)
const currentCardIndex = ref(0)
const isFlipped = ref(false)

const currentCard = computed(() => cards.value[currentCardIndex.value])
const studyProgress = computed(() => 
  cards.value.length > 0 ? ((currentCardIndex.value + 1) / cards.value.length) * 100 : 0
)

const addCard = () => {
  if (!newCard.value.front || !newCard.value.back) return
  cards.value.push({
    id: Date.now(),
    ...newCard.value,
    difficulty: 'new'
  })
  newCard.value = { front: '', back: '' }
  saveCards()
}

const deleteCard = (id) => {
  cards.value = cards.value.filter(c => c.id !== id)
  saveCards()
}

const startStudy = () => {
  currentCardIndex.value = 0
  isFlipped.value = false
  studyMode.value = true
}

const markCard = (difficulty) => {
  if (currentCard.value) {
    currentCard.value.difficulty = difficulty
  }
  
  isFlipped.value = false
  
  if (currentCardIndex.value < cards.value.length - 1) {
    currentCardIndex.value++
  } else {
    studyMode.value = false
    alert('🎉 Great job! You completed all cards!')
  }
}

const saveCards = () => {
  localStorage.setItem('quickhelp-flashcards', JSON.stringify(cards.value))
}

const loadCards = () => {
  const saved = localStorage.getItem('quickhelp-flashcards')
  if (saved) {
    cards.value = JSON.parse(saved)
  }
}

// Writing
const writingText = ref('')

const writingStats = computed(() => {
  const text = writingText.value
  const words = text.trim().split(/\s+/).filter(w => w).length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length
  const readTime = Math.ceil(words / 200)
  const avgSentenceLength = sentences > 0 ? Math.round(words / sentences) : 0
  
  return { words, sentences, paragraphs, readTime, avgSentenceLength }
})

onMounted(() => {
  loadCards()
})
</script>

<style scoped>
.learning-page {
  padding-top: 80px;
}

.hero {
  padding: 100px 0;
  text-align: center;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%);
}

.hero-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(59, 130, 246, 0.2);
  border-radius: 50px;
  font-size: 14px;
  color: #93c5fd;
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

.quick-tools {
  padding: 60px 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.tool-card {
  padding: 32px 24px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tool-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.tool-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.tool-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tool-card p {
  font-size: 14px;
  color: var(--text-muted);
}

/* Calculator */
.calculator {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
}

.calc-display {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
  text-align: right;
}

.calc-expression {
  font-size: 18px;
  color: var(--text-muted);
  min-height: 24px;
  word-break: break-all;
}

.calc-result {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: white;
  min-height: 44px;
}

.calc-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.calc-btn {
  padding: 18px;
  font-size: 20px;
  font-weight: 600;
  background: var(--surface);
  border: none;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.calc-btn:hover {
  background: var(--surface-light);
}

.calc-btn.func {
  color: #f472b6;
}

.calc-btn.op {
  background: rgba(124, 58, 237, 0.2);
  color: var(--primary);
}

.calc-btn.equals {
  background: var(--primary);
}

.calc-scientific {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.calc-btn.sci {
  padding: 12px;
  font-size: 14px;
  background: var(--surface);
}

.calc-history {
  padding-top: 16px;
  border-top: 1px solid var(--border-light);
}

.calc-history h4 {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.history-list {
  max-height: 120px;
  overflow-y: auto;
}

.history-item {
  padding: 8px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
}

.history-item:hover {
  background: var(--surface);
  color: white;
}

/* Flashcards */
.flashcard-creator {
  max-width: 500px;
  margin: 0 auto 32px;
  padding: 24px;
}

.flashcard-creator h3 {
  font-size: 18px;
  margin-bottom: 16px;
}

.card-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.flashcard-deck {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.flashcard-deck h3 {
  margin-bottom: 20px;
}

.deck-list {
  margin-bottom: 24px;
}

.deck-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--surface);
  border-radius: 10px;
  margin-bottom: 8px;
}

.deck-card .front {
  font-weight: 600;
}

.deck-card .back {
  color: var(--text-muted);
}

.deck-card .delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
}

.deck-card .delete-btn:hover {
  color: #ef4444;
}

.study-area {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.progress-bar {
  height: 4px;
  background: var(--surface);
  border-radius: 2px;
  margin-bottom: 32px;
  overflow: hidden;
}

.progress-bar .progress {
  height: 100%;
  background: var(--primary);
  transition: width 0.3s ease;
}

.flashcard {
  width: 100%;
  height: 300px;
  perspective: 1000px;
  cursor: pointer;
  margin-bottom: 32px;
}

.flashcard-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flashcard.flipped .flashcard-inner {
  transform: rotateY(180deg);
}

.flashcard-front,
.flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: var(--surface);
  border-radius: var(--radius-xl);
  border: 2px solid var(--border-light);
}

.flashcard-back {
  transform: rotateY(180deg);
  background: linear-gradient(135deg, var(--primary), var(--secondary));
}

.flashcard-front span,
.flashcard-back span {
  font-size: 24px;
  font-weight: 600;
}

.flip-hint {
  position: absolute;
  bottom: 20px;
  font-size: 14px;
  color: var(--text-muted);
}

.study-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
}

/* Writing */
.writing-tool {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px;
}

.writing-input {
  width: 100%;
  height: 300px;
  padding: 20px;
  font-size: 16px;
  line-height: 1.8;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  color: white;
  resize: vertical;
  margin-bottom: 24px;
}

.writing-input:focus {
  outline: none;
  border-color: var(--primary);
}

.writing-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.writing-stats .stat {
  text-align: center;
  padding: 16px;
  background: var(--surface);
  border-radius: 10px;
}

.writing-stats .value {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
}

.writing-stats .label {
  font-size: 13px;
  color: var(--text-muted);
}

.writing-tips h4 {
  font-size: 16px;
  margin-bottom: 12px;
}

.writing-tips ul {
  list-style: none;
  padding: 0;
}

.writing-tips li {
  padding: 8px 12px;
  background: var(--surface);
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

/* Study Tips */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.tip-card {
  padding: 28px;
  background: var(--surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.tip-icon {
  font-size: 36px;
  margin-bottom: 16px;
}

.tip-card h3 {
  font-size: 18px;
  margin-bottom: 12px;
}

.tip-card p {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
}

.tip-card ul {
  list-style: none;
  padding: 0;
}

.tip-card li {
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
  font-size: 13px;
  color: var(--text-muted);
}

.tip-card li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary);
}

/* Resources */
.resources-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.resource-card {
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all 0.3s ease;
}

.resource-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.resource-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.resource-card h4 {
  font-size: 16px;
  color: white;
  margin-bottom: 8px;
}

.resource-card p {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .tools-grid,
  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .resources-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .hero h1 {
    font-size: 36px;
  }

  .tools-grid,
  .tips-grid {
    grid-template-columns: 1fr;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }

  .writing-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
