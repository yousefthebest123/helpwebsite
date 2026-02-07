<template>
  <div class="emergency-page">
    <!-- Warning Banner -->
    <section class="emergency-hero">
      <div class="container">
        <div class="emergency-badge">
          <span class="pulse-dot"></span>
          Emergency Resources
        </div>
        <h1>You are <span class="highlight-text">not alone</span></h1>
        <p class="hero-subtitle">
          If you or someone you know is in crisis, free and confidential help is available 24/7. 
          You deserve support — please reach out.
        </p>
      </div>
    </section>

    <!-- Immediate Help -->
    <section class="container scroll-reveal">
      <div class="immediate-help glass">
        <div class="ih-header">
          <h2>🆘 Immediate Help Lines</h2>
          <p>Call or text any of these numbers — they're free, confidential, and available around the clock.</p>
        </div>
        <div class="hotlines-grid">
          <div v-for="line in hotlines" :key="line.name" class="hotline-card">
            <div class="hotline-icon">{{ line.icon }}</div>
            <div class="hotline-info">
              <h3>{{ line.name }}</h3>
              <p>{{ line.desc }}</p>
            </div>
            <a :href="line.link" class="hotline-number">
              {{ line.number }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Crisis Types -->
    <section class="section container scroll-reveal">
      <div class="section-header">
        <h2>Resources by <span class="gradient-text">situation</span></h2>
        <p>Find specific help for what you're going through right now.</p>
      </div>

      <div class="crisis-grid">
        <div v-for="crisis in crisisTypes" :key="crisis.title" class="crisis-card glass">
          <div class="crisis-icon">{{ crisis.icon }}</div>
          <h3>{{ crisis.title }}</h3>
          <p>{{ crisis.desc }}</p>
          <div class="crisis-resources">
            <a v-for="r in crisis.resources" :key="r.name" :href="r.url" target="_blank" rel="noopener" class="resource-link">
              {{ r.name }}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Self-Help Grounding -->
    <section class="section container scroll-reveal reveal-scale">
      <div class="grounding-card glass">
        <div class="grounding-content">
          <h2>🌊 5-4-3-2-1 Grounding Exercise</h2>
          <p>If you're feeling overwhelmed right now, try this sensory grounding technique:</p>
          <div class="grounding-steps">
            <div class="step" :class="{ active: groundingStep >= 1 }" @click="groundingStep = 1">
              <span class="step-num">5</span>
              <div>
                <h4>Things you can SEE</h4>
                <p>Look around and name 5 things you can see right now.</p>
              </div>
            </div>
            <div class="step" :class="{ active: groundingStep >= 2 }" @click="groundingStep = 2">
              <span class="step-num">4</span>
              <div>
                <h4>Things you can TOUCH</h4>
                <p>Notice 4 things you can physically feel.</p>
              </div>
            </div>
            <div class="step" :class="{ active: groundingStep >= 3 }" @click="groundingStep = 3">
              <span class="step-num">3</span>
              <div>
                <h4>Things you can HEAR</h4>
                <p>Listen for 3 sounds around you.</p>
              </div>
            </div>
            <div class="step" :class="{ active: groundingStep >= 4 }" @click="groundingStep = 4">
              <span class="step-num">2</span>
              <div>
                <h4>Things you can SMELL</h4>
                <p>Notice 2 things you can smell.</p>
              </div>
            </div>
            <div class="step" :class="{ active: groundingStep >= 5 }" @click="groundingStep = 5">
              <span class="step-num">1</span>
              <div>
                <h4>Thing you can TASTE</h4>
                <p>Focus on 1 thing you can taste.</p>
              </div>
            </div>
          </div>
          <div class="grounding-actions">
            <button class="btn btn-primary" @click="nextGroundingStep">
              {{ groundingStep >= 5 ? 'Start Over' : groundingStep === 0 ? 'Begin Exercise' : 'Next Step' }}
            </button>
            <NuxtLink to="/tools/breathing" class="btn btn-glass">
              Try Breathing Exercise
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Safety Plan -->
    <section class="section container scroll-reveal reveal-left">
      <div class="section-header">
        <h2>📋 Build Your <span class="gradient-text">Safety Plan</span></h2>
        <p>A personal safety plan can help during difficult moments. This stays on your device only.</p>
      </div>

      <div class="safety-plan glass">
        <div class="safety-grid">
          <div class="safety-item">
            <label>Warning signs I notice:</label>
            <textarea v-model="safetyPlan.warnings" class="input" rows="3" placeholder="e.g., Feeling isolated, not sleeping, racing thoughts..."></textarea>
          </div>
          <div class="safety-item">
            <label>Things that help me feel better:</label>
            <textarea v-model="safetyPlan.coping" class="input" rows="3" placeholder="e.g., Walking, listening to music, calling a friend..."></textarea>
          </div>
          <div class="safety-item">
            <label>People I can reach out to:</label>
            <textarea v-model="safetyPlan.contacts" class="input" rows="3" placeholder="e.g., Mom (555-1234), Best friend (555-5678)..."></textarea>
          </div>
          <div class="safety-item">
            <label>Reasons to keep going:</label>
            <textarea v-model="safetyPlan.reasons" class="input" rows="3" placeholder="e.g., My pet, future goals, people who care..."></textarea>
          </div>
        </div>
        <div class="safety-actions">
          <button class="btn btn-primary" @click="saveSafetyPlan">💾 Save Plan (Locally)</button>
          <span class="privacy-note">🔒 Never leaves your device</span>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="section container scroll-reveal reveal-scale">
      <div class="bottom-cta glass">
        <h2>Remember: asking for help is a sign of <span class="gradient-text">strength</span> 💜</h2>
        <p>You matter, and things can get better. Reach out to someone you trust.</p>
        <div class="cta-links">
          <NuxtLink to="/mental-health" class="btn btn-primary btn-lg">Mental Health Tools</NuxtLink>
          <NuxtLink to="/wellness" class="btn btn-glass btn-lg">Wellness Dashboard</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

useHead({ title: 'Emergency Help — QuickHelp.lol' })

const hotlines = [
  { icon: '📞', name: '988 Suicide & Crisis Lifeline', desc: 'Free 24/7 support for anyone in emotional distress', number: 'Call or Text 988', link: 'tel:988' },
  { icon: '💬', name: 'Crisis Text Line', desc: 'Free 24/7 crisis counseling via text', number: 'Text HOME to 741741', link: 'sms:741741' },
  { icon: '🌍', name: 'International Association for Suicide Prevention', desc: 'Find a crisis center in your country', number: 'Visit IASP', link: 'https://www.iasp.info/resources/Crisis_Centres/' },
  { icon: '🧒', name: 'Childhelp National Hotline', desc: 'Help for children and young people', number: 'Call 1-800-422-4453', link: 'tel:18004224453' },
  { icon: '🤝', name: 'SAMHSA National Helpline', desc: 'Substance abuse treatment referrals', number: 'Call 1-800-662-4357', link: 'tel:18006624357' },
]

const crisisTypes = [
  {
    icon: '💔', title: 'Suicidal Thoughts',
    desc: 'If you are thinking about hurting yourself, please reach out immediately.',
    resources: [
      { name: '988 Lifeline', url: 'https://988lifeline.org' },
      { name: 'IMAlive Chat', url: 'https://www.imalive.org' },
    ]
  },
  {
    icon: '😰', title: 'Anxiety & Panic',
    desc: 'Overwhelming anxiety or panic attacks can be managed with help.',
    resources: [
      { name: 'ADAA Resources', url: 'https://adaa.org' },
      { name: 'Calm Harm App', url: 'https://calmharm.co.uk' },
    ]
  },
  {
    icon: '🏠', title: 'Domestic Violence',
    desc: 'If you or someone is experiencing domestic abuse.',
    resources: [
      { name: 'National DV Hotline', url: 'https://www.thehotline.org' },
      { name: 'RAINN', url: 'https://www.rainn.org' },
    ]
  },
  {
    icon: '🍷', title: 'Substance Abuse',
    desc: 'Support for addiction and substance use disorders.',
    resources: [
      { name: 'SAMHSA', url: 'https://www.samhsa.gov' },
      { name: 'NA World Services', url: 'https://na.org' },
    ]
  },
  {
    icon: '🎓', title: 'Student Support',
    desc: 'Resources specifically for students dealing with stress or crises.',
    resources: [
      { name: 'JED Foundation', url: 'https://jedfoundation.org' },
      { name: 'Active Minds', url: 'https://www.activeminds.org' },
    ]
  },
  {
    icon: '👤', title: 'Loneliness & Isolation',
    desc: 'Feeling alone? There are people who want to talk.',
    resources: [
      { name: '7 Cups', url: 'https://www.7cups.com' },
      { name: 'Befrienders', url: 'https://www.befrienders.org' },
    ]
  },
]

// Grounding Exercise
const groundingStep = ref(0)
const nextGroundingStep = () => {
  if (groundingStep.value >= 5) {
    groundingStep.value = 0
  } else {
    groundingStep.value++
  }
}

// Safety Plan
const safetyPlan = ref({
  warnings: '',
  coping: '',
  contacts: '',
  reasons: '',
})

const saveSafetyPlan = () => {
  localStorage.setItem('qh_safety_plan', JSON.stringify(safetyPlan.value))
  alert('Safety plan saved locally. 💜 It\'s only on your device.')
}

onMounted(() => {
  try {
    const saved = localStorage.getItem('qh_safety_plan')
    if (saved) safetyPlan.value = JSON.parse(saved)
  } catch {}
})
</script>

<style scoped>
.emergency-hero {
  padding: 120px 0 60px;
  text-align: center;
}

.emergency-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  margin-bottom: 24px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  animation: emergPulse 2s ease-in-out infinite;
}

@keyframes emergPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
  50% { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
}

.emergency-hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 700;
  margin-bottom: 16px;
}

.highlight-text {
  background: linear-gradient(135deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 17px;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Immediate Help */
.immediate-help {
  padding: 40px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(239, 68, 68, 0.15);
}

.ih-header {
  margin-bottom: 32px;
}

.ih-header h2 { font-size: 22px; font-weight: 700; margin-bottom: 8px; }
.ih-header p { color: var(--text-muted); font-size: 14px; }

.hotlines-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.hotline-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--surface-light);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.hotline-card:hover {
  border-color: rgba(239, 68, 68, 0.3);
  transform: translateY(-2px);
}

.hotline-icon { font-size: 28px; }

.hotline-info { flex: 1; }
.hotline-info h3 { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.hotline-info p { font-size: 12px; color: var(--text-dim); }

.hotline-number {
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.3s ease;
}

.hotline-number:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Section styling */
.section { padding: 80px 0; }

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 700;
  margin-bottom: 10px;
}

.section-header p { color: var(--text-muted); font-size: 15px; }

/* Crisis Grid */
.crisis-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.crisis-card {
  padding: 28px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.crisis-card:hover {
  border-color: rgba(124, 58, 237, 0.25);
  transform: translateY(-4px);
}

.crisis-icon { font-size: 32px; margin-bottom: 14px; }
.crisis-card h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
.crisis-card p { font-size: 13px; color: var(--text-muted); line-height: 1.5; margin-bottom: 16px; }

.crisis-resources { display: flex; flex-direction: column; gap: 8px; }

.resource-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--primary-light);
  text-decoration: none;
  transition: color 0.2s ease;
}
.resource-link:hover { color: white; }

/* Grounding Exercise */
.grounding-card {
  padding: 48px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(124, 58, 237, 0.15);
}

.grounding-content h2 { font-size: 24px; font-weight: 700; margin-bottom: 10px; }
.grounding-content > p { color: var(--text-muted); font-size: 15px; margin-bottom: 32px; }

.grounding-steps { 
  display: flex; 
  flex-direction: column; 
  gap: 14px;
  margin-bottom: 32px; 
}

.step {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  background: var(--surface-light);
  transition: all 0.4s ease;
  cursor: pointer;
  opacity: 0.5;
}

.step.active {
  opacity: 1;
  border-color: rgba(124, 58, 237, 0.3);
  background: rgba(124, 58, 237, 0.06);
}

.step-num {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  min-width: 40px;
  text-align: center;
}

.step h4 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.step p { font-size: 13px; color: var(--text-muted); }

.grounding-actions { display: flex; gap: 12px; }

/* Safety Plan */
.safety-plan {
  padding: 40px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-light);
}

.safety-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

.safety-item label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.safety-item textarea {
  width: 100%;
  resize: vertical;
  min-height: 80px;
}

.safety-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.privacy-note {
  font-size: 12px;
  color: var(--text-dim);
}

/* Bottom CTA */
.bottom-cta {
  text-align: center;
  padding: 60px 40px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(124, 58, 237, 0.15);
}

.bottom-cta h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.bottom-cta p {
  color: var(--text-muted);
  font-size: 15px;
  margin-bottom: 28px;
}

.cta-links { display: flex; gap: 12px; justify-content: center; }

@media (max-width: 768px) {
  .hotlines-grid { grid-template-columns: 1fr; }
  .crisis-grid { grid-template-columns: 1fr; }
  .safety-grid { grid-template-columns: 1fr; }
  .grounding-card { padding: 28px; }
  .hotline-card { flex-direction: column; text-align: center; }
  .cta-links { flex-direction: column; align-items: center; }
}
</style>
