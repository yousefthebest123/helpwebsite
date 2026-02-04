<template>
  <div class="tool-page">
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <main class="tool-container">
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">← Back to Tools</NuxtLink>
        <div class="badge"><span>🔢</span> Math Tool</div>
        <h1><span class="gradient-text">Scientific Calculator</span></h1>
        <p>A powerful calculator for everyday and scientific calculations.</p>
      </header>

      <div class="calculator-card">
        <!-- Display -->
        <div class="display-section">
          <div class="history" v-if="history">{{ history }}</div>
          <div class="display">{{ display || '0' }}</div>
        </div>

        <!-- Memory Buttons -->
        <div class="memory-row">
          <button @click="memoryClear" class="mem-btn" :disabled="memory === null">MC</button>
          <button @click="memoryRecall" class="mem-btn" :disabled="memory === null">MR</button>
          <button @click="memoryAdd" class="mem-btn">M+</button>
          <button @click="memorySubtract" class="mem-btn">M-</button>
          <button @click="memoryStore" class="mem-btn">MS</button>
        </div>

        <!-- Main Buttons -->
        <div class="button-grid">
          <!-- Row 1 - Scientific -->
          <button @click="scientific('sin')" class="btn sci">sin</button>
          <button @click="scientific('cos')" class="btn sci">cos</button>
          <button @click="scientific('tan')" class="btn sci">tan</button>
          <button @click="scientific('log')" class="btn sci">log</button>
          <button @click="scientific('ln')" class="btn sci">ln</button>
          
          <!-- Row 2 - Scientific -->
          <button @click="scientific('sqrt')" class="btn sci">√</button>
          <button @click="scientific('square')" class="btn sci">x²</button>
          <button @click="scientific('cube')" class="btn sci">x³</button>
          <button @click="scientific('pow')" class="btn sci">xʸ</button>
          <button @click="scientific('inv')" class="btn sci">1/x</button>
          
          <!-- Row 3 -->
          <button @click="clear" class="btn clear">C</button>
          <button @click="clearEntry" class="btn clear">CE</button>
          <button @click="backspace" class="btn clear">⌫</button>
          <button @click="append('/')" class="btn op">÷</button>
          <button @click="scientific('pi')" class="btn sci">π</button>
          
          <!-- Row 4 -->
          <button @click="append('7')" class="btn num">7</button>
          <button @click="append('8')" class="btn num">8</button>
          <button @click="append('9')" class="btn num">9</button>
          <button @click="append('*')" class="btn op">×</button>
          <button @click="scientific('e')" class="btn sci">e</button>
          
          <!-- Row 5 -->
          <button @click="append('4')" class="btn num">4</button>
          <button @click="append('5')" class="btn num">5</button>
          <button @click="append('6')" class="btn num">6</button>
          <button @click="append('-')" class="btn op">−</button>
          <button @click="scientific('abs')" class="btn sci">|x|</button>
          
          <!-- Row 6 -->
          <button @click="append('1')" class="btn num">1</button>
          <button @click="append('2')" class="btn num">2</button>
          <button @click="append('3')" class="btn num">3</button>
          <button @click="append('+')" class="btn op">+</button>
          <button @click="scientific('fact')" class="btn sci">n!</button>
          
          <!-- Row 7 -->
          <button @click="toggleSign" class="btn num">±</button>
          <button @click="append('0')" class="btn num">0</button>
          <button @click="appendDecimal" class="btn num">.</button>
          <button @click="calculate" class="btn equals">=</button>
          <button @click="append('(')" class="btn sci">(</button>
        </div>

        <!-- History -->
        <div class="calc-history" v-if="calculations.length">
          <div class="history-header">
            <span>📜 History</span>
            <button @click="clearHistory" class="clear-history">Clear</button>
          </div>
          <div class="history-list">
            <div 
              v-for="(calc, i) in calculations.slice().reverse()" 
              :key="i" 
              class="history-item"
              @click="useResult(calc.result)"
            >
              <span class="calc-expr">{{ calc.expression }}</span>
              <span class="calc-result">= {{ calc.result }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
useHead({ title: 'Scientific Calculator - QuickHelp.lol' })

const display = ref('')
const history = ref('')
const memory = ref(null)
const calculations = ref([])
const waitingForOperand = ref(false)

const append = (value) => {
  if (waitingForOperand.value && '0123456789'.includes(value)) {
    display.value = value
    waitingForOperand.value = false
  } else {
    display.value += value
  }
}

const appendDecimal = () => {
  const parts = display.value.split(/[\+\-\*\/\(\)]/)
  const lastPart = parts[parts.length - 1]
  if (!lastPart.includes('.')) {
    display.value += '.'
  }
}

const toggleSign = () => {
  if (display.value && display.value !== '0') {
    if (display.value.startsWith('-')) {
      display.value = display.value.slice(1)
    } else {
      display.value = '-' + display.value
    }
  }
}

const clear = () => {
  display.value = ''
  history.value = ''
  waitingForOperand.value = false
}

const clearEntry = () => {
  display.value = ''
}

const backspace = () => {
  display.value = display.value.slice(0, -1)
}

const scientific = (func) => {
  const val = parseFloat(display.value) || 0
  let result
  
  switch (func) {
    case 'sin':
      result = Math.sin(val * Math.PI / 180)
      break
    case 'cos':
      result = Math.cos(val * Math.PI / 180)
      break
    case 'tan':
      result = Math.tan(val * Math.PI / 180)
      break
    case 'log':
      result = Math.log10(val)
      break
    case 'ln':
      result = Math.log(val)
      break
    case 'sqrt':
      result = Math.sqrt(val)
      break
    case 'square':
      result = val * val
      break
    case 'cube':
      result = val * val * val
      break
    case 'pow':
      display.value += '^'
      return
    case 'inv':
      result = 1 / val
      break
    case 'pi':
      display.value += Math.PI
      return
    case 'e':
      display.value += Math.E
      return
    case 'abs':
      result = Math.abs(val)
      break
    case 'fact':
      result = factorial(Math.floor(val))
      break
    default:
      return
  }
  
  display.value = formatResult(result)
  waitingForOperand.value = true
}

const factorial = (n) => {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  if (n > 170) return Infinity
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

const calculate = () => {
  if (!display.value) return
  
  try {
    let expr = display.value
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^/g, '**')
    
    // Safe eval using Function
    const result = Function('"use strict"; return (' + expr + ')')()
    
    calculations.value.push({
      expression: display.value,
      result: formatResult(result)
    })
    
    history.value = display.value
    display.value = formatResult(result)
    waitingForOperand.value = true
  } catch (e) {
    display.value = 'Error'
    setTimeout(() => { display.value = '' }, 1500)
  }
}

const formatResult = (num) => {
  if (!isFinite(num)) return String(num)
  if (Number.isInteger(num)) return String(num)
  return parseFloat(num.toPrecision(12)).toString()
}

// Memory functions
const memoryClear = () => { memory.value = null }
const memoryRecall = () => { if (memory.value !== null) display.value = String(memory.value) }
const memoryAdd = () => { memory.value = (memory.value || 0) + (parseFloat(display.value) || 0) }
const memorySubtract = () => { memory.value = (memory.value || 0) - (parseFloat(display.value) || 0) }
const memoryStore = () => { memory.value = parseFloat(display.value) || 0 }

const useResult = (result) => {
  display.value = result
}

const clearHistory = () => {
  calculations.value = []
}

// Keyboard support
onMounted(() => {
  const handleKeydown = (e) => {
    if (e.key >= '0' && e.key <= '9') append(e.key)
    else if (e.key === '.') appendDecimal()
    else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') append(e.key)
    else if (e.key === 'Enter' || e.key === '=') calculate()
    else if (e.key === 'Backspace') backspace()
    else if (e.key === 'Escape') clear()
    else if (e.key === '(' || e.key === ')') append(e.key)
  }
  
  window.addEventListener('keydown', handleKeydown)
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
})
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(14, 165, 233, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 500px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #22c55e; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 100px; color: #22c55e; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 36px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #22c55e, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 16px; }

.calculator-card { background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 24px; padding: 24px; backdrop-filter: blur(20px); }

.display-section { background: rgba(30, 41, 59, 0.8); border-radius: 16px; padding: 20px; margin-bottom: 16px; }
.history { font-size: 14px; color: #64748b; text-align: right; margin-bottom: 8px; min-height: 20px; }
.display { font-size: 36px; font-weight: 600; font-family: 'Fira Code', monospace; color: #22c55e; text-align: right; word-break: break-all; min-height: 44px; }

.memory-row { display: flex; gap: 8px; margin-bottom: 12px; }
.mem-btn { flex: 1; padding: 10px; font-size: 12px; font-weight: 600; background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(100, 116, 139, 0.2); border-radius: 10px; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
.mem-btn:hover:not(:disabled) { background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.3); color: #22c55e; }
.mem-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.button-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }

.btn { padding: 18px 12px; font-size: 18px; font-weight: 500; border-radius: 12px; cursor: pointer; transition: all 0.15s; border: 1px solid transparent; }
.btn:active { transform: scale(0.95); }

.btn.num { background: rgba(30, 41, 59, 0.8); color: #e2e8f0; border-color: rgba(100, 116, 139, 0.2); }
.btn.num:hover { background: rgba(51, 65, 85, 0.8); }

.btn.op { background: rgba(14, 165, 233, 0.15); color: #0ea5e9; border-color: rgba(14, 165, 233, 0.3); font-size: 22px; }
.btn.op:hover { background: rgba(14, 165, 233, 0.25); }

.btn.sci { background: rgba(139, 92, 246, 0.1); color: #a78bfa; border-color: rgba(139, 92, 246, 0.2); font-size: 14px; }
.btn.sci:hover { background: rgba(139, 92, 246, 0.2); }

.btn.clear { background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.2); }
.btn.clear:hover { background: rgba(239, 68, 68, 0.2); }

.btn.equals { background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; grid-row: span 1; }
.btn.equals:hover { filter: brightness(1.1); }

.calc-history { margin-top: 20px; background: rgba(30, 41, 59, 0.5); border-radius: 14px; padding: 16px; }
.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; color: #94a3b8; font-size: 14px; }
.clear-history { padding: 6px 12px; font-size: 12px; background: transparent; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 6px; color: #f87171; cursor: pointer; }
.clear-history:hover { background: rgba(239, 68, 68, 0.1); }

.history-list { max-height: 150px; overflow-y: auto; }
.history-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(15, 23, 42, 0.5); border-radius: 8px; margin-bottom: 6px; cursor: pointer; transition: all 0.2s; }
.history-item:hover { background: rgba(34, 197, 94, 0.1); }
.calc-expr { font-size: 13px; color: #94a3b8; font-family: 'Fira Code', monospace; }
.calc-result { font-size: 14px; color: #22c55e; font-family: 'Fira Code', monospace; font-weight: 600; }
</style>
