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
          <!-- Study Streak Banner -->
          <div class="streak-banner" v-if="settings.showStudyStreak && studyStreak > 0">
            <span class="streak-fire">🔥</span>
            <span>{{ studyStreak }} day streak!</span>
            <span class="streak-sub">Keep it going!</span>
          </div>
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
            <span class="card-count-badge" v-if="allCards.length">{{ allCards.length }} cards</span>
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
          <div class="tool-card" @click="activeSection = 'quiz'">
            <span class="tool-icon">❓</span>
            <h3>Quiz Mode</h3>
            <p>Test yourself with timed quizzes</p>
          </div>
          <div class="tool-card" @click="activeSection = 'stats'">
            <span class="tool-icon">📊</span>
            <h3>Study Stats</h3>
            <p>Track your learning progress over time</p>
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
            <div class="calc-result">{{ calcResult }}</div>
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
          
          <div class="calc-history" v-if="calcHistory.length > 0">
            <h4>History</h4>
            <div class="history-list">
              <div v-for="(item, idx) in calcHistory.slice().reverse()" :key="idx" class="history-item"
                @click="expression = item.expr">
                {{ item.expr }} = {{ item.result }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════ -->
    <!-- FLASHCARDS SECTION — MASSIVELY UPGRADED     -->
    <!-- ═══════════════════════════════════════════ -->
    <section class="section flashcards-section" v-if="activeSection === 'flashcards'">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🃏 Flashcards</h2>
          <div class="header-actions">
            <button class="btn btn-ghost btn-sm" @click="flashcardTab = 'create'" :class="{ active: flashcardTab === 'create' }">➕ Create</button>
            <button class="btn btn-ghost btn-sm" @click="flashcardTab = 'decks'" :class="{ active: flashcardTab === 'decks' }">📚 Decks</button>
            <button class="btn btn-ghost btn-sm" @click="flashcardTab = 'history'" :class="{ active: flashcardTab === 'history' }">📜 History</button>
            <button class="btn btn-ghost btn-sm" @click="flashcardTab = 'import'" :class="{ active: flashcardTab === 'import' }">📥 Import</button>
            <button class="btn btn-ghost" @click="activeSection = null">Close</button>
          </div>
        </div>

        <!-- Create Tab -->
        <div v-if="flashcardTab === 'create' && !studyMode">
          <div class="flashcard-creator glass">
            <h3>Create New Card</h3>
            <div class="card-form">
              <input type="text" v-model="newCard.front" class="input" placeholder="Front (Question)" @keyup.enter="focusBackInput" />
              <input type="text" v-model="newCard.back" class="input" placeholder="Back (Answer)" ref="backInput" @keyup.enter="addCard" />
              <div class="form-row">
                <select v-model="newCard.deck" class="input select-input">
                  <option value="default">📁 Default Deck</option>
                  <option v-for="d in customDecks" :key="d" :value="d">📁 {{ d }}</option>
                  <option value="__new__">➕ New Deck...</option>
                </select>
                <select v-model="newCard.priority" class="input select-input">
                  <option value="normal">Normal Priority</option>
                  <option value="high">🔴 High Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </select>
              </div>
              <input v-if="newCard.deck === '__new__'" v-model="newDeckName" class="input" placeholder="New deck name..." />
              <input v-model="newCard.tag" class="input" placeholder="Tag (optional, e.g. math, history)" />
              <button class="btn btn-primary" @click="addCard">Add Card</button>
            </div>
          </div>

          <!-- Bulk Create -->
          <div class="flashcard-creator glass" style="margin-top: 16px;">
            <h3>⚡ Bulk Create</h3>
            <p class="hint-text">One card per line. Separate front and back with <code>|</code> or <code>::</code></p>
            <textarea v-model="bulkInput" class="input bulk-textarea" placeholder="What is 2+2? | 4&#10;Capital of France :: Paris&#10;H2O :: Water"></textarea>
            <div class="form-row">
              <select v-model="bulkDeck" class="input select-input">
                <option value="default">📁 Default Deck</option>
                <option v-for="d in customDecks" :key="d" :value="d">📁 {{ d }}</option>
              </select>
              <button class="btn btn-primary" @click="bulkCreate">Add All</button>
            </div>
          </div>
        </div>

        <!-- Decks Tab -->
        <div v-if="flashcardTab === 'decks' && !studyMode">
          <div class="decks-overview">
            <div v-for="deck in deckList" :key="deck.name" class="deck-panel glass">
              <div class="deck-header">
                <div>
                  <h3>📁 {{ deck.name }} <span class="badge">{{ deck.cards.length }}</span></h3>
                  <div class="deck-meta">
                    <span class="meta-item due" v-if="deck.dueCount > 0">🔴 {{ deck.dueCount }} due</span>
                    <span class="meta-item">✅ {{ deck.masteredCount }} mastered</span>
                    <span class="meta-item">📊 {{ deck.averageScore }}% avg</span>
                  </div>
                </div>
                <div class="deck-actions">
                  <button class="btn btn-primary btn-sm" @click="startStudy(deck.name)" :disabled="deck.cards.length === 0">
                    📖 Study
                  </button>
                  <button class="btn btn-secondary btn-sm" @click="startStudy(deck.name, 'spaced')" :disabled="deck.dueCount === 0">
                    🔄 Spaced
                  </button>
                </div>
              </div>
              <div class="deck-card-list">
                <div v-for="card in deck.cards" :key="card.id" class="deck-card" :class="{ 'card-mastered': card.mastered }">
                  <div class="card-info">
                    <span class="front">{{ card.front }}</span>
                    <span class="back">{{ card.back }}</span>
                    <div class="card-tags">
                      <span class="tag" v-if="card.tag">🏷️ {{ card.tag }}</span>
                      <span class="difficulty-badge" :class="card.difficulty">{{ card.difficulty }}</span>
                      <span class="review-count" v-if="card.reviewCount">{{ card.reviewCount }}× reviewed</span>
                    </div>
                  </div>
                  <div class="card-actions">
                    <button class="icon-btn" @click="editCardStart(card)" title="Edit">✏️</button>
                    <button class="icon-btn" @click="toggleStar(card)" title="Star">{{ card.starred ? '⭐' : '☆' }}</button>
                    <button class="delete-btn" @click="deleteCard(card.id)" title="Delete">×</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- History Tab -->
        <div v-if="flashcardTab === 'history' && !studyMode">
          <div class="history-panel glass">
            <div class="history-header">
              <h3>📜 Study History</h3>
              <div class="history-filters">
                <select v-model="historyFilter" class="input select-input select-sm">
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <button class="btn btn-ghost btn-sm" @click="clearHistory">🗑️ Clear</button>
              </div>
            </div>

            <div class="history-stats-bar">
              <div class="h-stat">
                <span class="h-val">{{ filteredHistory.length }}</span>
                <span class="h-label">Reviews</span>
              </div>
              <div class="h-stat easy-stat">
                <span class="h-val">{{ filteredHistory.filter(h => h.difficulty === 'easy').length }}</span>
                <span class="h-label">Easy</span>
              </div>
              <div class="h-stat okay-stat">
                <span class="h-val">{{ filteredHistory.filter(h => h.difficulty === 'okay').length }}</span>
                <span class="h-label">Okay</span>
              </div>
              <div class="h-stat hard-stat">
                <span class="h-val">{{ filteredHistory.filter(h => h.difficulty === 'hard').length }}</span>
                <span class="h-label">Hard</span>
              </div>
            </div>

            <div class="history-timeline" v-if="filteredHistory.length > 0">
              <div v-for="(item, idx) in filteredHistory.slice().reverse().slice(0, 50)" :key="idx" class="timeline-item">
                <div class="timeline-dot" :class="item.difficulty"></div>
                <div class="timeline-content">
                  <div class="timeline-card-name">{{ item.front }}</div>
                  <div class="timeline-details">
                    <span class="difficulty-badge" :class="item.difficulty">{{ difficultyEmoji(item.difficulty) }} {{ item.difficulty }}</span>
                    <span class="timeline-deck">📁 {{ item.deck || 'default' }}</span>
                    <span class="timeline-time">{{ formatTimeAgo(item.timestamp) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <span class="empty-icon">📜</span>
              <p>No study history yet. Start studying to track your progress!</p>
            </div>
          </div>
        </div>

        <!-- Import/Export Tab -->
        <div v-if="flashcardTab === 'import' && !studyMode">
          <div class="import-panel glass">
            <h3>📥 Import / Export Cards</h3>
            
            <div class="import-section">
              <h4>Export</h4>
              <p class="hint-text">Download your cards as JSON to back up or share.</p>
              <button class="btn btn-secondary" @click="exportCards">📤 Export All Cards</button>
            </div>

            <div class="import-section">
              <h4>Import JSON</h4>
              <p class="hint-text">Paste exported JSON data to import cards.</p>
              <textarea v-model="importJson" class="input bulk-textarea" placeholder="Paste JSON here..."></textarea>
              <button class="btn btn-primary" @click="importCards">📥 Import Cards</button>
            </div>

            <div class="import-section">
              <h4>🗑️ Danger Zone</h4>
              <p class="hint-text">Permanently delete all cards and history.</p>
              <button class="btn btn-danger" @click="deleteAllData">Delete All Data</button>
            </div>
          </div>
        </div>

        <!-- Study Mode -->
        <div class="study-area" v-if="studyMode">
          <div class="study-header-bar">
            <div class="study-info">
              <span class="study-deck-label">📁 {{ currentStudyDeck }}</span>
              <span class="study-mode-label">{{ studyModeType === 'spaced' ? '🔄 Spaced Repetition' : '📖 Normal' }}</span>
            </div>
            <div class="study-counter">
              {{ currentCardIndex + 1 }} / {{ studyCards.length }}
            </div>
          </div>

          <div class="progress-bar">
            <div class="progress" :style="{ width: studyProgress + '%' }"></div>
          </div>

          <!-- Confidence meter -->
          <div class="confidence-meter" v-if="studySessionStats.total > 0">
            <div class="cm-bar">
              <div class="cm-easy" :style="{ width: (studySessionStats.easy / studySessionStats.total * 100) + '%' }"></div>
              <div class="cm-okay" :style="{ width: (studySessionStats.okay / studySessionStats.total * 100) + '%' }"></div>
              <div class="cm-hard" :style="{ width: (studySessionStats.hard / studySessionStats.total * 100) + '%' }"></div>
            </div>
          </div>
          
          <div 
            :class="['flashcard', { flipped: isFlipped }]"
            @click="isFlipped = !isFlipped"
          >
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <div class="card-number">Card {{ currentCardIndex + 1 }}</div>
                <span>{{ currentCard?.front }}</span>
                <button class="tts-btn" @click.stop="speak(currentCard?.front)" title="Read aloud">
                  <span v-if="!isSpeaking">🔊</span>
                  <span v-else>⏹️</span>
                </button>
                <p class="flip-hint">Click to reveal answer</p>
                <div class="card-meta-study" v-if="currentCard">
                  <span v-if="currentCard.tag" class="tag sm">🏷️ {{ currentCard.tag }}</span>
                  <span v-if="currentCard.reviewCount" class="review-badge">{{ currentCard.reviewCount }}× reviewed</span>
                </div>
              </div>
              <div class="flashcard-back">
                <span>{{ currentCard?.back }}</span>
                <button class="tts-btn tts-btn-back" @click.stop="speak(currentCard?.back)" title="Read aloud">
                  <span v-if="!isSpeaking">🔊</span>
                  <span v-else>⏹️</span>
                </button>
              </div>
            </div>
          </div>
          
          <div class="study-controls" v-if="isFlipped">
            <button class="btn difficulty-btn hard" @click="markCard('hard')">
              😓 Hard
            </button>
            <button class="btn difficulty-btn okay" @click="markCard('okay')">
              🤔 Okay
            </button>
            <button class="btn difficulty-btn easy" @click="markCard('easy')">
              😊 Easy
            </button>
          </div>

          <div class="tts-controls">
            <label class="checkbox-label">
              <input type="checkbox" v-model="autoSpeak" />
              🔊 Auto-speak cards
            </label>
            <div class="tts-lang-select">
              <label>🌐</label>
              <select v-model="ttsLang">
                <option value="">Auto-detect</option>
                <option value="he-IL">🇮🇱 Hebrew (עברית)</option>
                <option value="en-US">🇺🇸 English</option>
                <option value="es-ES">🇪🇸 Spanish</option>
                <option value="fr-FR">🇫🇷 French</option>
                <option value="de-DE">🇩🇪 German</option>
                <option value="ar-SA">🇸🇦 Arabic</option>
                <option value="zh-CN">🇨🇳 Chinese</option>
                <option value="ja-JP">🇯🇵 Japanese</option>
                <option value="ru-RU">🇷🇺 Russian</option>
                <option value="pt-BR">🇧🇷 Portuguese</option>
              </select>
            </div>
          </div>

          <div class="keyboard-hint">
            💡 Keyboard: <kbd>Space</kbd> flip · <kbd>1</kbd> hard · <kbd>2</kbd> okay · <kbd>3</kbd> easy · <kbd>S</kbd> speak
          </div>
          
          <button class="btn btn-ghost" @click="endStudySession">
            Exit Study Mode
          </button>
        </div>

        <!-- Study Complete Modal -->
        <Teleport to="body">
          <div class="modal-overlay" v-if="showStudyComplete" @click.self="showStudyComplete = false">
            <div class="modal glass study-complete-modal">
              <div class="confetti-container">🎉</div>
              <h2>Session Complete!</h2>
              <div class="complete-stats">
                <div class="c-stat">
                  <span class="c-val">{{ studySessionStats.total }}</span>
                  <span class="c-label">Cards Reviewed</span>
                </div>
                <div class="c-stat easy-stat">
                  <span class="c-val">{{ studySessionStats.easy }}</span>
                  <span class="c-label">Easy</span>
                </div>
                <div class="c-stat okay-stat">
                  <span class="c-val">{{ studySessionStats.okay }}</span>
                  <span class="c-label">Okay</span>
                </div>
                <div class="c-stat hard-stat">
                  <span class="c-val">{{ studySessionStats.hard }}</span>
                  <span class="c-label">Hard</span>
                </div>
              </div>
              <div class="score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--surface-light)" stroke-width="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" stroke-width="8"
                    :stroke-dasharray="283"
                    :stroke-dashoffset="283 - (283 * sessionScore / 100)"
                    stroke-linecap="round"
                    transform="rotate(-90 50 50)" />
                </svg>
                <span class="score-text">{{ sessionScore }}%</span>
              </div>
              <p class="score-message">{{ scoreMessage }}</p>
              <div class="modal-actions">
                <button class="btn btn-primary" @click="showStudyComplete = false">Done</button>
                <button class="btn btn-secondary" @click="showStudyComplete = false; startStudy(currentStudyDeck)">Study Again</button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Edit Card Modal -->
        <Teleport to="body">
          <div class="modal-overlay" v-if="editingCard" @click.self="editingCard = null">
            <div class="modal glass">
              <h3>✏️ Edit Card</h3>
              <div class="card-form">
                <input type="text" v-model="editingCard.front" class="input" placeholder="Front" />
                <input type="text" v-model="editingCard.back" class="input" placeholder="Back" />
                <input type="text" v-model="editingCard.tag" class="input" placeholder="Tag" />
                <div class="form-row">
                  <button class="btn btn-primary" @click="saveEditCard">Save</button>
                  <button class="btn btn-ghost" @click="editingCard = null">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </section>

    <!-- ════════════════════════════ -->
    <!-- QUIZ MODE                    -->
    <!-- ════════════════════════════ -->
    <section class="section quiz-section" v-if="activeSection === 'quiz'">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">❓ Quiz Mode</h2>
          <button class="btn btn-ghost" @click="activeSection = null; quizActive = false; quizFinished = false">Close</button>
        </div>

        <div v-if="!quizActive && !quizFinished" class="quiz-setup glass">
          <h3>Set Up Your Quiz</h3>
          <div v-if="allCards.length < 4" class="empty-state">
            <span class="empty-icon">⚠️</span>
            <p>You need at least 4 flashcards to start a quiz. Go create some cards first!</p>
          </div>
          <div v-else class="card-form">
            <div class="form-row">
              <select v-model="quizDeck" class="input select-input">
                <option value="all">All Cards</option>
                <option v-for="d in allDeckNames" :key="d" :value="d">📁 {{ d }}</option>
              </select>
              <select v-model="quizCount" class="input select-input">
                <option :value="5">5 Questions</option>
                <option :value="10">10 Questions</option>
                <option :value="20">20 Questions</option>
                <option :value="0">All Cards</option>
              </select>
            </div>
            <div class="form-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="quizTimed" /> 
                ⏱️ Timed ({{ quizTimeLimit }}s per question)
              </label>
              <input v-if="quizTimed" type="number" v-model.number="quizTimeLimit" class="input" style="width:80px" min="5" max="120" />
            </div>
            <button class="btn btn-primary btn-lg" @click="startQuiz">🚀 Start Quiz</button>
          </div>
        </div>

        <div v-if="quizActive" class="quiz-area">
          <div class="quiz-header">
            <span>Question {{ quizIndex + 1 }} / {{ quizQuestions.length }}</span>
            <span v-if="quizTimed" class="quiz-timer" :class="{ 'timer-warning': quizTimer <= 5 }">
              ⏱️ {{ quizTimer }}s
            </span>
            <span class="quiz-score-live">Score: {{ quizCorrect }}/{{ quizIndex }}</span>
          </div>

          <div class="progress-bar">
            <div class="progress" :style="{ width: ((quizIndex + 1) / quizQuestions.length * 100) + '%' }"></div>
          </div>

          <div class="quiz-question glass">
            <h3>{{ quizQuestions[quizIndex]?.front }}</h3>
            <button class="tts-btn tts-quiz" @click="speak(quizQuestions[quizIndex]?.front)" title="Read aloud">
              <span v-if="!isSpeaking">🔊</span>
              <span v-else>⏹️</span>
            </button>
          </div>

          <div class="quiz-answers">
            <button 
              v-for="(opt, i) in quizQuestions[quizIndex]?.options" 
              :key="i"
              class="quiz-option"
              :class="{ 
                correct: quizAnswered && opt === quizQuestions[quizIndex]?.back,
                wrong: quizAnswered && quizSelected === opt && opt !== quizQuestions[quizIndex]?.back,
                selected: quizSelected === opt
              }"
              :disabled="quizAnswered"
              @click="answerQuiz(opt)"
            >
              <span class="option-letter">{{ ['A','B','C','D'][i] }}</span>
              {{ opt }}
            </button>
          </div>

          <button v-if="quizAnswered" class="btn btn-primary" @click="nextQuizQuestion">
            {{ quizIndex < quizQuestions.length - 1 ? 'Next Question →' : 'See Results' }}
          </button>
        </div>

        <!-- Quiz Results -->
        <div v-if="quizFinished" class="quiz-results glass">
          <h2>🏆 Quiz Results</h2>
          <div class="score-circle large">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--surface-light)" stroke-width="8" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary)" stroke-width="8"
                :stroke-dasharray="283"
                :stroke-dashoffset="283 - (283 * quizScorePercent / 100)"
                stroke-linecap="round"
                transform="rotate(-90 50 50)" />
            </svg>
            <span class="score-text">{{ quizScorePercent }}%</span>
          </div>
          <p>{{ quizCorrect }} out of {{ quizQuestions.length }} correct</p>
          <div class="modal-actions">
            <button class="btn btn-primary" @click="quizFinished = false; quizActive = false">Done</button>
            <button class="btn btn-secondary" @click="quizFinished = false; startQuiz()">Retry</button>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════ -->
    <!-- STUDY STATS DASHBOARD        -->
    <!-- ════════════════════════════ -->
    <section class="section stats-section" v-if="activeSection === 'stats'">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">📊 Study Statistics</h2>
          <button class="btn btn-ghost" @click="activeSection = null">Close</button>
        </div>

        <div class="stats-dashboard">
          <div class="stat-card glass">
            <span class="stat-icon">🃏</span>
            <span class="stat-value">{{ allCards.length }}</span>
            <span class="stat-label">Total Cards</span>
          </div>
          <div class="stat-card glass">
            <span class="stat-icon">📖</span>
            <span class="stat-value">{{ studyHistory.length }}</span>
            <span class="stat-label">Total Reviews</span>
          </div>
          <div class="stat-card glass">
            <span class="stat-icon">🔥</span>
            <span class="stat-value">{{ studyStreak }}</span>
            <span class="stat-label">Day Streak</span>
          </div>
          <div class="stat-card glass">
            <span class="stat-icon">🎯</span>
            <span class="stat-value">{{ overallAccuracy }}%</span>
            <span class="stat-label">Accuracy</span>
          </div>
          <div class="stat-card glass">
            <span class="stat-icon">⭐</span>
            <span class="stat-value">{{ allCards.filter(c => c.mastered).length }}</span>
            <span class="stat-label">Mastered</span>
          </div>
          <div class="stat-card glass">
            <span class="stat-icon">📅</span>
            <span class="stat-value">{{ todayReviews }}</span>
            <span class="stat-label">Today</span>
          </div>
        </div>

        <!-- Activity Heatmap -->
        <div class="activity-section glass">
          <h3>📅 Activity (Last 30 Days)</h3>
          <div class="heatmap">
            <div 
              v-for="(day, i) in heatmapData" 
              :key="i" 
              class="heatmap-cell"
              :class="'level-' + day.level"
              :title="day.date + ': ' + day.count + ' reviews'"
            ></div>
          </div>
          <div class="heatmap-legend">
            <span>Less</span>
            <div class="heatmap-cell level-0"></div>
            <div class="heatmap-cell level-1"></div>
            <div class="heatmap-cell level-2"></div>
            <div class="heatmap-cell level-3"></div>
            <div class="heatmap-cell level-4"></div>
            <span>More</span>
          </div>
        </div>

        <!-- Difficulty Breakdown -->
        <div class="breakdown-section glass">
          <h3>📊 Card Difficulty Breakdown</h3>
          <div class="breakdown-bars">
            <div class="b-row">
              <span class="b-label">😊 Easy</span>
              <div class="b-bar"><div class="b-fill easy" :style="{ width: cardBreakdown.easy + '%' }"></div></div>
              <span class="b-pct">{{ cardBreakdown.easy }}%</span>
            </div>
            <div class="b-row">
              <span class="b-label">🤔 Okay</span>
              <div class="b-bar"><div class="b-fill okay" :style="{ width: cardBreakdown.okay + '%' }"></div></div>
              <span class="b-pct">{{ cardBreakdown.okay }}%</span>
            </div>
            <div class="b-row">
              <span class="b-label">😓 Hard</span>
              <div class="b-bar"><div class="b-fill hard" :style="{ width: cardBreakdown.hard + '%' }"></div></div>
              <span class="b-pct">{{ cardBreakdown.hard }}%</span>
            </div>
            <div class="b-row">
              <span class="b-label">🆕 New</span>
              <div class="b-bar"><div class="b-fill new-card" :style="{ width: cardBreakdown.newCards + '%' }"></div></div>
              <span class="b-pct">{{ cardBreakdown.newCards }}%</span>
            </div>
          </div>
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
import { useSettings } from '~/composables/useSettings'

useScrollReveal()
const { settings } = useSettings()

useHead({
  title: 'Learning Hub - QuickHelp.lol',
  meta: [
    { name: 'description', content: 'Free learning tools including calculator, flashcards, writing helper, and study techniques.' }
  ]
})

const activeSection = ref(null)
const flashcardTab = ref('decks')
const backInput = ref(null)

const focusBackInput = () => {
  backInput.value?.focus()
}

// ─── Calculator ────────────────────────────────
const expression = ref('')
const calcResult = ref('')
const calcHistory = ref([])

const addToExpression = (val) => {
  expression.value += val
  try {
    const expr = expression.value.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-')
    calcResult.value = eval(expr)
  } catch { calcResult.value = '' }
}

const addFunction = (func) => { expression.value += `Math.${func}(` }

const calculate = () => {
  if (!expression.value) return
  try {
    const expr = expression.value.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-')
    const res = eval(expr)
    calcHistory.value.push({ expr: expression.value, result: res })
    calcResult.value = res
    expression.value = String(res)
  } catch { calcResult.value = 'Error' }
}

const clearCalc = () => { expression.value = ''; calcResult.value = '' }
const deleteChar = () => { expression.value = expression.value.slice(0, -1) }

// ─── Flashcards — Advanced ─────────────────────
const allCards = ref([])
const studyHistory = ref([])
const newCard = ref({ front: '', back: '', deck: 'default', tag: '', priority: 'normal' })
const newDeckName = ref('')
const bulkInput = ref('')
const bulkDeck = ref('default')
const importJson = ref('')
const editingCard = ref(null)

const studyMode = ref(false)
const studyModeType = ref('normal')
const currentStudyDeck = ref('default')
const currentCardIndex = ref(0)
const isFlipped = ref(false)
const studyCards = ref([])
const showStudyComplete = ref(false)
const studySessionStats = ref({ total: 0, easy: 0, okay: 0, hard: 0 })

const historyFilter = ref('all')

// Quiz state
const quizActive = ref(false)
const quizFinished = ref(false)
const quizDeck = ref('all')
const quizCount = ref(10)
const quizTimed = ref(false)
const quizTimeLimit = ref(15)
const quizQuestions = ref([])
const quizIndex = ref(0)
const quizCorrect = ref(0)
const quizSelected = ref(null)
const quizAnswered = ref(false)
const quizTimer = ref(0)
let quizTimerInterval = null

// Computed
const currentCard = computed(() => studyCards.value[currentCardIndex.value])
const studyProgress = computed(() =>
  studyCards.value.length > 0 ? ((currentCardIndex.value + 1) / studyCards.value.length) * 100 : 0
)

const customDecks = computed(() => {
  const decks = new Set(allCards.value.map(c => c.deck || 'default'))
  decks.delete('default')
  return [...decks].sort()
})

const allDeckNames = computed(() => {
  const decks = new Set(allCards.value.map(c => c.deck || 'default'))
  return [...decks].sort()
})

const allTags = computed(() => {
  const tags = new Set(allCards.value.map(c => c.tag).filter(Boolean))
  return [...tags].sort()
})

const deckList = computed(() => {
  const deckMap = {}
  for (const card of allCards.value) {
    const name = card.deck || 'default'
    if (!deckMap[name]) deckMap[name] = []
    deckMap[name].push(card)
  }
  if (!deckMap['default']) deckMap['default'] = []

  return Object.entries(deckMap).map(([name, cards]) => {
    const now = Date.now()
    const dueCards = cards.filter(c => !c.nextReview || c.nextReview <= now)
    const mastered = cards.filter(c => c.mastered)
    const reviewed = cards.filter(c => c.reviewCount > 0)
    const avgScore = reviewed.length > 0
      ? Math.round(reviewed.reduce((sum, c) => sum + (c.score || 0), 0) / reviewed.length)
      : 0

    return { name, cards, dueCount: dueCards.length, masteredCount: mastered.length, averageScore: avgScore }
  }).sort((a, b) => a.name === 'default' ? -1 : b.name === 'default' ? 1 : a.name.localeCompare(b.name))
})

const filteredHistory = computed(() => {
  const now = Date.now()
  const day = 86400000
  switch (historyFilter.value) {
    case 'today': return studyHistory.value.filter(h => now - h.timestamp < day)
    case 'week': return studyHistory.value.filter(h => now - h.timestamp < 7 * day)
    case 'month': return studyHistory.value.filter(h => now - h.timestamp < 30 * day)
    default: return studyHistory.value
  }
})

const studyStreak = computed(() => {
  if (studyHistory.value.length === 0) return 0
  const days = new Set()
  for (const h of studyHistory.value) {
    days.add(new Date(h.timestamp).toDateString())
  }
  const sorted = [...days].map(d => new Date(d)).sort((a, b) => b - a)
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    expected.setHours(0, 0, 0, 0)
    const d = new Date(sorted[i])
    d.setHours(0, 0, 0, 0)
    if (d.getTime() === expected.getTime()) {
      streak++
    } else break
  }
  return streak
})

const overallAccuracy = computed(() => {
  if (studyHistory.value.length === 0) return 0
  const easy = studyHistory.value.filter(h => h.difficulty === 'easy').length
  const okay = studyHistory.value.filter(h => h.difficulty === 'okay').length
  return Math.round(((easy * 1 + okay * 0.5) / studyHistory.value.length) * 100)
})

const todayReviews = computed(() => {
  const today = new Date().toDateString()
  return studyHistory.value.filter(h => new Date(h.timestamp).toDateString() === today).length
})

const sessionScore = computed(() => {
  const s = studySessionStats.value
  if (s.total === 0) return 0
  return Math.round(((s.easy * 1 + s.okay * 0.5) / s.total) * 100)
})

const scoreMessage = computed(() => {
  const s = sessionScore.value
  if (s >= 90) return '🌟 Outstanding! You really know this material!'
  if (s >= 70) return '💪 Great job! Keep practicing the tricky ones.'
  if (s >= 50) return '📚 Good effort! Review the hard cards again soon.'
  return '🔄 Keep studying! You\'ll get there with practice.'
})

const heatmapData = computed(() => {
  const days = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toDateString()
    const count = studyHistory.value.filter(h => new Date(h.timestamp).toDateString() === dateStr).length
    const level = count === 0 ? 0 : count <= 5 ? 1 : count <= 15 ? 2 : count <= 30 ? 3 : 4
    days.push({ date: d.toLocaleDateString(), count, level })
  }
  return days
})

const cardBreakdown = computed(() => {
  const total = allCards.value.length || 1
  const easy = allCards.value.filter(c => c.difficulty === 'easy').length
  const okay = allCards.value.filter(c => c.difficulty === 'okay').length
  const hard = allCards.value.filter(c => c.difficulty === 'hard').length
  const newCards = allCards.value.filter(c => c.difficulty === 'new').length
  return {
    easy: Math.round(easy / total * 100),
    okay: Math.round(okay / total * 100),
    hard: Math.round(hard / total * 100),
    newCards: Math.round(newCards / total * 100),
  }
})

const quizScorePercent = computed(() => {
  if (quizQuestions.value.length === 0) return 0
  return Math.round((quizCorrect.value / quizQuestions.value.length) * 100)
})

// ─── Methods ───────────────────────────────────

const addCard = () => {
  if (!newCard.value.front || !newCard.value.back) return
  let deck = newCard.value.deck
  if (deck === '__new__' && newDeckName.value.trim()) {
    deck = newDeckName.value.trim()
    newDeckName.value = ''
  }
  if (deck === '__new__') deck = 'default'

  allCards.value.push({
    id: Date.now() + Math.random(),
    front: newCard.value.front,
    back: newCard.value.back,
    deck,
    tag: newCard.value.tag || '',
    priority: newCard.value.priority || 'normal',
    difficulty: 'new',
    reviewCount: 0,
    score: 0,
    starred: false,
    mastered: false,
    nextReview: null,
    lastReview: null,
    createdAt: Date.now(),
  })
  newCard.value = { front: '', back: '', deck, tag: '', priority: 'normal' }
  saveAll()
}

const bulkCreate = () => {
  const lines = bulkInput.value.split('\n').filter(l => l.trim())
  let added = 0
  for (const line of lines) {
    const parts = line.includes('::') ? line.split('::') : line.split('|')
    if (parts.length >= 2) {
      allCards.value.push({
        id: Date.now() + Math.random() + added,
        front: parts[0].trim(),
        back: parts[1].trim(),
        deck: bulkDeck.value,
        tag: '',
        priority: 'normal',
        difficulty: 'new',
        reviewCount: 0,
        score: 0,
        starred: false,
        mastered: false,
        nextReview: null,
        lastReview: null,
        createdAt: Date.now(),
      })
      added++
    }
  }
  if (added > 0) {
    bulkInput.value = ''
    saveAll()
  }
}

const deleteCard = (id) => {
  allCards.value = allCards.value.filter(c => c.id !== id)
  saveAll()
}

const toggleStar = (card) => {
  card.starred = !card.starred
  saveAll()
}

const editCardStart = (card) => {
  editingCard.value = { ...card }
}

const saveEditCard = () => {
  const idx = allCards.value.findIndex(c => c.id === editingCard.value.id)
  if (idx !== -1) {
    allCards.value[idx] = { ...allCards.value[idx], ...editingCard.value }
  }
  editingCard.value = null
  saveAll()
}

const startStudy = (deckName = 'default', mode = 'normal') => {
  studyModeType.value = mode
  currentStudyDeck.value = deckName
  studySessionStats.value = { total: 0, easy: 0, okay: 0, hard: 0 }

  let cards = allCards.value.filter(c => (c.deck || 'default') === deckName)
  
  if (mode === 'spaced') {
    const now = Date.now()
    cards = cards.filter(c => !c.nextReview || c.nextReview <= now)
  }

  // Shuffle
  cards = cards.slice().sort(() => Math.random() - 0.5)

  // Limit per session
  if (settings.value.cardsPerSession > 0 && cards.length > settings.value.cardsPerSession) {
    cards = cards.slice(0, settings.value.cardsPerSession)
  }

  studyCards.value = cards
  currentCardIndex.value = 0
  isFlipped.value = false
  studyMode.value = true
  flashcardTab.value = 'decks'
}

const markCard = (difficulty) => {
  if (!currentCard.value) return

  // Update card stats
  const card = allCards.value.find(c => c.id === currentCard.value.id)
  if (card) {
    card.difficulty = difficulty
    card.reviewCount = (card.reviewCount || 0) + 1
    card.lastReview = Date.now()
    
    // Spaced repetition intervals
    const intervals = { hard: 1, okay: 3, easy: 7 }
    const multiplier = Math.min(card.reviewCount, 5)
    const days = intervals[difficulty] * multiplier
    card.nextReview = Date.now() + days * 86400000

    // Score (0-100)
    const points = { hard: 20, okay: 60, easy: 100 }
    card.score = Math.round((card.score * (card.reviewCount - 1) + points[difficulty]) / card.reviewCount)

    // Mastered if easy 3+ times or score >= 90
    if (card.score >= 90 && card.reviewCount >= 3) {
      card.mastered = true
    }
  }

  // Record history
  studyHistory.value.push({
    id: currentCard.value.id,
    front: currentCard.value.front,
    back: currentCard.value.back,
    deck: currentCard.value.deck || 'default',
    difficulty,
    timestamp: Date.now(),
  })

  // Session stats
  studySessionStats.value.total++
  studySessionStats.value[difficulty]++

  isFlipped.value = false
  saveAll()

  if (currentCardIndex.value < studyCards.value.length - 1) {
    currentCardIndex.value++
  } else {
    studyMode.value = false
    showStudyComplete.value = true
  }
}

const endStudySession = () => {
  studyMode.value = false
  if (studySessionStats.value.total > 0) {
    showStudyComplete.value = true
  }
}

const clearHistory = () => {
  if (confirm('Clear all study history? This cannot be undone.')) {
    studyHistory.value = []
    saveAll()
  }
}

const exportCards = () => {
  const data = { cards: allCards.value, history: studyHistory.value }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `flashcards-export-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importCards = () => {
  try {
    const data = JSON.parse(importJson.value)
    if (data.cards) {
      allCards.value.push(...data.cards)
    }
    if (data.history) {
      studyHistory.value.push(...data.history)
    }
    importJson.value = ''
    saveAll()
    alert('✅ Cards imported successfully!')
  } catch {
    alert('❌ Invalid JSON format')
  }
}

const deleteAllData = () => {
  if (confirm('🗑️ Delete ALL flashcards and history? This cannot be undone!')) {
    allCards.value = []
    studyHistory.value = []
    saveAll()
  }
}

// Quiz
const startQuiz = () => {
  let pool = quizDeck.value === 'all' 
    ? allCards.value.slice() 
    : allCards.value.filter(c => (c.deck || 'default') === quizDeck.value)
  
  pool = pool.sort(() => Math.random() - 0.5)
  const count = quizCount.value === 0 ? pool.length : Math.min(quizCount.value, pool.length)
  
  quizQuestions.value = pool.slice(0, count).map(card => {
    const wrongs = allCards.value
      .filter(c => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.back)
    
    const options = [card.back, ...wrongs].sort(() => Math.random() - 0.5)
    return { ...card, options }
  })

  quizIndex.value = 0
  quizCorrect.value = 0
  quizSelected.value = null
  quizAnswered.value = false
  quizActive.value = true
  quizFinished.value = false

  if (quizTimed.value) startQuizTimer()
}

const startQuizTimer = () => {
  clearInterval(quizTimerInterval)
  quizTimer.value = quizTimeLimit.value
  quizTimerInterval = setInterval(() => {
    quizTimer.value--
    if (quizTimer.value <= 0) {
      clearInterval(quizTimerInterval)
      if (!quizAnswered.value) answerQuiz(null)
    }
  }, 1000)
}

const answerQuiz = (opt) => {
  clearInterval(quizTimerInterval)
  quizSelected.value = opt
  quizAnswered.value = true
  if (opt === quizQuestions.value[quizIndex.value]?.back) {
    quizCorrect.value++
  }
}

const nextQuizQuestion = () => {
  if (quizIndex.value < quizQuestions.value.length - 1) {
    quizIndex.value++
    quizSelected.value = null
    quizAnswered.value = false
    if (quizTimed.value) startQuizTimer()
  } else {
    quizActive.value = false
    quizFinished.value = true
    clearInterval(quizTimerInterval)
  }
}

// Helpers
const difficultyEmoji = (d) => {
  return { hard: '😓', okay: '🤔', easy: '😊' }[d] || ''
}

const formatTimeAgo = (ts) => {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

// Persistence
const saveAll = () => {
  localStorage.setItem('quickhelp-flashcards-v2', JSON.stringify(allCards.value))
  localStorage.setItem('quickhelp-study-history', JSON.stringify(studyHistory.value))
}

const loadAll = () => {
  // Migrate v1
  const v1 = localStorage.getItem('quickhelp-flashcards')
  if (v1) {
    try {
      const old = JSON.parse(v1)
      allCards.value = old.map(c => ({
        ...c,
        deck: c.deck || 'default',
        tag: c.tag || '',
        priority: c.priority || 'normal',
        reviewCount: c.reviewCount || 0,
        score: c.score || 0,
        starred: c.starred || false,
        mastered: c.mastered || false,
        nextReview: c.nextReview || null,
        lastReview: c.lastReview || null,
        createdAt: c.createdAt || Date.now(),
      }))
      localStorage.removeItem('quickhelp-flashcards')
      saveAll()
    } catch {}
  }

  const v2 = localStorage.getItem('quickhelp-flashcards-v2')
  if (v2) {
    try { allCards.value = JSON.parse(v2) } catch {}
  }

  const hist = localStorage.getItem('quickhelp-study-history')
  if (hist) {
    try { studyHistory.value = JSON.parse(hist) } catch {}
  }
}

// ─── Text-to-Speech ────────────────────────────
const isSpeaking = ref(false)
const autoSpeak = ref(false)
const ttsLang = ref('')

// Detect Hebrew characters in text
const detectLang = (text) => {
  if (ttsLang.value) return ttsLang.value
  if (/[\u0590-\u05FF]/.test(text)) return 'he-IL'
  if (/[\u0600-\u06FF]/.test(text)) return 'ar-SA'
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh-CN'
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja-JP'
  if (/[\u0400-\u04FF]/.test(text)) return 'ru-RU'
  return ''
}

const speak = (text) => {
  if (!text) return
  if (isSpeaking.value) {
    window.speechSynthesis.cancel()
    isSpeaking.value = false
    return
  }
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = detectLang(text)
  utter.rate = 0.9
  utter.pitch = 1
  utter.onend = () => { isSpeaking.value = false }
  utter.onerror = () => { isSpeaking.value = false }
  isSpeaking.value = true
  window.speechSynthesis.speak(utter)
}

const stopSpeaking = () => {
  window.speechSynthesis.cancel()
  isSpeaking.value = false
}

// Auto-speak when card changes
watch(currentCardIndex, () => {
  stopSpeaking()
  if (autoSpeak.value && currentCard.value) {
    nextTick(() => speak(currentCard.value.front))
  }
})

watch(isFlipped, (flipped) => {
  stopSpeaking()
  if (autoSpeak.value && flipped && currentCard.value) {
    nextTick(() => speak(currentCard.value.back))
  }
})

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

// Keyboard shortcuts for study mode
const handleKeydown = (e) => {
  if (!studyMode.value) return
  if (e.code === 'Space') {
    e.preventDefault()
    isFlipped.value = !isFlipped.value
  }
  if (isFlipped.value) {
    if (e.key === '1') markCard('hard')
    if (e.key === '2') markCard('okay')
    if (e.key === '3') markCard('easy')
  }
  if (e.key === 's' || e.key === 'S') {
    const text = isFlipped.value ? currentCard.value?.back : currentCard.value?.front
    speak(text)
  }
}

onMounted(() => {
  loadAll()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearInterval(quizTimerInterval)
  stopSpeaking()
})
</script>

<style scoped>
.learning-page {
  padding-top: 80px;
}

/* ─── Hero ─────────────────── */
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

.streak-banner {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  padding: 12px 28px;
  background: linear-gradient(135deg, rgba(251,146,60,0.2), rgba(239,68,68,0.15));
  border: 1px solid rgba(251,146,60,0.3);
  border-radius: var(--radius-full);
  font-size: 16px;
  font-weight: 600;
  animation: pulse-glow 2s ease-in-out infinite;
}

.streak-fire { font-size: 24px; }
.streak-sub { font-size: 13px; color: var(--text-muted); }

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 15px rgba(251,146,60,0.15); }
  50% { box-shadow: 0 0 30px rgba(251,146,60,0.3); }
}

/* ─── Quick Tools ───────────── */
.quick-tools { padding: 60px 0; }

.tools-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  position: relative;
}

.tool-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.tool-icon { font-size: 48px; display: block; margin-bottom: 16px; }
.tool-card h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
.tool-card p { font-size: 14px; color: var(--text-muted); }

.card-count-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  background: var(--primary);
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
}

/* ─── Section Header ──────── */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}

.header-actions .btn.active {
  background: var(--primary);
  color: white;
}

/* ─── Calculator ──────────── */
.calculator { max-width: 400px; margin: 0 auto; padding: 24px; }

.calc-display {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: 20px;
  text-align: right;
}

.calc-expression { font-size: 18px; color: var(--text-muted); min-height: 24px; word-break: break-all; }

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

.calc-btn:hover { background: var(--surface-light); }
.calc-btn.func { color: #f472b6; }
.calc-btn.op { background: rgba(124, 58, 237, 0.2); color: var(--primary); }
.calc-btn.equals { background: var(--primary); }

.calc-scientific {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.calc-btn.sci { padding: 12px; font-size: 14px; background: var(--surface); }

.calc-history { padding-top: 16px; border-top: 1px solid var(--border-light); }
.calc-history h4 { font-size: 14px; color: var(--text-muted); margin-bottom: 12px; }
.history-list { max-height: 120px; overflow-y: auto; }

.history-item {
  padding: 8px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 6px;
}

.history-item:hover { background: var(--surface); color: white; }

/* ─── Flashcards ──────────── */
.flashcard-creator { max-width: 600px; margin: 0 auto 32px; padding: 24px; }
.flashcard-creator h3 { font-size: 18px; margin-bottom: 16px; }

.card-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}

.select-sm { padding: 8px 32px 8px 12px; font-size: 13px; }

.bulk-textarea {
  min-height: 120px;
  resize: vertical;
  font-family: 'Space Grotesk', monospace;
  line-height: 1.7;
}

.hint-text {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.hint-text code {
  background: var(--surface);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

/* Decks */
.decks-overview { display: flex; flex-direction: column; gap: 24px; }

.deck-panel { padding: 24px; }

.deck-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.deck-header h3 { font-size: 18px; margin-bottom: 4px; }

.badge {
  display: inline-block;
  padding: 2px 10px;
  background: var(--primary);
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

.deck-meta { display: flex; gap: 16px; flex-wrap: wrap; }

.meta-item {
  font-size: 13px;
  color: var(--text-muted);
}

.meta-item.due { color: #ef4444; font-weight: 600; }

.deck-actions { display: flex; gap: 8px; }

.btn-sm {
  padding: 8px 16px;
  font-size: 13px;
}

.deck-card-list { display: flex; flex-direction: column; gap: 8px; }

.deck-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: var(--surface);
  border-radius: 10px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.deck-card:hover { border-color: var(--border); }
.deck-card.card-mastered { border-left: 3px solid var(--accent-2); }

.card-info { flex: 1; min-width: 0; }
.card-info .front { font-weight: 600; display: block; margin-bottom: 2px; }
.card-info .back { color: var(--text-muted); font-size: 14px; display: block; }

.card-tags {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.tag {
  padding: 2px 10px;
  background: rgba(124, 58, 237, 0.15);
  border-radius: var(--radius-full);
  font-size: 11px;
  color: var(--primary-light);
}

.tag.sm { font-size: 10px; padding: 1px 8px; }

.difficulty-badge {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.difficulty-badge.easy { background: rgba(34,197,94,0.15); color: #4ade80; }
.difficulty-badge.okay { background: rgba(245,158,11,0.15); color: #fbbf24; }
.difficulty-badge.hard { background: rgba(239,68,68,0.15); color: #f87171; }
.difficulty-badge.new { background: rgba(59,130,246,0.15); color: #93c5fd; }

.review-count { font-size: 11px; color: var(--text-dim); }

.card-actions { display: flex; gap: 4px; align-items: center; }

.icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.icon-btn:hover { background: var(--surface-light); }

.delete-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 18px;
}

.delete-btn:hover { color: #ef4444; }

/* History */
.history-panel { padding: 24px; }

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.history-filters { display: flex; gap: 8px; align-items: center; }

.history-stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.h-stat {
  text-align: center;
  padding: 12px;
  background: var(--surface);
  border-radius: 10px;
}

.h-val {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
}

.h-label { font-size: 12px; color: var(--text-muted); }
.easy-stat .h-val, .easy-stat .c-val { color: #4ade80; }
.okay-stat .h-val, .okay-stat .c-val { color: #fbbf24; }
.hard-stat .h-val, .hard-stat .c-val { color: #f87171; }

.history-timeline { max-height: 500px; overflow-y: auto; }

.timeline-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.timeline-dot.easy { background: #4ade80; }
.timeline-dot.okay { background: #fbbf24; }
.timeline-dot.hard { background: #f87171; }

.timeline-card-name { font-weight: 600; margin-bottom: 4px; }

.timeline-details {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.timeline-deck { font-size: 12px; color: var(--text-muted); }
.timeline-time { font-size: 12px; color: var(--text-dim); }

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-muted);
}

.empty-icon { font-size: 48px; display: block; margin-bottom: 16px; }

/* Import/Export */
.import-panel { max-width: 600px; margin: 0 auto; padding: 24px; }

.import-section {
  padding: 20px 0;
  border-bottom: 1px solid var(--border-light);
}

.import-section:last-child { border-bottom: none; }
.import-section h4 { font-size: 16px; margin-bottom: 8px; }

.btn-danger {
  padding: 10px 20px;
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.3);
  border-radius: var(--radius-md);
  color: #f87171;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-danger:hover { background: rgba(239,68,68,0.25); }

/* ─── Study Mode ──────────── */
.study-area { max-width: 560px; margin: 0 auto; text-align: center; }

.study-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.study-info { display: flex; gap: 12px; align-items: center; }

.study-deck-label, .study-mode-label {
  font-size: 13px;
  color: var(--text-muted);
  padding: 4px 12px;
  background: var(--surface);
  border-radius: var(--radius-full);
}

.study-counter {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 600;
}

.progress-bar {
  height: 4px;
  background: var(--surface);
  border-radius: 2px;
  margin-bottom: 20px;
  overflow: hidden;
}

.progress-bar .progress {
  height: 100%;
  background: var(--gradient-1);
  transition: width 0.3s ease;
}

.confidence-meter { margin-bottom: 20px; }

.cm-bar {
  height: 6px;
  background: var(--surface);
  border-radius: 3px;
  overflow: hidden;
  display: flex;
}

.cm-easy { background: #4ade80; transition: width 0.3s; }
.cm-okay { background: #fbbf24; transition: width 0.3s; }
.cm-hard { background: #f87171; transition: width 0.3s; }

.flashcard {
  width: 100%;
  height: 300px;
  perspective: 1000px;
  cursor: pointer;
  margin-bottom: 24px;
}

.flashcard-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.flashcard.flipped .flashcard-inner { transform: rotateY(180deg); }

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
  background: var(--gradient-1);
}

.flashcard-front span,
.flashcard-back span { font-size: 24px; font-weight: 600; }

.card-number {
  position: absolute;
  top: 16px;
  left: 20px;
  font-size: 12px;
  color: var(--text-dim);
}

.card-meta-study {
  position: absolute;
  bottom: 40px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.review-badge {
  font-size: 11px;
  color: var(--text-dim);
  padding: 2px 8px;
  background: var(--surface-light);
  border-radius: var(--radius-full);
}

.flip-hint {
  position: absolute;
  bottom: 20px;
  font-size: 14px;
  color: var(--text-muted);
}

/* TTS Button */
.tts-btn {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid rgba(124, 58, 237, 0.3);
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 5;
}

.tts-btn:hover {
  background: rgba(124, 58, 237, 0.4);
  transform: scale(1.1);
}

.tts-btn-back {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.tts-btn-back:hover {
  background: rgba(255, 255, 255, 0.35);
}

.tts-quiz {
  position: relative;
  top: auto;
  right: auto;
  margin-top: 16px;
}

.tts-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.tts-lang-select {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tts-lang-select select {
  background: var(--surface);
  border: 1px solid var(--border-light);
  color: white;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  cursor: pointer;
  outline: none;
}

.tts-lang-select select:focus {
  border-color: var(--primary);
}

.study-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.difficulty-btn {
  padding: 12px 28px;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.difficulty-btn.hard { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }
.difficulty-btn.hard:hover { background: rgba(239,68,68,0.25); }
.difficulty-btn.okay { background: rgba(245,158,11,0.15); color: #fbbf24; border-color: rgba(245,158,11,0.3); }
.difficulty-btn.okay:hover { background: rgba(245,158,11,0.25); }
.difficulty-btn.easy { background: rgba(34,197,94,0.15); color: #4ade80; border-color: rgba(34,197,94,0.3); }
.difficulty-btn.easy:hover { background: rgba(34,197,94,0.25); }

.keyboard-hint {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 20px;
}

.keyboard-hint kbd {
  display: inline-block;
  padding: 2px 8px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  font-size: 11px;
  font-family: 'Space Grotesk', monospace;
}

/* ─── Study Complete Modal ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  max-width: 480px;
  width: 100%;
  padding: 40px;
  border-radius: var(--radius-xl);
  text-align: center;
}

.confetti-container { font-size: 48px; margin-bottom: 16px; }

.modal h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  margin-bottom: 24px;
}

.complete-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.c-stat {
  padding: 12px;
  background: var(--surface);
  border-radius: 10px;
}

.c-val {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
}

.c-label { font-size: 11px; color: var(--text-muted); }

.score-circle {
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  position: relative;
}

.score-circle.large { width: 160px; height: 160px; }

.score-circle svg { width: 100%; height: 100%; }

.score-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 700;
}

.score-circle.large .score-text { font-size: 36px; }

.score-message {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.modal-actions { display: flex; gap: 12px; justify-content: center; }

/* ─── Quiz ────────────────── */
.quiz-setup { max-width: 500px; margin: 0 auto; padding: 32px; }
.quiz-setup h3 { font-size: 20px; margin-bottom: 20px; }

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.quiz-area { max-width: 600px; margin: 0 auto; }

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-muted);
}

.quiz-timer {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: white;
}

.quiz-timer.timer-warning { color: #ef4444; animation: blink 0.5s infinite; }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.quiz-score-live { font-weight: 600; color: var(--primary-light); }

.quiz-question {
  padding: 40px;
  margin-bottom: 24px;
  text-align: center;
}

.quiz-question h3 { font-size: 22px; line-height: 1.5; }

.quiz-answers {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.quiz-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: var(--surface);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-md);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.quiz-option:hover:not(:disabled) {
  border-color: var(--primary);
  background: var(--surface-light);
}

.quiz-option.correct { border-color: #4ade80; background: rgba(34,197,94,0.1); }
.quiz-option.wrong { border-color: #f87171; background: rgba(239,68,68,0.1); }

.option-letter {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-light);
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.quiz-results { max-width: 500px; margin: 0 auto; padding: 40px; text-align: center; }
.quiz-results h2 { margin-bottom: 24px; }
.quiz-results p { font-size: 18px; color: var(--text-secondary); margin-bottom: 24px; }

/* ─── Stats Dashboard ─────── */
.stats-dashboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 24px;
  text-align: center;
  border-radius: var(--radius-lg);
}

.stat-icon { font-size: 28px; display: block; margin-bottom: 8px; }

.stat-value {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-light);
}

.stat-label { font-size: 13px; color: var(--text-muted); }

.activity-section, .breakdown-section {
  padding: 24px;
  margin-bottom: 24px;
}

.activity-section h3, .breakdown-section h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.heatmap {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.heatmap-cell {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  transition: all 0.2s;
}

.heatmap-cell.level-0 { background: var(--surface); }
.heatmap-cell.level-1 { background: rgba(124,58,237,0.25); }
.heatmap-cell.level-2 { background: rgba(124,58,237,0.45); }
.heatmap-cell.level-3 { background: rgba(124,58,237,0.7); }
.heatmap-cell.level-4 { background: var(--primary); }

.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-muted);
}

.heatmap-legend .heatmap-cell { width: 16px; height: 16px; }

.breakdown-bars { display: flex; flex-direction: column; gap: 16px; }

.b-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.b-label { width: 80px; font-size: 14px; flex-shrink: 0; }

.b-bar {
  flex: 1;
  height: 12px;
  background: var(--surface);
  border-radius: 6px;
  overflow: hidden;
}

.b-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.b-fill.easy { background: #4ade80; }
.b-fill.okay { background: #fbbf24; }
.b-fill.hard { background: #f87171; }
.b-fill.new-card { background: #93c5fd; }

.b-pct {
  width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

/* ─── Writing ─────────────── */
.writing-tool { max-width: 800px; margin: 0 auto; padding: 32px; }

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

.writing-input:focus { outline: none; border-color: var(--primary); }

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

.writing-stats .label { font-size: 13px; color: var(--text-muted); }
.writing-tips h4 { font-size: 16px; margin-bottom: 12px; }
.writing-tips ul { list-style: none; padding: 0; }

.writing-tips li {
  padding: 8px 12px;
  background: var(--surface);
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

/* ─── Study Tips ──────────── */
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

.tip-icon { font-size: 36px; margin-bottom: 16px; }
.tip-card h3 { font-size: 18px; margin-bottom: 12px; }
.tip-card p { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }
.tip-card ul { list-style: none; padding: 0; }

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

/* ─── Resources ───────────── */
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

.resource-card:hover { border-color: var(--primary); transform: translateY(-2px); }
.resource-icon { font-size: 32px; display: block; margin-bottom: 12px; }
.resource-card h4 { font-size: 16px; color: white; margin-bottom: 8px; }
.resource-card p { font-size: 13px; color: var(--text-muted); }

/* ─── Responsive ──────────── */
@media (max-width: 900px) {
  .tools-grid, .tips-grid { grid-template-columns: repeat(2, 1fr); }
  .resources-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-dashboard { grid-template-columns: repeat(2, 1fr); }
  .complete-stats { grid-template-columns: repeat(2, 1fr); }
  .history-stats-bar { grid-template-columns: repeat(2, 1fr); }
  .header-actions { flex-wrap: wrap; }
}

@media (max-width: 600px) {
  .hero h1 { font-size: 36px; }
  .tools-grid, .tips-grid { grid-template-columns: 1fr; }
  .resources-grid { grid-template-columns: 1fr; }
  .writing-stats { grid-template-columns: repeat(2, 1fr); }
  .stats-dashboard { grid-template-columns: 1fr; }
  .study-header-bar { flex-direction: column; text-align: center; gap: 8px; }
  .study-info { flex-wrap: wrap; justify-content: center; }
  .complete-stats, .history-stats-bar { grid-template-columns: repeat(2, 1fr); }
  .form-row { flex-direction: column; }
}
</style>
