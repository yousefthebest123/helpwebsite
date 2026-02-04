<template>
  <div class="min-h-screen pt-20 pb-16">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 text-sm mb-6">
          <span>⏱️</span>
          <span>Productivity</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Pomodoro Timer</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Boost your productivity with the Pomodoro Technique. Focus, break, repeat.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="glass-card p-8">
          <!-- Mode Tabs -->
          <div class="mode-tabs">
            <button 
              v-for="mode in modes" 
              :key="mode.value"
              @click="setMode(mode.value)"
              :class="['mode-tab', { active: currentMode === mode.value }]"
            >
              {{ mode.label }}
            </button>
          </div>

          <!-- Timer Display -->
          <div class="timer-display">
            <div class="timer-circle" :style="timerCircleStyle">
              <div class="timer-inner">
                <span class="timer-time">{{ formatTime(timeLeft) }}</span>
                <span class="timer-label">{{ modes.find(m => m.value === currentMode)?.label }}</span>
              </div>
            </div>
          </div>

          <!-- Controls -->
          <div class="controls">
            <button @click="toggleTimer" class="btn btn-primary">
              {{ isRunning ? '⏸️ Pause' : '▶️ Start' }}
            </button>
            <button @click="resetTimer" class="btn btn-secondary">
              🔄 Reset
            </button>
            <button @click="skipTimer" class="btn btn-secondary">
              ⏭️ Skip
            </button>
          </div>

          <!-- Stats -->
          <div class="stats-row">
            <div class="stat">
              <span class="stat-value">{{ pomodorosCompleted }}</span>
              <span class="stat-label">Pomodoros</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ formatDuration(totalFocusTime) }}</span>
              <span class="stat-label">Focus Time</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ currentRound }}/{{ settings.longBreakInterval }}</span>
              <span class="stat-label">Round</span>
            </div>
          </div>

          <!-- Settings Toggle -->
          <button @click="showSettings = !showSettings" class="settings-toggle">
            ⚙️ {{ showSettings ? 'Hide Settings' : 'Show Settings' }}
          </button>

          <!-- Settings -->
          <div v-if="showSettings" class="settings-panel">
            <div class="setting-group">
              <label>Focus Duration (minutes)</label>
              <input 
                type="number" 
                v-model.number="settings.focusDuration"
                min="1" 
                max="120"
                class="input"
              />
            </div>
            <div class="setting-group">
              <label>Short Break (minutes)</label>
              <input 
                type="number" 
                v-model.number="settings.shortBreak"
                min="1" 
                max="30"
                class="input"
              />
            </div>
            <div class="setting-group">
              <label>Long Break (minutes)</label>
              <input 
                type="number" 
                v-model.number="settings.longBreak"
                min="1" 
                max="60"
                class="input"
              />
            </div>
            <div class="setting-group">
              <label>Long Break Interval</label>
              <input 
                type="number" 
                v-model.number="settings.longBreakInterval"
                min="2" 
                max="10"
                class="input"
              />
            </div>
            <div class="setting-group checkbox">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.autoStart" />
                <span>Auto-start next timer</span>
              </label>
            </div>
            <div class="setting-group checkbox">
              <label class="checkbox-label">
                <input type="checkbox" v-model="settings.soundEnabled" />
                <span>Sound notifications</span>
              </label>
            </div>
          </div>

          <!-- Task List -->
          <div class="task-section">
            <h3>Task List</h3>
            <div class="task-input-row">
              <input 
                type="text" 
                v-model="newTask"
                placeholder="Add a task..."
                class="input"
                @keyup.enter="addTask"
              />
              <button @click="addTask" class="btn btn-sm btn-primary">+</button>
            </div>
            
            <div class="task-list">
              <div 
                v-for="(task, i) in tasks" 
                :key="i"
                :class="['task-item', { completed: task.completed }]"
              >
                <button @click="toggleTask(i)" class="task-check">
                  {{ task.completed ? '✅' : '⬜' }}
                </button>
                <span class="task-text">{{ task.text }}</span>
                <span class="task-pomodoros">🍅 {{ task.pomodoros }}</span>
                <button @click="addPomodoroToTask(i)" class="task-add-pomo">+</button>
                <button @click="removeTask(i)" class="task-remove">×</button>
              </div>
              <p v-if="!tasks.length" class="no-tasks">No tasks yet. Add one above!</p>
            </div>
          </div>
        </div>

        <!-- How It Works -->
        <div class="how-it-works mt-12">
          <h3 class="text-white text-xl font-semibold text-center mb-8">How Pomodoro Works</h3>
          <div class="steps-grid">
            <div class="step-card">
              <span class="step-number">1</span>
              <h4>Pick a Task</h4>
              <p>Choose what you want to accomplish</p>
            </div>
            <div class="step-card">
              <span class="step-number">2</span>
              <h4>Focus for 25 min</h4>
              <p>Work on your task with full concentration</p>
            </div>
            <div class="step-card">
              <span class="step-number">3</span>
              <h4>Take a Break</h4>
              <p>Rest for 5 minutes to recharge</p>
            </div>
            <div class="step-card">
              <span class="step-number">4</span>
              <h4>Repeat</h4>
              <p>After 4 pomodoros, take a longer break</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Task {
  text: string
  completed: boolean
  pomodoros: number
}

const modes: { value: 'focus' | 'shortBreak' | 'longBreak'; label: string }[] = [
  { value: 'focus', label: 'Focus' },
  { value: 'shortBreak', label: 'Short Break' },
  { value: 'longBreak', label: 'Long Break' }
]

const currentMode = ref<'focus' | 'shortBreak' | 'longBreak'>('focus')
const isRunning = ref(false)
const timeLeft = ref(25 * 60)
const totalTime = ref(25 * 60)
const pomodorosCompleted = ref(0)
const totalFocusTime = ref(0)
const currentRound = ref(1)
const showSettings = ref(false)
const newTask = ref('')
const tasks = ref<Task[]>([])

const settings = reactive({
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStart: false,
  soundEnabled: true
})

let timer: ReturnType<typeof setInterval> | null = null

const timerCircleStyle = computed(() => {
  const progress = 1 - (timeLeft.value / totalTime.value)
  const circumference = 2 * Math.PI * 140
  const offset = circumference * (1 - progress)
  
  let color = '#8b5cf6' // focus
  if (currentMode.value === 'shortBreak') color = '#10b981'
  if (currentMode.value === 'longBreak') color = '#3b82f6'
  
  return {
    '--progress-offset': `${offset}px`,
    '--progress-color': color
  }
})

const setMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
  stopTimer()
  currentMode.value = mode
  
  switch (mode) {
    case 'focus':
      timeLeft.value = settings.focusDuration * 60
      totalTime.value = settings.focusDuration * 60
      break
    case 'shortBreak':
      timeLeft.value = settings.shortBreak * 60
      totalTime.value = settings.shortBreak * 60
      break
    case 'longBreak':
      timeLeft.value = settings.longBreak * 60
      totalTime.value = settings.longBreak * 60
      break
  }
}

const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer()
  } else {
    startTimer()
  }
}

const startTimer = () => {
  isRunning.value = true
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      if (currentMode.value === 'focus') {
        totalFocusTime.value++
      }
    } else {
      timerComplete()
    }
  }, 1000)
}

const stopTimer = () => {
  isRunning.value = false
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

const resetTimer = () => {
  stopTimer()
  setMode(currentMode.value)
}

const skipTimer = () => {
  timerComplete()
}

const timerComplete = () => {
  stopTimer()
  
  if (settings.soundEnabled) {
    playSound()
  }
  
  if (currentMode.value === 'focus') {
    pomodorosCompleted.value++
    currentRound.value++
    
    if (currentRound.value > settings.longBreakInterval) {
      currentRound.value = 1
      setMode('longBreak')
    } else {
      setMode('shortBreak')
    }
  } else {
    setMode('focus')
  }
  
  if (settings.autoStart) {
    startTimer()
  }
}

const playSound = () => {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU')
    audio.play().catch(() => {})
  } catch (e) {}
  
  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro Timer', {
      body: currentMode.value === 'focus' ? 'Time for a break!' : 'Ready to focus?',
      icon: '🍅'
    })
  }
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      text: newTask.value.trim(),
      completed: false,
      pomodoros: 1
    })
    newTask.value = ''
    saveTasks()
  }
}

const toggleTask = (index: number) => {
  tasks.value[index].completed = !tasks.value[index].completed
  saveTasks()
}

const addPomodoroToTask = (index: number) => {
  tasks.value[index].pomodoros++
  saveTasks()
}

const removeTask = (index: number) => {
  tasks.value.splice(index, 1)
  saveTasks()
}

const saveTasks = () => {
  localStorage.setItem('pomodoroTasks', JSON.stringify(tasks.value))
}

onMounted(() => {
  // Load saved tasks
  const savedTasks = localStorage.getItem('pomodoroTasks')
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks)
  }
  
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  // Initialize timer
  setMode('focus')
})

onUnmounted(() => {
  stopTimer()
})

// Watch settings changes
watch(() => settings.focusDuration, () => {
  if (currentMode.value === 'focus' && !isRunning.value) {
    setMode('focus')
  }
})

useHead({
  title: 'Pomodoro Timer - QuickHelp.lol'
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #8b5cf6, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 24px;
}

.mode-tabs {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 40px;
}

.mode-tab {
  padding: 12px 28px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-tab:hover {
  background: rgba(139, 92, 246, 0.1);
}

.mode-tab.active {
  background: rgba(139, 92, 246, 0.2);
  border-color: #8b5cf6;
  color: #a78bfa;
}

.timer-display {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.timer-circle {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(30, 41, 59, 0.6);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-circle::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 6px solid rgba(139, 92, 246, 0.2);
}

.timer-circle::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  border: 6px solid var(--progress-color);
  border-top-color: transparent;
  border-right-color: transparent;
  transform: rotate(-45deg);
  transition: all 1s linear;
}

.timer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.timer-time {
  font-size: 64px;
  font-weight: 700;
  color: white;
  font-family: monospace;
}

.timer-label {
  color: #94a3b8;
  font-size: 16px;
}

.controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
}

.btn {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  color: white;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.5);
}

.btn-secondary {
  background: rgba(30, 41, 59, 0.6);
  color: #94a3b8;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.btn-secondary:hover {
  background: rgba(30, 41, 59, 0.8);
  color: white;
}

.btn-sm {
  padding: 10px 18px;
  font-size: 18px;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 48px;
  padding: 24px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 16px;
  margin-bottom: 24px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  color: #a78bfa;
  font-size: 28px;
  font-weight: 700;
}

.stat-label {
  color: #64748b;
  font-size: 13px;
}

.settings-toggle {
  display: block;
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 1px dashed rgba(139, 92, 246, 0.3);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;
}

.settings-toggle:hover {
  border-color: #8b5cf6;
  color: #a78bfa;
}

.settings-panel {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 16px;
  margin-bottom: 24px;
}

.setting-group label {
  display: block;
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 8px;
}

.setting-group.checkbox {
  grid-column: span 2;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #94a3b8;
  cursor: pointer;
}

.checkbox-label input {
  accent-color: #8b5cf6;
}

.input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #8b5cf6;
}

.task-section {
  margin-top: 24px;
}

.task-section h3 {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.task-input-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.1);
  border-radius: 12px;
  transition: all 0.2s;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: #64748b;
}

.task-check {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.task-text {
  flex: 1;
  color: white;
  font-size: 14px;
}

.task-pomodoros {
  color: #f43f5e;
  font-size: 13px;
}

.task-add-pomo {
  width: 24px;
  height: 24px;
  background: rgba(139, 92, 246, 0.2);
  border: none;
  border-radius: 6px;
  color: #a78bfa;
  font-size: 16px;
  cursor: pointer;
}

.task-remove {
  width: 24px;
  height: 24px;
  background: rgba(239, 68, 68, 0.2);
  border: none;
  border-radius: 6px;
  color: #f87171;
  font-size: 16px;
  cursor: pointer;
}

.no-tasks {
  color: #64748b;
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.step-card {
  padding: 24px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 16px;
  text-align: center;
}

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border-radius: 50%;
  color: white;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
}

.step-card h4 {
  color: white;
  font-size: 15px;
  margin-bottom: 8px;
}

.step-card p {
  color: #94a3b8;
  font-size: 13px;
}

@media (max-width: 768px) {
  .stats-row {
    gap: 24px;
    flex-wrap: wrap;
  }
  
  .settings-panel {
    grid-template-columns: 1fr;
  }
  
  .setting-group.checkbox {
    grid-column: span 1;
  }
  
  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
