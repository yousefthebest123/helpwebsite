<template>
  <div class="bmi-page">
    <section class="bmi-hero">
      <div class="container">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1>⚖️ BMI <span class="gradient-text">Calculator</span></h1>
        <p>Calculate your Body Mass Index and understand what it means for your health.</p>
      </div>
    </section>

    <section class="container bmi-content">
      <div class="bmi-grid">
        <!-- Calculator -->
        <div class="calc-card glass">
          <div class="unit-toggle">
            <button :class="{ active: unit === 'metric' }" @click="unit = 'metric'">Metric (kg/cm)</button>
            <button :class="{ active: unit === 'imperial' }" @click="unit = 'imperial'">Imperial (lb/ft)</button>
          </div>

          <div class="fields">
            <div class="field-group">
              <label>Age</label>
              <input v-model.number="age" type="number" class="input" min="1" max="120" placeholder="25" />
            </div>

            <div class="field-group">
              <label>Gender</label>
              <div class="gender-btns">
                <button :class="{ active: gender === 'male' }" @click="gender = 'male'">♂ Male</button>
                <button :class="{ active: gender === 'female' }" @click="gender = 'female'">♀ Female</button>
              </div>
            </div>

            <template v-if="unit === 'metric'">
              <div class="field-group">
                <label>Height (cm)</label>
                <input v-model.number="heightCm" type="number" class="input" min="50" max="300" placeholder="175" />
                <div class="slider-wrap">
                  <input v-model.number="heightCm" type="range" min="100" max="250" class="range-slider" />
                </div>
              </div>
              <div class="field-group">
                <label>Weight (kg)</label>
                <input v-model.number="weightKg" type="number" class="input" min="10" max="500" placeholder="70" />
                <div class="slider-wrap">
                  <input v-model.number="weightKg" type="range" min="30" max="250" class="range-slider" />
                </div>
              </div>
            </template>

            <template v-else>
              <div class="field-group">
                <label>Height</label>
                <div class="imperial-inputs">
                  <div>
                    <input v-model.number="heightFt" type="number" class="input" min="1" max="9" placeholder="5" />
                    <span class="unit-label">ft</span>
                  </div>
                  <div>
                    <input v-model.number="heightIn" type="number" class="input" min="0" max="11" placeholder="9" />
                    <span class="unit-label">in</span>
                  </div>
                </div>
              </div>
              <div class="field-group">
                <label>Weight (lbs)</label>
                <input v-model.number="weightLbs" type="number" class="input" min="20" max="1000" placeholder="154" />
              </div>
            </template>
          </div>

          <button class="btn btn-primary btn-lg full-width" @click="calculate" :disabled="!canCalculate">
            Calculate BMI
          </button>
        </div>

        <!-- Results -->
        <div class="results-card glass" v-if="bmiResult !== null">
          <div class="bmi-score" :style="{ color: bmiColor }">
            <span class="bmi-number">{{ bmiResult.toFixed(1) }}</span>
            <span class="bmi-label">{{ bmiCategory }}</span>
          </div>

          <div class="bmi-gauge">
            <div class="gauge-bar">
              <div class="gauge-sections">
                <div class="gauge-section underweight">Underweight</div>
                <div class="gauge-section normal">Normal</div>
                <div class="gauge-section overweight">Overweight</div>
                <div class="gauge-section obese">Obese</div>
              </div>
              <div class="gauge-marker" :style="{ left: gaugePosition + '%' }"></div>
            </div>
            <div class="gauge-labels">
              <span>15</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
            </div>
          </div>

          <div class="result-details">
            <div class="detail-row">
              <span>Healthy BMI range:</span>
              <span class="detail-val">18.5 – 24.9</span>
            </div>
            <div class="detail-row">
              <span>Healthy weight for your height:</span>
              <span class="detail-val">{{ healthyRange }}</span>
            </div>
            <div class="detail-row" v-if="weightDiff !== 0">
              <span>{{ weightDiff > 0 ? 'Weight to lose:' : 'Weight to gain:' }}</span>
              <span class="detail-val">{{ Math.abs(weightDiff).toFixed(1) }} {{ unit === 'metric' ? 'kg' : 'lbs' }}</span>
            </div>
          </div>

          <div class="bmi-tip glass">
            <h4>💡 {{ tipTitle }}</h4>
            <p>{{ tipText }}</p>
          </div>
        </div>

        <!-- Info when no result -->
        <div v-else class="info-card glass">
          <h3>What is BMI?</h3>
          <p>
            Body Mass Index is a simple calculation using your height and weight. While it doesn't 
            measure body fat directly, it can be a useful screening tool.
          </p>
          <div class="bmi-ranges">
            <div class="range-item">
              <span class="range-dot" style="background: #3b82f6"></span>
              <span>Underweight: &lt; 18.5</span>
            </div>
            <div class="range-item">
              <span class="range-dot" style="background: #22c55e"></span>
              <span>Normal: 18.5 – 24.9</span>
            </div>
            <div class="range-item">
              <span class="range-dot" style="background: #f59e0b"></span>
              <span>Overweight: 25 – 29.9</span>
            </div>
            <div class="range-item">
              <span class="range-dot" style="background: #ef4444"></span>
              <span>Obese: 30+</span>
            </div>
          </div>
          <div class="disclaimer">
            <p>⚠️ BMI is a screening tool, not a diagnostic tool. It doesn't account for muscle mass, 
            bone density, age, sex, or ethnicity. Always consult a healthcare professional.</p>
          </div>
        </div>
      </div>

      <!-- BMI History -->
      <div v-if="history.length > 0" class="history-section glass">
        <div class="card-header">
          <h3>📈 Your BMI History</h3>
          <button class="btn btn-glass btn-sm" @click="clearHistory">Clear</button>
        </div>
        <div class="history-chart">
          <div v-for="entry in history.slice(0, 10)" :key="entry.date" class="history-bar-wrap">
            <div class="history-bar" :style="{ height: ((entry.bmi / 45) * 100) + '%', background: getBmiColor(entry.bmi) }">
              <span class="bar-val">{{ entry.bmi.toFixed(1) }}</span>
            </div>
            <span class="bar-date">{{ entry.label }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

useHead({ title: 'BMI Calculator — QuickHelp.lol' })

const unit = ref('metric')
const age = ref(null)
const gender = ref('male')
const heightCm = ref(175)
const weightKg = ref(70)
const heightFt = ref(5)
const heightIn = ref(9)
const weightLbs = ref(154)
const bmiResult = ref(null)
const history = ref([])

const canCalculate = computed(() => {
  if (unit.value === 'metric') return heightCm.value > 0 && weightKg.value > 0
  return heightFt.value > 0 && weightLbs.value > 0
})

const calculate = () => {
  let h, w
  if (unit.value === 'metric') {
    h = heightCm.value / 100
    w = weightKg.value
  } else {
    const totalInches = heightFt.value * 12 + (heightIn.value || 0)
    h = totalInches * 0.0254
    w = weightLbs.value * 0.453592
  }
  if (h <= 0 || w <= 0) return
  bmiResult.value = w / (h * h)

  // Save to history
  const entry = {
    bmi: bmiResult.value,
    date: new Date().toISOString(),
    label: new Date().toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  }
  history.value.unshift(entry)
  if (history.value.length > 20) history.value.pop()
  localStorage.setItem('qh_bmi_history', JSON.stringify(history.value))
}

const bmiCategory = computed(() => {
  const b = bmiResult.value
  if (b < 18.5) return 'Underweight'
  if (b < 25) return 'Normal'
  if (b < 30) return 'Overweight'
  return 'Obese'
})

const bmiColor = computed(() => getBmiColor(bmiResult.value))

const getBmiColor = (b) => {
  if (b < 18.5) return '#3b82f6'
  if (b < 25) return '#22c55e'
  if (b < 30) return '#f59e0b'
  return '#ef4444'
}

const gaugePosition = computed(() => {
  const b = bmiResult.value
  if (b <= 15) return 0
  if (b >= 40) return 100
  return ((b - 15) / 25) * 100
})

const healthyRange = computed(() => {
  let h
  if (unit.value === 'metric') {
    h = heightCm.value / 100
    const low = (18.5 * h * h).toFixed(1)
    const high = (24.9 * h * h).toFixed(1)
    return `${low} — ${high} kg`
  } else {
    const totalIn = heightFt.value * 12 + (heightIn.value || 0)
    h = totalIn * 0.0254
    const low = ((18.5 * h * h) / 0.453592).toFixed(1)
    const high = ((24.9 * h * h) / 0.453592).toFixed(1)
    return `${low} — ${high} lbs`
  }
})

const weightDiff = computed(() => {
  if (!bmiResult.value) return 0
  let h
  if (unit.value === 'metric') {
    h = heightCm.value / 100
    if (bmiResult.value > 24.9) return weightKg.value - 24.9 * h * h
    if (bmiResult.value < 18.5) return weightKg.value - 18.5 * h * h
  } else {
    const totalIn = heightFt.value * 12 + (heightIn.value || 0)
    h = totalIn * 0.0254
    const wKg = weightLbs.value * 0.453592
    if (bmiResult.value > 24.9) return (wKg - 24.9 * h * h) / 0.453592
    if (bmiResult.value < 18.5) return (wKg - 18.5 * h * h) / 0.453592
  }
  return 0
})

const tipTitle = computed(() => {
  const c = bmiCategory.value
  if (c === 'Underweight') return 'Focus on nutrient-dense foods'
  if (c === 'Normal') return 'You\'re in a healthy range!'
  if (c === 'Overweight') return 'Small changes make a big difference'
  return 'Consider speaking with a professional'
})

const tipText = computed(() => {
  const c = bmiCategory.value
  if (c === 'Underweight') return 'Incorporate protein-rich foods, healthy fats, and whole grains. Consider consulting a dietitian for personalized advice.'
  if (c === 'Normal') return 'Keep up the good work! Maintain a balanced diet and regular physical activity to stay healthy.'
  if (c === 'Overweight') return 'Focus on portion control, regular exercise, and reducing processed foods. Even 5-10% weight loss can improve health markers.'
  return 'A healthcare provider can help create a safe, personalized plan. Focus on sustainable lifestyle changes rather than rapid weight loss.'
})

const clearHistory = () => {
  history.value = []
  localStorage.removeItem('qh_bmi_history')
}

onMounted(() => {
  try {
    const d = localStorage.getItem('qh_bmi_history')
    if (d) history.value = JSON.parse(d)
  } catch {}
})
</script>

<style scoped>
.bmi-hero {
  padding: 120px 0 40px;
  text-align: center;
}

.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--text-dim);
  text-decoration: none;
  margin-bottom: 20px;
}
.back-link:hover { color: var(--primary-light); }

.bmi-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 700;
  margin-bottom: 12px;
}

.bmi-hero p { color: var(--text-muted); font-size: 16px; }

.bmi-content { max-width: 900px; margin: 0 auto; padding-bottom: 80px; }

.bmi-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

/* Calculator */
.calc-card {
  padding: 28px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.unit-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background: var(--surface-light);
  border-radius: var(--radius-md);
  margin-bottom: 24px;
}

.unit-toggle button {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.unit-toggle button.active {
  background: var(--primary);
  color: white;
}

.fields { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }

.field-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

.gender-btns { display: flex; gap: 8px; }

.gender-btns button {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  background: var(--surface-light);
  color: var(--text-muted);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gender-btns button.active {
  border-color: var(--primary);
  background: rgba(124,58,237,0.1);
  color: white;
}

.imperial-inputs { display: flex; gap: 10px; }
.imperial-inputs > div { display: flex; align-items: center; gap: 6px; flex: 1; }
.unit-label { font-size: 13px; color: var(--text-dim); }

.slider-wrap { margin-top: 8px; }

.range-slider {
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  background: var(--surface-light);
  border-radius: 4px;
  outline: none;
}

.range-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(124,58,237,0.3);
}

.full-width { width: 100%; }

/* Results */
.results-card {
  padding: 28px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.bmi-score {
  text-align: center;
  margin-bottom: 28px;
}

.bmi-number {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
}

.bmi-label {
  font-size: 18px;
  font-weight: 600;
  margin-top: 4px;
  display: block;
}

/* Gauge */
.bmi-gauge { margin-bottom: 28px; }

.gauge-bar {
  position: relative;
  height: 32px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 8px;
}

.gauge-sections { display: flex; height: 100%; }

.gauge-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
}

.gauge-section.underweight { background: #3b82f6; }
.gauge-section.normal { background: #22c55e; }
.gauge-section.overweight { background: #f59e0b; }
.gauge-section.obese { background: #ef4444; }

.gauge-marker {
  position: absolute;
  top: -6px;
  width: 4px;
  height: 44px;
  background: white;
  border-radius: 2px;
  transform: translateX(-50%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: left 0.6s var(--ease-out-expo);
}

.gauge-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--text-dim);
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-light);
}

.detail-row span:first-child { color: var(--text-muted); }
.detail-val { font-weight: 600; }

.bmi-tip {
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.bmi-tip h4 { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
.bmi-tip p { font-size: 13px; color: var(--text-muted); line-height: 1.5; }

/* Info card */
.info-card {
  padding: 28px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.info-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
.info-card > p { font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 24px; }

.bmi-ranges { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }

.range-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-secondary);
}

.range-dot { width: 10px; height: 10px; border-radius: 50%; }

.disclaimer {
  padding: 16px;
  background: rgba(251, 146, 60, 0.06);
  border: 1px solid rgba(251, 146, 60, 0.15);
  border-radius: var(--radius-md);
}

.disclaimer p { font-size: 12px; color: var(--text-muted); line-height: 1.5; }

/* History */
.history-section {
  padding: 28px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.card-header h3 { font-size: 17px; font-weight: 700; }

.history-chart {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  height: 160px;
}

.history-bar-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 8px;
}

.history-bar {
  width: 100%;
  min-height: 20px;
  border-radius: 8px 8px 4px 4px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6px;
  transition: height 0.6s var(--ease-out-expo);
}

.bar-val { font-size: 11px; font-weight: 700; color: white; }
.bar-date { font-size: 10px; color: var(--text-dim); }

@media (max-width: 768px) {
  .bmi-grid { grid-template-columns: 1fr; }
  .history-chart { overflow-x: auto; }
}
</style>
