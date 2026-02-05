<template>
  <div class="min-h-screen pt-20 pb-16">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-6">
          <span>🎨</span>
          <span>Design Tools</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Color Picker</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Pick, convert, and explore colors with our advanced color tool. Get HEX, RGB, HSL and more.
        </p>
      </div>

      <div class="max-w-5xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Color Picker Panel -->
          <div class="glass-card p-6">
            <h3 class="text-white text-lg font-semibold mb-4">Color Selection</h3>
            
            <!-- Color Preview -->
            <div 
              class="color-preview"
              :style="{ background: currentColor }"
              @click="copyToClipboard(hexValue)"
            >
              <span class="preview-text" :style="{ color: textColor }">
                Click to copy
              </span>
            </div>

            <!-- Color Input -->
            <div class="color-input-row">
              <input 
                type="color" 
                v-model="hexValue"
                class="color-input-native"
              />
              <input 
                type="text" 
                v-model="hexValue"
                class="hex-input"
                placeholder="#000000"
              />
            </div>

            <!-- Sliders -->
            <div class="sliders-section">
              <div class="slider-group">
                <label>Red</label>
                <input type="range" v-model.number="rgb.r" min="0" max="255" class="slider red" />
                <input type="number" v-model.number="rgb.r" min="0" max="255" class="slider-value" />
              </div>
              <div class="slider-group">
                <label>Green</label>
                <input type="range" v-model.number="rgb.g" min="0" max="255" class="slider green" />
                <input type="number" v-model.number="rgb.g" min="0" max="255" class="slider-value" />
              </div>
              <div class="slider-group">
                <label>Blue</label>
                <input type="range" v-model.number="rgb.b" min="0" max="255" class="slider blue" />
                <input type="number" v-model.number="rgb.b" min="0" max="255" class="slider-value" />
              </div>
              <div class="slider-group">
                <label>Alpha</label>
                <input type="range" v-model.number="alpha" min="0" max="100" class="slider alpha" />
                <input type="number" v-model.number="alpha" min="0" max="100" class="slider-value" />
              </div>
            </div>
          </div>

          <!-- Color Values Panel -->
          <div class="glass-card p-6">
            <h3 class="text-white text-lg font-semibold mb-4">Color Values</h3>
            
            <div class="values-grid">
              <div class="value-card" @click="copyToClipboard(hexValue)">
                <span class="value-label">HEX</span>
                <span class="value-text">{{ hexValue }}</span>
                <span class="copy-icon">📋</span>
              </div>
              
              <div class="value-card" @click="copyToClipboard(rgbString)">
                <span class="value-label">RGB</span>
                <span class="value-text">{{ rgbString }}</span>
                <span class="copy-icon">📋</span>
              </div>
              
              <div class="value-card" @click="copyToClipboard(rgbaString)">
                <span class="value-label">RGBA</span>
                <span class="value-text">{{ rgbaString }}</span>
                <span class="copy-icon">📋</span>
              </div>
              
              <div class="value-card" @click="copyToClipboard(hslString)">
                <span class="value-label">HSL</span>
                <span class="value-text">{{ hslString }}</span>
                <span class="copy-icon">📋</span>
              </div>
              
              <div class="value-card" @click="copyToClipboard(hslaString)">
                <span class="value-label">HSLA</span>
                <span class="value-text">{{ hslaString }}</span>
                <span class="copy-icon">📋</span>
              </div>
              
              <div class="value-card" @click="copyToClipboard(cmykString)">
                <span class="value-label">CMYK</span>
                <span class="value-text">{{ cmykString }}</span>
                <span class="copy-icon">📋</span>
              </div>
            </div>

            <!-- Contrast Checker -->
            <div class="contrast-section">
              <h4>Contrast Checker</h4>
              <div class="contrast-preview">
                <div class="contrast-box" :style="{ background: currentColor, color: '#ffffff' }">
                  White Text
                </div>
                <div class="contrast-box" :style="{ background: currentColor, color: '#000000' }">
                  Black Text
                </div>
              </div>
              <div class="contrast-scores">
                <div class="contrast-score">
                  <span>White: {{ contrastWithWhite.toFixed(2) }}:1</span>
                  <span :class="['badge', contrastWithWhite >= 4.5 ? 'pass' : 'fail']">
                    {{ contrastWithWhite >= 4.5 ? 'AA Pass' : 'Fail' }}
                  </span>
                </div>
                <div class="contrast-score">
                  <span>Black: {{ contrastWithBlack.toFixed(2) }}:1</span>
                  <span :class="['badge', contrastWithBlack >= 4.5 ? 'pass' : 'fail']">
                    {{ contrastWithBlack >= 4.5 ? 'AA Pass' : 'Fail' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Color Palette -->
        <div class="glass-card p-6 mt-8">
          <h3 class="text-white text-lg font-semibold mb-4">Color Palette Generator</h3>
          
          <div class="palette-tabs">
            <button 
              v-for="type in paletteTypes" 
              :key="type.value"
              @click="paletteType = type.value"
              :class="['palette-tab', { active: paletteType === type.value }]"
            >
              {{ type.label }}
            </button>
          </div>

          <div class="palette-grid">
            <div 
              v-for="(color, i) in generatedPalette" 
              :key="i"
              class="palette-color"
              :style="{ background: color }"
              @click="copyToClipboard(color)"
            >
              <span class="palette-hex" :style="{ color: getContrastColor(color) }">
                {{ color }}
              </span>
            </div>
          </div>
        </div>

        <!-- Saved Colors -->
        <div class="glass-card p-6 mt-8">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-white text-lg font-semibold">Saved Colors</h3>
            <button @click="saveColor" class="save-btn">+ Save Current</button>
          </div>
          
          <div v-if="savedColors.length" class="saved-colors">
            <div 
              v-for="(color, i) in savedColors" 
              :key="i"
              class="saved-color"
              :style="{ background: color }"
              @click="hexValue = color"
            >
              <button @click.stop="removeColor(i)" class="remove-btn">×</button>
            </div>
          </div>
          <p v-else class="text-slate-400 text-sm">No saved colors yet. Click "Save Current" to add colors.</p>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="toast">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
const hexValue = ref('#7c3aed')
const alpha = ref(100)
const showToast = ref(false)
const toastMessage = ref('')
const paletteType = ref('complementary')
const savedColors = ref<string[]>([])

const paletteTypes = [
  { value: 'complementary', label: 'Complementary' },
  { value: 'analogous', label: 'Analogous' },
  { value: 'triadic', label: 'Triadic' },
  { value: 'split', label: 'Split' },
  { value: 'shades', label: 'Shades' }
]

// RGB values reactive
const rgb = reactive({
  r: 6,
  g: 182,
  b: 212
})

// Watch hex and update RGB
watch(hexValue, (val) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val)
  if (result) {
    rgb.r = parseInt(result[1], 16)
    rgb.g = parseInt(result[2], 16)
    rgb.b = parseInt(result[3], 16)
  }
})

// Watch RGB and update hex
watch([() => rgb.r, () => rgb.g, () => rgb.b], () => {
  hexValue.value = '#' + [rgb.r, rgb.g, rgb.b].map(x => {
    const hex = Math.max(0, Math.min(255, x)).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
})

const currentColor = computed(() => {
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.value / 100})`
})

const rgbString = computed(() => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)
const rgbaString = computed(() => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${(alpha.value / 100).toFixed(2)})`)

// HSL conversion
const hsl = computed(() => {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
})

const hslString = computed(() => `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`)
const hslaString = computed(() => `hsla(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%, ${(alpha.value / 100).toFixed(2)})`)

// CMYK conversion
const cmyk = computed(() => {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255
  
  const k = 1 - Math.max(r, g, b)
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }
  
  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100)
  }
})

const cmykString = computed(() => `cmyk(${cmyk.value.c}%, ${cmyk.value.m}%, ${cmyk.value.y}%, ${cmyk.value.k}%)`)

// Luminance calculation
const getLuminance = (r: number, g: number, b: number) => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

const getContrastRatio = (l1: number, l2: number) => {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

const currentLuminance = computed(() => getLuminance(rgb.r, rgb.g, rgb.b))
const contrastWithWhite = computed(() => getContrastRatio(1, currentLuminance.value))
const contrastWithBlack = computed(() => getContrastRatio(currentLuminance.value, 0))

const textColor = computed(() => {
  return currentLuminance.value > 0.5 ? '#000000' : '#ffffff'
})

const getContrastColor = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '#ffffff'
  const l = getLuminance(
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  )
  return l > 0.5 ? '#000000' : '#ffffff'
}

// Palette generation
const hslToHex = (h: number, s: number, l: number) => {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const generatedPalette = computed(() => {
  const { h, s, l } = hsl.value
  const colors: string[] = []
  
  switch (paletteType.value) {
    case 'complementary':
      colors.push(hexValue.value)
      colors.push(hslToHex((h + 180) % 360, s, l))
      colors.push(hslToHex(h, s, Math.min(l + 20, 100)))
      colors.push(hslToHex(h, s, Math.max(l - 20, 0)))
      colors.push(hslToHex((h + 180) % 360, s, Math.min(l + 20, 100)))
      break
    case 'analogous':
      colors.push(hslToHex((h - 30 + 360) % 360, s, l))
      colors.push(hslToHex((h - 15 + 360) % 360, s, l))
      colors.push(hexValue.value)
      colors.push(hslToHex((h + 15) % 360, s, l))
      colors.push(hslToHex((h + 30) % 360, s, l))
      break
    case 'triadic':
      colors.push(hexValue.value)
      colors.push(hslToHex((h + 120) % 360, s, l))
      colors.push(hslToHex((h + 240) % 360, s, l))
      colors.push(hslToHex(h, s, Math.min(l + 15, 100)))
      colors.push(hslToHex(h, s, Math.max(l - 15, 0)))
      break
    case 'split':
      colors.push(hexValue.value)
      colors.push(hslToHex((h + 150) % 360, s, l))
      colors.push(hslToHex((h + 210) % 360, s, l))
      colors.push(hslToHex((h + 150) % 360, s, Math.min(l + 20, 100)))
      colors.push(hslToHex((h + 210) % 360, s, Math.min(l + 20, 100)))
      break
    case 'shades':
      for (let i = 0; i < 5; i++) {
        colors.push(hslToHex(h, s, Math.max(10, l - 30 + i * 15)))
      }
      break
  }
  
  return colors
})

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toastMessage.value = `Copied: ${text}`
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const saveColor = () => {
  if (!savedColors.value.includes(hexValue.value)) {
    savedColors.value.push(hexValue.value)
    localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
  }
}

const removeColor = (index: number) => {
  savedColors.value.splice(index, 1)
  localStorage.setItem('savedColors', JSON.stringify(savedColors.value))
}

onMounted(() => {
  const saved = localStorage.getItem('savedColors')
  if (saved) {
    savedColors.value = JSON.parse(saved)
  }
})

useHead({
  title: 'Color Picker - QuickHelp.lol'
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #a855f7, #ec4899, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 24px;
}

.color-preview {
  height: 120px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  margin-bottom: 20px;
}

.color-preview:hover {
  transform: scale(1.02);
}

.preview-text {
  font-weight: 600;
  font-size: 14px;
  opacity: 0.8;
}

.color-input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.color-input-native {
  width: 60px;
  height: 48px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: none;
}

.hex-input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-family: monospace;
  text-transform: uppercase;
  outline: none;
}

.hex-input:focus {
  border-color: #a855f7;
}

.sliders-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.slider-group {
  display: grid;
  grid-template-columns: 60px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.slider-group label {
  color: #94a3b8;
  font-size: 14px;
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  appearance: none;
  background: rgba(30, 41, 59, 0.8);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
}

.slider.red::-webkit-slider-thumb { background: #ef4444; }
.slider.green::-webkit-slider-thumb { background: #22c55e; }
.slider.blue::-webkit-slider-thumb { background: #3b82f6; }
.slider.alpha::-webkit-slider-thumb { background: linear-gradient(135deg, #a855f7, #ec4899); }

.slider-value {
  width: 60px;
  padding: 8px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px;
  color: white;
  text-align: center;
  font-size: 14px;
  outline: none;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.value-card {
  padding: 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.value-card:hover {
  border-color: #a855f7;
  background: rgba(168, 85, 247, 0.1);
}

.value-label {
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-bottom: 4px;
}

.value-text {
  color: white;
  font-size: 13px;
  font-family: monospace;
}

.copy-icon {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}

.value-card:hover .copy-icon {
  opacity: 1;
}

.contrast-section {
  padding: 20px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 16px;
}

.contrast-section h4 {
  color: white;
  font-size: 14px;
  margin-bottom: 16px;
}

.contrast-preview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.contrast-box {
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.contrast-scores {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contrast-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #94a3b8;
  font-size: 13px;
}

.badge {
  padding: 4px 10px;
  border-radius: 6px;
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

.palette-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.palette-tab {
  padding: 10px 18px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.palette-tab.active {
  background: rgba(168, 85, 247, 0.2);
  border-color: #a855f7;
  color: #c084fc;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.palette-color {
  height: 80px;
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.palette-color:hover {
  transform: scale(1.05);
}

.palette-hex {
  font-size: 12px;
  font-family: monospace;
  font-weight: 600;
}

.saved-colors {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.saved-color {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: transform 0.2s;
}

.saved-color:hover {
  transform: scale(1.1);
}

.remove-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  background: #ef4444;
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.saved-color:hover .remove-btn {
  opacity: 1;
}

.save-btn {
  padding: 10px 18px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
}

.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  background: linear-gradient(135deg, #a855f7, #ec4899);
  border-radius: 12px;
  color: white;
  font-weight: 600;
  animation: slideUp 0.3s ease;
  z-index: 1000;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@media (max-width: 768px) {
  .palette-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .values-grid {
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
