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
        <div class="tool-badge pink">
          <span>🖼️</span>
          <span>Image Tool</span>
        </div>
        <h1 class="page-title">
          <span class="title-gradient">Image to Base64</span>
        </h1>
        <p class="page-subtitle">
          Convert images to Base64 encoded strings for embedding directly in your code.
        </p>
      </div>

      <div class="max-w-5xl mx-auto">
        <div class="tool-card">
          <!-- Upload Area -->
          <div class="card-section">
            <div 
              @drop.prevent="handleDrop"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              :class="['drop-zone', { active: isDragging }]"
            >
              <input 
                type="file" 
                @change="handleFileSelect" 
                accept="image/*" 
                class="hidden" 
                ref="fileInput"
              />
              <div class="drop-content">
                <div class="drop-icon" :class="{ bounce: isDragging }">
                  {{ isDragging ? '📥' : '🖼️' }}
                </div>
                <h3 class="drop-title">{{ isDragging ? 'Drop it here!' : 'Drag & Drop an Image' }}</h3>
                <p class="drop-hint">or</p>
                <button @click="($refs.fileInput as HTMLInputElement).click()" class="browse-btn">
                  <span>📁</span>
                  Browse Files
                </button>
                <div class="supported-formats">
                  <span class="format-badge">PNG</span>
                  <span class="format-badge">JPG</span>
                  <span class="format-badge">GIF</span>
                  <span class="format-badge">SVG</span>
                  <span class="format-badge">WebP</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview & Result -->
          <div v-if="base64Output" class="card-section">
            <div class="result-grid">
              <!-- Preview Column -->
              <div class="preview-card">
                <div class="preview-header">
                  <span class="preview-label">📷 Preview</span>
                </div>
                <div class="preview-content">
                  <img :src="base64Output" :alt="fileName" class="preview-image" />
                </div>
              </div>

              <!-- Info Column -->
              <div class="info-card">
                <div class="info-header">
                  <span class="info-label">📊 File Info</span>
                </div>
                <div class="info-rows">
                  <div class="info-row">
                    <span class="info-key">📄 Name</span>
                    <span class="info-value">{{ fileName }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">📁 Type</span>
                    <span class="info-value type-badge">{{ fileType }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">📏 Original</span>
                    <span class="info-value">{{ formatSize(originalSize) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">🔢 Base64</span>
                    <span class="info-value">{{ formatSize(base64Output.length) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-key">📈 Increase</span>
                    <span class="info-value increase">+{{ Math.round((base64Output.length / originalSize - 1) * 100) }}%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Output Section -->
            <div class="output-section">
              <div class="output-header">
                <span class="output-label">🔐 Base64 Output</span>
                <div class="output-actions">
                  <button @click="copyOutput('dataUri')" class="copy-btn" :class="{ copied: copiedType === 'dataUri' }">
                    {{ copiedType === 'dataUri' ? '✓ Copied' : '📋 Data URI' }}
                  </button>
                  <button @click="copyOutput('raw')" class="copy-btn" :class="{ copied: copiedType === 'raw' }">
                    {{ copiedType === 'raw' ? '✓ Copied' : '📋 Raw Base64' }}
                  </button>
                </div>
              </div>
              <div class="output-box">
                <code class="output-code">{{ base64Output.substring(0, 500) }}{{ base64Output.length > 500 ? '...' : '' }}</code>
              </div>
              <p class="output-hint">Full Base64 string: {{ base64Output.length.toLocaleString() }} characters</p>
            </div>

            <!-- HTML Code -->
            <div class="code-section">
              <div class="code-header">
                <span class="code-label">🏷️ HTML Embed Code</span>
                <button @click="copyHtml" class="copy-btn sm" :class="{ copied: copiedType === 'html' }">
                  {{ copiedType === 'html' ? '✓ Copied' : '📋 Copy' }}
                </button>
              </div>
              <div class="code-box">
                <code class="code-text">&lt;img src="{{ base64Output.substring(0, 60) }}..." alt="{{ fileName }}" /&gt;</code>
              </div>
            </div>

            <!-- Reset Button -->
            <button @click="reset" class="reset-btn">
              <span>🔄</span>
              Convert Another Image
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const base64Output = ref('')
const fileName = ref('')
const fileType = ref('')
const originalSize = ref(0)
const copiedType = ref('')

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) processFile(target.files[0])
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files[0]) processFile(event.dataTransfer.files[0])
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }
  fileName.value = file.name
  fileType.value = file.type.split('/')[1].toUpperCase()
  originalSize.value = file.size

  const reader = new FileReader()
  reader.onload = (e) => {
    base64Output.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const copyOutput = (type: 'dataUri' | 'raw') => {
  const text = type === 'raw' ? base64Output.value.split(',')[1] : base64Output.value
  navigator.clipboard.writeText(text)
  copiedType.value = type
  setTimeout(() => copiedType.value = '', 2000)
}

const copyHtml = () => {
  const html = `<img src="${base64Output.value}" alt="${fileName.value}" />`
  navigator.clipboard.writeText(html)
  copiedType.value = 'html'
  setTimeout(() => copiedType.value = '', 2000)
}

const reset = () => {
  base64Output.value = ''
  fileName.value = ''
  fileType.value = ''
  originalSize.value = 0
}

useHead({ title: 'Image to Base64 - QuickHelp.lol' })
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

.back-link:hover { color: #f472b6; }

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

.tool-badge.pink {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15));
  border: 1px solid rgba(236, 72, 153, 0.3);
  color: #f472b6;
}

.page-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; }

.title-gradient {
  background: linear-gradient(135deg, #f472b6, #a855f7, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle { color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto; line-height: 1.6; }

.tool-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 24px;
  overflow: hidden;
}

.card-section { padding: 32px; border-bottom: 1px solid rgba(124, 58, 237, 0.1); }
.card-section:last-child { border-bottom: none; }

/* Drop Zone */
.drop-zone {
  border: 2px dashed rgba(236, 72, 153, 0.3);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(236, 72, 153, 0.03);
}

.drop-zone:hover, .drop-zone.active {
  border-color: #f472b6;
  background: rgba(236, 72, 153, 0.1);
  transform: scale(1.01);
}

.drop-icon {
  font-size: 64px;
  margin-bottom: 24px;
  transition: transform 0.3s;
}

.drop-icon.bounce { animation: bounce 0.5s infinite; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.drop-title { color: white; font-size: 22px; font-weight: 600; margin-bottom: 8px; }
.drop-hint { color: #64748b; font-size: 14px; margin-bottom: 20px; }

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #ec4899, #a855f7);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 24px;
}

.browse-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(236, 72, 153, 0.4); }

.supported-formats { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }

.format-badge {
  padding: 6px 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(236, 72, 153, 0.2);
  border-radius: 8px;
  color: #f472b6;
  font-size: 12px;
  font-weight: 600;
}

/* Results */
.result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }

.preview-card, .info-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.preview-header, .info-header {
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.preview-label, .info-label { color: #94a3b8; font-size: 14px; font-weight: 500; }

.preview-content { padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 200px; }

.preview-image { max-width: 100%; max-height: 250px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3); }

.info-rows { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }

.info-row { display: flex; justify-content: space-between; align-items: center; }
.info-key { color: #64748b; font-size: 14px; }
.info-value { color: white; font-size: 14px; font-weight: 500; }
.info-value.type-badge { padding: 4px 10px; background: rgba(236, 72, 153, 0.15); border-radius: 6px; color: #f472b6; }
.info-value.increase { color: #fbbf24; }

/* Output Section */
.output-section { margin-bottom: 24px; }

.output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.output-label { color: #94a3b8; font-size: 14px; font-weight: 500; }
.output-actions { display: flex; gap: 8px; }

.copy-btn {
  padding: 10px 18px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 10px;
  color: #a78bfa;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover { background: rgba(124, 58, 237, 0.2); }
.copy-btn.copied { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); color: #34d399; }
.copy-btn.sm { padding: 8px 14px; font-size: 12px; }

.output-box {
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 12px;
  overflow-x: auto;
}

.output-code { color: #a78bfa; font-family: 'Fira Code', monospace; font-size: 12px; word-break: break-all; line-height: 1.6; }
.output-hint { color: #64748b; font-size: 13px; margin-top: 10px; }

/* Code Section */
.code-section { margin-bottom: 24px; }
.code-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.code-label { color: #94a3b8; font-size: 14px; font-weight: 500; }
.code-box { padding: 16px 20px; background: rgba(0, 0, 0, 0.3); border-radius: 12px; overflow-x: auto; }
.code-text { color: #a78bfa; font-family: 'Fira Code', monospace; font-size: 13px; }

/* Reset Button */
.reset-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 14px;
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover { background: rgba(124, 58, 237, 0.15); border-color: #7c3aed; }

@media (max-width: 768px) {
  .result-grid { grid-template-columns: 1fr; }
  .page-title { font-size: 2rem; }
  .drop-zone { padding: 40px 24px; }
}
</style>
