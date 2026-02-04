<template>
  <div class="tool-page">
    <NavBar />
    
    <!-- Animated Background -->
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="grid-pattern"></div>
    </div>

    <main class="tool-container">
      <!-- Header -->
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">
          <span>←</span> Back to Tools
        </NuxtLink>
        
        <div class="badge">
          <span class="badge-icon">💰</span>
          <span>Finance Tool</span>
        </div>
        
        <h1 class="title">
          <span class="title-icon">🧮</span>
          <span class="title-gradient">Tip Calculator</span>
        </h1>
        
        <p class="subtitle">
          Calculate tips and split bills with your friends in seconds
        </p>
      </header>

      <!-- Calculator Card -->
      <div class="calculator-wrapper">
        <div class="calculator-card">
          <!-- Decorative Elements -->
          <div class="card-glow"></div>
          
          <div class="calculator-grid">
            <!-- Input Section -->
            <div class="input-section">
              <!-- Bill Amount -->
              <div class="input-block">
                <label class="input-label">
                  <span class="label-icon">💵</span>
                  Bill Amount
                </label>
                <div class="currency-input">
                  <span class="currency-symbol">$</span>
                  <input
                    v-model.number="billAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="bill-input"
                    @input="animateResult"
                  />
                  <div class="input-glow" :class="{ active: billAmount > 0 }"></div>
                </div>
              </div>

              <!-- Tip Percentage -->
              <div class="input-block">
                <label class="input-label">
                  <span class="label-icon">💡</span>
                  Tip Percentage
                </label>
                
                <div class="tip-presets">
                  <button
                    v-for="preset in tipPresets"
                    :key="preset"
                    @click="selectTip(preset)"
                    :class="['preset-btn', { active: tipPercent === preset }]"
                  >
                    <span class="preset-value">{{ preset }}</span>
                    <span class="preset-symbol">%</span>
                    <div class="preset-bg"></div>
                  </button>
                </div>

                <div class="custom-tip">
                  <div class="slider-container">
                    <input
                      v-model.number="tipPercent"
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      class="tip-slider"
                    />
                    <div class="slider-track">
                      <div class="slider-fill" :style="{ width: (tipPercent / 50) * 100 + '%' }"></div>
                    </div>
                  </div>
                  <div class="slider-value">
                    <span class="value-number">{{ tipPercent }}</span>
                    <span class="value-symbol">%</span>
                  </div>
                </div>
              </div>

              <!-- Split Between -->
              <div class="input-block">
                <label class="input-label">
                  <span class="label-icon">👥</span>
                  Split Between
                </label>
                
                <div class="people-selector">
                  <button 
                    @click="decreasePeople"
                    class="people-btn minus"
                    :disabled="people <= 1"
                  >
                    <span>−</span>
                  </button>
                  
                  <div class="people-display">
                    <span class="people-count" :key="people">{{ people }}</span>
                    <span class="people-label">{{ people === 1 ? 'person' : 'people' }}</span>
                  </div>
                  
                  <button 
                    @click="increasePeople"
                    class="people-btn plus"
                  >
                    <span>+</span>
                  </button>
                </div>
                
                <div class="people-avatars">
                  <div 
                    v-for="i in Math.min(people, 8)" 
                    :key="i" 
                    class="avatar"
                    :style="{ animationDelay: (i * 0.1) + 's' }"
                  >
                    👤
                  </div>
                  <div v-if="people > 8" class="avatar-more">+{{ people - 8 }}</div>
                </div>
              </div>
            </div>

            <!-- Results Section -->
            <div class="results-section">
              <div class="results-card">
                <div class="results-header">
                  <span class="results-icon">📊</span>
                  <span>Calculation Results</span>
                </div>

                <div class="result-row">
                  <div class="result-info">
                    <span class="result-label">Tip Amount</span>
                    <span class="result-desc">{{ tipPercent }}% of ${{ billAmount.toFixed(2) }}</span>
                  </div>
                  <div class="result-value tip">
                    <span class="dollar">$</span>
                    <span class="amount">{{ animatedTip.toFixed(2) }}</span>
                  </div>
                </div>

                <div class="result-row">
                  <div class="result-info">
                    <span class="result-label">Total Bill</span>
                    <span class="result-desc">Bill + Tip</span>
                  </div>
                  <div class="result-value total">
                    <span class="dollar">$</span>
                    <span class="amount">{{ animatedTotal.toFixed(2) }}</span>
                  </div>
                </div>

                <div class="result-divider">
                  <div class="divider-line"></div>
                  <span class="divider-icon">⚡</span>
                  <div class="divider-line"></div>
                </div>

                <div class="result-row highlight">
                  <div class="result-info">
                    <span class="result-label">Per Person</span>
                    <span class="result-desc">Split among {{ people }} {{ people === 1 ? 'person' : 'people' }}</span>
                  </div>
                  <div class="result-value per-person">
                    <span class="dollar">$</span>
                    <span class="amount">{{ animatedPerPerson.toFixed(2) }}</span>
                  </div>
                </div>

                <!-- Summary Card -->
                <div class="summary-card">
                  <div class="summary-icon">💡</div>
                  <div class="summary-text">
                    Each person pays <strong>${{ perPerson.toFixed(2) }}</strong>
                    <span class="summary-detail">(including ${{ (tipAmount / people).toFixed(2) }} tip)</span>
                  </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                  <button @click="copyResult" class="action-btn">
                    <span>{{ copied ? '✓' : '📋' }}</span>
                    {{ copied ? 'Copied!' : 'Copy' }}
                  </button>
                  <button @click="resetCalculator" class="action-btn">
                    <span>🔄</span>
                    Reset
                  </button>
                  <button @click="shareResult" class="action-btn">
                    <span>📤</span>
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <section class="tips-section">
        <h3 class="tips-title">💡 Tipping Guidelines</h3>
        <div class="tips-grid">
          <div class="tip-card" v-for="tip in tippingTips" :key="tip.service">
            <div class="tip-icon">{{ tip.icon }}</div>
            <div class="tip-content">
              <h4>{{ tip.service }}</h4>
              <p>{{ tip.range }}</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
const billAmount = ref(0)
const tipPercent = ref(18)
const people = ref(1)
const copied = ref(false)
const tipPresets = [10, 15, 18, 20, 25]

// Animated values
const animatedTip = ref(0)
const animatedTotal = ref(0)
const animatedPerPerson = ref(0)

const tipAmount = computed(() => (billAmount.value * tipPercent.value) / 100)
const totalAmount = computed(() => billAmount.value + tipAmount.value)
const perPerson = computed(() => people.value > 0 ? totalAmount.value / people.value : 0)

const tippingTips = [
  { icon: '🍽️', service: 'Restaurant', range: '15-20%' },
  { icon: '☕', service: 'Coffee Shop', range: '10-15%' },
  { icon: '🚕', service: 'Taxi/Rideshare', range: '15-20%' },
  { icon: '💇', service: 'Hair Salon', range: '15-25%' },
  { icon: '🛎️', service: 'Hotel Staff', range: '$2-5/day' },
  { icon: '🍕', service: 'Delivery', range: '15-20%' },
]

const selectTip = (preset: number) => {
  tipPercent.value = preset
  animateResult()
}

const decreasePeople = () => {
  if (people.value > 1) {
    people.value--
    animateResult()
  }
}

const increasePeople = () => {
  people.value++
  animateResult()
}

const animateResult = () => {
  const duration = 300
  const steps = 20
  const stepTime = duration / steps
  
  const startTip = animatedTip.value
  const startTotal = animatedTotal.value
  const startPerPerson = animatedPerPerson.value
  
  const endTip = tipAmount.value
  const endTotal = totalAmount.value
  const endPerPerson = perPerson.value
  
  let step = 0
  const animate = () => {
    step++
    const progress = step / steps
    const eased = 1 - Math.pow(1 - progress, 3)
    
    animatedTip.value = startTip + (endTip - startTip) * eased
    animatedTotal.value = startTotal + (endTotal - startTotal) * eased
    animatedPerPerson.value = startPerPerson + (endPerPerson - startPerPerson) * eased
    
    if (step < steps) {
      setTimeout(animate, stepTime)
    }
  }
  animate()
}

const copyResult = () => {
  const text = `Bill: $${billAmount.value.toFixed(2)}\nTip (${tipPercent.value}%): $${tipAmount.value.toFixed(2)}\nTotal: $${totalAmount.value.toFixed(2)}\nPer Person (${people.value}): $${perPerson.value.toFixed(2)}`
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const resetCalculator = () => {
  billAmount.value = 0
  tipPercent.value = 18
  people.value = 1
  animateResult()
}

const shareResult = async () => {
  const text = `💰 Tip Calculator\n\nBill: $${billAmount.value.toFixed(2)}\nTip (${tipPercent.value}%): $${tipAmount.value.toFixed(2)}\nTotal: $${totalAmount.value.toFixed(2)}\nPer Person: $${perPerson.value.toFixed(2)}`
  
  if (navigator.share) {
    await navigator.share({ title: 'Tip Calculation', text })
  } else {
    copyResult()
  }
}

// Watch for changes and animate
watch([billAmount, tipPercent, people], () => {
  animateResult()
}, { immediate: true })

useHead({ title: 'Tip Calculator - QuickHelp.lol' })
</script>

<style scoped>
.tool-page {
  min-height: 100vh;
  position: relative;
}

/* Background */
.page-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: #030712;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(249, 115, 22, 0.3), transparent 70%);
  top: -100px;
  right: -100px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.2), transparent 70%);
  bottom: 0;
  left: -100px;
  animation-delay: -10s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, 30px) scale(1.1); }
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Container */
.tool-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 100px 24px 60px;
}

/* Header */
.tool-header {
  text-align: center;
  margin-bottom: 48px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 24px;
  transition: color 0.2s;
}

.back-btn:hover {
  color: #f97316;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 100px;
  color: #f97316;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 20px;
}

.badge-icon {
  font-size: 16px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.title-icon {
  font-size: 48px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.title-gradient {
  background: linear-gradient(135deg, #f97316, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: #64748b;
  font-size: 18px;
}

/* Calculator Card */
.calculator-wrapper {
  margin-bottom: 60px;
}

.calculator-card {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 28px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(249, 115, 22, 0.08), transparent 30%);
  animation: glowRotate 10s linear infinite;
}

@keyframes glowRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.calculator-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .calculator-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Input Section */
.input-section {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.input-block {
  position: relative;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.label-icon {
  font-size: 18px;
}

/* Currency Input */
.currency-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency-symbol {
  position: absolute;
  left: 20px;
  font-size: 28px;
  font-weight: 700;
  color: #f97316;
  z-index: 2;
}

.bill-input {
  width: 100%;
  padding: 20px 20px 20px 50px;
  font-size: 32px;
  font-weight: 700;
  background: rgba(30, 41, 59, 0.6);
  border: 2px solid rgba(100, 116, 139, 0.3);
  border-radius: 16px;
  color: white;
  outline: none;
  transition: all 0.3s ease;
}

.bill-input:focus {
  border-color: #f97316;
}

.bill-input::placeholder {
  color: #475569;
}

.input-glow {
  position: absolute;
  inset: 0;
  border-radius: 16px;
  opacity: 0;
  transition: opacity 0.3s;
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.3);
  pointer-events: none;
}

.input-glow.active {
  opacity: 1;
}

/* Tip Presets */
.tip-presets {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.preset-btn {
  position: relative;
  padding: 16px 8px;
  background: rgba(30, 41, 59, 0.6);
  border: 2px solid rgba(100, 116, 139, 0.3);
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.preset-btn:hover {
  border-color: rgba(249, 115, 22, 0.5);
  transform: translateY(-2px);
}

.preset-btn.active {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.15);
}

.preset-btn.active .preset-bg {
  opacity: 1;
}

.preset-value {
  font-size: 20px;
  font-weight: 700;
  color: white;
  position: relative;
  z-index: 1;
}

.preset-symbol {
  font-size: 14px;
  color: #94a3b8;
  position: relative;
  z-index: 1;
}

.preset-btn.active .preset-symbol {
  color: #f97316;
}

.preset-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

/* Custom Tip Slider */
.custom-tip {
  display: flex;
  align-items: center;
  gap: 20px;
}

.slider-container {
  flex: 1;
  position: relative;
  height: 8px;
}

.tip-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.tip-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #f97316, #fbbf24);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.5);
  transition: transform 0.2s;
}

.tip-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.slider-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 8px;
  background: rgba(51, 65, 85, 0.8);
  border-radius: 4px;
  overflow: hidden;
}

.slider-fill {
  height: 100%;
  background: linear-gradient(90deg, #f97316, #fbbf24);
  border-radius: 4px;
  transition: width 0.1s;
}

.slider-value {
  background: rgba(249, 115, 22, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 12px;
  padding: 10px 16px;
  min-width: 80px;
  text-align: center;
}

.value-number {
  font-size: 24px;
  font-weight: 700;
  color: #f97316;
}

.value-symbol {
  font-size: 16px;
  color: #94a3b8;
}

/* People Selector */
.people-selector {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.people-btn {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  border: 2px solid rgba(100, 116, 139, 0.3);
  background: rgba(30, 41, 59, 0.6);
  color: white;
  font-size: 28px;
  font-weight: 300;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.people-btn:hover:not(:disabled) {
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.1);
}

.people-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.people-btn.plus:hover:not(:disabled) {
  background: rgba(249, 115, 22, 0.2);
}

.people-display {
  flex: 1;
  text-align: center;
}

.people-count {
  display: block;
  font-size: 48px;
  font-weight: 700;
  color: white;
  line-height: 1;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.people-label {
  font-size: 14px;
  color: #64748b;
}

.people-avatars {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.avatar {
  width: 36px;
  height: 36px;
  background: rgba(249, 115, 22, 0.15);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  animation: fadeIn 0.3s ease backwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.avatar-more {
  width: 36px;
  height: 36px;
  background: rgba(249, 115, 22, 0.3);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #f97316;
}

/* Results Section */
.results-section {
  display: flex;
  flex-direction: column;
}

.results-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(249, 115, 22, 0.15);
  border-radius: 20px;
  padding: 28px;
  height: 100%;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(100, 116, 139, 0.2);
}

.results-icon {
  font-size: 20px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.result-row.highlight {
  background: rgba(249, 115, 22, 0.1);
  margin: 0 -28px;
  padding: 20px 28px;
  border-radius: 12px;
}

.result-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-label {
  font-size: 15px;
  font-weight: 500;
  color: #e2e8f0;
}

.result-desc {
  font-size: 13px;
  color: #64748b;
}

.result-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.result-value .dollar {
  font-size: 18px;
  color: #94a3b8;
}

.result-value .amount {
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.result-value.tip .amount {
  color: #fbbf24;
}

.result-value.per-person .amount {
  font-size: 36px;
  background: linear-gradient(135deg, #f97316, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.result-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent);
}

.divider-icon {
  color: #f97316;
  font-size: 16px;
}

/* Summary Card */
.summary-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: rgba(249, 115, 22, 0.08);
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 14px;
  margin-top: 20px;
}

.summary-icon {
  font-size: 24px;
}

.summary-text {
  font-size: 14px;
  color: #94a3b8;
}

.summary-text strong {
  color: white;
  font-weight: 600;
}

.summary-detail {
  display: block;
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  color: white;
  border-color: rgba(249, 115, 22, 0.4);
  background: rgba(249, 115, 22, 0.1);
}

/* Tips Section */
.tips-section {
  margin-top: 40px;
}

.tips-title {
  font-size: 24px;
  font-weight: 600;
  color: white;
  margin-bottom: 24px;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 768px) {
  .tips-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .tips-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

.tip-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(249, 115, 22, 0.1);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.tip-card:hover {
  border-color: rgba(249, 115, 22, 0.3);
  transform: translateY(-4px);
}

.tip-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.tip-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.tip-card p {
  font-size: 16px;
  font-weight: 700;
  color: #f97316;
}
</style>
