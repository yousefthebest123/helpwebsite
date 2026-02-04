<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="animated-bg"></div>
    
    <main class="container mx-auto px-6 pt-24 pb-16">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-sm mb-6">
          <span>📝</span>
          <span>Text Tool</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Lorem Ipsum Generator</span>
        </h1>
        <p class="text-slate-400 text-lg">
          Generate placeholder text for your designs and mockups.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-8">
          <!-- Options -->
          <div class="grid md:grid-cols-3 gap-6 mb-8">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select v-model="type" class="input">
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Amount</label>
              <input v-model.number="amount" type="number" min="1" max="100" class="input" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Format</label>
              <select v-model="format" class="input">
                <option value="plain">Plain Text</option>
                <option value="html">HTML Tags</option>
              </select>
            </div>
          </div>

          <button @click="generate" class="w-full btn btn-primary btn-lg mb-8">
            Generate Lorem Ipsum 📝
          </button>

          <!-- Output -->
          <div v-if="output" class="space-y-4">
            <div class="flex items-center justify-between">
              <p class="text-slate-400">Generated Text</p>
              <button @click="copyText" class="btn btn-ghost btn-sm text-cyan-400">
                {{ copied ? '✓ Copied' : '📋 Copy' }}
              </button>
            </div>
            <div class="p-6 bg-slate-800/50 rounded-xl max-h-[400px] overflow-y-auto">
              <div v-if="format === 'html'" class="space-y-4 text-slate-300 leading-relaxed" v-html="output"></div>
              <p v-else class="text-slate-300 leading-relaxed whitespace-pre-wrap">{{ output }}</p>
            </div>
            
            <div class="flex items-center gap-4 text-sm text-slate-500">
              <span>{{ wordCount }} words</span>
              <span>•</span>
              <span>{{ charCount }} characters</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
const type = ref<'paragraphs' | 'sentences' | 'words'>('paragraphs')
const amount = ref(3)
const format = ref<'plain' | 'html'>('plain')
const output = ref('')
const copied = ref(false)

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'perspiciatis', 'unde', 
  'omnis', 'iste', 'natus', 'error', 'voluptatem', 'accusantium', 'doloremque', 
  'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 
  'inventore', 'veritatis', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta'
]

const getRandomWord = () => loremWords[Math.floor(Math.random() * loremWords.length)]

const generateSentence = (wordCount: number = 0) => {
  const count = wordCount || Math.floor(Math.random() * 10) + 5
  const words = Array.from({ length: count }, getRandomWord)
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
  return words.join(' ') + '.'
}

const generateParagraph = () => {
  const sentenceCount = Math.floor(Math.random() * 4) + 4
  return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ')
}

const generate = () => {
  let result: string[] = []

  if (type.value === 'words') {
    result = [Array.from({ length: amount.value }, getRandomWord).join(' ')]
  } else if (type.value === 'sentences') {
    result = Array.from({ length: amount.value }, () => generateSentence())
  } else {
    result = Array.from({ length: amount.value }, generateParagraph)
  }

  if (format.value === 'html') {
    output.value = result.map(p => `<p>${p}</p>`).join('\n')
  } else {
    output.value = result.join('\n\n')
  }
}

const wordCount = computed(() => output.value.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w).length)
const charCount = computed(() => output.value.replace(/<[^>]*>/g, '').length)

const copyText = () => {
  navigator.clipboard.writeText(output.value)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}

// Generate initial text
onMounted(generate)

useHead({ title: 'Lorem Ipsum Generator - QuickHelp.lol' })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 20px;
}
</style>
