<template>
  <div class="min-h-screen">
    
    <main class="container mx-auto px-6 pt-20 pb-16">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-sm mb-6">
          <span>📝</span>
          <span>Writing Tool</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Word Counter</span>
        </h1>
        <p class="text-slate-400 text-lg">
          Count words, characters, sentences, and estimate reading time.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-8">
          <!-- Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div class="text-center p-4 bg-slate-800/50 rounded-xl">
              <p class="text-3xl font-bold text-cyan-400">{{ stats.words }}</p>
              <p class="text-slate-500 text-sm">Words</p>
            </div>
            <div class="text-center p-4 bg-slate-800/50 rounded-xl">
              <p class="text-3xl font-bold text-blue-400">{{ stats.characters }}</p>
              <p class="text-slate-500 text-sm">Characters</p>
            </div>
            <div class="text-center p-4 bg-slate-800/50 rounded-xl">
              <p class="text-3xl font-bold text-purple-400">{{ stats.sentences }}</p>
              <p class="text-slate-500 text-sm">Sentences</p>
            </div>
            <div class="text-center p-4 bg-slate-800/50 rounded-xl">
              <p class="text-3xl font-bold text-green-400">{{ stats.paragraphs }}</p>
              <p class="text-slate-500 text-sm">Paragraphs</p>
            </div>
            <div class="text-center p-4 bg-slate-800/50 rounded-xl">
              <p class="text-3xl font-bold text-orange-400">{{ stats.readingTime }}</p>
              <p class="text-slate-500 text-sm">Min Read</p>
            </div>
          </div>

          <!-- Text Area -->
          <textarea
            v-model="text"
            class="input min-h-[400px] font-mono text-sm"
            placeholder="Start typing or paste your text here..."
          ></textarea>

          <!-- Additional Stats -->
          <div class="mt-6 p-4 bg-slate-800/30 rounded-xl">
            <div class="grid md:grid-cols-3 gap-4 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-slate-400">Characters (no spaces):</span>
                <span class="text-white font-mono">{{ stats.charactersNoSpaces }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-400">Average word length:</span>
                <span class="text-white font-mono">{{ stats.avgWordLength }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-400">Speaking time:</span>
                <span class="text-white font-mono">{{ stats.speakingTime }} min</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-4 mt-6">
            <button @click="copyText" class="btn btn-secondary flex-1">
              📋 Copy Text
            </button>
            <button @click="clearText" class="btn btn-ghost flex-1">
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const text = ref('')

const stats = computed(() => {
  const t = text.value.trim()
  
  const words = t ? t.split(/\s+/).filter(w => w.length > 0).length : 0
  const characters = text.value.length
  const charactersNoSpaces = text.value.replace(/\s/g, '').length
  const sentences = t ? (t.match(/[.!?]+/g) || []).length : 0
  const paragraphs = t ? t.split(/\n\n+/).filter(p => p.trim()).length : 0
  const readingTime = Math.ceil(words / 200)
  const speakingTime = Math.ceil(words / 150)
  const avgWordLength = words ? (charactersNoSpaces / words).toFixed(1) : '0'

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    readingTime,
    speakingTime,
    avgWordLength
  }
})

const copyText = () => {
  navigator.clipboard.writeText(text.value)
}

const clearText = () => {
  text.value = ''
}

useHead({ title: 'Word Counter - QuickHelp.lol' })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.15);
  border-radius: 20px;
}
</style>
