<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="animated-bg"></div>
    
    <main class="container mx-auto px-6 pt-24 pb-16">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/30 rounded-full text-pink-400 text-sm mb-6">
          <span>🖼️</span>
          <span>Image Tool</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Image to Base64</span>
        </h1>
        <p class="text-slate-400 text-lg">
          Convert images to Base64 encoded strings for embedding in code.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="glass-card p-8">
          <!-- Upload Area -->
          <div 
            @drop.prevent="handleDrop"
            @dragover.prevent="isDragging = true"
            @dragleave="isDragging = false"
            :class="[
              'drop-zone mb-6 transition-all',
              isDragging ? 'border-cyan-500 bg-cyan-500/10' : ''
            ]"
          >
            <input 
              type="file" 
              @change="handleFileSelect" 
              accept="image/*" 
              class="hidden" 
              ref="fileInput"
            />
            <div class="text-center">
              <span class="text-5xl mb-4 block">📤</span>
              <p class="text-white font-medium mb-2">Drop an image here</p>
              <p class="text-slate-500 text-sm mb-4">or</p>
              <button @click="($refs.fileInput as HTMLInputElement).click()" class="btn btn-primary">
                Browse Files
              </button>
              <p class="text-slate-500 text-xs mt-4">Supports PNG, JPG, GIF, SVG, WebP</p>
            </div>
          </div>

          <!-- Preview & Result -->
          <div v-if="base64Output" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Preview -->
              <div class="p-4 bg-slate-800/50 rounded-xl">
                <p class="text-slate-400 text-sm mb-3">Preview</p>
                <img :src="base64Output" :alt="fileName" class="max-w-full h-auto rounded-lg mx-auto" style="max-height: 300px;" />
              </div>

              <!-- Info -->
              <div class="p-4 bg-slate-800/50 rounded-xl">
                <p class="text-slate-400 text-sm mb-3">File Info</p>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-slate-500">Name:</span>
                    <span class="text-white">{{ fileName }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Type:</span>
                    <span class="text-white">{{ fileType }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Original Size:</span>
                    <span class="text-white">{{ formatSize(originalSize) }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-slate-500">Base64 Size:</span>
                    <span class="text-white">{{ formatSize(base64Output.length) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Output -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <p class="text-slate-400 text-sm">Base64 Output</p>
                <div class="flex gap-2">
                  <button @click="copyOutput('dataUri')" class="btn btn-ghost btn-sm text-cyan-400">
                    {{ copiedType === 'dataUri' ? '✓ Copied' : '📋 Data URI' }}
                  </button>
                  <button @click="copyOutput('raw')" class="btn btn-ghost btn-sm text-cyan-400">
                    {{ copiedType === 'raw' ? '✓ Copied' : '📋 Raw Base64' }}
                  </button>
                </div>
              </div>
              <textarea
                :value="base64Output"
                readonly
                class="input font-mono text-xs h-32"
              ></textarea>
            </div>

            <!-- HTML Preview -->
            <div>
              <p class="text-slate-400 text-sm mb-3">HTML Embed Code</p>
              <div class="p-4 bg-slate-800/50 rounded-xl">
                <code class="text-cyan-400 text-xs break-all">
                  &lt;img src="{{ base64Output.substring(0, 50) }}..." alt="{{ fileName }}" /&gt;
                </code>
              </div>
            </div>

            <button @click="reset" class="btn btn-secondary w-full">
              🔄 Convert Another Image
            </button>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const base64Output = ref('')
const fileName = ref('')
const fileType = ref('')
const originalSize = ref(0)
const copiedType = ref('')

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    processFile(target.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  fileName.value = file.name
  fileType.value = file.type
  originalSize.value = file.size

  const reader = new FileReader()
  reader.onload = (e) => {
    base64Output.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

const copyOutput = (type: 'dataUri' | 'raw') => {
  const text = type === 'raw' 
    ? base64Output.value.split(',')[1] 
    : base64Output.value
  navigator.clipboard.writeText(text)
  copiedType.value = type
  setTimeout(() => copiedType.value = '', 2000)
}

const reset = () => {
  base64Output.value = ''
  fileName.value = ''
  fileType.value = ''
  originalSize.value = 0
}

useHead({ title: 'Image to Base64 - QuickHelp.lol' })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(236, 72, 153, 0.15);
  border-radius: 20px;
}
.drop-zone {
  border: 2px dashed rgba(6, 182, 212, 0.3);
  border-radius: 16px;
  padding: 48px;
  cursor: pointer;
}
</style>
