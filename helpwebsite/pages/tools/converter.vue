<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>🔄</span> Smart Unit Converter</h1>
        <p>Convert currencies, time zones, measurements, data sizes, and more — all in one place.</p>
      </div>

      <div class="converter-layout">
        <!-- Category Tabs -->
        <div class="category-tabs">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            :class="['tab-btn', { active: activeCategory === cat.id }]"
            @click="activeCategory = cat.id"
          >
            <span class="tab-icon">{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>

        <!-- Converter Card -->
        <div class="converter-card glass">
          <!-- Length -->
          <div v-if="activeCategory === 'length'" class="converter-content">
            <div class="input-group">
              <label>From</label>
              <div class="input-row">
                <input v-model.number="lengthValue" type="number" class="input" placeholder="Enter value" />
                <select v-model="lengthFrom" class="input select">
                  <option value="m">Meters (m)</option>
                  <option value="km">Kilometers (km)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="mm">Millimeters (mm)</option>
                  <option value="mi">Miles (mi)</option>
                  <option value="yd">Yards (yd)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                </select>
              </div>
            </div>
            <button class="swap-btn" @click="swapLength">⇅</button>
            <div class="input-group">
              <label>To</label>
              <div class="input-row">
                <input :value="lengthResult" type="text" class="input result" readonly />
                <select v-model="lengthTo" class="input select">
                  <option value="m">Meters (m)</option>
                  <option value="km">Kilometers (km)</option>
                  <option value="cm">Centimeters (cm)</option>
                  <option value="mm">Millimeters (mm)</option>
                  <option value="mi">Miles (mi)</option>
                  <option value="yd">Yards (yd)</option>
                  <option value="ft">Feet (ft)</option>
                  <option value="in">Inches (in)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Weight -->
          <div v-if="activeCategory === 'weight'" class="converter-content">
            <div class="input-group">
              <label>From</label>
              <div class="input-row">
                <input v-model.number="weightValue" type="number" class="input" placeholder="Enter value" />
                <select v-model="weightFrom" class="input select">
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="mg">Milligrams (mg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                  <option value="ton">Metric Ton</option>
                </select>
              </div>
            </div>
            <button class="swap-btn" @click="swapWeight">⇅</button>
            <div class="input-group">
              <label>To</label>
              <div class="input-row">
                <input :value="weightResult" type="text" class="input result" readonly />
                <select v-model="weightTo" class="input select">
                  <option value="kg">Kilograms (kg)</option>
                  <option value="g">Grams (g)</option>
                  <option value="mg">Milligrams (mg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                  <option value="ton">Metric Ton</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Temperature -->
          <div v-if="activeCategory === 'temperature'" class="converter-content">
            <div class="input-group">
              <label>From</label>
              <div class="input-row">
                <input v-model.number="tempValue" type="number" class="input" placeholder="Enter value" />
                <select v-model="tempFrom" class="input select">
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </select>
              </div>
            </div>
            <button class="swap-btn" @click="swapTemp">⇅</button>
            <div class="input-group">
              <label>To</label>
              <div class="input-row">
                <input :value="tempResult" type="text" class="input result" readonly />
                <select v-model="tempTo" class="input select">
                  <option value="c">Celsius (°C)</option>
                  <option value="f">Fahrenheit (°F)</option>
                  <option value="k">Kelvin (K)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Data Size -->
          <div v-if="activeCategory === 'data'" class="converter-content">
            <div class="input-group">
              <label>From</label>
              <div class="input-row">
                <input v-model.number="dataValue" type="number" class="input" placeholder="Enter value" />
                <select v-model="dataFrom" class="input select">
                  <option value="b">Bytes (B)</option>
                  <option value="kb">Kilobytes (KB)</option>
                  <option value="mb">Megabytes (MB)</option>
                  <option value="gb">Gigabytes (GB)</option>
                  <option value="tb">Terabytes (TB)</option>
                  <option value="pb">Petabytes (PB)</option>
                </select>
              </div>
            </div>
            <button class="swap-btn" @click="swapData">⇅</button>
            <div class="input-group">
              <label>To</label>
              <div class="input-row">
                <input :value="dataResult" type="text" class="input result" readonly />
                <select v-model="dataTo" class="input select">
                  <option value="b">Bytes (B)</option>
                  <option value="kb">Kilobytes (KB)</option>
                  <option value="mb">Megabytes (MB)</option>
                  <option value="gb">Gigabytes (GB)</option>
                  <option value="tb">Terabytes (TB)</option>
                  <option value="pb">Petabytes (PB)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Time -->
          <div v-if="activeCategory === 'time'" class="converter-content">
            <div class="input-group">
              <label>From</label>
              <div class="input-row">
                <input v-model.number="timeValue" type="number" class="input" placeholder="Enter value" />
                <select v-model="timeFrom" class="input select">
                  <option value="ms">Milliseconds</option>
                  <option value="s">Seconds</option>
                  <option value="min">Minutes</option>
                  <option value="h">Hours</option>
                  <option value="d">Days</option>
                  <option value="w">Weeks</option>
                  <option value="mo">Months</option>
                  <option value="y">Years</option>
                </select>
              </div>
            </div>
            <button class="swap-btn" @click="swapTime">⇅</button>
            <div class="input-group">
              <label>To</label>
              <div class="input-row">
                <input :value="timeResult" type="text" class="input result" readonly />
                <select v-model="timeTo" class="input select">
                  <option value="ms">Milliseconds</option>
                  <option value="s">Seconds</option>
                  <option value="min">Minutes</option>
                  <option value="h">Hours</option>
                  <option value="d">Days</option>
                  <option value="w">Weeks</option>
                  <option value="mo">Months</option>
                  <option value="y">Years</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Kitchen -->
          <div v-if="activeCategory === 'kitchen'" class="converter-content">
            <div class="input-group">
              <label>From</label>
              <div class="input-row">
                <input v-model.number="kitchenValue" type="number" class="input" placeholder="Enter value" />
                <select v-model="kitchenFrom" class="input select">
                  <option value="cup">Cups</option>
                  <option value="tbsp">Tablespoons</option>
                  <option value="tsp">Teaspoons</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (L)</option>
                  <option value="floz">Fluid Ounces</option>
                  <option value="pt">Pints</option>
                  <option value="qt">Quarts</option>
                  <option value="gal">Gallons</option>
                </select>
              </div>
            </div>
            <button class="swap-btn" @click="swapKitchen">⇅</button>
            <div class="input-group">
              <label>To</label>
              <div class="input-row">
                <input :value="kitchenResult" type="text" class="input result" readonly />
                <select v-model="kitchenTo" class="input select">
                  <option value="cup">Cups</option>
                  <option value="tbsp">Tablespoons</option>
                  <option value="tsp">Teaspoons</option>
                  <option value="ml">Milliliters (ml)</option>
                  <option value="l">Liters (L)</option>
                  <option value="floz">Fluid Ounces</option>
                  <option value="pt">Pints</option>
                  <option value="qt">Quarts</option>
                  <option value="gal">Gallons</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Copy Button -->
          <button class="btn btn-primary copy-btn" @click="copyResult">
            {{ copied ? '✓ Copied!' : '📋 Copy Result' }}
          </button>
        </div>

        <!-- Quick Reference -->
        <div class="quick-reference glass">
          <h3>Quick Reference</h3>
          <div class="reference-list">
            <div class="reference-item" v-for="ref in quickRefs[activeCategory]" :key="ref.label">
              <span class="ref-label">{{ ref.label }}</span>
              <span class="ref-value">{{ ref.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Unit Converter - QuickHelp.lol'
})

const activeCategory = ref('length')
const copied = ref(false)

const categories = [
  { id: 'length', name: 'Length', icon: '📏' },
  { id: 'weight', name: 'Weight', icon: '⚖️' },
  { id: 'temperature', name: 'Temperature', icon: '🌡️' },
  { id: 'data', name: 'Data Size', icon: '💾' },
  { id: 'time', name: 'Time', icon: '⏰' },
  { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
]

// Length conversion
const lengthValue = ref(1)
const lengthFrom = ref('m')
const lengthTo = ref('ft')

const lengthFactors = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
}

const lengthResult = computed(() => {
  if (!lengthValue.value) return ''
  const meters = lengthValue.value * lengthFactors[lengthFrom.value]
  const result = meters / lengthFactors[lengthTo.value]
  return formatNumber(result)
})

const swapLength = () => {
  const temp = lengthFrom.value
  lengthFrom.value = lengthTo.value
  lengthTo.value = temp
}

// Weight conversion
const weightValue = ref(1)
const weightFrom = ref('kg')
const weightTo = ref('lb')

const weightFactors = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.453592,
  oz: 0.0283495,
  ton: 1000,
}

const weightResult = computed(() => {
  if (!weightValue.value) return ''
  const kg = weightValue.value * weightFactors[weightFrom.value]
  const result = kg / weightFactors[weightTo.value]
  return formatNumber(result)
})

const swapWeight = () => {
  const temp = weightFrom.value
  weightFrom.value = weightTo.value
  weightTo.value = temp
}

// Temperature conversion
const tempValue = ref(0)
const tempFrom = ref('c')
const tempTo = ref('f')

const tempResult = computed(() => {
  if (tempValue.value === null || tempValue.value === '') return ''
  let celsius
  
  if (tempFrom.value === 'c') celsius = tempValue.value
  else if (tempFrom.value === 'f') celsius = (tempValue.value - 32) * 5/9
  else celsius = tempValue.value - 273.15
  
  let result
  if (tempTo.value === 'c') result = celsius
  else if (tempTo.value === 'f') result = celsius * 9/5 + 32
  else result = celsius + 273.15
  
  return formatNumber(result)
})

const swapTemp = () => {
  const temp = tempFrom.value
  tempFrom.value = tempTo.value
  tempTo.value = temp
}

// Data size conversion
const dataValue = ref(1)
const dataFrom = ref('gb')
const dataTo = ref('mb')

const dataFactors = {
  b: 1,
  kb: 1024,
  mb: 1024 * 1024,
  gb: 1024 * 1024 * 1024,
  tb: 1024 * 1024 * 1024 * 1024,
  pb: 1024 * 1024 * 1024 * 1024 * 1024,
}

const dataResult = computed(() => {
  if (!dataValue.value) return ''
  const bytes = dataValue.value * dataFactors[dataFrom.value]
  const result = bytes / dataFactors[dataTo.value]
  return formatNumber(result)
})

const swapData = () => {
  const temp = dataFrom.value
  dataFrom.value = dataTo.value
  dataTo.value = temp
}

// Time conversion
const timeValue = ref(1)
const timeFrom = ref('h')
const timeTo = ref('min')

const timeFactors = {
  ms: 0.001,
  s: 1,
  min: 60,
  h: 3600,
  d: 86400,
  w: 604800,
  mo: 2629746,
  y: 31556952,
}

const timeResult = computed(() => {
  if (!timeValue.value) return ''
  const seconds = timeValue.value * timeFactors[timeFrom.value]
  const result = seconds / timeFactors[timeTo.value]
  return formatNumber(result)
})

const swapTime = () => {
  const temp = timeFrom.value
  timeFrom.value = timeTo.value
  timeTo.value = temp
}

// Kitchen conversion
const kitchenValue = ref(1)
const kitchenFrom = ref('cup')
const kitchenTo = ref('ml')

const kitchenFactors = {
  cup: 236.588,
  tbsp: 14.7868,
  tsp: 4.92892,
  ml: 1,
  l: 1000,
  floz: 29.5735,
  pt: 473.176,
  qt: 946.353,
  gal: 3785.41,
}

const kitchenResult = computed(() => {
  if (!kitchenValue.value) return ''
  const ml = kitchenValue.value * kitchenFactors[kitchenFrom.value]
  const result = ml / kitchenFactors[kitchenTo.value]
  return formatNumber(result)
})

const swapKitchen = () => {
  const temp = kitchenFrom.value
  kitchenFrom.value = kitchenTo.value
  kitchenTo.value = temp
}

// Quick reference data
const quickRefs = {
  length: [
    { label: '1 mile', value: '1.609 km' },
    { label: '1 foot', value: '30.48 cm' },
    { label: '1 inch', value: '2.54 cm' },
    { label: '1 meter', value: '3.281 ft' },
  ],
  weight: [
    { label: '1 pound', value: '0.454 kg' },
    { label: '1 ounce', value: '28.35 g' },
    { label: '1 kg', value: '2.205 lb' },
  ],
  temperature: [
    { label: '0°C', value: '32°F' },
    { label: '100°C', value: '212°F' },
    { label: '37°C (body)', value: '98.6°F' },
  ],
  data: [
    { label: '1 KB', value: '1,024 bytes' },
    { label: '1 MB', value: '1,024 KB' },
    { label: '1 GB', value: '1,024 MB' },
    { label: '1 TB', value: '1,024 GB' },
  ],
  time: [
    { label: '1 day', value: '86,400 seconds' },
    { label: '1 week', value: '168 hours' },
    { label: '1 year', value: '365.25 days' },
  ],
  kitchen: [
    { label: '1 cup', value: '237 ml' },
    { label: '1 tablespoon', value: '15 ml' },
    { label: '1 teaspoon', value: '5 ml' },
    { label: '1 gallon', value: '3.785 L' },
  ],
}

const formatNumber = (num) => {
  if (Math.abs(num) < 0.0001 || Math.abs(num) > 9999999) {
    return num.toExponential(4)
  }
  return parseFloat(num.toPrecision(8)).toString()
}

const getCurrentResult = () => {
  switch (activeCategory.value) {
    case 'length': return lengthResult.value
    case 'weight': return weightResult.value
    case 'temperature': return tempResult.value
    case 'data': return dataResult.value
    case 'time': return timeResult.value
    case 'kitchen': return kitchenResult.value
    default: return ''
  }
}

const copyResult = async () => {
  const result = getCurrentResult()
  if (result) {
    await navigator.clipboard.writeText(result)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}
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
  transition: color 0.2s ease;
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

.converter-layout {
  max-width: 800px;
  margin: 0 auto;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  border-color: var(--primary);
  color: white;
}

.tab-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.tab-icon {
  font-size: 18px;
}

.converter-card {
  padding: 32px;
  margin-bottom: 24px;
}

.converter-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-row .input {
  flex: 1;
}

.input-row .select {
  flex: 0 0 180px;
}

.input.result {
  background: var(--surface);
  font-weight: 600;
  color: var(--primary);
}

.swap-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--surface-light);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-self: center;
}

.swap-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
  transform: rotate(180deg);
}

.copy-btn {
  width: 100%;
}

.quick-reference {
  padding: 24px;
}

.quick-reference h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.reference-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.reference-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 14px;
  background: var(--surface);
  border-radius: 8px;
  font-size: 13px;
}

.ref-label {
  color: var(--text-muted);
}

.ref-value {
  font-weight: 500;
  color: white;
}

@media (max-width: 600px) {
  .input-row {
    flex-direction: column;
  }

  .input-row .select {
    flex: 1;
  }

  .reference-list {
    grid-template-columns: 1fr;
  }
}
</style>
