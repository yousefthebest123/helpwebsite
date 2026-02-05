<template>
  <div class="tool-page min-h-screen">
    <div class="cyber-grid"></div>
    <div class="animated-bg"></div>

    <main class="container mx-auto px-6 pt-32 pb-16 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <NuxtLink to="/tools" class="back-link">
          <span>←</span> Back to Tools
        </NuxtLink>
        <div class="tool-badge teal">
          <span>🎲</span>
          <span>Random Tool</span>
        </div>
        <h1 class="page-title">
          <span class="title-gradient">UUID Generator</span>
        </h1>
        <p class="page-subtitle">
          Generate unique identifiers (UUIDs) for your applications, databases, and APIs.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="tool-card">
          <!-- Options -->
          <div class="card-section">
            <div class="section-header">
              <div class="section-icon teal">⚙️</div>
              <div>
                <h3 class="section-title">Options</h3>
                <p class="section-desc">Configure your UUID generation settings</p>
              </div>
            </div>

            <div class="options-grid">
              <div class="option-group">
                <label class="option-label">UUID Version</label>
                <select v-model="version" class="option-select">
                  <option value="4">Version 4 (Random)</option>
                  <option value="1">Version 1 (Timestamp)</option>
                </select>
              </div>
              <div class="option-group">
                <label class="option-label">Format</label>
                <select v-model="format" class="option-select">
                  <option value="lowercase">lowercase</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="no-hyphens">No Hyphens</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Single UUID -->
          <div class="card-section">
            <div class="section-header">
              <div class="section-icon cyan">🔑</div>
              <div>
                <h3 class="section-title">Generated UUID</h3>
                <p class="section-desc">Click the buttons to copy or regenerate</p>
              </div>
            </div>

            <div class="uuid-display">
              <code class="uuid-code">{{ currentUuid }}</code>
              <div class="uuid-actions">
                <button @click="copyUuid(currentUuid)" class="action-btn" :class="{ copied: copied === currentUuid }">
                  {{ copied === currentUuid ? '✓' : '📋' }}
                </button>
                <button @click="generateSingle" class="action-btn refresh">
                  🔄
                </button>
              </div>
            </div>
          </div>

          <!-- Bulk Generation -->
          <div class="card-section">
            <div class="section-header">
              <div class="section-icon purple">📦</div>
              <div>
                <h3 class="section-title">Bulk Generate</h3>
                <p class="section-desc">Generate multiple UUIDs at once</p>
              </div>
            </div>

            <div class="bulk-controls">
              <div class="bulk-input-group">
                <label class="option-label">Quantity</label>
                <input 
                  v-model.number="bulkCount" 
                  type="number" 
                  min="1" 
                  max="100" 
                  class="bulk-input"
                />
              </div>
              <button @click="generateBulk" class="generate-btn">
                <span>⚡</span>
                Generate {{ bulkCount }} UUIDs
              </button>
            </div>

            <div v-if="bulkUuids.length" class="bulk-results">
              <div class="bulk-header">
                <span class="bulk-count">{{ bulkUuids.length }} UUIDs generated</span>
                <button @click="copyAll" class="copy-all-btn" :class="{ copied: copiedAll }">
                  {{ copiedAll ? '✓ Copied All' : '📋 Copy All' }}
                </button>
              </div>
              <div class="uuid-list">
                <div 
                  v-for="(uuid, index) in bulkUuids" 
                  :key="index"
                  class="uuid-item"
                >
                  <span class="uuid-index">{{ index + 1 }}</span>
                  <code class="uuid-text">{{ uuid }}</code>
                  <button @click="copyUuid(uuid)" class="copy-item-btn" :class="{ copied: copied === uuid }">
                    {{ copied === uuid ? '✓' : '📋' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-box">
            <div class="info-icon">💡</div>
            <div class="info-content">
              <h4 class="info-title">UUID Versions Explained</h4>
              <div class="info-list">
                <p><strong>Version 4:</strong> Randomly generated, most commonly used for unique IDs</p>
                <p><strong>Version 1:</strong> Based on timestamp and MAC address, useful for ordering</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const version = ref('4')
const format = ref('lowercase')
const currentUuid = ref('')
const bulkCount = ref(10)
const bulkUuids = ref<string[]>([])
const copied = ref('')
const copiedAll = ref(false)

const generateUuidV4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const generateUuidV1 = (): string => {
  const now = Date.now()
  return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = ((now + Math.random() * 16) % 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const formatUuid = (uuid: string): string => {
  if (format.value === 'uppercase') return uuid.toUpperCase()
  if (format.value === 'no-hyphens') return uuid.replace(/-/g, '')
  return uuid
}

const generateUuid = (): string => {
  const uuid = version.value === '1' ? generateUuidV1() : generateUuidV4()
  return formatUuid(uuid)
}

const generateSingle = () => {
  currentUuid.value = generateUuid()
}

const generateBulk = () => {
  bulkUuids.value = Array.from({ length: bulkCount.value }, generateUuid)
}

const copyUuid = (uuid: string) => {
  navigator.clipboard.writeText(uuid)
  copied.value = uuid
  setTimeout(() => copied.value = '', 2000)
}

const copyAll = () => {
  navigator.clipboard.writeText(bulkUuids.value.join('\n'))
  copiedAll.value = true
  setTimeout(() => copiedAll.value = false, 2000)
}

onMounted(generateSingle)
watch([version, format], generateSingle)

useHead({ title: 'UUID Generator - QuickHelp.lol' })
</script>

<style scoped>
.tool-page {
  position: relative;
  background: linear-gradient(180deg, #030712 0%, #0a1628 50%, #030712 100%);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.3s;
}

.back-link:hover { color: #2dd4bf; }

.tool-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}

.tool-badge.teal {
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(124, 58, 237, 0.15));
  border: 1px solid rgba(20, 184, 166, 0.3);
  color: #2dd4bf;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.title-gradient {
  background: linear-gradient(135deg, #2dd4bf, #7c3aed, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.tool-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 24px;
  overflow: hidden;
}

.card-section {
  padding: 32px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.card-section:last-child { border-bottom: none; }

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.section-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  font-size: 22px;
}

.section-icon.teal { background: rgba(20, 184, 166, 0.15); border: 1px solid rgba(20, 184, 166, 0.3); }
.section-icon.cyan { background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.3); }
.section-icon.purple { background: rgba(139, 92, 246, 0.15); border: 1px solid rgba(139, 92, 246, 0.3); }

.section-title { color: white; font-size: 18px; font-weight: 600; margin-bottom: 4px; }
.section-desc { color: #64748b; font-size: 14px; }

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.option-group { display: flex; flex-direction: column; gap: 8px; }

.option-label { color: #94a3b8; font-size: 14px; font-weight: 500; }

.option-select {
  padding: 14px 18px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 18px;
  padding-right: 48px;
}

.option-select:focus { border-color: #2dd4bf; }

.uuid-display {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
}

.uuid-code {
  flex: 1;
  color: #2dd4bf;
  font-family: 'Fira Code', monospace;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1px;
  text-align: center;
}

.uuid-actions { display: flex; gap: 8px; }

.action-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-btn:hover { background: rgba(124, 58, 237, 0.2); transform: scale(1.05); }
.action-btn.copied { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); }
.action-btn.refresh { background: linear-gradient(135deg, #2dd4bf, #7c3aed); border-color: transparent; }
.action-btn.refresh:hover { transform: scale(1.05) rotate(180deg); }

.bulk-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.bulk-input-group { display: flex; flex-direction: column; gap: 8px; }

.bulk-input {
  width: 100px;
  padding: 14px 18px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  text-align: center;
  outline: none;
}

.bulk-input:focus { border-color: #2dd4bf; }

.generate-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #2dd4bf, #7c3aed);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4); }

.bulk-results { margin-top: 24px; }

.bulk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.bulk-count { color: #64748b; font-size: 14px; }

.copy-all-btn {
  padding: 10px 20px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 10px;
  color: #a78bfa;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-all-btn:hover { background: rgba(124, 58, 237, 0.2); }
.copy-all-btn.copied { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); color: #34d399; }

.uuid-list {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 8px;
}

.uuid-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.uuid-item:hover { border-color: rgba(124, 58, 237, 0.25); }

.uuid-index {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(124, 58, 237, 0.1);
  border-radius: 8px;
  color: #a78bfa;
  font-size: 13px;
  font-weight: 600;
}

.uuid-text {
  flex: 1;
  color: #2dd4bf;
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

.copy-item-btn {
  padding: 8px 12px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 8px;
  color: #a78bfa;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-item-btn:hover { background: rgba(124, 58, 237, 0.2); }
.copy-item-btn.copied { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); color: #34d399; }

.info-box {
  display: flex;
  gap: 16px;
  margin: 32px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.1), rgba(124, 58, 237, 0.1));
  border: 1px solid rgba(20, 184, 166, 0.2);
  border-radius: 16px;
}

.info-icon { font-size: 28px; }
.info-title { color: white; font-size: 15px; font-weight: 600; margin-bottom: 10px; }
.info-list { display: flex; flex-direction: column; gap: 6px; }
.info-list p { color: #94a3b8; font-size: 14px; line-height: 1.5; }
.info-list strong { color: #2dd4bf; }

@media (max-width: 640px) {
  .page-title { font-size: 2rem; }
  .options-grid { grid-template-columns: 1fr; }
  .uuid-display { flex-direction: column; }
  .uuid-code { font-size: 14px; }
  .bulk-controls { flex-direction: column; }
  .bulk-input-group { width: 100%; }
  .bulk-input { width: 100%; }
}
</style>
