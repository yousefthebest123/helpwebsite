<template>
  <div class="min-h-screen pt-20 pb-16">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-sm mb-6">
          <span>🎲</span>
          <span>Generator</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Random Picker</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Make random selections from lists, generate random numbers, pick winners, and more.
        </p>
      </div>

      <div class="max-w-5xl mx-auto">
        <!-- Mode Selector -->
        <div class="mode-tabs">
          <button 
            v-for="mode in modes" 
            :key="mode.value"
            @click="currentMode = mode.value"
            :class="['mode-tab', { active: currentMode === mode.value }]"
          >
            <span class="mode-icon">{{ mode.icon }}</span>
            <span>{{ mode.label }}</span>
          </button>
        </div>

        <!-- List Picker -->
        <div v-if="currentMode === 'list'" class="glass-card p-8">
          <h3 class="section-title">Pick from List</h3>
          <p class="section-desc">Enter items (one per line) and randomly pick one or more</p>
          
          <textarea 
            v-model="listItems"
            placeholder="Item 1&#10;Item 2&#10;Item 3&#10;..."
            class="input textarea"
            rows="8"
          ></textarea>

          <div class="controls-row">
            <div class="control-group">
              <label>Number to pick:</label>
              <input type="number" v-model="pickCount" min="1" :max="itemsArray.length || 1" class="input small" />
            </div>
            <button @click="pickFromList" class="btn btn-primary" :disabled="!itemsArray.length">
              🎲 Pick Random
            </button>
          </div>

          <div v-if="pickedItems.length" class="result-section">
            <h4>Selected:</h4>
            <div class="picked-items">
              <div v-for="(item, i) in pickedItems" :key="i" class="picked-item">
                <span class="pick-number">#{{ i + 1 }}</span>
                <span class="pick-value">{{ item }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Number Generator -->
        <div v-if="currentMode === 'number'" class="glass-card p-8">
          <h3 class="section-title">Random Number Generator</h3>
          <p class="section-desc">Generate random numbers within a specified range</p>
          
          <div class="number-inputs">
            <div class="number-input-group">
              <label>Minimum</label>
              <input type="number" v-model="numMin" class="input" />
            </div>
            <span class="range-separator">to</span>
            <div class="number-input-group">
              <label>Maximum</label>
              <input type="number" v-model="numMax" class="input" />
            </div>
          </div>

          <div class="options-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="allowDuplicates" />
              <span>Allow duplicates</span>
            </label>
            <div class="count-input">
              <label>Count:</label>
              <input type="number" v-model="numCount" min="1" max="100" class="input small" />
            </div>
          </div>

          <button @click="generateNumbers" class="btn btn-primary">
            🔢 Generate Numbers
          </button>

          <div v-if="generatedNumbers.length" class="result-section">
            <h4>Generated Numbers:</h4>
            <div class="number-result">
              <span v-for="(num, i) in generatedNumbers" :key="i" class="number-badge">
                {{ num }}
              </span>
            </div>
          </div>
        </div>

        <!-- Coin Flip -->
        <div v-if="currentMode === 'coin'" class="glass-card p-8">
          <h3 class="section-title">Coin Flip</h3>
          <p class="section-desc">Flip a virtual coin for heads or tails</p>
          
          <div class="coin-container">
            <div :class="['coin', { flipping: isFlipping, heads: coinResult === 'heads', tails: coinResult === 'tails' }]">
              <div class="coin-face heads">👑</div>
              <div class="coin-face tails">🌙</div>
            </div>
          </div>

          <button @click="flipCoin" class="btn btn-primary" :disabled="isFlipping">
            🪙 Flip Coin
          </button>

          <div v-if="coinResult && !isFlipping" class="result-section centered">
            <h4>Result:</h4>
            <div class="coin-result">{{ coinResult === 'heads' ? '👑 Heads!' : '🌙 Tails!' }}</div>
          </div>

          <div v-if="coinHistory.length" class="history-section">
            <h4>History ({{ coinHistory.filter(h => h === 'heads').length }}H / {{ coinHistory.filter(h => h === 'tails').length }}T)</h4>
            <div class="history-items">
              <span v-for="(h, i) in coinHistory.slice(-20)" :key="i" :class="['history-item', h]">
                {{ h === 'heads' ? '👑' : '🌙' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Dice Roll -->
        <div v-if="currentMode === 'dice'" class="glass-card p-8">
          <h3 class="section-title">Dice Roller</h3>
          <p class="section-desc">Roll virtual dice of various types</p>
          
          <div class="dice-options">
            <div class="dice-type-selector">
              <button 
                v-for="d in diceTypes" 
                :key="d.value"
                @click="selectedDice = d.value"
                :class="['dice-type-btn', { active: selectedDice === d.value }]"
              >
                {{ d.label }}
              </button>
            </div>
            
            <div class="dice-count">
              <label>Number of dice:</label>
              <input type="number" v-model="diceCount" min="1" max="10" class="input small" />
            </div>
          </div>

          <div class="dice-display">
            <div 
              v-for="(val, i) in diceResults" 
              :key="i" 
              :class="['dice-result', { rolling: isDiceRolling }]"
            >
              {{ val }}
            </div>
          </div>

          <button @click="rollDice" class="btn btn-primary" :disabled="isDiceRolling">
            🎲 Roll Dice
          </button>

          <div v-if="diceResults.length && !isDiceRolling" class="result-section centered">
            <h4>Total: <span class="total-value">{{ diceTotal }}</span></h4>
          </div>
        </div>

        <!-- Wheel Spinner -->
        <div v-if="currentMode === 'wheel'" class="glass-card p-8">
          <h3 class="section-title">Wheel Spinner</h3>
          <p class="section-desc">Spin a wheel with custom options</p>
          
          <textarea 
            v-model="wheelItems"
            placeholder="Option 1&#10;Option 2&#10;Option 3&#10;..."
            class="input textarea"
            rows="5"
          ></textarea>

          <div class="wheel-container">
            <div 
              class="wheel" 
              :style="{ transform: `rotate(${wheelRotation}deg)` }"
            >
              <div 
                v-for="(item, i) in wheelArray" 
                :key="i"
                class="wheel-segment"
                :style="getWheelSegmentStyle(i)"
              >
                <span class="segment-text">{{ item }}</span>
              </div>
            </div>
            <div class="wheel-pointer">▼</div>
          </div>

          <button @click="spinWheel" class="btn btn-primary" :disabled="isSpinning || wheelArray.length < 2">
            🎡 Spin Wheel
          </button>

          <div v-if="wheelResult && !isSpinning" class="result-section centered">
            <h4>Winner:</h4>
            <div class="wheel-winner">🎉 {{ wheelResult }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
const showToast = ref(false)
const toastMessage = ref('')

const currentMode = ref('list')
const modes = [
  { value: 'list', label: 'List Picker', icon: '📋' },
  { value: 'number', label: 'Number Gen', icon: '🔢' },
  { value: 'coin', label: 'Coin Flip', icon: '🪙' },
  { value: 'dice', label: 'Dice Roll', icon: '🎲' },
  { value: 'wheel', label: 'Wheel Spin', icon: '🎡' }
]

// List Picker
const listItems = ref('')
const pickCount = ref(1)
const pickedItems = ref<string[]>([])

const itemsArray = computed(() => {
  return listItems.value.split('\n').map(i => i.trim()).filter(i => i.length > 0)
})

const pickFromList = () => {
  const items = [...itemsArray.value]
  const count = Math.min(pickCount.value, items.length)
  const picked: string[] = []
  
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * items.length)
    picked.push(items[idx])
    items.splice(idx, 1)
  }
  
  pickedItems.value = picked
}

// Number Generator
const numMin = ref(1)
const numMax = ref(100)
const numCount = ref(1)
const allowDuplicates = ref(true)
const generatedNumbers = ref<number[]>([])

const generateNumbers = () => {
  const min = Math.min(numMin.value, numMax.value)
  const max = Math.max(numMin.value, numMax.value)
  const range = max - min + 1
  const count = Math.min(numCount.value, allowDuplicates.value ? 100 : range)
  
  const numbers: number[] = []
  
  if (allowDuplicates.value) {
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * range) + min)
    }
  } else {
    const pool = Array.from({ length: range }, (_, i) => i + min)
    for (let i = 0; i < count && pool.length; i++) {
      const idx = Math.floor(Math.random() * pool.length)
      numbers.push(pool[idx])
      pool.splice(idx, 1)
    }
  }
  
  generatedNumbers.value = numbers
}

// Coin Flip
const coinResult = ref<'heads' | 'tails' | null>(null)
const isFlipping = ref(false)
const coinHistory = ref<string[]>([])

const flipCoin = () => {
  isFlipping.value = true
  coinResult.value = null
  
  setTimeout(() => {
    const result = Math.random() < 0.5 ? 'heads' : 'tails'
    coinResult.value = result
    coinHistory.value.push(result)
    isFlipping.value = false
  }, 1500)
}

// Dice Roll
const selectedDice = ref(6)
const diceCount = ref(1)
const diceResults = ref<number[]>([])
const isDiceRolling = ref(false)

const diceTypes = [
  { value: 4, label: 'D4' },
  { value: 6, label: 'D6' },
  { value: 8, label: 'D8' },
  { value: 10, label: 'D10' },
  { value: 12, label: 'D12' },
  { value: 20, label: 'D20' },
  { value: 100, label: 'D100' }
]

const diceTotal = computed(() => diceResults.value.reduce((a, b) => a + b, 0))

const rollDice = () => {
  isDiceRolling.value = true
  diceResults.value = Array(diceCount.value).fill(0)
  
  // Animate rolling
  const interval = setInterval(() => {
    diceResults.value = Array(diceCount.value).fill(0).map(() => 
      Math.floor(Math.random() * selectedDice.value) + 1
    )
  }, 100)
  
  setTimeout(() => {
    clearInterval(interval)
    diceResults.value = Array(diceCount.value).fill(0).map(() => 
      Math.floor(Math.random() * selectedDice.value) + 1
    )
    isDiceRolling.value = false
  }, 1000)
}

// Wheel Spinner
const wheelItems = ref('Option 1\nOption 2\nOption 3\nOption 4')
const wheelRotation = ref(0)
const isSpinning = ref(false)
const wheelResult = ref('')

const wheelArray = computed(() => {
  return wheelItems.value.split('\n').map(i => i.trim()).filter(i => i.length > 0)
})

const getWheelSegmentStyle = (index: number) => {
  const total = wheelArray.value.length
  const angle = 360 / total
  const colors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']
  
  return {
    transform: `rotate(${index * angle}deg)`,
    background: colors[index % colors.length]
  }
}

const spinWheel = () => {
  isSpinning.value = true
  wheelResult.value = ''
  
  const spins = 5 + Math.random() * 5
  const finalAngle = Math.random() * 360
  wheelRotation.value = wheelRotation.value + spins * 360 + finalAngle
  
  setTimeout(() => {
    const normalizedAngle = (360 - (wheelRotation.value % 360) + 90) % 360
    const segmentAngle = 360 / wheelArray.value.length
    const winnerIndex = Math.floor(normalizedAngle / segmentAngle) % wheelArray.value.length
    wheelResult.value = wheelArray.value[winnerIndex]
    isSpinning.value = false
  }, 5000)
}

useHead({
  title: 'Random Picker - QuickHelp.lol'
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #f59e0b, #f43f5e, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mode-tabs {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.mode-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 14px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-tab:hover {
  background: rgba(245, 158, 11, 0.1);
}

.mode-tab.active {
  background: rgba(245, 158, 11, 0.2);
  border-color: #f59e0b;
  color: #fbbf24;
}

.mode-icon {
  font-size: 20px;
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 24px;
  max-width: 700px;
  margin: 0 auto;
}

.section-title {
  color: white;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-desc {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 24px;
}

.input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  outline: none;
}

.input:focus {
  border-color: #f59e0b;
}

.input.textarea {
  resize: vertical;
  min-height: 150px;
  font-family: inherit;
  line-height: 1.6;
}

.input.small {
  width: 80px;
  padding: 8px 12px;
  text-align: center;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-group label {
  color: #94a3b8;
  font-size: 14px;
}

.btn {
  padding: 14px 32px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #f59e0b, #f43f5e);
  color: white;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(245, 158, 11, 0.5);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.result-section {
  margin-top: 32px;
  padding: 24px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 16px;
}

.result-section.centered {
  text-align: center;
}

.result-section h4 {
  color: white;
  font-size: 16px;
  margin-bottom: 16px;
}

.picked-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.picked-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 18px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.pick-number {
  color: #fbbf24;
  font-size: 14px;
  font-weight: 600;
}

.pick-value {
  color: white;
  font-size: 16px;
}

.number-inputs {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 20px;
}

.number-input-group {
  flex: 1;
}

.number-input-group label {
  display: block;
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 8px;
}

.range-separator {
  color: #64748b;
  padding-bottom: 12px;
}

.options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
}

.checkbox-label input {
  accent-color: #f59e0b;
}

.count-input {
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-input label {
  color: #94a3b8;
  font-size: 14px;
}

.number-result {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.number-badge {
  padding: 12px 20px;
  background: linear-gradient(135deg, #f59e0b, #f43f5e);
  border-radius: 12px;
  color: white;
  font-size: 18px;
  font-weight: 700;
}

/* Coin */
.coin-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
  perspective: 1000px;
}

.coin {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  box-shadow: 0 8px 30px rgba(245, 158, 11, 0.4);
  position: relative;
  transform-style: preserve-3d;
}

.coin-face {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  border-radius: 50%;
}

.coin-face.heads {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.coin-face.tails {
  background: linear-gradient(135deg, #94a3b8, #64748b);
  transform: rotateY(180deg);
}

.coin.flipping {
  animation: coinFlip 1.5s ease-out;
}

.coin.tails:not(.flipping) {
  transform: rotateY(180deg);
}

@keyframes coinFlip {
  0% { transform: rotateY(0); }
  100% { transform: rotateY(1800deg); }
}

.coin-result {
  font-size: 32px;
  font-weight: 700;
  color: #fbbf24;
}

.history-section {
  margin-top: 24px;
}

.history-section h4 {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 12px;
}

.history-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-item {
  font-size: 20px;
}

/* Dice */
.dice-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.dice-type-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dice-type-btn {
  padding: 10px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.dice-type-btn.active {
  background: rgba(245, 158, 11, 0.2);
  border-color: #f59e0b;
  color: #fbbf24;
}

.dice-count {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dice-count label {
  color: #94a3b8;
  font-size: 14px;
}

.dice-display {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  margin: 32px 0;
}

.dice-result {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f59e0b, #f43f5e);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
}

.dice-result.rolling {
  animation: diceShake 0.1s infinite;
}

@keyframes diceShake {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.total-value {
  color: #fbbf24;
  font-size: 28px;
}

/* Wheel */
.wheel-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 32px auto;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.3), 0 8px 40px rgba(0, 0, 0, 0.4);
  transition: transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99);
}

.wheel-segment {
  position: absolute;
  width: 50%;
  height: 50%;
  top: 0;
  right: 0;
  transform-origin: bottom left;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: polygon(0 0, 100% 0, 0 100%);
}

.segment-text {
  transform: rotate(45deg) translateX(20px);
  color: white;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wheel-pointer {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  color: #f59e0b;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.wheel-winner {
  font-size: 28px;
  font-weight: 700;
  color: #fbbf24;
}

.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  background: linear-gradient(135deg, #f59e0b, #f43f5e);
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

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
