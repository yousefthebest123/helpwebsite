<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="animated-bg"></div>
    
    <main class="container mx-auto px-6 pt-24 pb-16">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-400 text-sm mb-6">
          <span>🎲</span>
          <span>Random Tool</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">UUID Generator</span>
        </h1>
        <p class="text-slate-400 text-lg">
          Generate unique identifiers (UUIDs) for your applications.
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="glass-card p-8">
          <!-- Options -->
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">UUID Version</label>
              <select v-model="version" class="input">
                <option value="4">Version 4 (Random)</option>
                <option value="1">Version 1 (Timestamp)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Format</label>
              <select v-model="format" class="input">
                <option value="lowercase">lowercase</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="no-hyphens">No Hyphens</option>
              </select>
            </div>
          </div>

          <!-- Single UUID -->
          <div class="mb-8">
            <div class="flex items-center gap-4">
              <code class="flex-1 p-4 bg-slate-800 rounded-xl text-cyan-400 font-mono text-lg text-center">
                {{ currentUuid }}
              </code>
              <button @click="copyUuid(currentUuid)" class="btn btn-secondary">
                {{ copied === currentUuid ? '✓' : '📋' }}
              </button>
              <button @click="generateSingle" class="btn btn-primary">
                🔄
              </button>
            </div>
          </div>

          <!-- Bulk Generation -->
          <div class="border-t border-slate-700/50 pt-8">
            <h3 class="text-lg font-semibold text-white mb-4">Bulk Generate</h3>
            <div class="flex items-center gap-4 mb-4">
              <input 
                v-model.number="bulkCount" 
                type="number" 
                min="1" 
                max="100" 
                class="input w-32"
                placeholder="Count"
              />
              <button @click="generateBulk" class="btn btn-primary flex-1">
                Generate {{ bulkCount }} UUIDs
              </button>
            </div>

            <div v-if="bulkUuids.length" class="space-y-3">
              <div class="flex justify-end gap-2">
                <button @click="copyAll" class="btn btn-ghost btn-sm text-cyan-400">
                  {{ copiedAll ? '✓ Copied All' : '📋 Copy All' }}
                </button>
              </div>
              <div class="max-h-[300px] overflow-y-auto space-y-2">
                <div 
                  v-for="(uuid, index) in bulkUuids" 
                  :key="index"
                  class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <span class="text-slate-500 text-xs w-6">{{ index + 1 }}</span>
                  <code class="flex-1 text-cyan-400 font-mono text-sm">{{ uuid }}</code>
                  <button @click="copyUuid(uuid)" class="text-slate-400 hover:text-cyan-400">
                    {{ copied === uuid ? '✓' : '📋' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="mt-8 p-4 bg-teal-500/10 border border-teal-500/30 rounded-xl">
            <div class="flex gap-3">
              <span class="text-teal-400">ℹ️</span>
              <div class="text-sm text-slate-400">
                <p class="mb-1"><strong class="text-white">Version 4:</strong> Random UUID, most commonly used</p>
                <p><strong class="text-white">Version 1:</strong> Based on timestamp and MAC address</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
const version = ref('4')
const format = ref('lowercase')
const currentUuid = ref('')
const bulkCount = ref(10)
const bulkUuids = ref<string[]>([])
const copied = ref('')
const copiedAll = ref(false)

const generateUuidV4 = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const generateUuidV1 = (): string => {
  const now = Date.now()
  const uuid = 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c, i) => {
    const r = ((now + Math.random() * 16) % 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
  return uuid
}

const formatUuid = (uuid: string): string => {
  if (format.value === 'uppercase') return uuid.toUpperCase()
  if (format.value === 'no-hyphens') return uuid.replace(/-/g, '')
  return uuid
}

const generateUuid = (): string => {
  const uuid = version.value === '1' ? generateUuidV1() : generateUuidV4()
  return formatUuid(uuid)
}

const generateSingle = () => {
  currentUuid.value = generateUuid()
}

const generateBulk = () => {
  bulkUuids.value = Array.from({ length: bulkCount.value }, generateUuid)
}

const copyUuid = (uuid: string) => {
  navigator.clipboard.writeText(uuid)
  copied.value = uuid
  setTimeout(() => copied.value = '', 2000)
}

const copyAll = () => {
  navigator.clipboard.writeText(bulkUuids.value.join('\n'))
  copiedAll.value = true
  setTimeout(() => copiedAll.value = false, 2000)
}

// Generate initial UUID
onMounted(generateSingle)

// Regenerate when format or version changes
watch([version, format], generateSingle)

useHead({ title: 'UUID Generator - QuickHelp.lol' })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #14b8a6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(20, 184, 166, 0.15);
  border-radius: 20px;
}
</style>
