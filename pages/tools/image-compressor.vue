<template>
  <div class="min-h-screen pt-20 pb-16">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm mb-6">
          <span>🖼️</span>
          <span>Image Tools</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Image Compressor</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Compress and optimize your images without losing quality. Supports PNG, JPG, and WebP.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-8">
          <!-- Upload Area -->
          <div 
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="['upload-area', { dragging: isDragging, 'has-image': originalImage }]"
          >
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              accept="image/png,image/jpeg,image/webp"
              class="hidden"
            />
            
            <div v-if="!originalImage" class="upload-content" @click="fileInput?.click()">
              <div class="upload-icon">📁</div>
              <h3>Drop your image here</h3>
              <p>or click to browse</p>
              <span class="formats">Supports: PNG, JPG, WebP • Max 10MB</span>
            </div>

            <div v-else class="image-preview">
              <div class="preview-card original">
                <h4>Original</h4>
                <img :src="originalImage" alt="Original" />
                <div class="size-info">
                  <span>{{ formatSize(originalSize) }}</span>
                </div>
              </div>
              <div class="preview-arrow">→</div>
              <div class="preview-card compressed">
                <h4>Compressed</h4>
                <img v-if="compressedImage" :src="compressedImage" alt="Compressed" />
                <div v-else class="loading-placeholder">
                  <span class="spinner"></span>
                  Compressing...
                </div>
                <div v-if="compressedSize" class="size-info">
                  <span>{{ formatSize(compressedSize) }}</span>
                  <span class="savings">-{{ savingsPercent }}%</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Options -->
          <div v-if="originalImage" class="options-section">
            <div class="option-group">
              <label>Quality</label>
              <div class="quality-slider">
                <input type="range" v-model="quality" min="10" max="100" @input="compressImage" />
                <span class="quality-value">{{ quality }}%</span>
              </div>
            </div>

            <div class="option-group">
              <label>Output Format</label>
              <div class="format-buttons">
                <button 
                  v-for="fmt in formats" 
                  :key="fmt.value"
                  @click="outputFormat = fmt.value; compressImage()"
                  :class="['format-btn', { active: outputFormat === fmt.value }]"
                >
                  {{ fmt.label }}
                </button>
              </div>
            </div>

            <div class="option-group">
              <label>Max Width (optional)</label>
              <input 
                type="number" 
                v-model="maxWidth" 
                placeholder="e.g., 1920"
                @input="compressImage"
                class="input"
              />
            </div>
          </div>

          <!-- Actions -->
          <div v-if="compressedImage" class="actions">
            <button @click="downloadImage" class="btn btn-primary">
              💾 Download Compressed Image
            </button>
            <button @click="resetAll" class="btn btn-secondary">
              🔄 Compress Another
            </button>
          </div>

          <!-- Stats -->
          <div v-if="compressedImage" class="stats-row">
            <div class="stat">
              <span class="stat-label">Original</span>
              <span class="stat-value">{{ formatSize(originalSize) }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Compressed</span>
              <span class="stat-value">{{ formatSize(compressedSize) }}</span>
            </div>
            <div class="stat highlight">
              <span class="stat-label">Saved</span>
              <span class="stat-value">{{ formatSize(originalSize - compressedSize) }}</span>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🔒</span>
            <h4>100% Private</h4>
            <p>All processing happens locally in your browser</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">⚡</span>
            <h4>Lightning Fast</h4>
            <p>Compress images instantly with no uploads</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🎨</span>
            <h4>Quality Control</h4>
            <p>Fine-tune compression with quality slider</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const originalImage = ref<string | null>(null)
const compressedImage = ref<string | null>(null)
const originalSize = ref(0)
const compressedSize = ref(0)
const quality = ref(80)
const maxWidth = ref<number | null>(null)
const outputFormat = ref('image/jpeg')
const originalFile = ref<File | null>(null)

const formats = [
  { value: 'image/jpeg', label: 'JPEG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' }
]

const savingsPercent = computed(() => {
  if (!originalSize.value || !compressedSize.value) return 0
  return Math.round((1 - compressedSize.value / originalSize.value) * 100)
})

const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files?.length) {
    processFile(input.files[0])
  }
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files?.length) {
    processFile(e.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }
  
  if (file.size > 10 * 1024 * 1024) {
    alert('File size exceeds 10MB limit')
    return
  }

  originalFile.value = file
  originalSize.value = file.size
  
  const reader = new FileReader()
  reader.onload = (e) => {
    originalImage.value = e.target?.result as string
    compressImage()
  }
  reader.readAsDataURL(file)
}

const compressImage = () => {
  if (!originalImage.value) return

  compressedImage.value = null
  
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    let { width, height } = img
    
    // Resize if maxWidth is set
    if (maxWidth.value && width > maxWidth.value) {
      height = (height * maxWidth.value) / width
      width = maxWidth.value
    }
    
    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, width, height)
    
    // Compress
    const dataUrl = canvas.toDataURL(outputFormat.value, quality.value / 100)
    compressedImage.value = dataUrl
    
    // Calculate size
    const base64 = dataUrl.split(',')[1]
    compressedSize.value = Math.round((base64.length * 3) / 4)
  }
  img.src = originalImage.value
}

const downloadImage = () => {
  if (!compressedImage.value) return
  
  const link = document.createElement('a')
  const ext = outputFormat.value.split('/')[1]
  link.download = `compressed-image.${ext}`
  link.href = compressedImage.value
  link.click()
}

const resetAll = () => {
  originalImage.value = null
  compressedImage.value = null
  originalSize.value = 0
  compressedSize.value = 0
  quality.value = 80
  maxWidth.value = null
  originalFile.value = null
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

useHead({
  title: 'Image Compressor - QuickHelp.lol'
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #7c3aed, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 24px;
}

.upload-area {
  border: 2px dashed rgba(124, 58, 237, 0.3);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.upload-area.dragging {
  border-color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
}

.upload-area.has-image {
  border-style: solid;
  padding: 20px;
}

.upload-content {
  cursor: pointer;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.upload-content h3 {
  color: white;
  font-size: 18px;
  margin-bottom: 8px;
}

.upload-content p {
  color: #94a3b8;
  margin-bottom: 12px;
}

.formats {
  color: #64748b;
  font-size: 13px;
}

.image-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.preview-card {
  flex: 1;
  max-width: 300px;
  text-align: center;
}

.preview-card h4 {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 12px;
}

.preview-card img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
}

.preview-arrow {
  font-size: 24px;
  color: #7c3aed;
}

.size-info {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.size-info span {
  color: white;
  font-size: 14px;
}

.size-info .savings {
  color: #10b981;
  font-weight: 600;
}

.loading-placeholder {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 12px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(124, 58, 237, 0.3);
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.options-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 16px;
}

.option-group label {
  display: block;
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.quality-slider {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quality-slider input[type="range"] {
  flex: 1;
  height: 6px;
  background: rgba(124, 58, 237, 0.3);
  border-radius: 3px;
  appearance: none;
}

.quality-slider input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #7c3aed;
  border-radius: 50%;
  cursor: pointer;
}

.quality-value {
  color: #a78bfa;
  font-weight: 600;
  min-width: 45px;
}

.format-buttons {
  display: flex;
  gap: 8px;
}

.format-btn {
  padding: 8px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 8px;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.format-btn.active {
  background: rgba(124, 58, 237, 0.2);
  border-color: #7c3aed;
  color: #a78bfa;
}

.input {
  width: 100%;
  padding: 10px 14px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  outline: none;
}

.input:focus {
  border-color: #7c3aed;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 24px;
}

.btn {
  padding: 14px 28px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  color: white;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.5);
}

.btn-secondary {
  background: rgba(30, 41, 59, 0.6);
  color: #94a3b8;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.btn-secondary:hover {
  background: rgba(30, 41, 59, 0.8);
  color: white;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 20px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 16px;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  color: #64748b;
  font-size: 13px;
  margin-bottom: 4px;
}

.stat-value {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.stat.highlight .stat-value {
  color: #10b981;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 32px;
}

.feature-card {
  padding: 24px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  text-align: center;
}

.feature-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.feature-card h4 {
  color: white;
  font-size: 16px;
  margin-bottom: 8px;
}

.feature-card p {
  color: #94a3b8;
  font-size: 14px;
}

@media (max-width: 768px) {
  .image-preview {
    flex-direction: column;
  }
  
  .preview-arrow {
    transform: rotate(90deg);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
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
