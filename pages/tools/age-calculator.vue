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
        <div class="tool-badge purple">
          <span>📅</span>
          <span>Calculator</span>
        </div>
        <h1 class="page-title">
          <span class="title-gradient">Age Calculator</span>
        </h1>
        <p class="page-subtitle">
          Find out your exact age in years, months, days, and more fun statistics!
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        <div class="tool-card">
          <!-- Date Inputs -->
          <div class="card-section">
            <div class="dates-grid">
              <div class="date-group">
                <label class="date-label">
                  <span class="label-icon">🎂</span>
                  Birth Date
                </label>
                <input
                  v-model="birthDate"
                  type="date"
                  class="date-input"
                  :max="today"
                />
              </div>
              <div class="date-group">
                <label class="date-label">
                  <span class="label-icon">📆</span>
                  Calculate Age On
                </label>
                <input
                  v-model="targetDate"
                  type="date"
                  class="date-input"
                />
              </div>
            </div>

            <button @click="calculateAge" class="calculate-btn">
              <span>🎉</span>
              Calculate My Age
            </button>
          </div>

          <!-- Results -->
          <div v-if="result" class="card-section results">
            <!-- Main Age Display -->
            <div class="age-hero">
              <div class="age-number">{{ result.years }}</div>
              <div class="age-label">Years Old</div>
              <div class="age-cake">🎂</div>
            </div>

            <!-- Breakdown Grid -->
            <div class="breakdown-grid">
              <div class="break-card">
                <div class="break-icon">📅</div>
                <div class="break-value">{{ result.months }}</div>
                <div class="break-label">Months</div>
              </div>
              <div class="break-card">
                <div class="break-icon">☀️</div>
                <div class="break-value">{{ result.days }}</div>
                <div class="break-label">Days</div>
              </div>
              <div class="break-card">
                <div class="break-icon">📆</div>
                <div class="break-value">{{ result.weeks.toLocaleString() }}</div>
                <div class="break-label">Weeks</div>
              </div>
              <div class="break-card">
                <div class="break-icon">⏰</div>
                <div class="break-value">{{ result.hours.toLocaleString() }}</div>
                <div class="break-label">Hours</div>
              </div>
            </div>

            <!-- Fun Facts -->
            <div class="fun-facts">
              <div class="facts-header">
                <span class="facts-icon">🎉</span>
                <h3 class="facts-title">Fun Facts About You</h3>
              </div>
              <div class="facts-grid">
                <div class="fact-item">
                  <span class="fact-emoji">⏱️</span>
                  <p class="fact-text">You've lived approximately <span class="fact-value">{{ result.minutes.toLocaleString() }}</span> minutes</p>
                </div>
                <div class="fact-item">
                  <span class="fact-emoji">💓</span>
                  <p class="fact-text">Your heart has beaten about <span class="fact-value">{{ result.heartbeats.toLocaleString() }}</span> times</p>
                </div>
                <div class="fact-item">
                  <span class="fact-emoji">🌬️</span>
                  <p class="fact-text">You've taken around <span class="fact-value">{{ result.breaths.toLocaleString() }}</span> breaths</p>
                </div>
                <div class="fact-item highlight">
                  <span class="fact-emoji">🎁</span>
                  <p class="fact-text">Next birthday in <span class="fact-value birthday">{{ result.daysUntilBirthday }}</span> days!</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Placeholder -->
          <div v-else class="card-section placeholder">
            <div class="placeholder-icon">🎂</div>
            <p class="placeholder-text">Enter your birth date and click calculate to see your age details!</p>
          </div>
        </div>
      </div>
    </main>
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

.back-link:hover { color: #a78bfa; }

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

.tool-badge.purple {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15));
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
}

.page-title { font-size: 3rem; font-weight: 800; margin-bottom: 16px; }

.title-gradient {
  background: linear-gradient(135deg, #a78bfa, #f472b6, #fb923c);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle { color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto; line-height: 1.6; }

.tool-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(139, 92, 246, 0.15);
  border-radius: 24px;
  overflow: hidden;
}

.card-section { padding: 32px; border-bottom: 1px solid rgba(139, 92, 246, 0.1); }
.card-section:last-child { border-bottom: none; }

/* Date Inputs */
.dates-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }

.date-group { display: flex; flex-direction: column; gap: 10px; }

.date-label {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
}

.label-icon { font-size: 16px; }

.date-input {
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 14px;
  color: white;
  font-size: 16px;
}

.date-input:focus { outline: none; border-color: #a78bfa; }

.calculate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 32px;
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.calculate-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4); }

/* Age Hero */
.age-hero {
  text-align: center;
  padding: 48px 24px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 24px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}

.age-number {
  font-size: 96px;
  font-weight: 900;
  background: linear-gradient(135deg, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 8px;
}

.age-label { color: #94a3b8; font-size: 20px; font-weight: 500; }

.age-cake {
  position: absolute;
  top: 20px;
  right: 24px;
  font-size: 40px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Breakdown Grid */
.breakdown-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }

.break-card {
  padding: 24px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
}

.break-card:hover { border-color: rgba(6, 182, 212, 0.4); transform: translateY(-4px); }

.break-icon { font-size: 24px; margin-bottom: 10px; }
.break-value { color: #22d3ee; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.break-label { color: #64748b; font-size: 13px; }

/* Fun Facts */
.fun-facts {
  padding: 24px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

.facts-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.facts-icon { font-size: 24px; }
.facts-title { color: white; font-size: 18px; font-weight: 600; }

.facts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.fact-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.15);
  border-radius: 14px;
}

.fact-item.highlight { background: rgba(139, 92, 246, 0.1); border-color: rgba(139, 92, 246, 0.3); }

.fact-emoji { font-size: 24px; }
.fact-text { color: #94a3b8; font-size: 14px; line-height: 1.4; }
.fact-value { color: #22d3ee; font-weight: 600; }
.fact-value.birthday { color: #a78bfa; }

/* Placeholder */
.placeholder { text-align: center; padding: 60px 32px !important; }
.placeholder-icon { font-size: 64px; margin-bottom: 20px; }
.placeholder-text { color: #64748b; font-size: 16px; }

@media (max-width: 768px) {
  .page-title { font-size: 2rem; }
  .dates-grid { grid-template-columns: 1fr; }
  .breakdown-grid { grid-template-columns: repeat(2, 1fr); }
  .facts-grid { grid-template-columns: 1fr; }
  .age-number { font-size: 64px; }
}
</style>
