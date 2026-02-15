<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>📏</span> Screen Ruler</h1>
        <p>Measure anything on your screen in pixels, centimeters, or inches. Drag to measure distances.</p>
      </div>

      <!-- Settings Bar -->
      <div class="settings-bar glass">
        <div class="setting-group">
          <label>Unit:</label>
          <select v-model="unit" class="input select-input sm">
            <option value="px">Pixels (px)</option>
            <option value="cm">Centimeters (cm)</option>
            <option value="in">Inches (in)</option>
          </select>
        </div>
        <div class="setting-group">
          <label>Guide Color:</label>
          <input type="color" v-model="guideColor" class="color-pick" />
        </div>
        <div class="setting-group">
          <label>Grid:</label>
          <label class="toggle">
            <input type="checkbox" v-model="showGrid" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="setting-group">
          <label>Crosshair:</label>
          <label class="toggle">
            <input type="checkbox" v-model="showCrosshair" />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <button class="btn btn-ghost btn-sm" @click="clearMeasurements">🗑️ Clear All</button>
      </div>

      <!-- Ruler Canvas -->
      <div class="ruler-container glass" ref="rulerContainer"
        @mousedown="startMeasure"
        @mousemove="onMouseMove"
        @mouseup="endMeasure"
        @mouseleave="onMouseLeave"
      >
        <!-- Grid -->
        <div class="grid-overlay" v-if="showGrid" :style="gridStyle"></div>

        <!-- Crosshair -->
        <div class="crosshair-h" v-if="showCrosshair && mousePos.x >= 0" :style="{ top: mousePos.y + 'px', background: guideColor }"></div>
        <div class="crosshair-v" v-if="showCrosshair && mousePos.x >= 0" :style="{ left: mousePos.x + 'px', background: guideColor }"></div>

        <!-- Current measurement -->
        <div v-if="measuring" class="measurement active" :style="currentMeasureStyle">
          <div class="measure-line" :style="{ borderColor: guideColor }"></div>
          <div class="measure-label" :style="{ background: guideColor }">
            {{ formatMeasurement(currentDistance) }}
            <span class="measure-dims">{{ currentWidth }} × {{ currentHeight }}</span>
          </div>
        </div>

        <!-- Saved measurements -->
        <div v-for="(m, i) in measurements" :key="i" class="measurement saved" :style="getMeasureStyle(m)">
          <div class="measure-line" :style="{ borderColor: guideColor }"></div>
          <div class="measure-label" :style="{ background: guideColor }">
            {{ formatMeasurement(m.distance) }}
          </div>
          <button class="measure-delete" @click.stop="measurements.splice(i, 1)">×</button>
        </div>

        <!-- Mouse position -->
        <div class="mouse-pos" v-if="mousePos.x >= 0">
          {{ Math.round(mousePos.x) }}, {{ Math.round(mousePos.y) }} px
        </div>

        <div class="ruler-hint" v-if="measurements.length === 0 && !measuring">
          Click and drag to measure. Measurements are saved when you release.
        </div>

        <!-- Horizontal ruler -->
        <div class="h-ruler">
          <span v-for="n in hRulerMarks" :key="n" class="ruler-mark" :style="{ left: n.pos + 'px' }">
            <span class="mark-label">{{ n.label }}</span>
          </span>
        </div>

        <!-- Vertical ruler -->
        <div class="v-ruler">
          <span v-for="n in vRulerMarks" :key="n" class="ruler-mark" :style="{ top: n.pos + 'px' }">
            <span class="mark-label">{{ n.label }}</span>
          </span>
        </div>
      </div>

      <!-- Measurements List -->
      <div class="measures-list glass" v-if="measurements.length > 0">
        <h3>📐 Saved Measurements</h3>
        <div class="measure-items">
          <div v-for="(m, i) in measurements" :key="i" class="measure-item">
            <span class="m-num">#{{ i + 1 }}</span>
            <span class="m-val">{{ formatMeasurement(m.distance) }}</span>
            <span class="m-dims">W: {{ convertUnit(m.w) }} × H: {{ convertUnit(m.h) }}</span>
            <button class="delete-sm" @click="measurements.splice(i, 1)">×</button>
          </div>
        </div>
      </div>

      <!-- DPI Info -->
      <div class="dpi-info glass">
        <h3>📱 Screen Info</h3>
        <div class="dpi-grid">
          <div class="dpi-item">
            <span class="dpi-val">{{ devicePixelRatio }}x</span>
            <span class="dpi-label">Pixel Ratio</span>
          </div>
          <div class="dpi-item">
            <span class="dpi-val">{{ screenWidth }}×{{ screenHeight }}</span>
            <span class="dpi-label">Screen Size</span>
          </div>
          <div class="dpi-item">
            <span class="dpi-val">~{{ estimatedDPI }}</span>
            <span class="dpi-label">Estimated DPI</span>
          </div>
        </div>
        <p class="dpi-note">Note: Physical measurements (cm/in) are approximate, as exact DPI varies per monitor.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({ title: 'Screen Ruler — QuickHelp.lol' })

const unit = ref('px')
const guideColor = ref('#7c3aed')
const showGrid = ref(false)
const showCrosshair = ref(true)
const rulerContainer = ref(null)

const mousePos = ref({ x: -1, y: -1 })
const measuring = ref(false)
const measureStart = ref({ x: 0, y: 0 })
const measureEnd = ref({ x: 0, y: 0 })
const measurements = ref([])

const devicePixelRatio = ref(1)
const screenWidth = ref(0)
const screenHeight = ref(0)
const estimatedDPI = ref(96)

const currentDistance = computed(() => {
  const dx = measureEnd.value.x - measureStart.value.x
  const dy = measureEnd.value.y - measureStart.value.y
  return Math.sqrt(dx * dx + dy * dy)
})

const currentWidth = computed(() => convertUnit(Math.abs(measureEnd.value.x - measureStart.value.x)))
const currentHeight = computed(() => convertUnit(Math.abs(measureEnd.value.y - measureStart.value.y)))

const convertUnit = (px) => {
  switch (unit.value) {
    case 'cm': return (px / estimatedDPI.value * 2.54).toFixed(1) + ' cm'
    case 'in': return (px / estimatedDPI.value).toFixed(2) + ' in'
    default: return Math.round(px) + ' px'
  }
}

const formatMeasurement = (px) => convertUnit(px)

const gridStyle = computed(() => ({
  backgroundSize: unit.value === 'px' ? '50px 50px' : unit.value === 'cm' ? `${estimatedDPI.value / 2.54}px ${estimatedDPI.value / 2.54}px` : `${estimatedDPI.value}px ${estimatedDPI.value}px`,
  backgroundImage: `linear-gradient(${guideColor.value}15 1px, transparent 1px), linear-gradient(90deg, ${guideColor.value}15 1px, transparent 1px)`
}))

const hRulerMarks = computed(() => {
  const marks = []
  const step = unit.value === 'px' ? 100 : unit.value === 'cm' ? estimatedDPI.value / 2.54 : estimatedDPI.value
  for (let i = 0; i <= 1200; i += step) {
    const label = unit.value === 'px' ? i : unit.value === 'cm' ? Math.round(i / (estimatedDPI.value / 2.54)) : Math.round(i / estimatedDPI.value)
    marks.push({ pos: i + 24, label })
  }
  return marks
})

const vRulerMarks = computed(() => {
  const marks = []
  const step = unit.value === 'px' ? 100 : unit.value === 'cm' ? estimatedDPI.value / 2.54 : estimatedDPI.value
  for (let i = 0; i <= 600; i += step) {
    const label = unit.value === 'px' ? i : unit.value === 'cm' ? Math.round(i / (estimatedDPI.value / 2.54)) : Math.round(i / estimatedDPI.value)
    marks.push({ pos: i + 24, label })
  }
  return marks
})

const currentMeasureStyle = computed(() => {
  const x = Math.min(measureStart.value.x, measureEnd.value.x)
  const y = Math.min(measureStart.value.y, measureEnd.value.y)
  const w = Math.abs(measureEnd.value.x - measureStart.value.x)
  const h = Math.abs(measureEnd.value.y - measureStart.value.y)
  return { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' }
})

const getMeasureStyle = (m) => ({
  left: m.x + 'px', top: m.y + 'px', width: m.w + 'px', height: m.h + 'px'
})

const getRelativePos = (e) => {
  const rect = rulerContainer.value.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

const startMeasure = (e) => {
  const pos = getRelativePos(e)
  measureStart.value = pos
  measureEnd.value = pos
  measuring.value = true
}

const onMouseMove = (e) => {
  const pos = getRelativePos(e)
  mousePos.value = pos
  if (measuring.value) {
    measureEnd.value = pos
  }
}

const endMeasure = () => {
  if (measuring.value && currentDistance.value > 5) {
    const x = Math.min(measureStart.value.x, measureEnd.value.x)
    const y = Math.min(measureStart.value.y, measureEnd.value.y)
    const w = Math.abs(measureEnd.value.x - measureStart.value.x)
    const h = Math.abs(measureEnd.value.y - measureStart.value.y)
    measurements.value.push({ x, y, w, h, distance: currentDistance.value })
  }
  measuring.value = false
}

const onMouseLeave = () => {
  mousePos.value = { x: -1, y: -1 }
  if (measuring.value) endMeasure()
}

const clearMeasurements = () => { measurements.value = [] }

onMounted(() => {
  devicePixelRatio.value = window.devicePixelRatio || 1
  screenWidth.value = window.screen.width
  screenHeight.value = window.screen.height
  estimatedDPI.value = Math.round(96 * devicePixelRatio.value)
})
</script>

<style scoped>
.tool-page { min-height: 100vh; padding: 120px 0 80px; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

.tool-header { margin-bottom: 32px; }
.back-link { color: var(--text-muted); font-size: 14px; display: inline-block; margin-bottom: 16px; transition: color 0.2s; }
.back-link:hover { color: var(--primary-light); }
.tool-header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.tool-header h1 span { margin-right: 12px; }
.tool-header p { font-size: 18px; color: var(--text-muted); line-height: 1.7; }

.settings-bar { display: flex; flex-wrap: wrap; gap: 20px; padding: 16px 24px; align-items: center; margin-bottom: 24px; }

.setting-group { display: flex; align-items: center; gap: 8px; }
.setting-group label { font-size: 13px; color: var(--text-muted); white-space: nowrap; }

.color-pick { width: 32px; height: 32px; border: 2px solid var(--border-light); border-radius: 8px; cursor: pointer; padding: 0; }

.toggle { position: relative; width: 40px; height: 22px; cursor: pointer; }
.toggle input { display: none; }
.toggle-slider { position: absolute; inset: 0; background: var(--surface); border-radius: 11px; transition: 0.2s; }
.toggle-slider::before { content: ''; position: absolute; width: 16px; height: 16px; left: 3px; top: 3px; background: white; border-radius: 50%; transition: 0.2s; }
.toggle input:checked + .toggle-slider { background: var(--primary); }
.toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

.ruler-container {
  position: relative; min-height: 500px; padding: 24px;
  cursor: crosshair; user-select: none; overflow: hidden;
}

.grid-overlay { position: absolute; inset: 0; pointer-events: none; }

.crosshair-h { position: absolute; left: 0; right: 0; height: 1px; opacity: 0.4; pointer-events: none; }
.crosshair-v { position: absolute; top: 0; bottom: 0; width: 1px; opacity: 0.4; pointer-events: none; }

.measurement {
  position: absolute; pointer-events: none;
}

.measurement.active .measure-line {
  width: 100%; height: 100%;
  border: 2px dashed;
  border-radius: 2px;
  background: rgba(124, 58, 237, 0.05);
}

.measurement.saved .measure-line {
  width: 100%; height: 100%;
  border: 1px solid;
  background: rgba(124, 58, 237, 0.03);
  border-radius: 2px;
}

.measure-label {
  position: absolute; top: -28px; left: 50%;
  transform: translateX(-50%);
  padding: 4px 12px; border-radius: 6px;
  font-size: 12px; font-weight: 700; color: white;
  white-space: nowrap;
}

.measure-dims { display: block; font-size: 10px; font-weight: 400; opacity: 0.8; }

.measure-delete {
  position: absolute; top: -8px; right: -8px;
  width: 20px; height: 20px; border-radius: 50%;
  background: #ef4444; border: none; color: white;
  cursor: pointer; font-size: 14px; pointer-events: all;
  display: none;
}

.measurement.saved:hover .measure-delete { display: flex; align-items: center; justify-content: center; }
.measurement.saved { pointer-events: all; }

.mouse-pos {
  position: absolute; bottom: 12px; right: 16px;
  font-family: 'Space Grotesk', monospace; font-size: 12px;
  color: var(--text-dim); background: var(--surface);
  padding: 4px 10px; border-radius: 6px;
}

.ruler-hint {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px; color: var(--text-dim);
  text-align: center;
}

.h-ruler {
  position: absolute; top: 0; left: 0; right: 0; height: 24px;
  background: var(--surface-light); border-bottom: 1px solid var(--border-light);
}

.v-ruler {
  position: absolute; top: 0; left: 0; bottom: 0; width: 24px;
  background: var(--surface-light); border-right: 1px solid var(--border-light);
}

.ruler-mark { position: absolute; }
.h-ruler .ruler-mark { border-left: 1px solid var(--border); height: 8px; top: 16px; }
.v-ruler .ruler-mark { border-top: 1px solid var(--border); width: 8px; left: 16px; }

.mark-label { font-size: 9px; color: var(--text-dim); position: absolute; }
.h-ruler .mark-label { top: -14px; left: 4px; }
.v-ruler .mark-label { left: -20px; top: 2px; }

.measures-list { padding: 24px; margin-top: 24px; }
.measures-list h3 { font-size: 18px; margin-bottom: 16px; }

.measure-items { display: flex; flex-direction: column; gap: 8px; }

.measure-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; background: var(--surface); border-radius: 10px;
}

.m-num { font-size: 13px; color: var(--text-dim); font-weight: 600; }
.m-val { font-family: 'Space Grotesk', monospace; font-weight: 700; color: var(--primary-light); }
.m-dims { font-size: 12px; color: var(--text-muted); margin-left: auto; }

.delete-sm {
  width: 24px; height: 24px; border-radius: 50%;
  background: transparent; border: 1px solid var(--border-light);
  color: var(--text-muted); cursor: pointer; font-size: 14px;
}
.delete-sm:hover { color: #ef4444; border-color: #ef4444; }

.dpi-info { padding: 24px; margin-top: 24px; }
.dpi-info h3 { font-size: 18px; margin-bottom: 16px; }

.dpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 12px; }

.dpi-item { text-align: center; padding: 16px; background: var(--surface); border-radius: 10px; }
.dpi-val { display: block; font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: 700; color: var(--primary-light); }
.dpi-label { font-size: 12px; color: var(--text-muted); }

.dpi-note { font-size: 12px; color: var(--text-dim); }

.input { padding: 8px 12px; background: var(--surface); border: 1px solid var(--border-light); border-radius: var(--radius-md); color: white; font-size: 13px; }
.input:focus { outline: none; border-color: var(--primary); }
.select-input { appearance: none; padding-right: 28px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; }
.input.sm { width: auto; }

.btn { padding: 10px 20px; border: none; border-radius: var(--radius-md); font-weight: 600; cursor: pointer; font-size: 14px; transition: all 0.2s; font-family: inherit; }
.btn-ghost { background: transparent; color: var(--text-muted); }
.btn-ghost:hover { color: white; }
.btn-sm { padding: 6px 14px; font-size: 13px; }

@media (max-width: 700px) {
  .tool-header h1 { font-size: 28px; }
  .settings-bar { gap: 12px; }
  .ruler-container { min-height: 350px; }
  .dpi-grid { grid-template-columns: 1fr; }
}
</style>
