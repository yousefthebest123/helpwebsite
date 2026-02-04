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
    <section class="mission section">
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
    <section class="features section">
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
    <section class="stats section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-value">35+</span>
            <span class="stat-label">Free Tools</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">4</span>
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
    <section class="tech section">
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
    <section class="cta section">
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
    <section class="contact section">
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
  background: linear-gradient(180deg, rgba(99, 102, 241, 0.1) 0%, transparent 100%);
}

.hero h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: 20px;
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
  font-size: 36px;
  margin-bottom: 24px;
}

.mission-content p {
  font-size: 18px;
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
  gap: 24px;
}

.feature-card {
  padding: 32px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Stats */
.stats {
  background: var(--surface);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.stat-card {
  text-align: center;
  padding: 40px 24px;
}

.stat-value {
  display: block;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 56px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: var(--text-muted);
}

/* Tech */
.tech-grid {
  display: flex;
  justify-content: center;
  gap: 40px;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 40px;
  background: var(--surface);
  border-radius: 16px;
}

.tech-logo {
  font-size: 48px;
}

.tech-name {
  font-size: 16px;
  font-weight: 600;
}

/* CTA */
.cta-card {
  max-width: 700px;
  margin: 0 auto;
  padding: 60px;
  text-align: center;
}

.cta-card h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 36px;
  margin-bottom: 16px;
}

.cta-card p {
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* Contact */
.contact-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.contact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.contact-icon {
  font-size: 36px;
  margin-bottom: 16px;
}

.contact-card h4 {
  font-size: 18px;
  color: white;
  margin-bottom: 8px;
}

.contact-card p {
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 900px) {
  .mission-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .tech-grid {
    flex-wrap: wrap;
  }

  .contact-options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .hero h1 {
    font-size: 36px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .cta-buttons {
    flex-direction: column;
  }
}
</style>
