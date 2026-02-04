<template>
  <div class="min-h-screen">
    
    <main class="container mx-auto px-6 pt-20 pb-16">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm mb-6">
          <span>🔗</span>
          <span>URL Tool</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Link Shortener</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Create short, memorable links in seconds. Track clicks and manage your URLs.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <!-- Main Card -->
        <div class="glass-card p-8 mb-8">
          <form @submit.prevent="shortenUrl" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Enter your long URL</label>
              <div class="flex gap-4">
                <input
                  v-model="longUrl"
                  type="url"
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  class="input flex-1"
                  required
                />
                <button type="submit" class="btn btn-primary px-8" :disabled="isLoading">
                  {{ isLoading ? '...' : 'Shorten' }}
                </button>
              </div>
            </div>

            <div v-if="shortUrl" class="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
              <p class="text-slate-400 text-sm mb-2">Your shortened URL:</p>
              <div class="flex items-center gap-4">
                <code class="flex-1 bg-slate-800 px-4 py-3 rounded-lg text-cyan-400 text-lg font-mono">
                  {{ shortUrl }}
                </code>
                <button @click="copyUrl" class="btn btn-secondary" :class="{ 'bg-green-500/20 text-green-400': copied }">
                  {{ copied ? '✓ Copied' : '📋 Copy' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Recent Links -->
        <div class="glass-card p-6">
          <h2 class="text-xl font-bold text-white mb-6">Recent Links</h2>
          <div class="space-y-4">
            <div v-for="link in recentLinks" :key="link.id" class="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
              <div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                🔗
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-cyan-400 font-mono text-sm truncate">{{ link.short }}</p>
                <p class="text-slate-500 text-xs truncate">{{ link.original }}</p>
              </div>
              <div class="text-right">
                <p class="text-white font-semibold">{{ link.clicks }}</p>
                <p class="text-slate-500 text-xs">clicks</p>
              </div>
              <button @click="copyToClipboard(link.short)" class="btn btn-ghost btn-sm">📋</button>
            </div>
            <p v-if="!recentLinks.length" class="text-center text-slate-500 py-8">
              No links shortened yet
            </p>
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
.gradient-text {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 20px;
}
</style>
