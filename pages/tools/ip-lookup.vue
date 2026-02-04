<template>
  <div class="min-h-screen pt-20 pb-16">
    <div class="container mx-auto px-6">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-sky-500/10 border border-sky-500/30 rounded-full text-sky-400 text-sm mb-6">
          <span>📍</span>
          <span>Utilities</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">IP Address Lookup</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Get detailed information about any IP address including location, ISP, and more.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <!-- My IP Card -->
        <div class="glass-card p-8 mb-8">
          <div class="my-ip-header">
            <h3 class="text-white text-lg font-semibold">Your IP Address</h3>
            <button @click="copyMyIP" class="copy-btn" :disabled="!myIP">
              📋 Copy
            </button>
          </div>
          
          <div v-if="loadingMyIP" class="loading-state">
            <span class="spinner"></span>
            Detecting your IP...
          </div>
          
          <div v-else-if="myIP" class="my-ip-display">
            <span class="ip-value">{{ myIP }}</span>
            <span v-if="myIPInfo?.country" class="ip-location">
              {{ myIPInfo.country_flag }} {{ myIPInfo.city }}, {{ myIPInfo.country }}
            </span>
          </div>
        </div>

        <!-- Lookup Form -->
        <div class="glass-card p-8">
          <h3 class="text-white text-lg font-semibold mb-4">Lookup Any IP</h3>
          
          <div class="search-row">
            <input 
              type="text" 
              v-model="searchIP"
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              class="input"
              @keyup.enter="lookupIP"
            />
            <button @click="lookupIP" class="btn btn-primary" :disabled="!searchIP || loading">
              🔍 Lookup
            </button>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="loading-state mt-8">
            <span class="spinner"></span>
            Looking up IP information...
          </div>

          <!-- Error -->
          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <!-- Results -->
          <div v-if="ipInfo && !loading" class="results-section">
            <div class="result-header">
              <span class="result-ip">{{ ipInfo.ip }}</span>
              <span v-if="ipInfo.country_flag" class="result-flag">{{ ipInfo.country_flag }}</span>
            </div>

            <div class="info-grid">
              <div class="info-card">
                <span class="info-icon">🌍</span>
                <div class="info-content">
                  <span class="info-label">Country</span>
                  <span class="info-value">{{ ipInfo.country || 'Unknown' }}</span>
                </div>
              </div>

              <div class="info-card">
                <span class="info-icon">🏙️</span>
                <div class="info-content">
                  <span class="info-label">City</span>
                  <span class="info-value">{{ ipInfo.city || 'Unknown' }}</span>
                </div>
              </div>

              <div class="info-card">
                <span class="info-icon">📍</span>
                <div class="info-content">
                  <span class="info-label">Region</span>
                  <span class="info-value">{{ ipInfo.region || 'Unknown' }}</span>
                </div>
              </div>

              <div class="info-card">
                <span class="info-icon">📮</span>
                <div class="info-content">
                  <span class="info-label">Postal Code</span>
                  <span class="info-value">{{ ipInfo.postal || 'Unknown' }}</span>
                </div>
              </div>

              <div class="info-card">
                <span class="info-icon">📡</span>
                <div class="info-content">
                  <span class="info-label">ISP / Organization</span>
                  <span class="info-value">{{ ipInfo.org || 'Unknown' }}</span>
                </div>
              </div>

              <div class="info-card">
                <span class="info-icon">🕐</span>
                <div class="info-content">
                  <span class="info-label">Timezone</span>
                  <span class="info-value">{{ ipInfo.timezone || 'Unknown' }}</span>
                </div>
              </div>

              <div class="info-card">
                <span class="info-icon">🧭</span>
                <div class="info-content">
                  <span class="info-label">Coordinates</span>
                  <span class="info-value">{{ ipInfo.loc || 'Unknown' }}</span>
                </div>
              </div>

              <div class="info-card">
                <span class="info-icon">🔗</span>
                <div class="info-content">
                  <span class="info-label">Hostname</span>
                  <span class="info-value">{{ ipInfo.hostname || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <!-- Map Preview -->
            <div v-if="ipInfo.loc" class="map-section">
              <h4>Location on Map</h4>
              <a 
                :href="`https://www.google.com/maps?q=${ipInfo.loc}`" 
                target="_blank"
                class="map-link"
              >
                🗺️ View on Google Maps
              </a>
            </div>

            <!-- Raw JSON -->
            <details class="raw-json">
              <summary>View Raw JSON</summary>
              <pre>{{ JSON.stringify(ipInfo, null, 2) }}</pre>
            </details>
          </div>
        </div>

        <!-- Quick IPs -->
        <div class="quick-section mt-8">
          <h4>Popular DNS Servers</h4>
          <div class="quick-ips">
            <button @click="searchIP = '8.8.8.8'; lookupIP()" class="quick-ip">
              <span>8.8.8.8</span>
              <span class="quick-label">Google DNS</span>
            </button>
            <button @click="searchIP = '1.1.1.1'; lookupIP()" class="quick-ip">
              <span>1.1.1.1</span>
              <span class="quick-label">Cloudflare</span>
            </button>
            <button @click="searchIP = '208.67.222.222'; lookupIP()" class="quick-ip">
              <span>208.67.222.222</span>
              <span class="quick-label">OpenDNS</span>
            </button>
            <button @click="searchIP = '9.9.9.9'; lookupIP()" class="quick-ip">
              <span>9.9.9.9</span>
              <span class="quick-label">Quad9</span>
            </button>
          </div>
        </div>

        <!-- Info Cards -->
        <div class="info-cards-grid mt-12">
          <div class="feature-card">
            <span class="feature-icon">🔒</span>
            <h4>Privacy First</h4>
            <p>We don't log or store any IP lookups you perform</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">⚡</span>
            <h4>Real-time Data</h4>
            <p>Get up-to-date geolocation information instantly</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🌐</span>
            <h4>IPv4 & IPv6</h4>
            <p>Support for both IPv4 and IPv6 address formats</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script setup lang="ts">
interface IPInfo {
  ip: string
  city?: string
  region?: string
  country?: string
  country_flag?: string
  loc?: string
  org?: string
  postal?: string
  timezone?: string
  hostname?: string
}

const myIP = ref('')
const myIPInfo = ref<IPInfo | null>(null)
const loadingMyIP = ref(true)

const searchIP = ref('')
const ipInfo = ref<IPInfo | null>(null)
const loading = ref(false)
const error = ref('')

const showToast = ref(false)
const toastMessage = ref('')

// Get user's IP on load
onMounted(async () => {
  try {
    const res = await fetch('https://ipinfo.io/json')
    const data = await res.json()
    myIP.value = data.ip
    myIPInfo.value = {
      ...data,
      country_flag: getFlag(data.country)
    }
  } catch (err) {
    console.error('Failed to get IP:', err)
  } finally {
    loadingMyIP.value = false
  }
})

const lookupIP = async () => {
  if (!searchIP.value) return
  
  // Validate IP format
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$/
  
  if (!ipv4Regex.test(searchIP.value) && !ipv6Regex.test(searchIP.value)) {
    error.value = 'Please enter a valid IP address'
    return
  }
  
  loading.value = true
  error.value = ''
  ipInfo.value = null
  
  try {
    const res = await fetch(`https://ipinfo.io/${searchIP.value}/json`)
    const data = await res.json()
    
    if (data.error) {
      error.value = data.error.message || 'Failed to lookup IP'
      return
    }
    
    ipInfo.value = {
      ...data,
      country_flag: getFlag(data.country)
    }
  } catch (err) {
    error.value = 'Failed to lookup IP. Please try again.'
    console.error('IP lookup error:', err)
  } finally {
    loading.value = false
  }
}

const getFlag = (countryCode: string) => {
  if (!countryCode) return ''
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const copyMyIP = async () => {
  try {
    await navigator.clipboard.writeText(myIP.value)
    toastMessage.value = 'IP copied to clipboard!'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}

useHead({
  title: 'IP Address Lookup - QuickHelp.lol'
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #0ea5e9, #06b6d4, #14b8a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 24px;
}

.my-ip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.copy-btn {
  padding: 8px 16px;
  background: rgba(14, 165, 233, 0.2);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 10px;
  color: #38bdf8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover:not(:disabled) {
  background: rgba(14, 165, 233, 0.3);
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 15px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(14, 165, 233, 0.3);
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.my-ip-display {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ip-value {
  color: #38bdf8;
  font-size: 32px;
  font-weight: 700;
  font-family: monospace;
}

.ip-location {
  color: #94a3b8;
  font-size: 16px;
}

.search-row {
  display: flex;
  gap: 12px;
}

.input {
  flex: 1;
  padding: 14px 18px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 14px;
  color: white;
  font-size: 16px;
  font-family: monospace;
  outline: none;
}

.input:focus {
  border-color: #0ea5e9;
}

.btn {
  padding: 14px 28px;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  color: white;
  box-shadow: 0 4px 20px rgba(14, 165, 233, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.5);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  margin-top: 16px;
  padding: 14px 18px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #f87171;
  font-size: 14px;
}

.results-section {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(14, 165, 233, 0.1);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.result-ip {
  color: #38bdf8;
  font-size: 28px;
  font-weight: 700;
  font-family: monospace;
}

.result-flag {
  font-size: 32px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 18px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(14, 165, 233, 0.1);
  border-radius: 14px;
}

.info-icon {
  font-size: 24px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.info-label {
  color: #64748b;
  font-size: 12px;
}

.info-value {
  color: white;
  font-size: 14px;
  font-weight: 500;
  word-break: break-all;
}

.map-section {
  margin-top: 24px;
  padding: 20px;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 14px;
}

.map-section h4 {
  color: white;
  font-size: 14px;
  margin-bottom: 12px;
}

.map-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(14, 165, 233, 0.2);
  border-radius: 10px;
  color: #38bdf8;
  text-decoration: none;
  font-size: 14px;
  transition: background 0.2s;
}

.map-link:hover {
  background: rgba(14, 165, 233, 0.3);
}

.raw-json {
  margin-top: 24px;
  padding: 16px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.raw-json summary {
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
}

.raw-json pre {
  margin-top: 16px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 10px;
  color: #38bdf8;
  font-size: 12px;
  overflow-x: auto;
}

.quick-section {
  text-align: center;
}

.quick-section h4 {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 16px;
}

.quick-ips {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.quick-ip {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 20px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-ip:hover {
  border-color: #0ea5e9;
  background: rgba(14, 165, 233, 0.1);
}

.quick-ip span:first-child {
  color: white;
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
}

.quick-label {
  color: #64748b;
  font-size: 11px;
}

.info-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature-card {
  padding: 24px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(14, 165, 233, 0.15);
  border-radius: 16px;
  text-align: center;
}

.feature-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.feature-card h4 {
  color: white;
  font-size: 16px;
  margin-bottom: 8px;
}

.feature-card p {
  color: #94a3b8;
  font-size: 13px;
}

.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 28px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
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
  .search-row {
    flex-direction: column;
  }
  
  .info-cards-grid {
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
