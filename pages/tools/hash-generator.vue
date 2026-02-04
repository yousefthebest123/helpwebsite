<template>
  <div class="min-h-screen">
    
    <main class="container mx-auto px-6 pt-20 pb-16">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
          <span>🔐</span>
          <span>Security Tool</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Hash Generator</span>
        </h1>
        <p class="text-slate-400 text-lg">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="glass-card p-8">
          <!-- Input -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-slate-300 mb-2">Enter text to hash</label>
            <textarea
              v-model="inputText"
              rows="4"
              placeholder="Type or paste your text here..."
              class="input"
            ></textarea>
          </div>

          <!-- Hash Results -->
          <div class="space-y-4">
            <div v-for="hash in hashes" :key="hash.name" class="p-4 bg-slate-800/50 rounded-xl">
              <div class="flex items-center justify-between mb-2">
                <span class="text-slate-400 font-medium">{{ hash.name }}</span>
                <button 
                  @click="copyHash(hash.value)"
                  class="btn btn-ghost btn-sm text-cyan-400"
                >
                  {{ copiedHash === hash.name ? '✓ Copied' : '📋 Copy' }}
                </button>
              </div>
              <code class="block w-full p-3 bg-slate-900/50 rounded-lg text-cyan-400 font-mono text-sm break-all">
                {{ hash.value || '...' }}
              </code>
            </div>
          </div>

          <!-- Info -->
          <div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div class="flex gap-3">
              <span class="text-blue-400">ℹ️</span>
              <div class="text-sm text-slate-400">
                <p class="mb-1">Hashes are computed locally in your browser.</p>
                <p>Your text never leaves your device.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const inputText = ref('')
const copiedHash = ref('')

// Simple hash functions using Web Crypto API
const generateHash = async (algorithm: string, text: string): Promise<string> => {
  if (!text) return ''
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  try {
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return 'Error generating hash'
  }
}

// MD5 implementation (Web Crypto doesn't support MD5)
const md5 = (string: string): string => {
  if (!string) return ''
  
  function rotateLeft(value: number, shift: number) {
    return (value << shift) | (value >>> (32 - shift))
  }

  function addUnsigned(x: number, y: number) {
    const result = (x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)
    if (x & 0x80000000 && y & 0x80000000) return (result ^ 0x80000000 ^ 0x80000000) & 0xFFFFFFFF
    if (x & 0x80000000 || y & 0x80000000) {
      if (result & 0x40000000) return (result ^ 0xC0000000) & 0xFFFFFFFF
      return (result ^ 0x40000000) & 0xFFFFFFFF
    }
    return result & 0xFFFFFFFF
  }

  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21]
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000))

  const utf8 = unescape(encodeURIComponent(string))
  const words: number[] = []
  for (let i = 0; i < utf8.length; i += 4) {
    words.push(
      utf8.charCodeAt(i) |
      (utf8.charCodeAt(i + 1) << 8) |
      (utf8.charCodeAt(i + 2) << 16) |
      (utf8.charCodeAt(i + 3) << 24)
    )
  }
  
  words[utf8.length >> 2] |= 0x80 << ((utf8.length % 4) * 8)
  words[(((utf8.length + 8) >>> 6) << 4) + 14] = utf8.length * 8

  let [a, b, c, d] = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476]

  for (let i = 0; i < words.length; i += 16) {
    let [aa, bb, cc, dd] = [a, b, c, d]
    for (let j = 0; j < 64; j++) {
      let f: number, g: number
      if (j < 16) { f = (b & c) | (~b & d); g = j }
      else if (j < 32) { f = (d & b) | (~d & c); g = (5 * j + 1) % 16 }
      else if (j < 48) { f = b ^ c ^ d; g = (3 * j + 5) % 16 }
      else { f = c ^ (b | ~d); g = (7 * j) % 16 }
      const temp = d
      d = c; c = b
      b = addUnsigned(b, rotateLeft(addUnsigned(a, addUnsigned(f, addUnsigned(K[j], words[i + g] || 0))), S[(j >> 4) * 4 + (j % 4)]))
      a = temp
    }
    a = addUnsigned(a, aa); b = addUnsigned(b, bb); c = addUnsigned(c, cc); d = addUnsigned(d, dd)
  }

  return [a, b, c, d].map(n => 
    n.toString(16).padStart(8, '0').match(/../g)!.reverse().join('')
  ).join('')
}

const hashes = computed(() => [
  { name: 'MD5', value: md5(inputText.value) },
  { name: 'SHA-1', value: '' },
  { name: 'SHA-256', value: '' },
  { name: 'SHA-512', value: '' }
])

// Update SHA hashes when input changes
watch(inputText, async (text) => {
  if (text) {
    hashes.value[1].value = await generateHash('SHA-1', text)
    hashes.value[2].value = await generateHash('SHA-256', text)
    hashes.value[3].value = await generateHash('SHA-512', text)
  } else {
    hashes.value.forEach(h => h.value = '')
  }
}, { immediate: true })

const copyHash = (value: string) => {
  if (!value) return
  navigator.clipboard.writeText(value)
  const hash = hashes.value.find(h => h.value === value)
  if (hash) {
    copiedHash.value = hash.name
    setTimeout(() => copiedHash.value = '', 2000)
  }
}

useHead({ title: 'Hash Generator - QuickHelp.lol' })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 20px;
}
</style>
