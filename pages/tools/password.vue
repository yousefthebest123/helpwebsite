<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>🔐</span> Password Generator</h1>
        <p>Generate strong, secure passwords and masked emails to protect your accounts.</p>
      </div>

      <div class="generator-layout">
        <!-- Password Generator -->
        <div class="generator-card glass">
          <h3>🔑 Password Generator</h3>
          
          <div class="password-display">
            <input 
              :type="showPassword ? 'text' : 'password'"
              :value="password" 
              class="password-input"
              readonly
            />
            <button class="toggle-visibility" @click="showPassword = !showPassword">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>

          <div class="password-strength">
            <div class="strength-bar">
              <div 
                class="strength-fill"
                :style="{ width: strengthPercent + '%' }"
                :class="strengthClass"
              ></div>
            </div>
            <span :class="['strength-label', strengthClass]">{{ strengthLabel }}</span>
          </div>

          <div class="password-actions">
            <button class="btn btn-primary" @click="generatePassword">
              🔄 Generate New
            </button>
            <button class="btn btn-secondary" @click="copyPassword">
              {{ copiedPassword ? '✓ Copied!' : '📋 Copy' }}
            </button>
          </div>

          <div class="password-options">
            <div class="option-row">
              <label>Length: {{ settings.length }}</label>
              <input 
                type="range" 
                min="8" 
                max="64" 
                v-model.number="settings.length"
                @input="generatePassword"
              />
            </div>
            
            <div class="option-row checkbox-row">
              <label>
                <div 
                  :class="['checkbox', { checked: settings.uppercase }]"
                  @click="settings.uppercase = !settings.uppercase; generatePassword()"
                ></div>
                Uppercase (A-Z)
              </label>
            </div>
            
            <div class="option-row checkbox-row">
              <label>
                <div 
                  :class="['checkbox', { checked: settings.lowercase }]"
                  @click="settings.lowercase = !settings.lowercase; generatePassword()"
                ></div>
                Lowercase (a-z)
              </label>
            </div>
            
            <div class="option-row checkbox-row">
              <label>
                <div 
                  :class="['checkbox', { checked: settings.numbers }]"
                  @click="settings.numbers = !settings.numbers; generatePassword()"
                ></div>
                Numbers (0-9)
              </label>
            </div>
            
            <div class="option-row checkbox-row">
              <label>
                <div 
                  :class="['checkbox', { checked: settings.symbols }]"
                  @click="settings.symbols = !settings.symbols; generatePassword()"
                ></div>
                Symbols (!@#$%...)
              </label>
            </div>
            
            <div class="option-row checkbox-row">
              <label>
                <div 
                  :class="['checkbox', { checked: settings.excludeSimilar }]"
                  @click="settings.excludeSimilar = !settings.excludeSimilar; generatePassword()"
                ></div>
                Exclude similar (i, l, 1, L, o, 0, O)
              </label>
            </div>
          </div>
        </div>

        <!-- Masked Email Generator -->
        <div class="generator-card glass">
          <h3>📧 Masked Email Generator</h3>
          <p class="card-desc">Create unique email aliases to protect your real email address.</p>
          
          <div class="email-display">
            <input 
              :value="maskedEmail" 
              class="email-input"
              readonly
            />
          </div>

          <div class="email-actions">
            <button class="btn btn-primary" @click="generateMaskedEmail">
              🔄 Generate New
            </button>
            <button class="btn btn-secondary" @click="copyEmail">
              {{ copiedEmail ? '✓ Copied!' : '📋 Copy' }}
            </button>
          </div>

          <div class="email-options">
            <div class="option-row">
              <label>Email Domain</label>
              <select v-model="emailDomain" class="input select" @change="generateMaskedEmail">
                <option value="@example.com">@example.com</option>
                <option value="@mailinator.com">@mailinator.com</option>
                <option value="@tempmail.com">@tempmail.com</option>
                <option value="@privacy.net">@privacy.net</option>
              </select>
            </div>
            
            <div class="option-row">
              <label>Prefix Style</label>
              <select v-model="emailStyle" class="input select" @change="generateMaskedEmail">
                <option value="random">Random characters</option>
                <option value="words">Random words</option>
                <option value="uuid">UUID style</option>
              </select>
            </div>
          </div>
        </div>

        <!-- PIN Generator -->
        <div class="generator-card glass">
          <h3>🔢 PIN Generator</h3>
          <p class="card-desc">Generate secure numeric PINs for apps and services.</p>
          
          <div class="pin-display">
            <span v-for="(digit, i) in pin.split('')" :key="i" class="pin-digit">
              {{ digit }}
            </span>
          </div>

          <div class="pin-actions">
            <button class="btn btn-primary" @click="generatePin">
              🔄 Generate New
            </button>
            <button class="btn btn-secondary" @click="copyPin">
              {{ copiedPin ? '✓ Copied!' : '📋 Copy' }}
            </button>
          </div>

          <div class="pin-options">
            <label>PIN Length</label>
            <div class="pin-length-btns">
              <button 
                v-for="len in [4, 6, 8]" 
                :key="len"
                :class="['len-btn', { active: pinLength === len }]"
                @click="pinLength = len; generatePin()"
              >
                {{ len }} digits
              </button>
            </div>
          </div>
        </div>

        <!-- Password History -->
        <div class="history-card glass">
          <h3>📜 Recent Passwords</h3>
          <p class="card-desc">Your recently generated passwords (stored locally).</p>
          
          <div class="history-list">
            <div 
              v-for="(item, i) in passwordHistory" 
              :key="i"
              class="history-item"
            >
              <code class="history-password">{{ item.password }}</code>
              <span class="history-time">{{ formatTime(item.time) }}</span>
              <button class="history-copy" @click="copyHistoryItem(item.password)">
                📋
              </button>
            </div>
            <div v-if="passwordHistory.length === 0" class="no-history">
              No passwords generated yet.
            </div>
          </div>
          
          <button 
            v-if="passwordHistory.length > 0"
            class="btn btn-ghost clear-btn"
            @click="clearHistory"
          >
            🗑️ Clear History
          </button>
        </div>
      </div>

      <!-- Security Tips -->
      <div class="security-tips glass">
        <h3>🛡️ Password Security Tips</h3>
        <div class="tips-grid">
          <div class="tip">
            <span class="tip-icon">✓</span>
            <p>Use a unique password for each account</p>
          </div>
          <div class="tip">
            <span class="tip-icon">✓</span>
            <p>Aim for at least 16 characters</p>
          </div>
          <div class="tip">
            <span class="tip-icon">✓</span>
            <p>Mix uppercase, lowercase, numbers & symbols</p>
          </div>
          <div class="tip">
            <span class="tip-icon">✓</span>
            <p>Use a password manager to store passwords</p>
          </div>
          <div class="tip">
            <span class="tip-icon">✓</span>
            <p>Enable two-factor authentication (2FA)</p>
          </div>
          <div class="tip">
            <span class="tip-icon">✓</span>
            <p>Never share your passwords with others</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Password Generator - QuickHelp.lol'
})

const showPassword = ref(false)
const copiedPassword = ref(false)
const copiedEmail = ref(false)
const copiedPin = ref(false)

const password = ref('')
const maskedEmail = ref('')
const pin = ref('')
const pinLength = ref(6)

const settings = ref({
  length: 16,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeSimilar: false,
})

const emailDomain = ref('@example.com')
const emailStyle = ref('random')

const passwordHistory = ref([])

const charsets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

const similarChars = 'ilI1Lo0O'

const generatePassword = () => {
  let chars = ''
  
  if (settings.value.uppercase) chars += charsets.uppercase
  if (settings.value.lowercase) chars += charsets.lowercase
  if (settings.value.numbers) chars += charsets.numbers
  if (settings.value.symbols) chars += charsets.symbols
  
  if (settings.value.excludeSimilar) {
    chars = chars.split('').filter(c => !similarChars.includes(c)).join('')
  }
  
  if (chars.length === 0) {
    chars = charsets.lowercase
  }
  
  let result = ''
  const array = new Uint32Array(settings.value.length)
  crypto.getRandomValues(array)
  
  for (let i = 0; i < settings.value.length; i++) {
    result += chars[array[i] % chars.length]
  }
  
  password.value = result
  
  // Add to history
  passwordHistory.value.unshift({
    password: result,
    time: Date.now(),
  })
  
  // Keep only last 10
  if (passwordHistory.value.length > 10) {
    passwordHistory.value.pop()
  }
}

const strengthPercent = computed(() => {
  const len = password.value.length
  const hasUpper = /[A-Z]/.test(password.value)
  const hasLower = /[a-z]/.test(password.value)
  const hasNum = /[0-9]/.test(password.value)
  const hasSymbol = /[^A-Za-z0-9]/.test(password.value)
  
  let score = 0
  score += Math.min(len * 4, 40)
  if (hasUpper) score += 15
  if (hasLower) score += 15
  if (hasNum) score += 15
  if (hasSymbol) score += 15
  
  return Math.min(score, 100)
})

const strengthClass = computed(() => {
  const percent = strengthPercent.value
  if (percent < 30) return 'weak'
  if (percent < 60) return 'fair'
  if (percent < 80) return 'good'
  return 'strong'
})

const strengthLabel = computed(() => {
  const percent = strengthPercent.value
  if (percent < 30) return 'Weak'
  if (percent < 60) return 'Fair'
  if (percent < 80) return 'Good'
  return 'Strong'
})

const copyPassword = async () => {
  await navigator.clipboard.writeText(password.value)
  copiedPassword.value = true
  setTimeout(() => copiedPassword.value = false, 2000)
}

const generateMaskedEmail = () => {
  let prefix = ''
  
  if (emailStyle.value === 'random') {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    const array = new Uint32Array(10)
    crypto.getRandomValues(array)
    for (let i = 0; i < 10; i++) {
      prefix += chars[array[i] % chars.length]
    }
  } else if (emailStyle.value === 'words') {
    const words = ['cool', 'fast', 'blue', 'red', 'green', 'sun', 'moon', 'star', 'fire', 'ice', 'wind', 'rain']
    const array = new Uint32Array(2)
    crypto.getRandomValues(array)
    prefix = words[array[0] % words.length] + words[array[1] % words.length] + Math.floor(Math.random() * 100)
  } else {
    prefix = crypto.randomUUID().split('-')[0]
  }
  
  maskedEmail.value = prefix + emailDomain.value
}

const copyEmail = async () => {
  await navigator.clipboard.writeText(maskedEmail.value)
  copiedEmail.value = true
  setTimeout(() => copiedEmail.value = false, 2000)
}

const generatePin = () => {
  const array = new Uint32Array(pinLength.value)
  crypto.getRandomValues(array)
  pin.value = Array.from(array).map(n => n % 10).join('')
}

const copyPin = async () => {
  await navigator.clipboard.writeText(pin.value)
  copiedPin.value = true
  setTimeout(() => copiedPin.value = false, 2000)
}

const copyHistoryItem = async (pwd) => {
  await navigator.clipboard.writeText(pwd)
}

const clearHistory = () => {
  passwordHistory.value = []
}

const formatTime = (timestamp) => {
  const diff = Date.now() - timestamp
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  return Math.floor(diff / 3600000) + 'h ago'
}

// Generate initial values
onMounted(() => {
  generatePassword()
  generateMaskedEmail()
  generatePin()
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

.generator-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  max-width: 1000px;
  margin: 0 auto 40px;
}

.generator-card {
  padding: 28px;
}

.generator-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 20px;
}

.password-display {
  position: relative;
  margin-bottom: 16px;
}

.password-input {
  width: 100%;
  padding: 16px 50px 16px 16px;
  font-family: 'Space Grotesk', monospace;
  font-size: 18px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--primary);
  letter-spacing: 1px;
}

.toggle-visibility {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.7;
}

.toggle-visibility:hover {
  opacity: 1;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: var(--surface-light);
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.fair { background: #f59e0b; }
.strength-fill.good { background: #22c55e; }
.strength-fill.strong { background: #14b8a6; }

.strength-label {
  font-size: 13px;
  font-weight: 500;
}

.strength-label.weak { color: #fca5a5; }
.strength-label.fair { color: #fcd34d; }
.strength-label.good { color: #86efac; }
.strength-label.strong { color: #5eead4; }

.password-actions, .email-actions, .pin-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.password-actions .btn, .email-actions .btn, .pin-actions .btn {
  flex: 1;
}

.password-options, .email-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-row label {
  font-size: 14px;
  color: var(--text-muted);
}

.checkbox-row {
  flex-direction: row;
}

.checkbox-row label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: white;
}

.email-display {
  margin-bottom: 20px;
}

.email-input {
  width: 100%;
  padding: 16px;
  font-family: 'Space Grotesk', monospace;
  font-size: 16px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--accent);
}

.pin-display {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.pin-digit {
  width: 48px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 600;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
}

.pin-options label {
  display: block;
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.pin-length-btns {
  display: flex;
  gap: 8px;
}

.len-btn {
  flex: 1;
  padding: 10px;
  font-size: 13px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.len-btn:hover {
  border-color: var(--primary);
  color: white;
}

.len-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.history-card {
  grid-column: 1 / -1;
  padding: 28px;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--surface);
  border-radius: 10px;
}

.history-password {
  flex: 1;
  font-family: monospace;
  font-size: 14px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 12px;
  color: var(--text-muted);
}

.history-copy {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.7;
}

.history-copy:hover {
  opacity: 1;
}

.no-history {
  text-align: center;
  padding: 24px;
  color: var(--text-muted);
  font-size: 14px;
}

.clear-btn {
  width: 100%;
}

.security-tips {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
}

.security-tips h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.tip {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: var(--surface);
  border-radius: 12px;
}

.tip-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.tip p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .generator-layout {
    grid-template-columns: 1fr;
  }

  .tips-grid {
    grid-template-columns: 1fr;
  }
}
</style>
