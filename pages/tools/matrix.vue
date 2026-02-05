<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>📐</span> Priority Matrix</h1>
        <p>Organize tasks using the Eisenhower Matrix. Focus on what's important, not just urgent.</p>
      </div>

      <!-- Matrix Grid -->
      <div class="matrix-grid">
        <div 
          v-for="quadrant in quadrants"
          :key="quadrant.id"
          :class="['quadrant', quadrant.id]"
          @dragover.prevent
          @drop="handleDrop($event, quadrant.id)"
        >
          <div class="quadrant-header">
            <span class="quadrant-icon">{{ quadrant.icon }}</span>
            <h3>{{ quadrant.title }}</h3>
            <span class="quadrant-action">{{ quadrant.action }}</span>
          </div>
          
          <div class="quadrant-tasks">
            <div 
              v-for="task in getTasksByQuadrant(quadrant.id)"
              :key="task.id"
              :class="['task-item', { completed: task.completed }]"
              draggable="true"
              @dragstart="handleDragStart($event, task)"
            >
              <button class="task-check" @click="toggleTask(task)">
                <span v-if="task.completed">✓</span>
              </button>
              <span class="task-text">{{ task.text }}</span>
              <button class="task-delete" @click="deleteTask(task.id)">×</button>
            </div>
          </div>
          
          <div class="add-task">
            <input 
              type="text"
              :placeholder="'Add to ' + quadrant.title.toLowerCase() + '...'"
              @keyup.enter="addTask($event, quadrant.id)"
            />
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="matrix-stats glass">
        <div class="stat">
          <span class="stat-value">{{ tasks.length }}</span>
          <span class="stat-label">Total Tasks</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ completedCount }}</span>
          <span class="stat-label">Completed</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ urgentImportantCount }}</span>
          <span class="stat-label">Do First</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ delegateCount }}</span>
          <span class="stat-label">To Delegate</span>
        </div>
      </div>

      <!-- Tips -->
      <div class="tips-section">
        <h3>💡 How to Use the Priority Matrix</h3>
        <div class="tips-grid">
          <div class="tip-card urgent-important">
            <h4>🔥 Do First</h4>
            <p>Critical tasks with deadlines. Handle these immediately.</p>
            <ul>
              <li>Crisis situations</li>
              <li>Last-minute deadlines</li>
              <li>Urgent problems</li>
            </ul>
          </div>
          <div class="tip-card important">
            <h4>📅 Schedule</h4>
            <p>Important but not urgent. Plan dedicated time for these.</p>
            <ul>
              <li>Long-term goals</li>
              <li>Personal development</li>
              <li>Relationship building</li>
            </ul>
          </div>
          <div class="tip-card urgent">
            <h4>👤 Delegate</h4>
            <p>Urgent but less important. Can someone else handle this?</p>
            <ul>
              <li>Certain emails</li>
              <li>Some meetings</li>
              <li>Others' priorities</li>
            </ul>
          </div>
          <div class="tip-card neither">
            <h4>🗑️ Eliminate</h4>
            <p>Neither urgent nor important. Consider removing these.</p>
            <ul>
              <li>Time wasters</li>
              <li>Excessive social media</li>
              <li>Busy work</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions-bar">
        <button class="btn btn-secondary" @click="clearCompleted">
          Clear Completed
        </button>
        <button class="btn btn-secondary" @click="exportTasks">
          📥 Export Tasks
        </button>
        <button class="btn btn-ghost danger" @click="clearAll">
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Priority Matrix - QuickHelp.lol'
})

const quadrants = [
  {
    id: 'urgent-important',
    title: 'Urgent & Important',
    action: 'DO FIRST',
    icon: '🔥'
  },
  {
    id: 'important',
    title: 'Important, Not Urgent',
    action: 'SCHEDULE',
    icon: '📅'
  },
  {
    id: 'urgent',
    title: 'Urgent, Not Important',
    action: 'DELEGATE',
    icon: '👤'
  },
  {
    id: 'neither',
    title: 'Not Urgent or Important',
    action: 'ELIMINATE',
    icon: '🗑️'
  }
]

const tasks = ref([])
let draggedTask = null

const getTasksByQuadrant = (quadrantId) => {
  return tasks.value.filter(t => t.quadrant === quadrantId)
}

const completedCount = computed(() => 
  tasks.value.filter(t => t.completed).length
)

const urgentImportantCount = computed(() => 
  tasks.value.filter(t => t.quadrant === 'urgent-important' && !t.completed).length
)

const delegateCount = computed(() => 
  tasks.value.filter(t => t.quadrant === 'urgent' && !t.completed).length
)

const addTask = (event, quadrantId) => {
  const text = event.target.value.trim()
  if (!text) return
  
  tasks.value.push({
    id: Date.now(),
    text,
    quadrant: quadrantId,
    completed: false,
    createdAt: Date.now()
  })
  
  event.target.value = ''
  saveTasks()
}

const toggleTask = (task) => {
  task.completed = !task.completed
  saveTasks()
}

const deleteTask = (id) => {
  const index = tasks.value.findIndex(t => t.id === id)
  if (index !== -1) {
    tasks.value.splice(index, 1)
    saveTasks()
  }
}

const handleDragStart = (event, task) => {
  draggedTask = task
  event.dataTransfer.effectAllowed = 'move'
}

const handleDrop = (event, quadrantId) => {
  if (draggedTask) {
    draggedTask.quadrant = quadrantId
    saveTasks()
    draggedTask = null
  }
}

const clearCompleted = () => {
  tasks.value = tasks.value.filter(t => !t.completed)
  saveTasks()
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks.value = []
    saveTasks()
  }
}

const exportTasks = () => {
  let content = 'Priority Matrix Export\n'
  content += '='.repeat(40) + '\n\n'
  
  for (const quadrant of quadrants) {
    const quadrantTasks = getTasksByQuadrant(quadrant.id)
    content += `${quadrant.icon} ${quadrant.title} (${quadrant.action})\n`
    content += '-'.repeat(30) + '\n'
    
    if (quadrantTasks.length === 0) {
      content += '  (no tasks)\n'
    } else {
      for (const task of quadrantTasks) {
        content += `  ${task.completed ? '✓' : '○'} ${task.text}\n`
      }
    }
    content += '\n'
  }
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'priority-matrix.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const saveTasks = () => {
  localStorage.setItem('quickhelp-matrix', JSON.stringify(tasks.value))
}

const loadTasks = () => {
  const saved = localStorage.getItem('quickhelp-matrix')
  if (saved) {
    tasks.value = JSON.parse(saved)
  }
}

onMounted(() => {
  loadTasks()
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

.matrix-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.quadrant {
  background: var(--surface);
  border-radius: 20px;
  padding: 24px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.quadrant:hover {
  border-color: rgba(255, 255, 255, 0.1);
}

.quadrant.urgent-important {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), var(--surface));
  border-color: rgba(239, 68, 68, 0.2);
}

.quadrant.important {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), var(--surface));
  border-color: rgba(34, 197, 94, 0.2);
}

.quadrant.urgent {
  background: linear-gradient(135deg, rgba(234, 179, 8, 0.1), var(--surface));
  border-color: rgba(234, 179, 8, 0.2);
}

.quadrant.neither {
  background: linear-gradient(135deg, rgba(107, 114, 128, 0.1), var(--surface));
  border-color: rgba(107, 114, 128, 0.2);
}

.quadrant-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.quadrant-icon {
  font-size: 24px;
}

.quadrant-header h3 {
  font-size: 16px;
  font-weight: 600;
  flex: 1;
}

.quadrant-action {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-muted);
}

.quadrant.urgent-important .quadrant-action {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.quadrant.important .quadrant-action {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.quadrant.urgent .quadrant-action {
  background: rgba(234, 179, 8, 0.2);
  color: #fde047;
}

.quadrant-tasks {
  flex: 1;
  overflow-y: auto;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--background);
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: grab;
  transition: all 0.2s ease;
}

.task-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.task-item.completed {
  opacity: 0.5;
}

.task-item.completed .task-text {
  text-decoration: line-through;
}

.task-check {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--accent);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.task-check:hover {
  border-color: var(--accent);
}

.task-item.completed .task-check {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.task-text {
  flex: 1;
  font-size: 14px;
}

.task-delete {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  font-size: 16px;
}

.task-item:hover .task-delete {
  opacity: 1;
}

.task-delete:hover {
  color: #ef4444;
}

.add-task {
  margin-top: 12px;
}

.add-task input {
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  background: var(--background);
  border: 1px solid transparent;
  border-radius: 10px;
  color: white;
  transition: all 0.2s ease;
}

.add-task input:focus {
  outline: none;
  border-color: var(--primary);
}

.add-task input::placeholder {
  color: var(--text-muted);
}

.matrix-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 32px;
  margin-bottom: 40px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
}

.tips-section {
  margin-bottom: 40px;
}

.tips-section h3 {
  text-align: center;
  font-size: 20px;
  margin-bottom: 24px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tip-card {
  padding: 24px;
  background: var(--surface);
  border-radius: 16px;
  border-left: 4px solid;
}

.tip-card.urgent-important {
  border-left-color: #ef4444;
}

.tip-card.important {
  border-left-color: #22c55e;
}

.tip-card.urgent {
  border-left-color: #eab308;
}

.tip-card.neither {
  border-left-color: #6b7280;
}

.tip-card h4 {
  font-size: 16px;
  margin-bottom: 8px;
}

.tip-card p {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.tip-card ul {
  list-style: none;
  padding: 0;
}

.tip-card li {
  font-size: 12px;
  color: var(--text-muted);
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
}

.tip-card li::before {
  content: '•';
  position: absolute;
  left: 0;
}

.actions-bar {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.actions-bar .danger {
  color: #fca5a5;
}

.actions-bar .danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

@media (max-width: 900px) {
  .matrix-grid {
    grid-template-columns: 1fr;
  }

  .matrix-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .tips-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .tips-grid {
    grid-template-columns: 1fr;
  }

  .actions-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
