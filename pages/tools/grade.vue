<template>
  <div class="tool-page">
    <NavBar />
    <div class="page-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
    </div>

    <main class="tool-container">
      <header class="tool-header">
        <NuxtLink to="/tools" class="back-btn">← Back to Tools</NuxtLink>
        <div class="badge"><span>📚</span> Education Tool</div>
        <h1><span class="gradient-text">Grade Calculator</span></h1>
        <p>Calculate your weighted GPA and track your academic progress.</p>
      </header>

      <div class="tool-card">
        <!-- Quick GPA Calculator -->
        <div class="section">
          <h3>📊 Weighted GPA Calculator</h3>
          <p class="section-desc">Add your courses and grades to calculate your weighted GPA.</p>
          
          <div class="courses-list">
            <div 
              v-for="(course, index) in courses" 
              :key="index"
              class="course-row"
            >
              <input 
                v-model="course.name"
                type="text"
                placeholder="Course name"
                class="course-name"
              />
              <select v-model="course.grade" class="course-grade">
                <option value="">Grade</option>
                <option v-for="g in gradeOptions" :key="g.letter" :value="g.points">
                  {{ g.letter }} ({{ g.points.toFixed(1) }})
                </option>
              </select>
              <input 
                v-model.number="course.credits"
                type="number"
                placeholder="Credits"
                min="0"
                max="10"
                class="course-credits"
              />
              <button @click="removeCourse(index)" class="remove-btn">×</button>
            </div>
          </div>

          <button @click="addCourse" class="add-btn">+ Add Course</button>

          <!-- GPA Result -->
          <div class="gpa-result" v-if="gpa !== null">
            <div class="gpa-card">
              <div class="gpa-label">Your GPA</div>
              <div class="gpa-value" :class="gpaClass">{{ gpa.toFixed(2) }}</div>
              <div class="gpa-scale">out of 4.0</div>
            </div>
            <div class="gpa-stats">
              <div class="stat">
                <span class="stat-label">Total Credits</span>
                <span class="stat-value">{{ totalCredits }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Quality Points</span>
                <span class="stat-value">{{ qualityPoints.toFixed(1) }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Letter Grade</span>
                <span class="stat-value">{{ letterGrade }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <!-- Single Grade Calculator -->
        <div class="section">
          <h3>🎯 Final Grade Calculator</h3>
          <p class="section-desc">Calculate what grade you need on your final to reach your target.</p>

          <div class="final-calc">
            <div class="input-group">
              <label>Current Grade (%)</label>
              <input v-model.number="currentGrade" type="number" min="0" max="100" placeholder="85" />
            </div>
            <div class="input-group">
              <label>Final Worth (%)</label>
              <input v-model.number="finalWorth" type="number" min="0" max="100" placeholder="20" />
            </div>
            <div class="input-group">
              <label>Target Grade (%)</label>
              <input v-model.number="targetGrade" type="number" min="0" max="100" placeholder="90" />
            </div>
          </div>

          <div class="needed-result" v-if="neededGrade !== null">
            <div v-if="neededGrade <= 100" class="needed-box success">
              <span class="needed-label">You need at least</span>
              <span class="needed-value">{{ neededGrade.toFixed(1) }}%</span>
              <span class="needed-desc">on your final to get {{ targetGrade }}%</span>
            </div>
            <div v-else class="needed-box warning">
              <span class="needed-label">Not possible 😔</span>
              <span class="needed-desc">Even with 100% on the final, you'd get {{ maxPossible.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- Grade Scale Reference -->
        <details class="grade-scale">
          <summary>📋 Grade Scale Reference</summary>
          <div class="scale-grid">
            <div v-for="g in gradeOptions" :key="g.letter" class="scale-item">
              <span class="scale-letter">{{ g.letter }}</span>
              <span class="scale-range">{{ g.range }}</span>
              <span class="scale-points">{{ g.points.toFixed(1) }}</span>
            </div>
          </div>
        </details>
      </div>
    </main>

    <FooterSection />
  </div>
</template>

<script setup>
useHead({ title: 'Grade Calculator - QuickHelp.lol' })

const gradeOptions = [
  { letter: 'A+', points: 4.0, range: '97-100' },
  { letter: 'A', points: 4.0, range: '93-96' },
  { letter: 'A-', points: 3.7, range: '90-92' },
  { letter: 'B+', points: 3.3, range: '87-89' },
  { letter: 'B', points: 3.0, range: '83-86' },
  { letter: 'B-', points: 2.7, range: '80-82' },
  { letter: 'C+', points: 2.3, range: '77-79' },
  { letter: 'C', points: 2.0, range: '73-76' },
  { letter: 'C-', points: 1.7, range: '70-72' },
  { letter: 'D+', points: 1.3, range: '67-69' },
  { letter: 'D', points: 1.0, range: '63-66' },
  { letter: 'D-', points: 0.7, range: '60-62' },
  { letter: 'F', points: 0.0, range: '0-59' },
]

const courses = ref([
  { name: '', grade: '', credits: 3 },
  { name: '', grade: '', credits: 3 },
])

const addCourse = () => {
  courses.value.push({ name: '', grade: '', credits: 3 })
}

const removeCourse = (index) => {
  if (courses.value.length > 1) {
    courses.value.splice(index, 1)
  }
}

const totalCredits = computed(() => {
  return courses.value
    .filter(c => c.grade !== '' && c.credits > 0)
    .reduce((sum, c) => sum + c.credits, 0)
})

const qualityPoints = computed(() => {
  return courses.value
    .filter(c => c.grade !== '' && c.credits > 0)
    .reduce((sum, c) => sum + (c.grade * c.credits), 0)
})

const gpa = computed(() => {
  if (totalCredits.value === 0) return null
  return qualityPoints.value / totalCredits.value
})

const gpaClass = computed(() => {
  if (gpa.value === null) return ''
  if (gpa.value >= 3.5) return 'excellent'
  if (gpa.value >= 3.0) return 'good'
  if (gpa.value >= 2.0) return 'average'
  return 'poor'
})

const letterGrade = computed(() => {
  if (gpa.value === null) return '-'
  const grade = gradeOptions.find(g => gpa.value >= g.points)
  return grade ? grade.letter : 'F'
})

// Final grade calculator
const currentGrade = ref(null)
const finalWorth = ref(null)
const targetGrade = ref(null)

const neededGrade = computed(() => {
  if (currentGrade.value === null || finalWorth.value === null || targetGrade.value === null) return null
  if (finalWorth.value === 0) return null
  
  const current = currentGrade.value
  const worth = finalWorth.value / 100
  const target = targetGrade.value
  
  return (target - current * (1 - worth)) / worth
})

const maxPossible = computed(() => {
  if (currentGrade.value === null || finalWorth.value === null) return 0
  const worth = finalWorth.value / 100
  return currentGrade.value * (1 - worth) + 100 * worth
})
</script>

<style scoped>
.tool-page { min-height: 100vh; position: relative; }
.page-bg { position: fixed; inset: 0; z-index: -1; background: #030712; }
.gradient-orb { position: absolute; border-radius: 50%; filter: blur(100px); animation: float 20s ease-in-out infinite; }
.orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(16, 185, 129, 0.3), transparent 70%); top: -100px; right: -100px; }
.orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(59, 130, 246, 0.2), transparent 70%); bottom: -100px; left: -100px; animation-delay: -10s; }
@keyframes float { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(30px, 30px); } }

.tool-container { max-width: 800px; margin: 0 auto; padding: 100px 24px 60px; }
.tool-header { text-align: center; margin-bottom: 40px; }
.back-btn { display: inline-block; color: #94a3b8; text-decoration: none; font-size: 14px; margin-bottom: 20px; }
.back-btn:hover { color: #10b981; }
.badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 100px; color: #10b981; font-size: 13px; margin-bottom: 16px; }
.tool-header h1 { font-size: 42px; font-weight: 700; margin-bottom: 12px; }
.gradient-text { background: linear-gradient(135deg, #10b981, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.tool-header p { color: #64748b; font-size: 18px; }

.tool-card { background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 24px; padding: 32px; backdrop-filter: blur(20px); }

.section { margin-bottom: 32px; }
.section h3 { font-size: 20px; color: white; margin-bottom: 8px; }
.section-desc { color: #64748b; font-size: 14px; margin-bottom: 20px; }

.courses-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }
.course-row { display: grid; grid-template-columns: 1fr 120px 80px 40px; gap: 10px; align-items: center; }
@media (max-width: 600px) { .course-row { grid-template-columns: 1fr 1fr; } }

.course-name, .course-grade, .course-credits { padding: 12px 14px; font-size: 14px; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 10px; color: white; outline: none; }
.course-name:focus, .course-grade:focus, .course-credits:focus { border-color: #10b981; }
.course-grade { cursor: pointer; }
.course-credits { text-align: center; }

.remove-btn { padding: 10px; font-size: 18px; background: transparent; border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: #f87171; cursor: pointer; }
.remove-btn:hover { background: rgba(239, 68, 68, 0.1); }

.add-btn { padding: 12px 20px; font-size: 14px; background: rgba(16, 185, 129, 0.1); border: 1px dashed rgba(16, 185, 129, 0.4); border-radius: 10px; color: #10b981; cursor: pointer; transition: all 0.2s; }
.add-btn:hover { background: rgba(16, 185, 129, 0.2); }

.gpa-result { margin-top: 24px; display: grid; grid-template-columns: 180px 1fr; gap: 20px; align-items: center; }
@media (max-width: 600px) { .gpa-result { grid-template-columns: 1fr; } }

.gpa-card { text-align: center; padding: 24px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15)); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 16px; }
.gpa-label { font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
.gpa-value { font-size: 48px; font-weight: 700; font-family: 'Fira Code', monospace; }
.gpa-value.excellent { color: #10b981; }
.gpa-value.good { color: #3b82f6; }
.gpa-value.average { color: #f59e0b; }
.gpa-value.poor { color: #ef4444; }
.gpa-scale { font-size: 12px; color: #64748b; }

.gpa-stats { display: flex; flex-direction: column; gap: 12px; }
.stat { display: flex; justify-content: space-between; padding: 12px 16px; background: rgba(30, 41, 59, 0.5); border-radius: 10px; }
.stat-label { font-size: 14px; color: #94a3b8; }
.stat-value { font-size: 14px; font-weight: 600; color: white; font-family: 'Fira Code', monospace; }

.divider { height: 1px; background: rgba(100, 116, 139, 0.2); margin: 32px 0; }

.final-calc { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 20px; }
@media (max-width: 600px) { .final-calc { grid-template-columns: 1fr; } }

.input-group label { display: block; font-size: 13px; color: #94a3b8; margin-bottom: 8px; }
.input-group input { width: 100%; padding: 14px 16px; font-size: 16px; font-family: 'Fira Code', monospace; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(100, 116, 139, 0.3); border-radius: 10px; color: white; outline: none; text-align: center; }
.input-group input:focus { border-color: #10b981; }

.needed-result { margin-top: 16px; }
.needed-box { text-align: center; padding: 24px; border-radius: 14px; }
.needed-box.success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); }
.needed-box.warning { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); }
.needed-label { display: block; font-size: 14px; color: #94a3b8; margin-bottom: 8px; }
.needed-value { display: block; font-size: 36px; font-weight: 700; font-family: 'Fira Code', monospace; color: #10b981; margin-bottom: 8px; }
.needed-box.warning .needed-label { color: #f59e0b; }
.needed-desc { font-size: 13px; color: #64748b; }

.grade-scale { margin-top: 24px; background: rgba(30, 41, 59, 0.5); border-radius: 14px; }
.grade-scale summary { padding: 16px 20px; cursor: pointer; color: #e2e8f0; font-weight: 500; }
.scale-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; padding: 0 20px 20px; }
.scale-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(15, 23, 42, 0.5); border-radius: 8px; font-size: 13px; }
.scale-letter { font-weight: 600; color: #10b981; }
.scale-range { color: #64748b; }
.scale-points { font-family: 'Fira Code', monospace; color: #94a3b8; }
</style>
