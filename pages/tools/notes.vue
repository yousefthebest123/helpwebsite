<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>📝</span> Quick Notes</h1>
        <p>A minimalist scratchpad that auto-saves to your browser. No login required.</p>
      </div>

      <div class="notes-layout">
        <!-- Sidebar -->
        <div class="notes-sidebar glass">
          <div class="sidebar-header">
            <h3>📂 Your Notes</h3>
            <button class="btn btn-primary btn-sm" @click="createNote">
              + New
            </button>
          </div>
          
          <div class="notes-list">
            <div 
              v-for="note in sortedNotes" 
              :key="note.id"
              :class="['note-item', { active: activeNote?.id === note.id }]"
              @click="selectNote(note)"
            >
              <div class="note-preview">
                <h4>{{ note.title || 'Untitled' }}</h4>
                <p>{{ getPreview(note.content) }}</p>
              </div>
              <span class="note-date">{{ formatDate(note.updatedAt) }}</span>
            </div>
            
            <div v-if="notes.length === 0" class="no-notes">
              <span>📝</span>
              <p>No notes yet. Create one!</p>
            </div>
          </div>
        </div>

        <!-- Editor -->
        <div class="notes-editor glass">
          <div v-if="activeNote" class="editor-content">
            <input 
              v-model="activeNote.title"
              type="text"
              class="note-title-input"
              placeholder="Note title..."
              @input="saveNote"
            />
            
            <div class="editor-toolbar">
              <button @click="formatText('bold')" title="Bold">
                <strong>B</strong>
              </button>
              <button @click="formatText('italic')" title="Italic">
                <em>I</em>
              </button>
              <button @click="formatText('underline')" title="Underline">
                <u>U</u>
              </button>
              <span class="divider"></span>
              <button @click="formatText('list')" title="List">
                ☰
              </button>
              <button @click="formatText('checkbox')" title="Checkbox">
                ☑
              </button>
              <span class="divider"></span>
              <button @click="formatText('h1')" title="Heading">
                H1
              </button>
              <button @click="formatText('h2')" title="Subheading">
                H2
              </button>
              <span class="divider"></span>
              <button @click="formatText('code')" title="Code">
                {'</>'}
              </button>
            </div>

            <textarea 
              ref="textareaRef"
              v-model="activeNote.content"
              class="note-textarea"
              placeholder="Start writing..."
              @input="saveNote"
            ></textarea>

            <div class="editor-footer">
              <div class="word-stats">
                <span>{{ wordCount }} words</span>
                <span>•</span>
                <span>{{ charCount }} characters</span>
              </div>
              <div class="note-actions">
                <button class="btn btn-ghost btn-sm" @click="exportNote">
                  📥 Export
                </button>
                <button class="btn btn-ghost btn-sm danger" @click="deleteNote">
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>

          <div v-else class="editor-empty">
            <span class="empty-icon">📝</span>
            <h3>Select or create a note</h3>
            <p>Your notes are stored locally in your browser.</p>
            <button class="btn btn-primary" @click="createNote">
              Create New Note
            </button>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="features-section">
        <div class="feature">
          <span class="feature-icon">💾</span>
          <h4>Auto-Save</h4>
          <p>Your notes save automatically as you type</p>
        </div>
        <div class="feature">
          <span class="feature-icon">🔒</span>
          <h4>100% Private</h4>
          <p>Notes stay in your browser, never uploaded</p>
        </div>
        <div class="feature">
          <span class="feature-icon">⚡</span>
          <h4>Instant Access</h4>
          <p>No account or login required</p>
        </div>
        <div class="feature">
          <span class="feature-icon">📱</span>
          <h4>Works Offline</h4>
          <p>Access your notes without internet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Quick Notes - QuickHelp.lol'
})

const notes = ref([])
const activeNote = ref(null)
const textareaRef = ref(null)

const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => b.updatedAt - a.updatedAt)
})

const wordCount = computed(() => {
  if (!activeNote.value?.content) return 0
  return activeNote.value.content.trim().split(/\s+/).filter(w => w).length
})

const charCount = computed(() => {
  if (!activeNote.value?.content) return 0
  return activeNote.value.content.length
})

const createNote = () => {
  const newNote = {
    id: Date.now(),
    title: '',
    content: '',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  notes.value.unshift(newNote)
  activeNote.value = newNote
  saveToStorage()
  
  nextTick(() => {
    textareaRef.value?.focus()
  })
}

const selectNote = (note) => {
  activeNote.value = note
}

const saveNote = () => {
  if (activeNote.value) {
    activeNote.value.updatedAt = Date.now()
    saveToStorage()
  }
}

const deleteNote = () => {
  if (!activeNote.value) return
  
  if (confirm('Are you sure you want to delete this note?')) {
    const index = notes.value.findIndex(n => n.id === activeNote.value.id)
    if (index !== -1) {
      notes.value.splice(index, 1)
      activeNote.value = notes.value[0] || null
      saveToStorage()
    }
  }
}

const exportNote = () => {
  if (!activeNote.value) return
  
  const content = `# ${activeNote.value.title || 'Untitled'}\n\n${activeNote.value.content}`
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${activeNote.value.title || 'note'}.md`
  a.click()
  URL.revokeObjectURL(url)
}

const formatText = (format) => {
  if (!textareaRef.value) return
  
  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = textarea.value
  const selected = text.substring(start, end)
  
  let replacement = ''
  let cursorOffset = 0
  
  switch (format) {
    case 'bold':
      replacement = `**${selected}**`
      cursorOffset = selected ? 0 : 2
      break
    case 'italic':
      replacement = `*${selected}*`
      cursorOffset = selected ? 0 : 1
      break
    case 'underline':
      replacement = `__${selected}__`
      cursorOffset = selected ? 0 : 2
      break
    case 'list':
      replacement = `\n- ${selected}`
      cursorOffset = selected ? 0 : 0
      break
    case 'checkbox':
      replacement = `\n- [ ] ${selected}`
      cursorOffset = selected ? 0 : 0
      break
    case 'h1':
      replacement = `\n# ${selected}`
      break
    case 'h2':
      replacement = `\n## ${selected}`
      break
    case 'code':
      replacement = selected.includes('\n') ? `\`\`\`\n${selected}\n\`\`\`` : `\`${selected}\``
      break
  }
  
  activeNote.value.content = text.substring(0, start) + replacement + text.substring(end)
  saveNote()
  
  nextTick(() => {
    textarea.focus()
    const newPos = start + replacement.length - cursorOffset
    textarea.setSelectionRange(newPos, newPos)
  })
}

const getPreview = (content) => {
  if (!content) return 'Empty note'
  const text = content.replace(/[#*_`\[\]]/g, '').trim()
  return text.length > 60 ? text.substring(0, 60) + '...' : text
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago'
  
  return date.toLocaleDateString()
}

const saveToStorage = () => {
  localStorage.setItem('quickhelp-notes', JSON.stringify(notes.value))
}

const loadFromStorage = () => {
  const saved = localStorage.getItem('quickhelp-notes')
  if (saved) {
    notes.value = JSON.parse(saved)
    if (notes.value.length > 0) {
      activeNote.value = notes.value[0]
    }
  }
}

onMounted(() => {
  loadFromStorage()
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

.notes-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 600px;
}

.notes-sidebar {
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: 600;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
}

.note-item {
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.note-item:hover {
  background: var(--surface);
}

.note-item.active {
  background: rgba(99, 102, 241, 0.1);
  border-color: var(--primary);
}

.note-preview h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: white;
}

.note-preview p {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.4;
}

.note-date {
  font-size: 11px;
  color: var(--text-muted);
  display: block;
  margin-top: 8px;
}

.no-notes {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
}

.no-notes span {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.notes-editor {
  padding: 0;
  display: flex;
  flex-direction: column;
}

.editor-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.note-title-input {
  width: 100%;
  padding: 24px 28px 16px;
  font-size: 24px;
  font-weight: 600;
  background: transparent;
  border: none;
  color: white;
  outline: none;
}

.note-title-input::placeholder {
  color: var(--text-muted);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.editor-toolbar button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
}

.editor-toolbar button:hover {
  background: var(--surface);
  color: white;
}

.editor-toolbar .divider {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 8px;
}

.note-textarea {
  flex: 1;
  width: 100%;
  padding: 20px 28px;
  font-size: 15px;
  font-family: 'Inter', sans-serif;
  line-height: 1.8;
  background: transparent;
  border: none;
  color: white;
  outline: none;
  resize: none;
  min-height: 400px;
}

.note-textarea::placeholder {
  color: var(--text-muted);
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.word-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: var(--text-muted);
}

.note-actions {
  display: flex;
  gap: 8px;
}

.note-actions .danger {
  color: #fca5a5;
}

.note-actions .danger:hover {
  background: rgba(239, 68, 68, 0.2);
}

.editor-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.editor-empty h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.editor-empty p {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 60px auto 0;
}

.feature {
  text-align: center;
  padding: 24px;
  background: var(--surface);
  border-radius: 16px;
}

.feature-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.feature h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.feature p {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .notes-layout {
    grid-template-columns: 1fr;
  }

  .notes-sidebar {
    max-height: 300px;
  }

  .features-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .features-section {
    grid-template-columns: 1fr;
  }
}
</style>
