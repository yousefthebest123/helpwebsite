<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>🎨</span> Color Palette Generator</h1>
        <p>Generate beautiful color palettes for your designs. Export as CSS, Tailwind, or copy hex codes.</p>
      </div>

      <div class="generator-section glass">
        <div class="generator-controls">
          <div class="control-group">
            <label>Palette Type</label>
            <div class="btn-group">
              <button 
                v-for="type in paletteTypes"
                :key="type.id"
                :class="['btn btn-secondary', { active: selectedType === type.id }]"
                @click="selectedType = type.id"
              >
                {{ type.name }}
              </button>
            </div>
          </div>
          
          <div class="control-group" v-if="selectedType === 'fromColor'">
            <label>Base Color</label>
            <div class="color-picker-wrapper">
              <input 
                type="color" 
                v-model="baseColor"
                class="color-picker"
              />
              <input 
                type="text"
                v-model="baseColor"
                class="input"
                placeholder="#6366f1"
              />
            </div>
          </div>
          
          <button class="btn btn-primary btn-lg" @click="generatePalette">
            🎲 Generate New Palette
          </button>
        </div>
      </div>

      <!-- Palette Display -->
      <div class="palette-display">
        <div 
          v-for="(color, index) in palette"
          :key="index"
          class="color-card"
          :style="{ '--color': color.hex }"
        >
          <div class="color-swatch" :style="{ background: color.hex }" @click="copyColor(color.hex)">
            <span class="copy-hint">Click to copy</span>
          </div>
          <div class="color-info">
            <span class="color-hex">{{ color.hex }}</span>
            <span class="color-rgb">{{ color.rgb }}</span>
            <span class="color-hsl">{{ color.hsl }}</span>
          </div>
        </div>
      </div>

      <!-- Export Options -->
      <div class="export-section glass">
        <h3>Export Palette</h3>
        <div class="export-grid">
          <div class="export-option">
            <label>CSS Variables</label>
            <div class="code-block">
              <code>{{ cssExport }}</code>
            </div>
            <button class="btn btn-secondary btn-sm" @click="copyExport('css')">
              📋 Copy CSS
            </button>
          </div>
          
          <div class="export-option">
            <label>Tailwind Config</label>
            <div class="code-block">
              <code>{{ tailwindExport }}</code>
            </div>
            <button class="btn btn-secondary btn-sm" @click="copyExport('tailwind')">
              📋 Copy Tailwind
            </button>
          </div>
        </div>
      </div>

      <!-- Color Tools -->
      <div class="color-tools">
        <div class="tool-card glass">
          <h3>🔍 Color Converter</h3>
          <input 
            type="text"
            v-model="converterInput"
            class="input"
            placeholder="Enter HEX, RGB, or HSL..."
          />
          <div class="converter-results" v-if="convertedColor">
            <div class="result-item">
              <span>HEX</span>
              <code @click="copyText(convertedColor.hex)">{{ convertedColor.hex }}</code>
            </div>
            <div class="result-item">
              <span>RGB</span>
              <code @click="copyText(convertedColor.rgb)">{{ convertedColor.rgb }}</code>
            </div>
            <div class="result-item">
              <span>HSL</span>
              <code @click="copyText(convertedColor.hsl)">{{ convertedColor.hsl }}</code>
            </div>
          </div>
        </div>
        
        <div class="tool-card glass">
          <h3>📊 Contrast Checker</h3>
          <div class="contrast-inputs">
            <div class="color-input-group">
              <label>Background</label>
              <div class="color-picker-wrapper small">
                <input type="color" v-model="contrastBg" class="color-picker" />
                <input type="text" v-model="contrastBg" class="input" />
              </div>
            </div>
            <div class="color-input-group">
              <label>Text</label>
              <div class="color-picker-wrapper small">
                <input type="color" v-model="contrastText" class="color-picker" />
                <input type="text" v-model="contrastText" class="input" />
              </div>
            </div>
          </div>
          <div class="contrast-preview" :style="{ background: contrastBg, color: contrastText }">
            Sample Text
          </div>
          <div class="contrast-result">
            <div :class="['contrast-score', contrastScore >= 4.5 ? 'pass' : 'fail']">
              {{ contrastRatio }}
            </div>
            <div class="contrast-badges">
              <span :class="['badge', contrastScore >= 4.5 ? 'pass' : 'fail']">
                AA {{ contrastScore >= 4.5 ? '✓' : '✗' }}
              </span>
              <span :class="['badge', contrastScore >= 7 ? 'pass' : 'fail']">
                AAA {{ contrastScore >= 7 ? '✓' : '✗' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Saved Palettes -->
      <div class="saved-section" v-if="savedPalettes.length > 0">
        <h3>💾 Saved Palettes</h3>
        <div class="saved-grid">
          <div 
            v-for="(saved, index) in savedPalettes"
            :key="index"
            class="saved-palette"
            @click="loadPalette(saved)"
          >
            <div class="saved-colors">
              <div 
                v-for="color in saved"
                :key="color.hex"
                class="saved-swatch"
                :style="{ background: color.hex }"
              ></div>
            </div>
            <button class="delete-btn" @click.stop="deletePalette(index)">×</button>
          </div>
        </div>
      </div>

      <button class="btn btn-secondary save-btn" @click="savePalette" v-if="palette.length > 0">
        💾 Save Current Palette
      </button>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Color Palette Generator - QuickHelp.lol'
})

const paletteTypes = [
  { id: 'random', name: 'Random' },
  { id: 'analogous', name: 'Analogous' },
  { id: 'complementary', name: 'Complementary' },
  { id: 'triadic', name: 'Triadic' },
  { id: 'fromColor', name: 'From Color' },
]

const selectedType = ref('random')
const baseColor = ref('#6366f1')
const palette = ref([])
const savedPalettes = ref([])
const converterInput = ref('')
const contrastBg = ref('#ffffff')
const contrastText = ref('#000000')

// Color conversion utilities
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

const hslToRgb = (h, s, l) => {
  h /= 360; s /= 100; l /= 100
  let r, g, b
  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1/3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1/3)
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) }
}

const randomHsl = () => ({
  h: Math.floor(Math.random() * 360),
  s: Math.floor(Math.random() * 40) + 40,
  l: Math.floor(Math.random() * 40) + 30
})

const colorFromHsl = (h, s, l) => {
  const rgb = hslToRgb(h, s, l)
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
  return {
    hex,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`
  }
}

const generatePalette = () => {
  const colors = []
  
  switch (selectedType.value) {
    case 'random':
      for (let i = 0; i < 5; i++) {
        const hsl = randomHsl()
        colors.push(colorFromHsl(hsl.h, hsl.s, hsl.l))
      }
      break
      
    case 'analogous': {
      const base = randomHsl()
      for (let i = -2; i <= 2; i++) {
        const h = (base.h + i * 30 + 360) % 360
        colors.push(colorFromHsl(h, base.s, base.l))
      }
      break
    }
    
    case 'complementary': {
      const base = randomHsl()
      colors.push(colorFromHsl(base.h, base.s, base.l - 15))
      colors.push(colorFromHsl(base.h, base.s, base.l))
      colors.push(colorFromHsl(base.h, base.s, base.l + 15))
      const comp = (base.h + 180) % 360
      colors.push(colorFromHsl(comp, base.s, base.l))
      colors.push(colorFromHsl(comp, base.s, base.l + 15))
      break
    }
    
    case 'triadic': {
      const base = randomHsl()
      const h1 = base.h
      const h2 = (base.h + 120) % 360
      const h3 = (base.h + 240) % 360
      colors.push(colorFromHsl(h1, base.s, base.l))
      colors.push(colorFromHsl(h1, base.s, base.l + 20))
      colors.push(colorFromHsl(h2, base.s, base.l))
      colors.push(colorFromHsl(h3, base.s, base.l))
      colors.push(colorFromHsl(h3, base.s, base.l - 10))
      break
    }
    
    case 'fromColor': {
      const rgb = hexToRgb(baseColor.value)
      if (rgb) {
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        for (let i = 0; i < 5; i++) {
          const l = Math.max(10, Math.min(90, hsl.l - 20 + i * 15))
          colors.push(colorFromHsl(hsl.h, hsl.s, l))
        }
      }
      break
    }
  }
  
  palette.value = colors
}

// Computed exports
const cssExport = computed(() => {
  return `:root {\n${palette.value.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n')}\n}`
})

const tailwindExport = computed(() => {
  const obj = palette.value.reduce((acc, c, i) => {
    acc[`color${i + 1}`] = c.hex
    return acc
  }, {})
  return JSON.stringify(obj, null, 2)
})

// Color converter
const convertedColor = computed(() => {
  const input = converterInput.value.trim()
  if (!input) return null
  
  // Try HEX
  if (input.startsWith('#')) {
    const rgb = hexToRgb(input)
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      return {
        hex: input.toLowerCase(),
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
      }
    }
  }
  
  // Try RGB
  const rgbMatch = input.match(/rgb\((\d+),?\s*(\d+),?\s*(\d+)\)/)
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number)
    const hex = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)
    return {
      hex,
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    }
  }
  
  return null
})

// Contrast checker
const contrastRatio = computed(() => {
  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return 0
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  
  const l1 = getLuminance(contrastBg.value)
  const l2 = getLuminance(contrastText.value)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
  return ratio.toFixed(2) + ':1'
})

const contrastScore = computed(() => {
  return parseFloat(contrastRatio.value)
})

// Actions
const copyColor = (color) => {
  navigator.clipboard.writeText(color)
}

const copyText = (text) => {
  navigator.clipboard.writeText(text)
}

const copyExport = (type) => {
  const text = type === 'css' ? cssExport.value : tailwindExport.value
  navigator.clipboard.writeText(text)
}

const savePalette = () => {
  savedPalettes.value.push([...palette.value])
  localStorage.setItem('quickhelp-palettes', JSON.stringify(savedPalettes.value))
}

const loadPalette = (saved) => {
  palette.value = [...saved]
}

const deletePalette = (index) => {
  savedPalettes.value.splice(index, 1)
  localStorage.setItem('quickhelp-palettes', JSON.stringify(savedPalettes.value))
}

onMounted(() => {
  const saved = localStorage.getItem('quickhelp-palettes')
  if (saved) {
    savedPalettes.value = JSON.parse(saved)
  }
  generatePalette()
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

.generator-section {
  padding: 32px;
  margin-bottom: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.generator-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.control-group {
  width: 100%;
  text-align: center;
}

.control-group label {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.btn-group {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-group .btn.active {
  background: var(--primary);
  border-color: var(--primary);
}

.color-picker-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
}

.color-picker {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  padding: 0;
  background: transparent;
}

.color-picker-wrapper .input {
  width: 150px;
}

.color-picker-wrapper.small .color-picker {
  width: 36px;
  height: 36px;
}

.color-picker-wrapper.small .input {
  width: 100px;
}

.palette-display {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.color-card {
  text-align: center;
}

.color-swatch {
  height: 160px;
  border-radius: 16px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-swatch:hover {
  transform: scale(1.05);
}

.copy-hint {
  opacity: 0;
  color: white;
  font-size: 12px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  transition: opacity 0.2s ease;
}

.color-swatch:hover .copy-hint {
  opacity: 1;
}

.color-info {
  padding-top: 16px;
}

.color-hex {
  display: block;
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.color-rgb, .color-hsl {
  display: block;
  font-family: monospace;
  font-size: 11px;
  color: var(--text-muted);
}

.export-section {
  padding: 32px;
  margin-bottom: 40px;
}

.export-section h3 {
  text-align: center;
  font-size: 18px;
  margin-bottom: 24px;
}

.export-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.export-option label {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.code-block {
  background: var(--background);
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.code-block code {
  font-family: monospace;
  font-size: 12px;
  color: var(--text-muted);
  white-space: pre;
}

.color-tools {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.tool-card {
  padding: 24px;
}

.tool-card h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

.converter-results {
  margin-top: 16px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.result-item span {
  font-size: 12px;
  color: var(--text-muted);
}

.result-item code {
  font-family: monospace;
  cursor: pointer;
  padding: 4px 8px;
  background: var(--surface);
  border-radius: 4px;
}

.result-item code:hover {
  background: var(--primary);
}

.contrast-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.color-input-group label {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.contrast-preview {
  padding: 24px;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
}

.contrast-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.contrast-score {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 24px;
  font-weight: 700;
}

.contrast-score.pass {
  color: #22c55e;
}

.contrast-score.fail {
  color: #ef4444;
}

.contrast-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.pass {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.badge.fail {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.saved-section {
  margin-bottom: 24px;
}

.saved-section h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

.saved-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.saved-palette {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.saved-palette:hover {
  transform: scale(1.05);
}

.saved-colors {
  display: flex;
  height: 60px;
}

.saved-swatch {
  flex: 1;
}

.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.saved-palette:hover .delete-btn {
  opacity: 1;
}

.save-btn {
  display: block;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .palette-display {
    grid-template-columns: repeat(3, 1fr);
  }

  .export-grid,
  .color-tools {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .palette-display {
    grid-template-columns: repeat(2, 1fr);
  }

  .color-swatch {
    height: 100px;
  }
}
</style>
