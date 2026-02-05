<template>
  <div class="tool-page min-h-screen">
    <div class="cyber-grid"></div>
    <div class="animated-bg"></div>

    <main class="container mx-auto px-6 pt-32 pb-16 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <NuxtLink to="/tools" class="back-link">
          <span>←</span> Back to Tools
        </NuxtLink>
        <div class="tool-badge blue">
          <span>🔐</span>
          <span>Security Tool</span>
        </div>
        <h1 class="page-title">
          <span class="title-gradient">Hash Generator</span>
        </h1>
        <p class="page-subtitle">
          Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly. Secure and private.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="tool-card">
          <!-- Input Section -->
          <div class="card-section">
            <div class="section-header">
              <div class="section-icon blue">📝</div>
              <div>
                <h3 class="section-title">Input Text</h3>
                <p class="section-desc">Enter or paste the text you want to hash</p>
              </div>
            </div>
            <textarea
              v-model="inputText"
              rows="5"
              placeholder="Type or paste your text here..."
              class="tool-textarea"
            ></textarea>
            <div class="input-stats">
              <span>{{ inputText.length }} characters</span>
              <span>•</span>
              <span>{{ inputText.split(/\s+/).filter(w => w).length }} words</span>
            </div>
          </div>

          <!-- Hash Results -->
          <div class="card-section">
            <div class="section-header">
              <div class="section-icon cyan">🔒</div>
              <div>
                <h3 class="section-title">Hash Results</h3>
                <p class="section-desc">Generated hashes in multiple formats</p>
              </div>
            </div>

            <div class="hash-grid">
              <div v-for="hash in hashes" :key="hash.name" class="hash-item">
                <div class="hash-header">
                  <div class="hash-name">
                    <span class="hash-badge" :class="hash.name.toLowerCase().replace('-', '')">{{ hash.name }}</span>
                    <span class="hash-bits">{{ hash.bits }}-bit</span>
                  </div>
                  <button 
                    @click="copyHash(hash.name, hash.value)"
                    class="copy-btn"
                    :class="{ copied: copiedHash === hash.name }"
                    :disabled="!hash.value"
                  >
                    <span v-if="copiedHash === hash.name">✓ Copied</span>
                    <span v-else>📋 Copy</span>
                  </button>
                </div>
                <div class="hash-value-container">
                  <code class="hash-value" :class="{ empty: !hash.value }">
                    {{ hash.value || 'Enter text above to generate hash...' }}
                  </code>
                </div>
              </div>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-box">
            <div class="info-icon">🛡️</div>
            <div class="info-content">
              <h4 class="info-title">Privacy Guaranteed</h4>
              <p class="info-text">All hashes are computed locally in your browser. Your text never leaves your device.</p>
            </div>
          </div>
        </div>

        <!-- Hash Info Cards -->
        <div class="hash-info-grid">
          <div class="hash-info-card">
            <div class="info-card-icon md5">MD5</div>
            <h4>MD5</h4>
            <p>128-bit hash, fast but not cryptographically secure. Used for checksums.</p>
          </div>
          <div class="hash-info-card">
            <div class="info-card-icon sha1">SHA-1</div>
            <h4>SHA-1</h4>
            <p>160-bit hash, deprecated for security. Still used in Git commits.</p>
          </div>
          <div class="hash-info-card">
            <div class="info-card-icon sha256">SHA-256</div>
            <h4>SHA-256</h4>
            <p>256-bit hash from SHA-2 family. Industry standard for security.</p>
          </div>
          <div class="hash-info-card">
            <div class="info-card-icon sha512">SHA-512</div>
            <h4>SHA-512</h4>
            <p>512-bit hash, highest security. Used in TLS and cryptocurrency.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const inputText = ref('')
const copiedHash = ref('')

const hashValues = reactive({
  md5: '',
  sha1: '',
  sha256: '',
  sha512: ''
})

const generateHash = async (algorithm: string, text: string): Promise<string> => {
  if (!text) return ''
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return 'Error generating hash'
  }
}

const md5 = (str: string): string => {
  if (!str) return ''
  const rotateLeft = (value: number, shift: number) => (value << shift) | (value >>> (32 - shift))
  const addUnsigned = (x: number, y: number) => {
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
  const utf8 = unescape(encodeURIComponent(str))
  const words: number[] = []
  for (let i = 0; i < utf8.length; i += 4) {
    words.push(utf8.charCodeAt(i) | (utf8.charCodeAt(i + 1) << 8) | (utf8.charCodeAt(i + 2) << 16) | (utf8.charCodeAt(i + 3) << 24))
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
      const temp = d; d = c; c = b
      b = addUnsigned(b, rotateLeft(addUnsigned(a, addUnsigned(f, addUnsigned(K[j], words[i + g] || 0))), S[(j >> 4) * 4 + (j % 4)]))
      a = temp
    }
    a = addUnsigned(a, aa); b = addUnsigned(b, bb); c = addUnsigned(c, cc); d = addUnsigned(d, dd)
  }
  return [a, b, c, d].map(n => n.toString(16).padStart(8, '0').match(/../g)!.reverse().join('')).join('')
}

const hashes = computed(() => [
  { name: 'MD5', value: hashValues.md5, bits: 128 },
  { name: 'SHA-1', value: hashValues.sha1, bits: 160 },
  { name: 'SHA-256', value: hashValues.sha256, bits: 256 },
  { name: 'SHA-512', value: hashValues.sha512, bits: 512 }
])

watch(inputText, async (text) => {
  if (text) {
    hashValues.md5 = md5(text)
    hashValues.sha1 = await generateHash('SHA-1', text)
    hashValues.sha256 = await generateHash('SHA-256', text)
    hashValues.sha512 = await generateHash('SHA-512', text)
  } else {
    hashValues.md5 = ''
    hashValues.sha1 = ''
    hashValues.sha256 = ''
    hashValues.sha512 = ''
  }
}, { immediate: true })

const copyHash = (name: string, value: string) => {
  if (!value) return
  navigator.clipboard.writeText(value)
  copiedHash.value = name
  setTimeout(() => copiedHash.value = '', 2000)
}

useHead({ title: 'Hash Generator - QuickHelp.lol' })
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

.back-link:hover {
  color: #a78bfa;
}

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

.tool-badge.blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(124, 58, 237, 0.15));
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 16px;
}

.title-gradient {
  background: linear-gradient(135deg, #7c3aed, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #94a3b8;
  font-size: 18px;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.tool-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.card-section {
  padding: 32px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.card-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.section-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  font-size: 22px;
  flex-shrink: 0;
}

.section-icon.blue {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.section-icon.cyan {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.1));
  border: 1px solid rgba(124, 58, 237, 0.3);
}

.section-title {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.section-desc {
  color: #64748b;
  font-size: 14px;
}

.tool-textarea {
  width: 100%;
  padding: 20px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 16px;
  color: white;
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  outline: none;
  transition: all 0.3s;
}

.tool-textarea:focus {
  border-color: #7c3aed;
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
}

.tool-textarea::placeholder {
  color: #64748b;
}

.input-stats {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  font-size: 13px;
  color: #64748b;
}

.hash-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hash-item {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
}

.hash-item:hover {
  border-color: rgba(124, 58, 237, 0.25);
  background: rgba(15, 23, 42, 0.8);
}

.hash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.hash-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hash-badge {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  font-family: monospace;
}

.hash-badge.md5 {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.hash-badge.sha1 {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.hash-badge.sha256 {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.hash-badge.sha512 {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.hash-bits {
  color: #64748b;
  font-size: 12px;
}

.copy-btn {
  padding: 8px 16px;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 8px;
  color: #a78bfa;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-btn:hover:not(:disabled) {
  background: rgba(124, 58, 237, 0.2);
}

.copy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.copy-btn.copied {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}

.hash-value-container {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 16px;
  overflow-x: auto;
}

.hash-value {
  display: block;
  color: #a78bfa;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  word-break: break-all;
  line-height: 1.5;
}

.hash-value.empty {
  color: #475569;
  font-style: italic;
}

.info-box {
  display: flex;
  gap: 16px;
  margin: 32px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(124, 58, 237, 0.1));
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 16px;
}

.info-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.info-title {
  color: white;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.info-text {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.5;
}

.hash-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 32px;
}

.hash-info-card {
  padding: 24px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
}

.hash-info-card:hover {
  border-color: rgba(124, 58, 237, 0.25);
  transform: translateY(-4px);
}

.info-card-icon {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  font-family: monospace;
  margin-bottom: 12px;
}

.info-card-icon.md5 { background: rgba(239, 68, 68, 0.15); color: #f87171; }
.info-card-icon.sha1 { background: rgba(249, 115, 22, 0.15); color: #fb923c; }
.info-card-icon.sha256 { background: rgba(16, 185, 129, 0.15); color: #34d399; }
.info-card-icon.sha512 { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }

.hash-info-card h4 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.hash-info-card p {
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .page-title { font-size: 2rem; }
  .card-section { padding: 24px; }
  .info-box { margin: 24px; flex-direction: column; text-align: center; }
}
</style>
