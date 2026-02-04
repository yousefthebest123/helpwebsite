<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>⏱️</span> Focus Timer</h1>
        <p>Stay focused with the Pomodoro technique and ambient sounds to help you concentrate.</p>
      </div>

      <div class="timer-layout">
        <!-- Main Timer -->
        <div class="timer-card glass">
          <div class="timer-mode-tabs">
            <button 
              v-for="mode in modes" 
              :key="mode.id"
              :class="['mode-tab', { active: activeMode === mode.id }]"
              @click="setMode(mode.id)"
            >
              {{ mode.name }}
            </button>
          </div>

          <div class="timer-display">
            <svg class="timer-circle" viewBox="0 0 200 200">
              <circle class="timer-bg" cx="100" cy="100" r="90" />
              <circle 
                class="timer-progress" 
                cx="100" 
                cy="100" 
                r="90"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
              />
            </svg>
            <div class="timer-time">
              <span class="time-digits">{{ formatTime(timeLeft) }}</span>
              <span class="time-label">{{ isRunning ? 'Focus time' : 'Ready' }}</span>
            </div>
          </div>

          <div class="timer-controls">
            <button class="control-btn secondary" @click="resetTimer">
              <span>↺</span>
            </button>
            <button class="control-btn primary" @click="toggleTimer">
              <span>{{ isRunning ? '⏸' : '▶' }}</span>
            </button>
            <button class="control-btn secondary" @click="skipTimer">
              <span>⏭</span>
            </button>
          </div>

          <div class="session-info">
            <div class="session-stat">
              <span class="stat-num">{{ completedSessions }}</span>
              <span class="stat-label">Sessions Today</span>
            </div>
            <div class="session-stat">
              <span class="stat-num">{{ formatTotalTime(totalFocusTime) }}</span>
              <span class="stat-label">Total Focus Time</span>
            </div>
          </div>
        </div>

        <!-- Ambient Sounds -->
        <div class="sounds-card glass">
          <h3>🎵 Ambient Sounds</h3>
          <p class="sounds-desc">Mix different sounds to create your perfect focus environment.</p>
          
          <div class="sound-grid">
            <div 
              v-for="sound in sounds" 
              :key="sound.id"
              :class="['sound-item', { active: sound.active }]"
              @click="toggleSound(sound.id)"
            >
              <span class="sound-icon">{{ sound.icon }}</span>
              <span class="sound-name">{{ sound.name }}</span>
              <input 
                v-if="sound.active"
                type="range" 
                min="0" 
                max="100" 
                v-model="sound.volume"
                class="sound-volume"
                @click.stop
              />
            </div>
          </div>
        </div>

        <!-- Settings -->
        <div class="settings-card glass">
          <h3>⚙️ Timer Settings</h3>
          
          <div class="setting-item">
            <label>Focus Duration</label>
            <div class="setting-control">
              <button @click="adjustSetting('focus', -5)">-</button>
              <span>{{ settings.focus }} min</span>
              <button @click="adjustSetting('focus', 5)">+</button>
            </div>
          </div>
          
          <div class="setting-item">
            <label>Short Break</label>
            <div class="setting-control">
              <button @click="adjustSetting('shortBreak', -1)">-</button>
              <span>{{ settings.shortBreak }} min</span>
              <button @click="adjustSetting('shortBreak', 1)">+</button>
            </div>
          </div>
          
          <div class="setting-item">
            <label>Long Break</label>
            <div class="setting-control">
              <button @click="adjustSetting('longBreak', -5)">-</button>
              <span>{{ settings.longBreak }} min</span>
              <button @click="adjustSetting('longBreak', 5)">+</button>
            </div>
          </div>
          
          <div class="setting-item">
            <label>Auto-start Breaks</label>
            <div 
              :class="['toggle', { active: settings.autoStart }]"
              @click="settings.autoStart = !settings.autoStart"
            ></div>
          </div>
          
          <div class="setting-item">
            <label>Notifications</label>
            <div 
              :class="['toggle', { active: settings.notifications }]"
              @click="toggleNotifications"
            ></div>
          </div>
        </div>

        <!-- Tasks -->
        <div class="tasks-card glass">
          <h3>📋 Focus Tasks</h3>
          
          <div class="task-input">
            <input 
              v-model="newTask"
              type="text" 
              class="input"
              placeholder="What are you working on?"
              @keyup.enter="addTask"
            />
            <button class="btn btn-primary" @click="addTask">Add</button>
          </div>
          
          <div class="task-list">
            <div 
              v-for="task in tasks" 
              :key="task.id"
              :class="['task-item', { completed: task.completed }]"
            >
              <div 
                :class="['checkbox', { checked: task.completed }]"
                @click="toggleTask(task.id)"
              ></div>
              <span class="task-text">{{ task.text }}</span>
              <button class="task-delete" @click="deleteTask(task.id)">×</button>
            </div>
            <div v-if="tasks.length === 0" class="no-tasks">
              No tasks yet. Add one above!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Focus Timer - QuickHelp.lol'
})

const modes = [
  { id: 'focus', name: 'Focus' },
  { id: 'shortBreak', name: 'Short Break' },
  { id: 'longBreak', name: 'Long Break' },
]

const sounds = ref([
  { id: 'rain', name: 'Rain', icon: '🌧️', active: false, volume: 50 },
  { id: 'forest', name: 'Forest', icon: '🌲', active: false, volume: 50 },
  { id: 'cafe', name: 'Café', icon: '☕', active: false, volume: 50 },
  { id: 'fire', name: 'Fireplace', icon: '🔥', active: false, volume: 50 },
  { id: 'ocean', name: 'Ocean', icon: '🌊', active: false, volume: 50 },
  { id: 'lofi', name: 'Lo-Fi', icon: '🎵', active: false, volume: 50 },
  { id: 'thunder', name: 'Thunder', icon: '⛈️', active: false, volume: 50 },
  { id: 'birds', name: 'Birds', icon: '🐦', active: false, volume: 50 },
])

const settings = ref({
  focus: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStart: false,
  notifications: false,
})

const activeMode = ref('focus')
const isRunning = ref(false)
const timeLeft = ref(25 * 60)
const totalTime = ref(25 * 60)
const completedSessions = ref(0)
const totalFocusTime = ref(0)
const timer = ref(null)

// Tasks
const newTask = ref('')
const tasks = ref([])

// Timer circle
const circumference = 2 * Math.PI * 90 // radius = 90
const progressOffset = computed(() => {
  const progress = timeLeft.value / totalTime.value
  return circumference * (1 - progress)
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const formatTotalTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const setMode = (mode) => {
  activeMode.value = mode
  isRunning.value = false
  clearInterval(timer.value)
  
  switch (mode) {
    case 'focus':
      timeLeft.value = settings.value.focus * 60
      totalTime.value = settings.value.focus * 60
      break
    case 'shortBreak':
      timeLeft.value = settings.value.shortBreak * 60
      totalTime.value = settings.value.shortBreak * 60
      break
    case 'longBreak':
      timeLeft.value = settings.value.longBreak * 60
      totalTime.value = settings.value.longBreak * 60
      break
  }
}

const toggleTimer = () => {
  if (isRunning.value) {
    clearInterval(timer.value)
    isRunning.value = false
  } else {
    isRunning.value = true
    timer.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        if (activeMode.value === 'focus') {
          // Track focus time every minute
        }
      } else {
        clearInterval(timer.value)
        isRunning.value = false
        onTimerComplete()
      }
    }, 1000)
  }
}

const resetTimer = () => {
  clearInterval(timer.value)
  isRunning.value = false
  setMode(activeMode.value)
}

const skipTimer = () => {
  clearInterval(timer.value)
  isRunning.value = false
  timeLeft.value = 0
  onTimerComplete()
}

const onTimerComplete = () => {
  if (activeMode.value === 'focus') {
    completedSessions.value++
    totalFocusTime.value += settings.value.focus
    
    // Play notification sound
    if (settings.value.notifications) {
      notifyUser('Focus session complete! Take a break.')
    }
    
    // Auto start break
    if (settings.value.autoStart) {
      if (completedSessions.value % 4 === 0) {
        setMode('longBreak')
      } else {
        setMode('shortBreak')
      }
      toggleTimer()
    }
  } else {
    if (settings.value.notifications) {
      notifyUser('Break is over! Ready to focus?')
    }
    if (settings.value.autoStart) {
      setMode('focus')
      toggleTimer()
    }
  }
}

const notifyUser = (message) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('QuickHelp Timer', { body: message })
  }
}

const toggleNotifications = async () => {
  if (!settings.value.notifications) {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      settings.value.notifications = permission === 'granted'
    }
  } else {
    settings.value.notifications = false
  }
}

const adjustSetting = (setting, amount) => {
  const newValue = settings.value[setting] + amount
  if (setting === 'focus' && newValue >= 5 && newValue <= 90) {
    settings.value.focus = newValue
    if (activeMode.value === 'focus' && !isRunning.value) {
      setMode('focus')
    }
  } else if (setting === 'shortBreak' && newValue >= 1 && newValue <= 30) {
    settings.value.shortBreak = newValue
  } else if (setting === 'longBreak' && newValue >= 5 && newValue <= 60) {
    settings.value.longBreak = newValue
  }
}

const toggleSound = (id) => {
  const sound = sounds.value.find(s => s.id === id)
  if (sound) {
    sound.active = !sound.active
  }
}

// Tasks
const addTask = () => {
  if (newTask.value.trim()) {
    tasks.value.push({
      id: Date.now(),
      text: newTask.value.trim(),
      completed: false,
    })
    newTask.value = ''
  }
}

const toggleTask = (id) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.completed = !task.completed
  }
}

const deleteTask = (id) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

// Cleanup
onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style scoped>
.tool-page {
  padding: 120px 0 80px;
  min-height: 100vh;
}

.tool-header {
  text-align: center;
  margin-bottom: 48px;
}

.back-link {
  display: inline-block;
  margin-bottom: 16px;
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary);
}

.tool-header h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.tool-header p {
  font-size: 16px;
  color: var(--text-muted);
}

.timer-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.timer-card {
  grid-column: 1 / -1;
  padding: 48px;
  text-align: center;
}

.timer-mode-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
}

.mode-tab {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-tab:hover {
  border-color: var(--primary);
  color: white;
}

.mode-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.timer-display {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto 40px;
}

.timer-circle {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.timer-bg {
  fill: none;
  stroke: var(--surface-light);
  stroke-width: 8;
}

.timer-progress {
  fill: none;
  stroke: url(#timerGradient);
  stroke: var(--primary);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease;
}

.timer-time {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.time-digits {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 64px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.time-label {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-top: 8px;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 40px;
}

.control-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn.primary {
  width: 80px;
  height: 80px;
  background: var(--gradient-1);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
}

.control-btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
}

.control-btn.secondary {
  background: var(--surface-light);
  color: var(--text-muted);
}

.control-btn.secondary:hover {
  background: var(--surface);
  color: white;
}

.session-info {
  display: flex;
  justify-content: center;
  gap: 60px;
}

.session-stat {
  text-align: center;
}

.stat-num {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 13px;
  color: var(--text-muted);
}

.sounds-card, .settings-card, .tasks-card {
  padding: 28px;
}

.sounds-card h3, .settings-card h3, .tasks-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.sounds-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.sound-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.sound-item {
  padding: 14px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.sound-item:hover {
  border-color: var(--primary);
}

.sound-item.active {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
}

.sound-icon {
  font-size: 24px;
}

.sound-name {
  font-size: 12px;
  color: var(--text-muted);
}

.sound-volume {
  width: 100%;
  margin-top: 8px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item label {
  font-size: 14px;
  color: var(--text-muted);
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-control button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-control button:hover {
  background: var(--primary);
  border-color: var(--primary);
}

.setting-control span {
  font-size: 14px;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.task-input {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.task-input .input {
  flex: 1;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.task-item.completed {
  opacity: 0.5;
}

.task-item.completed .task-text {
  text-decoration: line-through;
}

.task-text {
  flex: 1;
  font-size: 14px;
}

.task-delete {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-delete:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.no-tasks {
  text-align: center;
  padding: 24px;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 768px) {
  .timer-layout {
    grid-template-columns: 1fr;
  }

  .timer-card {
    padding: 32px 24px;
  }

  .time-digits {
    font-size: 48px;
  }

  .session-info {
    gap: 40px;
  }
}
</style>
