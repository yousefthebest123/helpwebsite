<template>
  <div class="tool-page min-h-screen">
    <div class="cyber-grid"></div>
    <div class="animated-bg"></div>

    <main class="container mx-auto px-6 pt-24 pb-16 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <NuxtLink to="/tools" class="back-link">
          <span>←</span> Back to Tools
        </NuxtLink>
        <div class="tool-badge cyan">
          <span>🔗</span>
          <span>URL Tool</span>
        </div>
        <h1 class="page-title">
          <span class="title-gradient">Link Shortener</span>
        </h1>
        <p class="page-subtitle">
          Create short, memorable links in seconds. Track clicks and manage your URLs.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <!-- Main Card -->
        <div class="tool-card">
          <div class="card-section">
            <form @submit.prevent="shortenUrl" class="shorten-form">
              <div class="input-group">
                <div class="input-icon">🌐</div>
                <input
                  v-model="longUrl"
                  type="url"
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  class="url-input"
                  required
                />
                <button type="submit" class="shorten-btn" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner"></span>
                  <span v-else>✂️</span>
                  {{ isLoading ? 'Shortening...' : 'Shorten' }}
                </button>
              </div>
            </form>

            <!-- Result -->
            <div v-if="shortUrl" class="result-box">
              <div class="result-header">
                <span class="result-icon">✅</span>
                <span class="result-label">Your shortened URL is ready!</span>
              </div>
              <div class="result-content">
                <code class="short-url">{{ shortUrl }}</code>
                <button @click="copyUrl" :class="['copy-btn', { copied }]">
                  {{ copied ? '✓ Copied!' : '📋 Copy' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Links -->
        <div class="recent-card">
          <div class="section-header">
            <div class="section-icon blue">📊</div>
            <h2 class="section-title">Recent Links</h2>
            <span class="link-count">{{ recentLinks.length }} links</span>
          </div>

          <div class="links-list" v-if="recentLinks.length">
            <div v-for="link in recentLinks" :key="link.id" class="link-item">
              <div class="link-icon-box">🔗</div>
              <div class="link-info">
                <p class="link-short">{{ link.short }}</p>
                <p class="link-original">{{ link.original }}</p>
              </div>
              <div class="link-stats">
                <span class="click-count">{{ link.clicks }}</span>
                <span class="click-label">clicks</span>
              </div>
              <button @click="copyToClipboard(link.short)" class="link-copy-btn">
                📋
              </button>
            </div>
          </div>

          <div v-else class="empty-state">
            <span class="empty-icon">🔗</span>
            <p class="empty-text">No links shortened yet</p>
            <p class="empty-hint">Shorten your first link above!</p>
          </div>
        </div>

        <!-- Features -->
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">⚡</span>
            <h3 class="feature-title">Instant</h3>
            <p class="feature-text">Links generated in milliseconds</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">📊</span>
            <h3 class="feature-title">Trackable</h3>
            <p class="feature-text">Monitor your link clicks</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🔒</span>
            <h3 class="feature-title">Secure</h3>
            <p class="feature-text">Stored locally on your device</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const longUrl = ref('')
const shortUrl = ref('')
const isLoading = ref(false)
const copied = ref(false)
const recentLinks = ref<Array<{id: string, short: string, original: string, clicks: number}>>([])

onMounted(() => {
  const saved = localStorage.getItem('shortened_links')
  if (saved) recentLinks.value = JSON.parse(saved)
})

const generateShortCode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const shortenUrl = () => {
  if (!longUrl.value) return
  isLoading.value = true

  setTimeout(() => {
    const code = generateShortCode()
    shortUrl.value = `qh.lol/${code}`
    
    recentLinks.value.unshift({
      id: code,
      short: shortUrl.value,
      original: longUrl.value,
      clicks: 0
    })
    
    if (recentLinks.value.length > 10) recentLinks.value.pop()
    localStorage.setItem('shortened_links', JSON.stringify(recentLinks.value))
    
    isLoading.value = false
    longUrl.value = ''
  }, 500)
}

const copyUrl = () => {
  navigator.clipboard.writeText(shortUrl.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

useHead({ title: 'Link Shortener - QuickHelp.lol' })
</script>

<style scoped>
.tool-page {
  position: relative;
  background: linear-gradient(180deg, #030712 0%, #0a1628 50%, #030712 100%);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
  text-decoration: none;
  margin-bottom: 24px;
  transition: color 0.3s;
}

.back-link:hover { color: #22d3ee; }

.tool-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}

.tool-badge.cyan {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.15));
  border: 1px solid rgba(6, 182, 212, 0.3);
  color: #22d3ee;
}

.page-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; }

.title-gradient {
  background: linear-gradient(135deg, #22d3ee, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle { color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto; line-height: 1.6; }

.tool-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 24px;
}

.card-section { padding: 32px; }

/* Form */
.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 16px;
}

.input-icon { font-size: 24px; padding-left: 12px; }

.url-input {
  flex: 1;
  padding: 16px;
  background: transparent;
  border: none;
  color: white;
  font-size: 15px;
}

.url-input:focus { outline: none; }
.url-input::placeholder { color: #64748b; }

.shorten-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 28px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.shorten-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4); }
.shorten-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

/* Result */
.result-box {
  margin-top: 24px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1));
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 16px;
}

.result-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.result-icon { font-size: 20px; }
.result-label { color: #34d399; font-size: 14px; font-weight: 500; }

.result-content { display: flex; align-items: center; gap: 16px; }

.short-url {
  flex: 1;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  color: #22d3ee;
  font-size: 18px;
  font-family: 'Fira Code', monospace;
}

.copy-btn {
  padding: 14px 24px;
  background: rgba(6, 182, 212, 0.15);
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 12px;
  color: #22d3ee;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover { background: rgba(6, 182, 212, 0.25); }
.copy-btn.copied { background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.4); color: #34d399; }

/* Recent Links */
.recent-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 24px;
}

.section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.section-icon { font-size: 22px; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 14px; }
.section-icon.blue { background: rgba(59, 130, 246, 0.15); }
.section-title { color: white; font-size: 18px; font-weight: 600; flex: 1; }
.link-count { color: #64748b; font-size: 13px; padding: 6px 12px; background: rgba(100, 116, 139, 0.15); border-radius: 8px; }

.links-list { display: flex; flex-direction: column; gap: 12px; }

.link-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: 14px;
  transition: all 0.3s;
}

.link-item:hover { border-color: rgba(6, 182, 212, 0.3); }

.link-icon-box {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 182, 212, 0.15);
  border-radius: 12px;
  font-size: 20px;
}

.link-info { flex: 1; min-width: 0; }
.link-short { color: #22d3ee; font-family: 'Fira Code', monospace; font-size: 14px; margin-bottom: 4px; }
.link-original { color: #64748b; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.link-stats { text-align: center; }
.click-count { display: block; color: white; font-size: 18px; font-weight: 600; }
.click-label { color: #64748b; font-size: 11px; }

.link-copy-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.link-copy-btn:hover { background: rgba(6, 182, 212, 0.2); }

/* Empty State */
.empty-state { text-align: center; padding: 48px 24px; }
.empty-icon { font-size: 48px; display: block; margin-bottom: 16px; opacity: 0.5; }
.empty-text { color: #94a3b8; font-size: 16px; margin-bottom: 8px; }
.empty-hint { color: #64748b; font-size: 14px; }

/* Features */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

.feature-card {
  padding: 24px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover { border-color: rgba(6, 182, 212, 0.3); transform: translateY(-4px); }
.feature-icon { font-size: 28px; display: block; margin-bottom: 12px; }
.feature-title { color: white; font-size: 15px; font-weight: 600; margin-bottom: 6px; }
.feature-text { color: #64748b; font-size: 13px; }

@media (max-width: 768px) {
  .page-title { font-size: 2rem; }
  .input-group { flex-direction: column; padding: 16px; }
  .shorten-btn { width: 100%; justify-content: center; }
  .result-content { flex-direction: column; }
  .short-url { width: 100%; text-align: center; }
  .features-grid { grid-template-columns: 1fr; }
}
</style>
