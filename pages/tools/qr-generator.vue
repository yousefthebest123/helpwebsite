<template>
  <div class="min-h-screen pt-20 pb-16">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm mb-6">
          <span>📱</span>
          <span>Generator</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">QR Code Generator</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Create customizable QR codes for URLs, text, WiFi, contacts, and more.
        </p>
      </div>

      <div class="max-w-5xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Input Panel -->
          <div class="glass-card p-6">
            <!-- Type Selector -->
            <div class="type-tabs">
              <button 
                v-for="type in qrTypes" 
                :key="type.value"
                @click="qrType = type.value"
                :class="['type-tab', { active: qrType === type.value }]"
              >
                <span class="tab-icon">{{ type.icon }}</span>
                <span>{{ type.label }}</span>
              </button>
            </div>

            <!-- URL Input -->
            <div v-if="qrType === 'url'" class="input-section">
              <label>Website URL</label>
              <input 
                type="url" 
                v-model="urlData"
                placeholder="https://example.com"
                class="input"
              />
            </div>

            <!-- Text Input -->
            <div v-if="qrType === 'text'" class="input-section">
              <label>Text Content</label>
              <textarea 
                v-model="textData"
                placeholder="Enter your text here..."
                class="input textarea"
                rows="4"
              ></textarea>
            </div>

            <!-- WiFi Input -->
            <div v-if="qrType === 'wifi'" class="input-section">
              <label>Network Name (SSID)</label>
              <input 
                type="text" 
                v-model="wifiData.ssid"
                placeholder="MyWiFiNetwork"
                class="input"
              />
              
              <label>Password</label>
              <input 
                type="password" 
                v-model="wifiData.password"
                placeholder="Password"
                class="input"
              />
              
              <label>Encryption</label>
              <div class="radio-group">
                <label v-for="enc in ['WPA', 'WEP', 'nopass']" :key="enc" class="radio-label">
                  <input type="radio" v-model="wifiData.encryption" :value="enc" />
                  <span>{{ enc === 'nopass' ? 'None' : enc }}</span>
                </label>
              </div>
            </div>

            <!-- Email Input -->
            <div v-if="qrType === 'email'" class="input-section">
              <label>Email Address</label>
              <input 
                type="email" 
                v-model="emailData.email"
                placeholder="email@example.com"
                class="input"
              />
              
              <label>Subject (optional)</label>
              <input 
                type="text" 
                v-model="emailData.subject"
                placeholder="Subject line"
                class="input"
              />
              
              <label>Message (optional)</label>
              <textarea 
                v-model="emailData.body"
                placeholder="Email body..."
                class="input textarea"
                rows="3"
              ></textarea>
            </div>

            <!-- Phone Input -->
            <div v-if="qrType === 'phone'" class="input-section">
              <label>Phone Number</label>
              <input 
                type="tel" 
                v-model="phoneData"
                placeholder="+1 234 567 8900"
                class="input"
              />
            </div>

            <!-- SMS Input -->
            <div v-if="qrType === 'sms'" class="input-section">
              <label>Phone Number</label>
              <input 
                type="tel" 
                v-model="smsData.phone"
                placeholder="+1 234 567 8900"
                class="input"
              />
              
              <label>Message (optional)</label>
              <textarea 
                v-model="smsData.message"
                placeholder="SMS message..."
                class="input textarea"
                rows="3"
              ></textarea>
            </div>

            <!-- Customization -->
            <div class="customization-section">
              <h3>Customization</h3>
              
              <div class="custom-grid">
                <div class="custom-item">
                  <label>Foreground Color</label>
                  <div class="color-row">
                    <input type="color" v-model="fgColor" class="color-input" />
                    <input type="text" v-model="fgColor" class="input small" />
                  </div>
                </div>
                
                <div class="custom-item">
                  <label>Background Color</label>
                  <div class="color-row">
                    <input type="color" v-model="bgColor" class="color-input" />
                    <input type="text" v-model="bgColor" class="input small" />
                  </div>
                </div>
                
                <div class="custom-item">
                  <label>Size: {{ size }}px</label>
                  <input type="range" v-model="size" min="128" max="512" step="32" class="slider" />
                </div>
                
                <div class="custom-item">
                  <label>Error Correction</label>
                  <select v-model="errorCorrection" class="input">
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Preview Panel -->
          <div class="glass-card p-6">
            <h3 class="text-white text-lg font-semibold mb-4">Preview</h3>
            
            <div class="qr-preview" :style="{ background: bgColor }">
              <canvas ref="qrCanvas" class="qr-canvas"></canvas>
              <div v-if="!qrContent" class="placeholder">
                Enter content to generate QR code
              </div>
            </div>

            <!-- Actions -->
            <div class="actions">
              <button @click="downloadPNG" class="btn btn-primary" :disabled="!qrContent">
                📥 Download PNG
              </button>
              <button @click="downloadSVG" class="btn btn-secondary" :disabled="!qrContent">
                📥 Download SVG
              </button>
              <button @click="copyToClipboard" class="btn btn-secondary" :disabled="!qrContent">
                📋 Copy Image
              </button>
            </div>

            <!-- QR Info -->
            <div v-if="qrContent" class="qr-info">
              <div class="info-row">
                <span>Type:</span>
                <span>{{ qrTypes.find(t => t.value === qrType)?.label }}</span>
              </div>
              <div class="info-row">
                <span>Size:</span>
                <span>{{ size }}×{{ size }}px</span>
              </div>
              <div class="info-row">
                <span>Data Length:</span>
                <span>{{ qrContent.length }} characters</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Use Cases -->
        <div class="use-cases mt-12">
          <h3 class="text-white text-xl font-semibold text-center mb-8">Common Use Cases</h3>
          <div class="cases-grid">
            <div class="case-card">
              <span class="case-icon">🏪</span>
              <h4>Business Cards</h4>
              <p>Add a QR code to your business card for easy contact sharing</p>
            </div>
            <div class="case-card">
              <span class="case-icon">📦</span>
              <h4>Product Packaging</h4>
              <p>Link to product info, manuals, or warranty registration</p>
            </div>
            <div class="case-card">
              <span class="case-icon">🍽️</span>
              <h4>Restaurant Menus</h4>
              <p>Provide touchless digital menus for customers</p>
            </div>
            <div class="case-card">
              <span class="case-icon">🎫</span>
              <h4>Event Tickets</h4>
              <p>Create scannable tickets for events and conferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

const qrCanvas = ref<HTMLCanvasElement | null>(null)
const showToast = ref(false)
const toastMessage = ref('')

const qrType = ref('url')
const urlData = ref('')
const textData = ref('')
const phoneData = ref('')
const wifiData = reactive({ ssid: '', password: '', encryption: 'WPA' })
const emailData = reactive({ email: '', subject: '', body: '' })
const smsData = reactive({ phone: '', message: '' })

const fgColor = ref('#000000')
const bgColor = ref('#ffffff')
const size = ref(256)
const errorCorrection = ref('M')

const qrTypes = [
  { value: 'url', label: 'URL', icon: '🔗' },
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'phone', label: 'Phone', icon: '📞' },
  { value: 'sms', label: 'SMS', icon: '💬' }
]

const qrContent = computed(() => {
  switch (qrType.value) {
    case 'url':
      return urlData.value
    case 'text':
      return textData.value
    case 'wifi':
      if (!wifiData.ssid) return ''
      return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`
    case 'email':
      if (!emailData.email) return ''
      let mailto = `mailto:${emailData.email}`
      const params = []
      if (emailData.subject) params.push(`subject=${encodeURIComponent(emailData.subject)}`)
      if (emailData.body) params.push(`body=${encodeURIComponent(emailData.body)}`)
      if (params.length) mailto += '?' + params.join('&')
      return mailto
    case 'phone':
      return phoneData.value ? `tel:${phoneData.value}` : ''
    case 'sms':
      if (!smsData.phone) return ''
      let smsUrl = `sms:${smsData.phone}`
      if (smsData.message) smsUrl += `?body=${encodeURIComponent(smsData.message)}`
      return smsUrl
    default:
      return ''
  }
})

// Generate QR code when content changes
watch([qrContent, fgColor, bgColor, size, errorCorrection], async () => {
  if (!qrCanvas.value || !qrContent.value) return
  
  try {
    await QRCode.toCanvas(qrCanvas.value, qrContent.value, {
      width: size.value,
      margin: 2,
      color: {
        dark: fgColor.value,
        light: bgColor.value
      },
      errorCorrectionLevel: errorCorrection.value as 'L' | 'M' | 'Q' | 'H'
    })
  } catch (err) {
    console.error('QR generation error:', err)
  }
}, { immediate: true })

const downloadPNG = () => {
  if (!qrCanvas.value) return
  
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = qrCanvas.value.toDataURL('image/png')
  link.click()
  
  showNotification('PNG downloaded!')
}

const downloadSVG = async () => {
  if (!qrContent.value) return
  
  try {
    const svg = await QRCode.toString(qrContent.value, {
      type: 'svg',
      width: size.value,
      margin: 2,
      color: {
        dark: fgColor.value,
        light: bgColor.value
      },
      errorCorrectionLevel: errorCorrection.value as 'L' | 'M' | 'Q' | 'H'
    })
    
    const blob = new Blob([svg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = 'qrcode.svg'
    link.href = url
    link.click()
    URL.revokeObjectURL(url)
    
    showNotification('SVG downloaded!')
  } catch (err) {
    console.error('SVG generation error:', err)
  }
}

const copyToClipboard = async () => {
  if (!qrCanvas.value) return
  
  try {
    const blob = await new Promise<Blob>((resolve) => {
      qrCanvas.value!.toBlob((blob) => resolve(blob!), 'image/png')
    })
    
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])
    
    showNotification('Image copied to clipboard!')
  } catch (err) {
    console.error('Copy error:', err)
    showNotification('Failed to copy image')
  }
}

const showNotification = (message: string) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => showToast.value = false, 2000)
}

useHead({
  title: 'QR Code Generator - QuickHelp.lol'
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #10b981, #06b6d4, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 24px;
}

.type-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.type-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.type-tab:hover {
  background: rgba(16, 185, 129, 0.1);
}

.type-tab.active {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  color: #34d399;
}

.tab-icon {
  font-size: 20px;
}

.input-section {
  margin-bottom: 24px;
}

.input-section label {
  display: block;
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  margin-top: 16px;
}

.input-section label:first-child {
  margin-top: 0;
}

.input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #10b981;
}

.input.textarea {
  resize: vertical;
  min-height: 80px;
}

.input.small {
  padding: 8px 12px;
  font-size: 13px;
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
}

.radio-label input[type="radio"] {
  accent-color: #10b981;
}

.customization-section {
  padding: 20px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 16px;
}

.customization-section h3 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.custom-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.custom-item label {
  display: block;
  color: #94a3b8;
  font-size: 13px;
  margin-bottom: 8px;
}

.color-row {
  display: flex;
  gap: 10px;
}

.color-input {
  width: 48px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: none;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  appearance: none;
  background: rgba(16, 185, 129, 0.3);
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #10b981;
  border-radius: 50%;
  cursor: pointer;
}

.qr-preview {
  height: 300px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  transition: background 0.3s;
}

.qr-canvas {
  max-width: 100%;
  max-height: 100%;
}

.placeholder {
  color: #64748b;
  font-size: 14px;
  text-align: center;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.btn {
  flex: 1;
  min-width: 120px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: white;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.5);
}

.btn-secondary {
  background: rgba(30, 41, 59, 0.6);
  color: #94a3b8;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.btn-secondary:hover:not(:disabled) {
  background: rgba(30, 41, 59, 0.8);
  color: white;
}

.qr-info {
  padding: 16px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row span:first-child {
  color: #64748b;
  font-size: 13px;
}

.info-row span:last-child {
  color: white;
  font-size: 13px;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.case-card {
  padding: 24px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
}

.case-card:hover {
  border-color: rgba(16, 185, 129, 0.4);
  transform: translateY(-4px);
}

.case-icon {
  font-size: 36px;
  display: block;
  margin-bottom: 12px;
}

.case-card h4 {
  color: white;
  font-size: 16px;
  margin-bottom: 8px;
}

.case-card p {
  color: #94a3b8;
  font-size: 13px;
  line-height: 1.5;
}

.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  background: linear-gradient(135deg, #10b981, #06b6d4);
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

@media (max-width: 1024px) {
  .cases-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .type-tabs {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .custom-grid {
    grid-template-columns: 1fr;
  }
  
  .cases-grid {
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
