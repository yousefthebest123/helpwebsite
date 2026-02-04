<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="animated-bg"></div>
    
    <main class="container mx-auto px-6 pt-24 pb-16">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm mb-6">
          <span>💰</span>
          <span>Finance Tool</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Tip Calculator</span>
        </h1>
        <p class="text-slate-400 text-lg">
          Calculate tips and split bills easily with your group.
        </p>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="glass-card p-8">
          <!-- Bill Amount -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-slate-300 mb-2">Bill Amount</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">$</span>
              <input
                v-model.number="billAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="input pl-10 text-2xl font-bold"
              />
            </div>
          </div>

          <!-- Tip Percentage -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-slate-300 mb-3">Tip Percentage</label>
            <div class="grid grid-cols-5 gap-3 mb-4">
              <button
                v-for="percent in [10, 15, 18, 20, 25]"
                :key="percent"
                @click="tipPercent = percent"
                :class="[
                  'py-3 rounded-xl font-semibold transition-all',
                  tipPercent === percent 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30' 
                    : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                ]"
              >
                {{ percent }}%
              </button>
            </div>
            <div class="flex items-center gap-4">
              <input
                v-model.number="tipPercent"
                type="range"
                min="0"
                max="50"
                class="flex-1"
              />
              <span class="text-cyan-400 font-bold w-16 text-right">{{ tipPercent }}%</span>
            </div>
          </div>

          <!-- Number of People -->
          <div class="mb-8">
            <label class="block text-sm font-medium text-slate-300 mb-3">Split Between</label>
            <div class="flex items-center gap-4">
              <button 
                @click="people = Math.max(1, people - 1)"
                class="btn btn-secondary w-12 h-12"
              >
                −
              </button>
              <span class="text-3xl font-bold text-white flex-1 text-center">{{ people }}</span>
              <button 
                @click="people++"
                class="btn btn-secondary w-12 h-12"
              >
                +
              </button>
            </div>
            <p class="text-slate-500 text-sm text-center mt-2">{{ people === 1 ? 'person' : 'people' }}</p>
          </div>

          <!-- Results -->
          <div class="space-y-4 p-6 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl border border-orange-500/30">
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Tip Amount</span>
              <span class="text-2xl font-bold text-orange-400">${{ tipAmount.toFixed(2) }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Total</span>
              <span class="text-2xl font-bold text-white">${{ totalAmount.toFixed(2) }}</span>
            </div>
            <div class="h-px bg-slate-700/50"></div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400">Per Person</span>
              <span class="text-3xl font-bold gradient-text">${{ perPerson.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Quick Summary -->
          <div class="mt-6 p-4 bg-slate-800/30 rounded-xl text-sm text-slate-400 text-center">
            💡 Each person pays <span class="text-white font-semibold">${{ perPerson.toFixed(2) }}</span> 
            (including ${{ (tipAmount / people).toFixed(2) }} tip)
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
const billAmount = ref(0)
const tipPercent = ref(18)
const people = ref(1)

const tipAmount = computed(() => (billAmount.value * tipPercent.value) / 100)
const totalAmount = computed(() => billAmount.value + tipAmount.value)
const perPerson = computed(() => people.value > 0 ? totalAmount.value / people.value : 0)

useHead({ title: 'Tip Calculator - QuickHelp.lol' })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #f97316, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(249, 115, 22, 0.15);
  border-radius: 20px;
}
</style>
