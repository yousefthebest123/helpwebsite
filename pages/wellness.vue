<template>
  <div class="wellness-page">
    <!-- Hero -->
    <section class="wellness-hero">
      <div class="container">
        <div class="hero-pill glass">
          <span>🌿</span> Wellness Dashboard
        </div>
        <h1>Take care of <span class="gradient-text">yourself</span></h1>
        <p>Track habits, hydration, sleep & more — all saved locally on your device.</p>
      </div>
    </section>

    <!-- Dashboard Grid -->
    <section class="container dashboard">
      <!-- Habit Tracker -->
      <div class="dash-card glass habit-card">
        <div class="card-header">
          <h2>✅ Habit Tracker</h2>
          <button class="btn btn-glass btn-sm" @click="showAddHabit = !showAddHabit">
            + Add Habit
          </button>
        </div>

        <Transition name="slide">
          <div v-if="showAddHabit" class="add-habit-form">
            <input v-model="newHabitName" class="input" placeholder="e.g., Meditate 10 min" @keyup.enter="addHabit" />
            <select v-model="newHabitIcon" class="input select-input">
              <option value="🧘">🧘 Meditate</option>
              <option value="💪">💪 Exercise</option>
              <option value="📖">📖 Read</option>
              <option value="🚶">🚶 Walk</option>
              <option value="💧">💧 Water</option>
              <option value="🥗">🥗 Healthy Eating</option>
              <option value="😴">😴 Sleep Early</option>
              <option value="📝">📝 Journal</option>
              <option value="⭐">⭐ Custom</option>
            </select>
            <button class="btn btn-primary btn-sm" @click="addHabit">Add</button>
          </div>
        </Transition>

        <div class="habits-list">
          <div v-for="habit in habits" :key="habit.id" class="habit-row">
            <div class="habit-info">
              <span class="habit-icon">{{ habit.icon }}</span>
              <div>
                <span class="habit-name">{{ habit.name }}</span>
                <span class="habit-streak">🔥 {{ habit.streak }} day streak</span>
              </div>
            </div>
            <div class="habit-days">
              <button 
                v-for="day in 7" 
                :key="day"
                class="day-btn"
                :class="{ done: isHabitDone(habit.id, day) }"
                @click="toggleHabitDay(habit.id, day)"
              >
                {{ dayLabels[day - 1] }}
              </button>
            </div>
            <button class="btn-icon-sm" @click="removeHabit(habit.id)" title="Remove habit">✕</button>
          </div>
          <div v-if="habits.length === 0" class="empty-state">
            <p>No habits yet. Add one above to start tracking! 🌱</p>
          </div>
        </div>
      </div>

      <!-- Water Intake -->
      <div class="dash-card glass water-card">
        <div class="card-header">
          <h2>💧 Hydration</h2>
          <span class="badge badge-primary">{{ waterCups }}/{{ waterGoal }} cups</span>
        </div>
        <div class="water-visual">
          <div class="water-bottle">
            <div class="water-fill" :style="{ height: waterPercent + '%' }">
              <div class="water-wave"></div>
            </div>
            <div class="water-marks">
              <span v-for="n in 8" :key="n" class="mark" :style="{ bottom: (n/8*100) + '%' }">{{ n }}</span>
            </div>
          </div>
          <div class="water-controls">
            <button class="btn btn-primary" @click="addWater">+ Add Cup</button>
            <button class="btn btn-glass" @click="removeWater" :disabled="waterCups <= 0">- Remove</button>
            <div class="water-goal-set">
              <label>Daily goal:</label>
              <input v-model.number="waterGoal" type="number" min="1" max="20" class="input input-sm" />
            </div>
          </div>
        </div>
        <p class="water-msg" :class="{ complete: waterCups >= waterGoal }">
          {{ waterMessage }}
        </p>
      </div>

      <!-- Sleep Tracker -->
      <div class="dash-card glass sleep-card">
        <div class="card-header">
          <h2>🌙 Sleep Log</h2>
          <button class="btn btn-glass btn-sm" @click="showAddSleep = !showAddSleep">+ Log Sleep</button>
        </div>

        <Transition name="slide">
          <div v-if="showAddSleep" class="sleep-form">
            <div class="sleep-inputs">
              <div>
                <label>Bedtime</label>
                <input v-model="sleepEntry.bedtime" type="time" class="input" />
              </div>
              <div>
                <label>Wake up</label>
                <input v-model="sleepEntry.wakeup" type="time" class="input" />
              </div>
              <div>
                <label>Quality</label>
                <div class="quality-stars">
                  <button 
                    v-for="n in 5" :key="n"
                    @click="sleepEntry.quality = n"
                    :class="{ active: sleepEntry.quality >= n }"
                  >★</button>
                </div>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" @click="logSleep">Save Entry</button>
          </div>
        </Transition>

        <div class="sleep-history">
          <div v-for="entry in sleepLog.slice(0, 7)" :key="entry.date" class="sleep-entry">
            <span class="sleep-date">{{ entry.dateLabel }}</span>
            <div class="sleep-bar-wrap">
              <div class="sleep-bar" :style="{ width: (entry.hours / 12 * 100) + '%' }">
                <span>{{ entry.hours }}h</span>
              </div>
            </div>
            <span class="sleep-stars">{{ '★'.repeat(entry.quality) }}{{ '☆'.repeat(5 - entry.quality) }}</span>
          </div>
          <div v-if="sleepLog.length === 0" class="empty-state">
            <p>No sleep data yet. Log your first night! 😴</p>
          </div>
        </div>
      </div>

      <!-- Mood Check-in -->
      <div class="dash-card glass mood-card">
        <div class="card-header">
          <h2>😊 Mood Check-in</h2>
        </div>
        <p class="mood-prompt">How are you feeling right now?</p>
        <div class="mood-options">
          <button 
            v-for="mood in moods" 
            :key="mood.label"
            class="mood-btn"
            :class="{ selected: todayMood === mood.label }"
            @click="setMood(mood.label)"
          >
            <span class="mood-emoji">{{ mood.emoji }}</span>
            <span class="mood-label">{{ mood.label }}</span>
          </button>
        </div>
        <div v-if="moodHistory.length > 0" class="mood-history">
          <h4>Recent moods</h4>
          <div class="mood-timeline">
            <div v-for="entry in moodHistory.slice(0, 7)" :key="entry.date" class="mood-dot-wrap">
              <span class="mood-dot-emoji">{{ getMoodEmoji(entry.mood) }}</span>
              <span class="mood-dot-date">{{ entry.dayLabel }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="dash-card glass actions-card">
        <h2>🚀 Quick Wellness Actions</h2>
        <div class="action-links">
          <NuxtLink to="/tools/breathing" class="action-link glass">
            <span>🧘</span> Breathing Exercise
          </NuxtLink>
          <NuxtLink to="/mental-health" class="action-link glass">
            <span>🧠</span> Mental Health Tools
          </NuxtLink>
          <NuxtLink to="/tools/pomodoro" class="action-link glass">
            <span>⏱️</span> Focus Timer
          </NuxtLink>
          <NuxtLink to="/tools/notes" class="action-link glass">
            <span>📓</span> Gratitude Journal
          </NuxtLink>
          <NuxtLink to="/emergency" class="action-link glass">
            <span>🆘</span> Emergency Help
          </NuxtLink>
          <NuxtLink to="/tools/bmi-calculator" class="action-link glass">
            <span>⚖️</span> BMI Calculator
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

useHead({ title: 'Wellness Dashboard — QuickHelp.lol' })

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// ─── Habits ───
const habits = ref([])
const showAddHabit = ref(false)
const newHabitName = ref('')
const newHabitIcon = ref('⭐')

const loadData = (key, fallback) => {
  try {
    const d = localStorage.getItem(key)
    return d ? JSON.parse(d) : fallback
  } catch { return fallback }
}

const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))
}

const addHabit = () => {
  if (!newHabitName.value.trim()) return
  habits.value.push({
    id: Date.now(),
    name: newHabitName.value.trim(),
    icon: newHabitIcon.value,
    streak: 0,
    completedDays: {},
  })
  newHabitName.value = ''
  showAddHabit.value = false
  saveData('qh_habits', habits.value)
}

const removeHabit = (id) => {
  habits.value = habits.value.filter(h => h.id !== id)
  saveData('qh_habits', habits.value)
}

const getWeekKey = (dayOffset) => {
  const d = new Date()
  const dayOfWeek = d.getDay() === 0 ? 6 : d.getDay() - 1
  const diff = dayOfWeek - (dayOffset - 1)
  const target = new Date(d)
  target.setDate(d.getDate() - diff)
  return target.toISOString().split('T')[0]
}

const isHabitDone = (habitId, day) => {
  const habit = habits.value.find(h => h.id === habitId)
  if (!habit) return false
  const key = getWeekKey(day)
  return habit.completedDays[key] === true
}

const toggleHabitDay = (habitId, day) => {
  const habit = habits.value.find(h => h.id === habitId)
  if (!habit) return
  const key = getWeekKey(day)
  if (habit.completedDays[key]) {
    delete habit.completedDays[key]
  } else {
    habit.completedDays[key] = true
  }
  // Recalculate streak
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const k = d.toISOString().split('T')[0]
    if (habit.completedDays[k]) streak++
    else break
  }
  habit.streak = streak
  saveData('qh_habits', habits.value)
}

// ─── Water ───
const waterCups = ref(0)
const waterGoal = ref(8)
const showAddSleep = ref(false)

const waterPercent = computed(() => Math.min(100, (waterCups.value / waterGoal.value) * 100))
const waterMessage = computed(() => {
  const pct = waterPercent.value
  if (pct >= 100) return '🎉 You hit your goal! Great hydration!'
  if (pct >= 75) return '💪 Almost there! Keep it up!'
  if (pct >= 50) return '👍 Halfway there! Keep drinking!'
  if (pct >= 25) return '💧 Good start! Keep going!'
  return '🌱 Start hydrating — your body will thank you!'
})

const addWater = () => {
  waterCups.value++
  saveData('qh_water', { cups: waterCups.value, goal: waterGoal.value, date: new Date().toDateString() })
}
const removeWater = () => {
  if (waterCups.value > 0) {
    waterCups.value--
    saveData('qh_water', { cups: waterCups.value, goal: waterGoal.value, date: new Date().toDateString() })
  }
}

// ─── Sleep ───
const sleepLog = ref([])
const sleepEntry = ref({ bedtime: '23:00', wakeup: '07:00', quality: 3 })

const logSleep = () => {
  const bed = sleepEntry.value.bedtime.split(':').map(Number)
  const wake = sleepEntry.value.wakeup.split(':').map(Number)
  let hours = wake[0] - bed[0] + (wake[1] - bed[1]) / 60
  if (hours < 0) hours += 24
  hours = Math.round(hours * 10) / 10

  const today = new Date()
  sleepLog.value.unshift({
    date: today.toISOString().split('T')[0],
    dateLabel: today.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    hours,
    quality: sleepEntry.value.quality,
    bedtime: sleepEntry.value.bedtime,
    wakeup: sleepEntry.value.wakeup,
  })
  showAddSleep.value = false
  saveData('qh_sleep', sleepLog.value)
}

// ─── Mood ───
const moods = [
  { emoji: '😄', label: 'Great' },
  { emoji: '😊', label: 'Good' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '😔', label: 'Low' },
  { emoji: '😢', label: 'Bad' },
]
const todayMood = ref('')
const moodHistory = ref([])

const getMoodEmoji = (label) => moods.find(m => m.label === label)?.emoji || '😐'

const setMood = (label) => {
  todayMood.value = label
  const today = new Date()
  const key = today.toISOString().split('T')[0]
  const existing = moodHistory.value.findIndex(m => m.date === key)
  const entry = {
    date: key,
    dayLabel: today.toLocaleDateString('en', { weekday: 'short' }),
    mood: label,
  }
  if (existing >= 0) {
    moodHistory.value[existing] = entry
  } else {
    moodHistory.value.unshift(entry)
  }
  saveData('qh_moods', moodHistory.value)
}

// ─── Load saved data ───
onMounted(() => {
  habits.value = loadData('qh_habits', [])
  
  const water = loadData('qh_water', null)
  if (water && water.date === new Date().toDateString()) {
    waterCups.value = water.cups
    waterGoal.value = water.goal
  }

  sleepLog.value = loadData('qh_sleep', [])
  moodHistory.value = loadData('qh_moods', [])

  const today = new Date().toISOString().split('T')[0]
  const todayEntry = moodHistory.value.find(m => m.date === today)
  if (todayEntry) todayMood.value = todayEntry.mood
})

watch(waterGoal, (val) => {
  saveData('qh_water', { cups: waterCups.value, goal: val, date: new Date().toDateString() })
})
</script>

<style scoped>
.wellness-hero {
  padding: 120px 0 60px;
  text-align: center;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 20px;
  border: 1px solid rgba(124, 58, 237, 0.15);
}

.wellness-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  margin-bottom: 12px;
}

.wellness-hero p {
  color: var(--text-muted);
  font-size: 16px;
  max-width: 500px;
  margin: 0 auto;
}

/* Dashboard Grid */
.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding-bottom: 80px;
}

.dash-card {
  padding: 28px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.card-header h2 { font-size: 18px; font-weight: 700; }

/* Habits */
.habit-card { grid-column: 1 / -1; }

.add-habit-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.add-habit-form .input { flex: 1; }

.select-input {
  background: var(--surface-light);
  color: white;
  border: 1px solid var(--border-light);
  padding: 10px 12px;
  border-radius: var(--radius-md);
  cursor: pointer;
}

.habits-list { display: flex; flex-direction: column; gap: 12px; }

.habit-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--surface-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.habit-info { display: flex; align-items: center; gap: 12px; min-width: 180px; }
.habit-icon { font-size: 24px; }
.habit-name { font-size: 14px; font-weight: 600; display: block; }
.habit-streak { font-size: 12px; color: var(--text-dim); }

.habit-days { display: flex; gap: 6px; flex: 1; justify-content: center; }

.day-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  background: var(--surface);
  color: var(--text-dim);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.day-btn:hover { border-color: var(--primary); }
.day-btn.done {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.btn-icon-sm {
  background: none;
  border: none;
  color: var(--text-dim);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}
.btn-icon-sm:hover { color: #ef4444; background: rgba(239,68,68,0.1); }

/* Water */
.water-visual { display: flex; gap: 32px; align-items: center; }

.water-bottle {
  position: relative;
  width: 80px;
  height: 180px;
  border: 2px solid rgba(124, 58, 237, 0.2);
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  background: rgba(5, 5, 16, 0.5);
}

.water-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(6, 182, 212, 0.4), rgba(124, 58, 237, 0.2));
  transition: height 0.6s var(--ease-out-expo);
  border-radius: 0 0 18px 18px;
}

.water-wave {
  position: absolute;
  top: -4px;
  left: -10%;
  width: 120%;
  height: 12px;
  background: rgba(6, 182, 212, 0.3);
  border-radius: 50%;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: translateX(-5%) rotate(0deg); }
  50% { transform: translateX(5%) rotate(2deg); }
}

.water-marks { position: absolute; right: 6px; top: 0; bottom: 0; }
.mark {
  position: absolute;
  font-size: 9px;
  color: var(--text-dim);
  transform: translateY(50%);
}

.water-controls { display: flex; flex-direction: column; gap: 10px; }

.water-goal-set {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.water-goal-set label { font-size: 12px; color: var(--text-dim); }
.water-goal-set .input { width: 60px; padding: 6px 8px; font-size: 13px; }

.water-msg {
  margin-top: 16px;
  font-size: 14px;
  color: var(--text-muted);
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-light);
}

.water-msg.complete { color: var(--success); background: rgba(34,197,94,0.08); }

/* Sleep */
.sleep-form { margin-bottom: 20px; }

.sleep-inputs {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.sleep-inputs > div { flex: 1; }
.sleep-inputs label { display: block; font-size: 12px; color: var(--text-dim); margin-bottom: 6px; }

.quality-stars { display: flex; gap: 4px; }
.quality-stars button {
  background: none;
  border: none;
  font-size: 22px;
  color: var(--text-dim);
  cursor: pointer;
  transition: color 0.2s ease;
}
.quality-stars button.active { color: #fbbf24; }

.sleep-history { display: flex; flex-direction: column; gap: 10px; }

.sleep-entry {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.sleep-date { min-width: 60px; color: var(--text-dim); font-size: 12px; }

.sleep-bar-wrap {
  flex: 1;
  height: 24px;
  background: var(--surface-light);
  border-radius: 12px;
  overflow: hidden;
}

.sleep-bar {
  height: 100%;
  background: linear-gradient(to right, var(--primary), var(--secondary));
  border-radius: 12px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  transition: width 0.6s var(--ease-out-expo);
  min-width: 40px;
}

.sleep-stars { font-size: 12px; color: #fbbf24; min-width: 60px; }

/* Mood */
.mood-prompt {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.mood-options { display: flex; gap: 12px; margin-bottom: 28px; }

.mood-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--surface-light);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mood-btn:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
}

.mood-btn.selected {
  border-color: var(--primary);
  background: rgba(124,58,237,0.12);
  box-shadow: 0 4px 20px rgba(124,58,237,0.15);
}

.mood-emoji { font-size: 28px; }
.mood-label { font-size: 12px; color: var(--text-dim); }

.mood-history h4 {
  font-size: 13px;
  color: var(--text-dim);
  margin-bottom: 12px;
}

.mood-timeline { display: flex; gap: 12px; }

.mood-dot-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.mood-dot-emoji { font-size: 22px; }
.mood-dot-date { font-size: 10px; color: var(--text-dim); }

/* Actions card */
.actions-card { grid-column: 1 / -1; }
.actions-card h2 { font-size: 18px; font-weight: 700; margin-bottom: 20px; }

.action-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

.action-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 20px;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 14px;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.action-link:hover {
  border-color: rgba(124,58,237,0.3);
  transform: translateY(-2px);
  background: rgba(124,58,237,0.05);
}

.action-link span:first-child { font-size: 22px; }

/* Transitions */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: var(--text-dim);
  font-size: 14px;
}

@media (max-width: 768px) {
  .dashboard { grid-template-columns: 1fr; }
  .habit-row { flex-direction: column; align-items: flex-start; }
  .habit-days { flex-wrap: wrap; }
  .action-links { grid-template-columns: 1fr; }
  .mood-options { flex-wrap: wrap; }
  .sleep-inputs { flex-direction: column; }
  .water-visual { flex-direction: column; align-items: flex-start; }
}
</style>
