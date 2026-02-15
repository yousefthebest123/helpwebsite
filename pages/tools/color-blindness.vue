<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>👁️</span> Color Blindness Simulator</h1>
        <p>See how your designs look to people with different types of color vision deficiency. Upload an image or use a live color preview.</p>
      </div>

      <!-- Mode Tabs -->
      <div class="mode-tabs glass">
        <button class="tab-btn" :class="{ active: mode === 'image' }" @click="mode = 'image'">🖼️ Image Upload</button>
        <button class="tab-btn" :class="{ active: mode === 'palette' }" @click="mode = 'palette'">🎨 Color Palette</button>
        <button class="tab-btn" :class="{ active: mode === 'text' }" @click="mode = 'text'">📝 Text Preview</button>
      </div>

      <!-- Image Mode -->
      <div v-if="mode === 'image'" class="image-mode">
        <div class="upload-area glass" @drop.prevent="handleDrop" @dragover.prevent @click="triggerUpload">
          <input type="file" ref="fileInput" accept="image/*" @change="handleUpload" hidden />
          <div v-if="!imageData" class="upload-prompt">
            <span class="upload-icon">📁</span>
            <p>Drop an image or click to upload</p>
            <span class="upload-hint">PNG, JPG, SVG — max 10MB</span>
          </div>
          <div v-else class="image-preview-container">
            <canvas ref="originalCanvas" class="preview-canvas"></canvas>
          </div>
        </div>

        <div v-if="imageData" class="sim-grid">
          <div v-for="sim in simulations" :key="sim.id" class="sim-card glass">
            <div class="sim-header">
              <h4>{{ sim.icon }} {{ sim.name }}</h4>
              <span class="sim-pct">{{ sim.prevalence }}</span>
            </div>
            <canvas :ref="el => simCanvases[sim.id] = el" class="sim-canvas"></canvas>
            <p class="sim-desc">{{ sim.description }}</p>
          </div>
        </div>
      </div>

      <!-- Palette Mode -->
      <div v-if="mode === 'palette'" class="palette-mode">
        <div class="color-input-row">
          <div class="color-pick-group" v-for="(color, i) in paletteColors" :key="i">
            <input type="color" :value="color" @input="e => updatePaletteColor(i, e.target.value)" class="color-swatch" />
            <input type="text" :value="color" @input="e => updatePaletteColor(i, e.target.value)" class="color-hex input" />
            <button class="remove-btn" @click="paletteColors.splice(i, 1)" v-if="paletteColors.length > 1">×</button>
          </div>
          <button class="add-color-btn" @click="paletteColors.push(randomColor())" v-if="paletteColors.length < 8">+ Add</button>
        </div>

        <div class="palette-sim-grid">
          <div class="palette-sim-card glass" v-for="sim in simulations" :key="sim.id">
            <h4>{{ sim.icon }} {{ sim.name }}</h4>
            <div class="sim-swatches">
              <div v-for="(color, i) in paletteColors" :key="i" 
                class="sim-swatch" 
                :style="{ background: simulateColor(color, sim.id) }"
                :title="simulateColor(color, sim.id)"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Text Preview Mode -->
      <div v-if="mode === 'text'" class="text-mode">
        <div class="text-controls glass">
          <div class="control-row">
            <label>Text Color</label>
            <div class="color-inline">
              <input type="color" v-model="textColor" class="color-swatch sm" />
              <input type="text" v-model="textColor" class="input sm" />
            </div>
          </div>
          <div class="control-row">
            <label>Background</label>
            <div class="color-inline">
              <input type="color" v-model="bgColor" class="color-swatch sm" />
              <input type="text" v-model="bgColor" class="input sm" />
            </div>
          </div>
          <div class="control-row">
            <label>Sample Text</label>
            <input type="text" v-model="sampleText" class="input" />
          </div>
        </div>

        <div class="text-sim-grid">
          <div class="text-sim-card glass" v-for="sim in [{ id: 'normal', name: 'Normal Vision', icon: '👁️' }, ...simulations]" :key="sim.id">
            <h4>{{ sim.icon }} {{ sim.name }}</h4>
            <div class="text-preview" :style="{ 
              color: sim.id === 'normal' ? textColor : simulateColor(textColor, sim.id),
              background: sim.id === 'normal' ? bgColor : simulateColor(bgColor, sim.id)
            }">
              {{ sampleText }}
            </div>
            <div class="contrast-info">
              Contrast: {{ getContrast(
                sim.id === 'normal' ? textColor : simulateColor(textColor, sim.id),
                sim.id === 'normal' ? bgColor : simulateColor(bgColor, sim.id)
              ) }}:1
            </div>
          </div>
        </div>
      </div>

      <!-- Info Section -->
      <div class="info-section">
        <div class="info-card glass" v-for="sim in simulations" :key="sim.id">
          <span class="info-icon">{{ sim.icon }}</span>
          <h4>{{ sim.name }}</h4>
          <p>{{ sim.description }}</p>
          <span class="info-stat">{{ sim.prevalence }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Color Blindness Simulator — QuickHelp.lol' })

const mode = ref('palette')
const imageData = ref(null)
const fileInput = ref(null)
const originalCanvas = ref(null)
const simCanvases = ref({})
const paletteColors = ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF6600'])
const textColor = ref('#FFFFFF')
const bgColor = ref('#1a1a3e')
const sampleText = ref('The quick brown fox jumps over the lazy dog')

const simulations = [
  { id: 'protanopia', name: 'Protanopia', icon: '🔴', description: 'No red cone cells. Reds appear muted/brownish.', prevalence: '~1% of males' },
  { id: 'deuteranopia', name: 'Deuteranopia', icon: '🟢', description: 'No green cone cells. Greens appear beige/brown.', prevalence: '~1% of males' },
  { id: 'tritanopia', name: 'Tritanopia', icon: '🔵', description: 'No blue cone cells. Blues appear greenish.', prevalence: '~0.003%' },
  { id: 'achromatopsia', name: 'Achromatopsia', icon: '⚫', description: 'Complete color blindness. Only sees shades of gray.', prevalence: '~0.003%' },
]

// Color simulation matrices
const matrices = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758]
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7]
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525]
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114]
  ]
}

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16)
  ]
}

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0')).join('')
}

const simulateColor = (hex, type) => {
  if (!hex || hex.length < 7) return hex
  try {
    const [r, g, b] = hexToRgb(hex)
    const m = matrices[type]
    if (!m) return hex
    const nr = m[0][0] * r + m[0][1] * g + m[0][2] * b
    const ng = m[1][0] * r + m[1][1] * g + m[1][2] * b
    const nb = m[2][0] * r + m[2][1] * g + m[2][2] * b
    return rgbToHex(nr, ng, nb)
  } catch { return hex }
}

const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')

const updatePaletteColor = (index, value) => {
  paletteColors.value[index] = value
}

const getContrast = (fg, bg) => {
  try {
    const lum = (hex) => {
      const [r, g, b] = hexToRgb(hex).map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const l1 = lum(fg)
    const l2 = lum(bg)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    return ratio.toFixed(1)
  } catch { return '?' }
}

const triggerUpload = () => fileInput.value?.click()

const handleUpload = (e) => {
  const file = e.target.files[0]
  if (file) loadImage(file)
}

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0]
  if (file && file.type.startsWith('image/')) loadImage(file)
}

const loadImage = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    imageData.value = e.target.result
    nextTick(() => renderImage())
  }
  reader.readAsDataURL(file)
}

const renderImage = () => {
  const img = new Image()
  img.onload = () => {
    const maxW = 600
    const scale = Math.min(1, maxW / img.width)
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)

    // Original
    if (originalCanvas.value) {
      originalCanvas.value.width = w
      originalCanvas.value.height = h
      originalCanvas.value.getContext('2d').drawImage(img, 0, 0, w, h)
    }

    // Simulations
    for (const sim of simulations) {
      const canvas = simCanvases.value[sim.id]
      if (!canvas) continue
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, w, h)

      const data = ctx.getImageData(0, 0, w, h)
      const m = matrices[sim.id]
      for (let i = 0; i < data.data.length; i += 4) {
        const r = data.data[i]
        const g = data.data[i + 1]
        const b = data.data[i + 2]
        data.data[i] = Math.min(255, m[0][0] * r + m[0][1] * g + m[0][2] * b)
        data.data[i + 1] = Math.min(255, m[1][0] * r + m[1][1] * g + m[1][2] * b)
        data.data[i + 2] = Math.min(255, m[2][0] * r + m[2][1] * g + m[2][2] * b)
      }
      ctx.putImageData(data, 0, 0)
    }
  }
  img.src = imageData.value
}
</script>

<style scoped>
.tool-page { min-height: 100vh; padding: 120px 0 80px; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

.tool-header { margin-bottom: 40px; }
.back-link { color: var(--text-muted); font-size: 14px; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back-link:hover { color: var(--primary-light); }
.tool-header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.tool-header h1 span { margin-right: 12px; }
.tool-header p { font-size: 18px; color: var(--text-muted); max-width: 700px; line-height: 1.7; }

.mode-tabs { display: flex; gap: 8px; padding: 8px; margin-bottom: 32px; width: fit-content; }

.tab-btn {
  padding: 10px 20px; background: transparent; border: 1px solid transparent;
  border-radius: var(--radius-md); color: var(--text-muted); cursor: pointer;
  font-size: 14px; font-weight: 500; transition: all 0.2s;
}
.tab-btn.active { background: var(--primary); color: white; }
.tab-btn:hover:not(.active) { color: white; border-color: var(--border); }

/* Image Mode */
.upload-area {
  padding: 40px; text-align: center; cursor: pointer;
  border: 2px dashed var(--border-light); margin-bottom: 24px;
  transition: all 0.2s;
}
.upload-area:hover { border-color: var(--primary); }

.upload-prompt { padding: 40px; }
.upload-icon { font-size: 48px; display: block; margin-bottom: 12px; }
.upload-prompt p { font-size: 16px; margin-bottom: 8px; }
.upload-hint { font-size: 13px; color: var(--text-dim); }

.preview-canvas, .sim-canvas { width: 100%; border-radius: 8px; display: block; }

.sim-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

.sim-card { padding: 20px; }
.sim-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.sim-header h4 { font-size: 15px; }
.sim-pct { font-size: 12px; color: var(--text-dim); background: var(--surface); padding: 2px 10px; border-radius: var(--radius-full); }
.sim-desc { font-size: 12px; color: var(--text-muted); margin-top: 8px; }

/* Palette Mode */
.color-input-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; align-items: center; }

.color-pick-group { display: flex; gap: 8px; align-items: center; }

.color-swatch {
  width: 44px; height: 44px; border: 2px solid var(--border-light);
  border-radius: 10px; cursor: pointer; padding: 0;
}
.color-swatch.sm { width: 36px; height: 36px; }

.color-hex { width: 90px; text-align: center; font-family: 'Space Grotesk', monospace; font-size: 13px; }

.remove-btn {
  width: 28px; height: 28px; border-radius: 50%;
  background: transparent; border: 1px solid var(--border-light);
  color: var(--text-muted); cursor: pointer; font-size: 16px;
  transition: all 0.2s;
}
.remove-btn:hover { color: #ef4444; border-color: #ef4444; }

.add-color-btn {
  padding: 10px 20px; background: var(--surface); border: 1px dashed var(--border-light);
  border-radius: 10px; color: var(--text-muted); cursor: pointer; font-size: 14px;
  transition: all 0.2s;
}
.add-color-btn:hover { border-color: var(--primary); color: var(--primary-light); }

.palette-sim-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.palette-sim-card { padding: 20px; }
.palette-sim-card h4 { font-size: 15px; margin-bottom: 12px; }

.sim-swatches { display: flex; gap: 8px; }

.sim-swatch {
  width: 48px; height: 48px; border-radius: 10px;
  border: 2px solid var(--border-light);
}

/* Text Mode */
.text-controls { padding: 24px; margin-bottom: 24px; display: flex; flex-wrap: wrap; gap: 20px; }

.control-row { display: flex; flex-direction: column; gap: 6px; }
.control-row label { font-size: 13px; color: var(--text-muted); }

.color-inline { display: flex; gap: 8px; align-items: center; }

.text-sim-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.text-sim-card { padding: 20px; }
.text-sim-card h4 { font-size: 15px; margin-bottom: 12px; }

.text-preview {
  padding: 20px; border-radius: 10px; font-size: 18px;
  line-height: 1.6; margin-bottom: 8px; min-height: 80px;
}

.contrast-info { font-size: 12px; color: var(--text-dim); }

/* Info */
.info-section { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 48px; }

.info-card { padding: 20px; text-align: center; }
.info-icon { font-size: 28px; display: block; margin-bottom: 8px; }
.info-card h4 { font-size: 15px; margin-bottom: 8px; }
.info-card p { font-size: 12px; color: var(--text-muted); line-height: 1.5; margin-bottom: 8px; }
.info-stat { font-size: 11px; color: var(--text-dim); background: var(--surface); padding: 2px 10px; border-radius: var(--radius-full); }

.input {
  padding: 10px 14px; background: var(--surface); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); color: white; font-size: 14px;
}
.input:focus { outline: none; border-color: var(--primary); }
.input.sm { padding: 8px 10px; font-size: 13px; width: 90px; }

@media (max-width: 800px) {
  .tool-header h1 { font-size: 28px; }
  .sim-grid, .palette-sim-grid, .text-sim-grid { grid-template-columns: 1fr; }
  .info-section { grid-template-columns: repeat(2, 1fr); }
  .mode-tabs { flex-wrap: wrap; width: 100%; }
}

@media (max-width: 500px) {
  .info-section { grid-template-columns: 1fr; }
  .color-input-row { flex-direction: column; }
}
</style>
