<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>About <span class="gradient-text">QuickHelp</span></h1>
          <p>
            Your go-to destination for free, instant tools that help you work smarter, 
            take care of your mental health, and learn effectively.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="mission section scroll-reveal">
      <div class="container">
        <div class="mission-grid">
          <div class="mission-content">
            <h2>Our Mission</h2>
            <p>
              We believe that helpful tools should be free and accessible to everyone. 
              QuickHelp.lol is built with one goal: to make your life easier, whether 
              you need to convert units, manage stress, or study more effectively.
            </p>
            <p>
              No accounts, no ads, no tracking. Just instant help when you need it.
            </p>
          </div>
          <div class="mission-visual">
            <div class="floating-icons">
              <span class="icon">🚀</span>
              <span class="icon">💜</span>
              <span class="icon">✨</span>
              <span class="icon">🎯</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features section scroll-reveal">
      <div class="container">
        <h2 class="section-title">Why QuickHelp?</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🆓</div>
            <h3>100% Free</h3>
            <p>All tools are completely free to use. No hidden fees, no premium tiers.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Private</h3>
            <p>Your data stays in your browser. We don't track, store, or sell your information.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Instant</h3>
            <p>No sign-ups, no waiting. Just open a tool and start using it immediately.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Works Anywhere</h3>
            <p>Designed to work beautifully on desktop, tablet, and mobile devices.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌙</div>
            <h3>Dark Mode</h3>
            <p>Easy on the eyes with a carefully crafted dark theme.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💾</div>
            <h3>Local Storage</h3>
            <p>Your preferences and saved data persist between visits using local storage.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="stats section scroll-reveal reveal-scale">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">40+</span>
            <span class="stat-label">Free Tools</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">6</span>
            <span class="stat-label">Categories</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">0</span>
            <span class="stat-label">Ads</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">100%</span>
            <span class="stat-label">Private</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack -->
    <section class="tech section scroll-reveal reveal-left">
      <div class="container">
        <h2 class="section-title">Built With Modern Tech</h2>
        
        <div class="tech-grid">
          <div class="tech-item">
            <span class="tech-logo">⚡</span>
            <span class="tech-name">Nuxt 3</span>
          </div>
          <div class="tech-item">
            <span class="tech-logo">💚</span>
            <span class="tech-name">Vue 3</span>
          </div>
          <div class="tech-item">
            <span class="tech-logo">🎨</span>
            <span class="tech-name">CSS3</span>
          </div>
          <div class="tech-item">
            <span class="tech-logo">📦</span>
            <span class="tech-name">VueUse</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta section scroll-reveal reveal-scale">
      <div class="container">
        <div class="cta-card glass">
          <h2>Ready to Get Started?</h2>
          <p>Explore our collection of free tools and start simplifying your life today.</p>
          <div class="cta-buttons">
            <NuxtLink to="/tools" class="btn btn-primary btn-lg">
              Explore Tools
            </NuxtLink>
            <NuxtLink to="/mental-health" class="btn btn-secondary btn-lg">
              Mental Health
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="contact section scroll-reveal">
      <div class="container">
        <h2 class="section-title">Get in Touch</h2>
        <p class="section-subtitle">Have a suggestion or found a bug? We'd love to hear from you.</p>
        
        <div class="contact-options">
          <a href="mailto:hello@quickhelp.lol" class="contact-card">
            <span class="contact-icon">📧</span>
            <h4>Email Us</h4>
            <p>hello@quickhelp.lol</p>
          </a>
          <a href="https://github.com/quickhelp" target="_blank" class="contact-card">
            <span class="contact-icon">🐙</span>
            <h4>GitHub</h4>
            <p>Report issues & contribute</p>
          </a>
          <a href="https://twitter.com/quickhelp" target="_blank" class="contact-card">
            <span class="contact-icon">🐦</span>
            <h4>Twitter</h4>
            <p>Follow for updates</p>
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useScrollReveal } from '~/composables/useScrollReveal'

useScrollReveal()

useHead({
  title: 'About - QuickHelp.lol',
  meta: [
    { name: 'description', content: 'Learn about QuickHelp.lol - free, instant tools for productivity, mental health, and learning.' }
  ]
})
</script>

<style scoped>
.about-page {
  padding-top: 80px;
}

.hero {
  padding: 120px 0 80px;
  text-align: center;
}

.hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Mission */
.mission-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.mission-content h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  margin-bottom: 24px;
}

.mission-content p {
  font-size: 16px;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 16px;
}

.mission-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-icons {
  position: relative;
  width: 200px;
  height: 200px;
}

.floating-icons .icon {
  position: absolute;
  font-size: 48px;
  animation: float 3s ease-in-out infinite;
}

.floating-icons .icon:nth-child(1) { top: 0; left: 50%; animation-delay: 0s; }
.floating-icons .icon:nth-child(2) { top: 50%; right: 0; animation-delay: 0.5s; }
.floating-icons .icon:nth-child(3) { bottom: 0; left: 50%; animation-delay: 1s; }
.floating-icons .icon:nth-child(4) { top: 50%; left: 0; animation-delay: 1.5s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature-card {
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all 0.4s var(--ease-out-expo);
}

.feature-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.1);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.feature-card p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 36px 24px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
}

.stat-value {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
}

/* Tech */
.tech-grid {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 40px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.tech-item:hover {
  border-color: rgba(124, 58, 237, 0.25);
  transform: translateY(-3px);
}

.tech-logo { font-size: 40px; }
.tech-name { font-size: 15px; font-weight: 600; }

/* CTA */
.cta-card {
  max-width: 700px;
  margin: 0 auto;
  padding: 60px;
  text-align: center;
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: var(--radius-xl);
}

.cta-card h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  margin-bottom: 12px;
}

.cta-card p {
  font-size: 16px;
  color: var(--text-muted);
  margin-bottom: 28px;
}

.cta-buttons {
  display: flex;
  gap: 14px;
  justify-content: center;
}

/* Contact */
.contact-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  text-decoration: none;
  transition: all 0.4s var(--ease-out-expo);
}

.contact-card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.1);
}

.contact-icon {
  font-size: 32px;
  margin-bottom: 14px;
}

.contact-card h4 {
  font-size: 16px;
  color: white;
  margin-bottom: 6px;
}

.contact-card p {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .mission-grid { grid-template-columns: 1fr; text-align: center; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .contact-options { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .features-grid { grid-template-columns: 1fr; }
  .cta-buttons { flex-direction: column; }
  .cta-card { padding: 40px 24px; }
}
</style>
