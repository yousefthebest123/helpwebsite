<template>
  <div class="habit-page">
    <section class="habit-hero">
      <div class="container">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1>📋 Habit <span class="gradient-text">Tracker</span></h1>
        <p>Build better habits one day at a time. Everything is saved locally on your device.</p>
      </div>
    </section>

    <section class="container habit-content">
      <!-- Add Habit -->
      <div class="add-section glass">
        <input 
          v-model="newHabit" 
          class="input add-input" 
          placeholder="What habit do you want to build? (e.g., Read for 20 min)"
          @keyup.enter="addHabit"
        />
        <div class="add-options">
          <div class="icon-picker">
            <button 
              v-for="ic in iconOptions" :key="ic"
              class="icon-btn"
              :class="{ active: selectedIcon === ic }"
              @click="selectedIcon = ic"
            >{{ ic }}</button>
          </div>
          <div class="freq-picker">
            <label>
              <input type="radio" v-model="frequency" value="daily" /> Daily
            </label>
            <label>
              <input type="radio" v-model="frequency" value="weekdays" /> Weekdays
            </label>
            <label>
              <input type="radio" v-model="frequency" value="custom" /> Custom
            </label>
          </div>
          <button class="btn btn-primary" @click="addHabit">+ Add Habit</button>
        </div>
      </div>

      <!-- Stats Overview -->
      <div class="stats-row" v-if="habits.length > 0">
        <div class="stat-card glass">
          <span class="stat-icon">🔥</span>
          <div>
            <span class="stat-val">{{ bestStreak }}</span>
            <span class="stat-lbl">Best Streak</span>
          </div>
        </div>
        <div class="stat-card glass">
          <span class="stat-icon">✅</span>
          <div>
            <span class="stat-val">{{ todayCompleted }}/{{ habits.length }}</span>
            <span class="stat-lbl">Today</span>
          </div>
        </div>
        <div class="stat-card glass">
          <span class="stat-icon">📊</span>
          <div>
            <span class="stat-val">{{ completionRate }}%</span>
            <span class="stat-lbl">This Week</span>
          </div>
        </div>
        <div class="stat-card glass">
          <span class="stat-icon">📅</span>
          <div>
            <span class="stat-val">{{ totalDaysTracked }}</span>
            <span class="stat-lbl">Days Tracked</span>
          </div>
        </div>
      </div>

      <!-- Habits List -->
      <div class="habits-section">
        <div class="week-header">
          <button class="btn btn-glass btn-sm" @click="weekOffset--">← Prev</button>
          <h3>{{ weekLabel }}</h3>
          <button class="btn btn-glass btn-sm" @click="weekOffset++" :disabled="weekOffset >= 0">Next →</button>
        </div>

        <div class="habits-table">
          <div class="table-header">
            <div class="th-habit">Habit</div>
            <div class="th-days">
              <span v-for="d in weekDays" :key="d.key" class="th-day" :class="{ today: d.isToday }">
                <span class="day-name">{{ d.label }}</span>
                <span class="day-num">{{ d.num }}</span>
              </span>
            </div>
            <div class="th-streak">Streak</div>
            <div class="th-actions"></div>
          </div>

          <TransitionGroup name="list" tag="div" class="table-body">
            <div v-for="habit in habits" :key="habit.id" class="habit-row">
              <div class="habit-info">
                <span class="habit-icon">{{ habit.icon }}</span>
                <div>
                  <span class="habit-name">{{ habit.name }}</span>
                  <span class="habit-freq">{{ habit.frequency }}</span>
                </div>
              </div>
              <div class="habit-checks">
                <button 
                  v-for="d in weekDays" 
                  :key="d.key"
                  class="check-btn"
                  :class="{ done: habit.log[d.key], today: d.isToday }"
                  @click="toggleDay(habit, d.key)"
                >
                  <span v-if="habit.log[d.key]">✓</span>
                </button>
              </div>
              <div class="habit-streak">
                <span class="streak-num">{{ getStreak(habit) }}</span>
                <span class="streak-fire" v-if="getStreak(habit) >= 3">🔥</span>
              </div>
              <div class="habit-actions">
                <button class="btn-icon" @click="deleteHabit(habit.id)" title="Delete">🗑️</button>
              </div>
            </div>
          </TransitionGroup>

          <div v-if="habits.length === 0" class="empty-state">
            <p>🌱 No habits yet! Add your first habit above to start building better routines.</p>
          </div>
        </div>
      </div>

      <!-- Motivational Quotes -->
      <div class="motivation glass">
        <span class="quote-icon">💡</span>
        <p class="quote-text">"{{ currentQuote }}"</p>
        <button class="btn btn-glass btn-sm" @click="nextQuote">New Quote</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

useHead({ title: 'Habit Tracker — QuickHelp.lol' })

const iconOptions = ['📖', '💪', '🧘', '🚶', '💧', '🥗', '😴', '📝', '🎨', '🎵', '🧠', '⭐']
const selectedIcon = ref('⭐')
const newHabit = ref('')
const frequency = ref('daily')
const habits = ref([])
const weekOffset = ref(0)

const quotes = [
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
  "Motivation is what gets you started. Habit is what keeps you going.",
  "Small daily improvements over time lead to stunning results.",
  "Success is the sum of small efforts, repeated day in and day out.",
  "The secret of your success is found in your daily routine.",
  "First forget inspiration. Habit is more dependable.",
  "Good habits formed at youth make all the difference.",
  "Chains of habit are too light to be felt until they are too heavy to be broken.",
]
const quoteIndex = ref(0)
const currentQuote = computed(() => quotes[quoteIndex.value])
const nextQuote = () => { quoteIndex.value = (quoteIndex.value + 1) % quotes.length }

const getMonday = (offset = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offset * 7)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

const weekDays = computed(() => {
  const monday = getMonday(weekOffset.value)
  const today = new Date().toISOString().split('T')[0]
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const key = d.toISOString().split('T')[0]
    return {
      key,
      label: d.toLocaleDateString('en', { weekday: 'short' }),
      num: d.getDate(),
      isToday: key === today,
    }
  })
})

const weekLabel = computed(() => {
  const days = weekDays.value
  const start = new Date(days[0].key)
  const end = new Date(days[6].key)
  return `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} — ${end.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
})

const addHabit = () => {
  if (!newHabit.value.trim()) return
  habits.value.push({
    id: Date.now(),
    name: newHabit.value.trim(),
    icon: selectedIcon.value,
    frequency: frequency.value,
    log: {},
    createdAt: new Date().toISOString(),
  })
  newHabit.value = ''
  save()
}

const deleteHabit = (id) => {
  habits.value = habits.value.filter(h => h.id !== id)
  save()
}

const toggleDay = (habit, dayKey) => {
  if (habit.log[dayKey]) {
    delete habit.log[dayKey]
  } else {
    habit.log[dayKey] = true
  }
  save()
}

const getStreak = (habit) => {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (habit.log[key]) streak++
    else if (i > 0) break // allow today to be incomplete
  }
  return streak
}

const bestStreak = computed(() => {
  return Math.max(0, ...habits.value.map(h => getStreak(h)))
})

const todayCompleted = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return habits.value.filter(h => h.log[today]).length
})

const completionRate = computed(() => {
  if (habits.value.length === 0) return 0
  const days = weekDays.value.map(d => d.key)
  let total = 0, done = 0
  habits.value.forEach(h => {
    days.forEach(d => {
      total++
      if (h.log[d]) done++
    })
  })
  return total ? Math.round((done / total) * 100) : 0
})

const totalDaysTracked = computed(() => {
  const allDays = new Set()
  habits.value.forEach(h => {
    Object.keys(h.log).forEach(d => allDays.add(d))
  })
  return allDays.size
})

const save = () => localStorage.setItem('qh_habit_tracker', JSON.stringify(habits.value))

onMounted(() => {
  try {
    const d = localStorage.getItem('qh_habit_tracker')
    if (d) habits.value = JSON.parse(d)
  } catch {}
  quoteIndex.value = Math.floor(Math.random() * quotes.length)
})
</script>

<style scoped>
.habit-hero {
  padding: 120px 0 40px;
  text-align: center;
}

.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--text-dim);
  text-decoration: none;
  margin-bottom: 20px;
}
.back-link:hover { color: var(--primary-light); }

.habit-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 700;
  margin-bottom: 12px;
}

.habit-hero p { color: var(--text-muted); font-size: 16px; }

.habit-content { max-width: 900px; margin: 0 auto; padding-bottom: 80px; }

/* Add Section */
.add-section {
  padding: 24px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
  margin-bottom: 32px;
}

.add-input {
  width: 100%;
  padding: 14px 18px;
  font-size: 15px;
  margin-bottom: 14px;
}

.add-options {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.icon-picker { display: flex; gap: 4px; flex-wrap: wrap; }

.icon-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: var(--surface-light);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover { border-color: var(--primary); }
.icon-btn.active { border-color: var(--primary); background: rgba(124,58,237,0.12); }

.freq-picker {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--text-muted);
}

.freq-picker label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.freq-picker input[type="radio"] { accent-color: var(--primary); }

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.stat-icon { font-size: 28px; }
.stat-val { display: block; font-size: 22px; font-weight: 700; font-family: 'Space Grotesk', sans-serif; }
.stat-lbl { font-size: 12px; color: var(--text-dim); }

/* Week Header */
.week-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.week-header h3 {
  font-size: 16px;
  font-weight: 600;
}

/* Habits table */
.habits-table {
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 32px;
}

.table-header {
  display: grid;
  grid-template-columns: 200px 1fr 80px 50px;
  gap: 12px;
  padding: 14px 20px;
  background: var(--surface-light);
  border-bottom: 1px solid var(--border-light);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.th-days { display: flex; justify-content: space-around; }

.th-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.th-day.today { color: var(--primary-light); }
.day-name { font-size: 11px; }
.day-num { font-size: 13px; font-weight: 700; }

.habit-row {
  display: grid;
  grid-template-columns: 200px 1fr 80px 50px;
  gap: 12px;
  padding: 16px 20px;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  transition: background 0.2s ease;
}

.habit-row:last-child { border-bottom: none; }
.habit-row:hover { background: rgba(124, 58, 237, 0.02); }

.habit-info { display: flex; align-items: center; gap: 12px; }
.habit-icon { font-size: 22px; }
.habit-name { display: block; font-size: 14px; font-weight: 600; }
.habit-freq { font-size: 11px; color: var(--text-dim); text-transform: capitalize; }

.habit-checks { display: flex; justify-content: space-around; }

.check-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border-light);
  background: var(--surface);
  color: transparent;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-btn:hover { border-color: var(--primary); }
.check-btn.today { border-color: rgba(124, 58, 237, 0.3); }
.check-btn.done {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
  transform: scale(1.05);
}

.habit-streak {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
}

.streak-num {
  font-size: 16px;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.2s ease;
}
.btn-icon:hover { opacity: 1; }

/* Empty state */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--text-dim);
  font-size: 15px;
}

/* Motivation */
.motivation {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
}

.quote-icon { font-size: 24px; }

.quote-text {
  flex: 1;
  font-size: 14px;
  color: var(--text-muted);
  font-style: italic;
  line-height: 1.5;
}

/* List transitions */
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateX(-20px); }
.list-leave-to { opacity: 0; transform: translateX(20px); }

@media (max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .table-header, .habit-row { grid-template-columns: 1fr; gap: 8px; }
  .th-days, .habit-checks { justify-content: flex-start; gap: 6px; }
  .habit-streak, .habit-actions { justify-content: flex-start; }
  .add-options { flex-direction: column; align-items: flex-start; }
  .motivation { flex-direction: column; text-align: center; }
}
</style>
