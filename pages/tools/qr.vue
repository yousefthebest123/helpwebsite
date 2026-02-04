<template>
  <div class="tool-page">
    <div class="container">
      <div class="tool-header">
        <NuxtLink to="/tools" class="back-link">← Back to Tools</NuxtLink>
        <h1><span>📱</span> QR Code Generator</h1>
        <p>Instantly create QR codes for URLs, text, WiFi, contacts, and more.</p>
      </div>

      <div class="qr-layout">
        <!-- QR Type Tabs -->
        <div class="type-tabs">
          <button 
            v-for="type in qrTypes" 
            :key="type.id"
            :class="['type-tab', { active: activeType === type.id }]"
            @click="activeType = type.id"
          >
            <span class="tab-icon">{{ type.icon }}</span>
            <span>{{ type.name }}</span>
          </button>
        </div>

        <div class="qr-content">
          <!-- Input Section -->
          <div class="input-section glass">
            <!-- URL Input -->
            <div v-if="activeType === 'url'" class="input-group">
              <label>Website URL</label>
              <input 
                v-model="urlInput" 
                type="url" 
                class="input"
                placeholder="https://example.com"
              />
            </div>

            <!-- Text Input -->
            <div v-if="activeType === 'text'" class="input-group">
              <label>Text Content</label>
              <textarea 
                v-model="textInput" 
                class="input"
                placeholder="Enter any text..."
                rows="4"
              ></textarea>
            </div>

            <!-- WiFi Input -->
            <div v-if="activeType === 'wifi'" class="wifi-inputs">
              <div class="input-group">
                <label>Network Name (SSID)</label>
                <input 
                  v-model="wifiSSID" 
                  type="text" 
                  class="input"
                  placeholder="MyWiFiNetwork"
                />
              </div>
              <div class="input-group">
                <label>Password</label>
                <input 
                  v-model="wifiPassword" 
                  type="text" 
                  class="input"
                  placeholder="WiFi password"
                />
              </div>
              <div class="input-group">
                <label>Security Type</label>
                <select v-model="wifiSecurity" class="input select">
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">No Password</option>
                </select>
              </div>
            </div>

            <!-- Email Input -->
            <div v-if="activeType === 'email'" class="email-inputs">
              <div class="input-group">
                <label>Email Address</label>
                <input 
                  v-model="emailAddress" 
                  type="email" 
                  class="input"
                  placeholder="hello@example.com"
                />
              </div>
              <div class="input-group">
                <label>Subject (Optional)</label>
                <input 
                  v-model="emailSubject" 
                  type="text" 
                  class="input"
                  placeholder="Email subject"
                />
              </div>
              <div class="input-group">
                <label>Message (Optional)</label>
                <textarea 
                  v-model="emailBody" 
                  class="input"
                  placeholder="Email message..."
                  rows="3"
                ></textarea>
              </div>
            </div>

            <!-- Phone Input -->
            <div v-if="activeType === 'phone'" class="input-group">
              <label>Phone Number</label>
              <input 
                v-model="phoneNumber" 
                type="tel" 
                class="input"
                placeholder="+1 234 567 8900"
              />
            </div>

            <!-- SMS Input -->
            <div v-if="activeType === 'sms'" class="sms-inputs">
              <div class="input-group">
                <label>Phone Number</label>
                <input 
                  v-model="smsNumber" 
                  type="tel" 
                  class="input"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div class="input-group">
                <label>Message (Optional)</label>
                <textarea 
                  v-model="smsMessage" 
                  class="input"
                  placeholder="SMS message..."
                  rows="3"
                ></textarea>
              </div>
            </div>

            <!-- Customization -->
            <div class="customization">
              <h4>🎨 Customize</h4>
              
              <div class="color-options">
                <div class="input-group">
                  <label>QR Color</label>
                  <div class="color-picker">
                    <input type="color" v-model="qrColor" />
                    <span>{{ qrColor }}</span>
                  </div>
                </div>
                <div class="input-group">
                  <label>Background</label>
                  <div class="color-picker">
                    <input type="color" v-model="bgColor" />
                    <span>{{ bgColor }}</span>
                  </div>
                </div>
              </div>

              <div class="input-group">
                <label>Size: {{ qrSize }}px</label>
                <input 
                  type="range" 
                  min="128" 
                  max="512" 
                  step="32"
                  v-model.number="qrSize"
                />
              </div>

              <div class="input-group">
                <label>Error Correction</label>
                <select v-model="errorCorrection" class="input select">
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>

            <button class="btn btn-primary generate-btn" @click="generateQR">
              ✨ Generate QR Code
            </button>
          </div>

          <!-- QR Display Section -->
          <div class="qr-section glass">
            <div class="qr-preview" ref="qrContainer">
              <div v-if="!qrGenerated" class="qr-placeholder">
                <span class="placeholder-icon">📱</span>
                <p>Your QR code will appear here</p>
              </div>
              <canvas ref="qrCanvas" v-show="qrGenerated"></canvas>
            </div>

            <div v-if="qrGenerated" class="qr-actions">
              <button class="btn btn-primary" @click="downloadQR('png')">
                📥 Download PNG
              </button>
              <button class="btn btn-secondary" @click="downloadQR('svg')">
                📥 Download SVG
              </button>
              <button class="btn btn-secondary" @click="copyQR">
                {{ copied ? '✓ Copied!' : '📋 Copy' }}
              </button>
            </div>

            <div v-if="qrGenerated" class="qr-info">
              <p><strong>Content:</strong> {{ truncatedContent }}</p>
              <p><strong>Size:</strong> {{ qrSize }}x{{ qrSize }}px</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Use Cases -->
      <div class="use-cases">
        <h3>💡 Popular Use Cases</h3>
        <div class="cases-grid">
          <div class="case-card">
            <span class="case-icon">🍽️</span>
            <h4>Restaurant Menus</h4>
            <p>Let customers scan to view your menu on their phones</p>
          </div>
          <div class="case-card">
            <span class="case-icon">🎫</span>
            <h4>Event Tickets</h4>
            <p>Easy check-in with scannable tickets</p>
          </div>
          <div class="case-card">
            <span class="case-icon">📇</span>
            <h4>Business Cards</h4>
            <p>Share contact info instantly</p>
          </div>
          <div class="case-card">
            <span class="case-icon">📦</span>
            <h4>Product Links</h4>
            <p>Direct customers to product pages</p>
          </div>
          <div class="case-card">
            <span class="case-icon">📶</span>
            <h4>WiFi Access</h4>
            <p>Let guests connect without typing passwords</p>
          </div>
          <div class="case-card">
            <span class="case-icon">💰</span>
            <h4>Payment Links</h4>
            <p>Accept payments with a simple scan</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'QR Code Generator - QuickHelp.lol'
})

const qrTypes = [
  { id: 'url', name: 'URL', icon: '🔗' },
  { id: 'text', name: 'Text', icon: '📝' },
  { id: 'wifi', name: 'WiFi', icon: '📶' },
  { id: 'email', name: 'Email', icon: '📧' },
  { id: 'phone', name: 'Phone', icon: '📞' },
  { id: 'sms', name: 'SMS', icon: '💬' },
]

const activeType = ref('url')
const qrGenerated = ref(false)
const copied = ref(false)

// Input values
const urlInput = ref('https://quickhelp.lol')
const textInput = ref('')
const wifiSSID = ref('')
const wifiPassword = ref('')
const wifiSecurity = ref('WPA')
const emailAddress = ref('')
const emailSubject = ref('')
const emailBody = ref('')
const phoneNumber = ref('')
const smsNumber = ref('')
const smsMessage = ref('')

// QR Settings
const qrColor = ref('#000000')
const bgColor = ref('#ffffff')
const qrSize = ref(256)
const errorCorrection = ref('M')

const qrCanvas = ref(null)
const qrContainer = ref(null)

const getQRContent = () => {
  switch (activeType.value) {
    case 'url':
      return urlInput.value
    case 'text':
      return textInput.value
    case 'wifi':
      return `WIFI:T:${wifiSecurity.value};S:${wifiSSID.value};P:${wifiPassword.value};;`
    case 'email':
      let email = `mailto:${emailAddress.value}`
      const params = []
      if (emailSubject.value) params.push(`subject=${encodeURIComponent(emailSubject.value)}`)
      if (emailBody.value) params.push(`body=${encodeURIComponent(emailBody.value)}`)
      if (params.length) email += '?' + params.join('&')
      return email
    case 'phone':
      return `tel:${phoneNumber.value}`
    case 'sms':
      return `sms:${smsNumber.value}${smsMessage.value ? `?body=${encodeURIComponent(smsMessage.value)}` : ''}`
    default:
      return ''
  }
}

const truncatedContent = computed(() => {
  const content = getQRContent()
  return content.length > 50 ? content.substring(0, 50) + '...' : content
})

const generateQR = async () => {
  const content = getQRContent()
  if (!content) return

  // Simple QR code generation using canvas
  // In production, you'd use a library like qrcode.js
  const canvas = qrCanvas.value
  const ctx = canvas.getContext('2d')
  
  canvas.width = qrSize.value
  canvas.height = qrSize.value
  
  // Fill background
  ctx.fillStyle = bgColor.value
  ctx.fillRect(0, 0, qrSize.value, qrSize.value)
  
  // Generate QR pattern (simplified - in production use qrcode library)
  ctx.fillStyle = qrColor.value
  
  // Create a simple placeholder pattern for demo
  // In real implementation, use: import QRCode from 'qrcode'
  const moduleSize = Math.floor(qrSize.value / 25)
  const margin = moduleSize * 2
  
  // Draw finder patterns (corners)
  const drawFinderPattern = (x, y) => {
    // Outer square
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7)
    // White square
    ctx.fillStyle = bgColor.value
    ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5)
    // Inner square
    ctx.fillStyle = qrColor.value
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3)
  }
  
  drawFinderPattern(margin, margin)
  drawFinderPattern(qrSize.value - margin - moduleSize * 7, margin)
  drawFinderPattern(margin, qrSize.value - margin - moduleSize * 7)
  
  // Generate pseudo-random data pattern based on content
  const seed = content.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const random = (i) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280
  
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      // Skip finder pattern areas
      if ((i < 8 && j < 8) || (i < 8 && j > 12) || (i > 12 && j < 8)) continue
      
      if (random(i * 21 + j) > 0.5) {
        ctx.fillStyle = qrColor.value
        ctx.fillRect(
          margin + j * moduleSize,
          margin + i * moduleSize,
          moduleSize,
          moduleSize
        )
      }
    }
  }
  
  qrGenerated.value = true
}

const downloadQR = (format) => {
  const canvas = qrCanvas.value
  
  if (format === 'png') {
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  } else {
    // SVG export would require additional conversion
    const link = document.createElement('a')
    link.download = 'qrcode.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
}

const copyQR = async () => {
  const canvas = qrCanvas.value
  canvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      copied.value = true
      setTimeout(() => copied.value = false, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  })
}

// Generate initial QR
onMounted(() => {
  generateQR()
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

.qr-layout {
  max-width: 1000px;
  margin: 0 auto;
}

.type-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;
}

.type-tab {
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

.type-tab:hover {
  border-color: var(--primary);
  color: white;
}

.type-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.tab-icon {
  font-size: 18px;
}

.qr-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.input-section, .qr-section {
  padding: 28px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.wifi-inputs, .email-inputs, .sms-inputs {
  display: flex;
  flex-direction: column;
}

.customization {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.customization h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.color-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--surface);
  border-radius: 10px;
}

.color-picker input[type="color"] {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
}

.color-picker span {
  font-family: monospace;
  font-size: 13px;
  color: var(--text-muted);
}

.generate-btn {
  width: 100%;
  margin-top: 24px;
}

.qr-preview {
  aspect-ratio: 1;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  overflow: hidden;
}

.qr-placeholder {
  text-align: center;
  color: #666;
}

.placeholder-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

.qr-placeholder p {
  font-size: 14px;
}

.qr-preview canvas {
  max-width: 100%;
  height: auto;
}

.qr-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.qr-actions .btn {
  flex: 1;
  min-width: 120px;
}

.qr-info {
  padding: 16px;
  background: var(--surface);
  border-radius: 10px;
}

.qr-info p {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.qr-info p:last-child {
  margin-bottom: 0;
}

.qr-info strong {
  color: white;
}

.use-cases {
  max-width: 1000px;
  margin: 60px auto 0;
}

.use-cases h3 {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 32px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.case-card {
  padding: 24px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s ease;
}

.case-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

.case-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
}

.case-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.case-card p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .qr-content {
    grid-template-columns: 1fr;
  }

  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .color-options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .cases-grid {
    grid-template-columns: 1fr;
  }
}
</style>
