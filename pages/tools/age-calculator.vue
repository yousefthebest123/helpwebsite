<template>
  <div class="min-h-screen">
    <NavBar />
    <div class="animated-bg"></div>
    
    <main class="container mx-auto px-6 pt-24 pb-16">
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-6">
          <span>📅</span>
          <span>Calculator</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Age Calculator</span>
        </h1>
        <p class="text-slate-400 text-lg">
          Find out your exact age in years, months, days, and more!
        </p>
      </div>

      <div class="max-w-2xl mx-auto">
        <div class="glass-card p-8">
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Birth Date</label>
              <input
                v-model="birthDate"
                type="date"
                class="input"
                :max="today"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Calculate Age On</label>
              <input
                v-model="targetDate"
                type="date"
                class="input"
              />
            </div>
          </div>

          <button @click="calculateAge" class="w-full btn btn-primary btn-lg mb-8">
            Calculate Age 🎂
          </button>

          <div v-if="result" class="space-y-6">
            <!-- Main Age Display -->
            <div class="text-center p-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl border border-purple-500/30">
              <p class="text-6xl font-bold gradient-text mb-2">{{ result.years }}</p>
              <p class="text-slate-400">Years Old</p>
            </div>

            <!-- Detailed Breakdown -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-slate-800/50 rounded-xl">
                <p class="text-2xl font-bold text-cyan-400">{{ result.months }}</p>
                <p class="text-slate-500 text-sm">Months</p>
              </div>
              <div class="text-center p-4 bg-slate-800/50 rounded-xl">
                <p class="text-2xl font-bold text-cyan-400">{{ result.days }}</p>
                <p class="text-slate-500 text-sm">Days</p>
              </div>
              <div class="text-center p-4 bg-slate-800/50 rounded-xl">
                <p class="text-2xl font-bold text-cyan-400">{{ result.weeks }}</p>
                <p class="text-slate-500 text-sm">Weeks</p>
              </div>
              <div class="text-center p-4 bg-slate-800/50 rounded-xl">
                <p class="text-2xl font-bold text-cyan-400">{{ result.hours.toLocaleString() }}</p>
                <p class="text-slate-500 text-sm">Hours</p>
              </div>
            </div>

            <!-- Fun Facts -->
            <div class="p-6 bg-slate-800/30 rounded-xl">
              <h3 class="font-semibold text-white mb-4">Fun Facts 🎉</h3>
              <ul class="space-y-2 text-slate-400">
                <li>• You've lived approximately <span class="text-cyan-400">{{ result.minutes.toLocaleString() }}</span> minutes</li>
                <li>• Your heart has beaten about <span class="text-cyan-400">{{ result.heartbeats.toLocaleString() }}</span> times</li>
                <li>• You've taken around <span class="text-cyan-400">{{ result.breaths.toLocaleString() }}</span> breaths</li>
                <li>• Next birthday in <span class="text-purple-400">{{ result.daysUntilBirthday }}</span> days</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup lang="ts">
const today = new Date().toISOString().split('T')[0]
const birthDate = ref('')
const targetDate = ref(today)
const result = ref<any>(null)

const calculateAge = () => {
  if (!birthDate.value) return

  const birth = new Date(birthDate.value)
  const target = new Date(targetDate.value)
  
  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  let days = target.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0)
    days += lastMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24))
  const totalHours = totalDays * 24
  const totalMinutes = totalHours * 60

  // Next birthday calculation
  const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate())
  if (nextBirthday <= target) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1)
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24))

  result.value = {
    years,
    months,
    days,
    weeks: Math.floor(totalDays / 7),
    hours: totalHours,
    minutes: totalMinutes,
    heartbeats: totalMinutes * 72,
    breaths: totalMinutes * 16,
    daysUntilBirthday
  }
}

useHead({ title: 'Age Calculator - QuickHelp.lol' })
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 20px;
}
</style>
