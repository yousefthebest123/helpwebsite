<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge animate-fade-in">
            <span class="badge-dot"></span>
            <span>Your all-in-one help hub</span>
          </div>
          <h1 class="hero-title animate-fade-in-up">
            Get <span class="gradient-text">Quick Help</span><br>
            With Anything
          </h1>
          <p class="hero-subtitle animate-fade-in-up" style="animation-delay: 0.1s">
            From mental health support to productivity tools, math homework to creative projects — 
            we've got everything you need in one beautiful place. No sign-ups, no ads, just help.
          </p>
          <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.2s">
            <NuxtLink to="/tools" class="btn btn-primary btn-lg">
              <span>Explore All Tools</span>
              <span class="btn-arrow">→</span>
            </NuxtLink>
            <NuxtLink to="/mental-health" class="btn btn-secondary btn-lg">
              <span>💜</span>
              <span>Mental Health Support</span>
            </NuxtLink>
          </div>
          <div class="hero-stats animate-fade-in-up" style="animation-delay: 0.3s">
            <div class="stat">
              <span class="stat-value">50+</span>
              <span class="stat-label">Free Tools</span>
            </div>
            <div class="stat">
              <span class="stat-value">24/7</span>
              <span class="stat-label">Available</span>
            </div>
            <div class="stat">
              <span class="stat-value">0</span>
              <span class="stat-label">Ads</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="hero-cards stagger">
            <div class="floating-card card-1">
              <span class="card-icon">🧮</span>
              <span>Calculator</span>
            </div>
            <div class="floating-card card-2">
              <span class="card-icon">⏱️</span>
              <span>Focus Timer</span>
            </div>
            <div class="floating-card card-3">
              <span class="card-icon">🔐</span>
              <span>Password Gen</span>
            </div>
            <div class="floating-card card-4">
              <span class="card-icon">💜</span>
              <span>Mental Health</span>
            </div>
            <div class="floating-card card-5">
              <span class="card-icon">📄</span>
              <span>PDF Tools</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Access Tools -->
    <section class="quick-tools section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">⚡ Quick Access</span>
          <h2 class="section-title">Most Popular Tools</h2>
          <p class="section-subtitle">
            Jump straight into our most-used tools. No accounts, no waiting.
          </p>
        </div>
        
        <div class="quick-grid">
          <NuxtLink to="/tools/converter" class="quick-card">
            <div class="quick-icon purple">🔄</div>
            <div class="quick-info">
              <h3>Unit Converter</h3>
              <p>Convert anything instantly</p>
            </div>
            <span class="quick-arrow">→</span>
          </NuxtLink>
          <NuxtLink to="/tools/timer" class="quick-card">
            <div class="quick-icon pink">⏱️</div>
            <div class="quick-info">
              <h3>Focus Timer</h3>
              <p>Pomodoro with ambient sounds</p>
            </div>
            <span class="quick-arrow">→</span>
          </NuxtLink>
          <NuxtLink to="/tools/password" class="quick-card">
            <div class="quick-icon teal">🔐</div>
            <div class="quick-info">
              <h3>Password Generator</h3>
              <p>Create secure passwords</p>
            </div>
            <span class="quick-arrow">→</span>
          </NuxtLink>
          <NuxtLink to="/tools/qr" class="quick-card">
            <div class="quick-icon orange">📱</div>
            <div class="quick-info">
              <h3>QR Code Maker</h3>
              <p>Generate QR codes instantly</p>
            </div>
            <span class="quick-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Daily Workflow Section -->
    <section class="tools-section section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">📊 Daily Workflow</span>
          <h2 class="section-title">Everyday Essentials</h2>
          <p class="section-subtitle">
            Quick-fix tools you'll use every single day. Save time on repetitive tasks.
          </p>
        </div>
        
        <div class="tools-grid grid-3">
          <div class="card card-gradient tool-card">
            <div class="tool-icon purple">🔄</div>
            <h3>Smart Unit Converter</h3>
            <p>Convert currencies, time zones, kitchen measurements, data sizes, and more with real-time rates.</p>
            <NuxtLink to="/tools/converter" class="tool-link">
              Try it now <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon pink">📄</div>
            <h3>PDF Swiss Army Knife</h3>
            <p>Merge, split, compress PDFs or convert them to Word, images, and more. All in your browser.</p>
            <NuxtLink to="/tools/pdf" class="tool-link">
              Try it now <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon teal">🔀</div>
            <h3>Format Shifter</h3>
            <p>Convert images (PNG, WebP, JPG), videos to GIFs, and audio formats with zero quality loss.</p>
            <NuxtLink to="/tools/format" class="tool-link">
              Try it now <span>→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Brain De-Clutter Section -->
    <section class="tools-section section brain-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">🧠 Brain De-Clutter</span>
          <h2 class="section-title">Clear Your Mind</h2>
          <p class="section-subtitle">
            Organize your thoughts without complex project management tools.
          </p>
        </div>
        
        <div class="tools-grid grid-3">
          <div class="card card-gradient tool-card">
            <div class="tool-icon orange">⏱️</div>
            <h3>Focus Timer</h3>
            <p>Built-in Pomodoro timer with lo-fi beats, rain sounds, café ambience, and more.</p>
            <NuxtLink to="/tools/timer" class="tool-link">
              Start focusing <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon blue">📝</div>
            <h3>Minimalist Notes</h3>
            <p>A quick scratchpad that auto-saves to your browser. No login needed, ever.</p>
            <NuxtLink to="/tools/notes" class="tool-link">
              Start writing <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon green">📊</div>
            <h3>Priority Matrix</h3>
            <p>Drag-and-drop Eisenhower Matrix to decide what's urgent, important, or can wait.</p>
            <NuxtLink to="/tools/matrix" class="tool-link">
              Organize now <span>→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Content Creator Section -->
    <section class="tools-section section creator-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">🎨 Content Creator</span>
          <h2 class="section-title">Create Amazing Content</h2>
          <p class="section-subtitle">
            Perfect for social media posts, school presentations, and creative projects.
          </p>
        </div>
        
        <div class="tools-grid grid-3">
          <div class="card card-gradient tool-card">
            <div class="tool-icon pink">✨</div>
            <h3>Caption Generator</h3>
            <p>AI-powered prompts to help you write catchy captions, bios, and hooks.</p>
            <NuxtLink to="/tools/caption" class="tool-link">
              Generate captions <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon purple">🎨</div>
            <h3>Color Palette Picker</h3>
            <p>Upload any image and extract a beautiful, matching color palette instantly.</p>
            <NuxtLink to="/tools/colors" class="tool-link">
              Pick colors <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon teal">🖼️</div>
            <h3>Remove Background</h3>
            <p>Strip backgrounds from photos instantly. Perfect for product shots and portraits.</p>
            <NuxtLink to="/tools/background" class="tool-link">
              Remove now <span>→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Technical Shortcuts Section -->
    <section class="tools-section section tech-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">⚙️ Technical Shortcuts</span>
          <h2 class="section-title">Developer & Power User Tools</h2>
          <p class="section-subtitle">
            Small tools that save big time for students, developers, and office workers.
          </p>
        </div>
        
        <div class="tools-grid grid-4">
          <div class="card card-gradient tool-card">
            <div class="tool-icon blue">🧹</div>
            <h3>Text Cleaner</h3>
            <p>Remove extra spaces, fix quotes, change case — one click.</p>
            <NuxtLink to="/tools/text" class="tool-link">
              Clean text <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon green">🔐</div>
            <h3>Password Generator</h3>
            <p>Generate strong, random passwords and masked emails.</p>
            <NuxtLink to="/tools/password" class="tool-link">
              Generate <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon orange">📱</div>
            <h3>QR Code Maker</h3>
            <p>Turn any URL into a QR code for flyers, menus, and more.</p>
            <NuxtLink to="/tools/qr" class="tool-link">
              Create QR <span>→</span>
            </NuxtLink>
          </div>
          <div class="card card-gradient tool-card">
            <div class="tool-icon purple">{ }</div>
            <h3>JSON Formatter</h3>
            <p>Format, validate, and beautify JSON data instantly.</p>
            <NuxtLink to="/tools/json" class="tool-link">
              Format JSON <span>→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Mental Health Section -->
    <section class="mental-section section">
      <div class="container">
        <div class="mental-content">
          <div class="mental-text">
            <span class="section-tag">💜 Mental Health Support</span>
            <h2 class="section-title">You're Not Alone</h2>
            <p class="section-subtitle">
              Sometimes we all need a little help. Access resources, breathing exercises, 
              mood tracking, and connections to support when you need it most.
            </p>
            <div class="mental-features">
              <div class="mental-feature">
                <span>🌬️</span>
                <span>Guided Breathing</span>
              </div>
              <div class="mental-feature">
                <span>📔</span>
                <span>Mood Journal</span>
              </div>
              <div class="mental-feature">
                <span>🎯</span>
                <span>Coping Techniques</span>
              </div>
              <div class="mental-feature">
                <span>📞</span>
                <span>Crisis Resources</span>
              </div>
            </div>
            <NuxtLink to="/mental-health" class="btn btn-primary btn-lg">
              Get Support <span class="btn-arrow">→</span>
            </NuxtLink>
          </div>
          <div class="mental-visual">
            <div class="mental-card glass">
              <div class="breathing-circle">
                <div class="breathing-inner"></div>
                <span>Breathe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Learning Hub Section -->
    <section class="learning-section section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">📚 Learning Hub</span>
          <h2 class="section-title">Need Help with Homework?</h2>
          <p class="section-subtitle">
            Math formulas, writing guides, study techniques, and more — all free.
          </p>
        </div>
        
        <div class="learning-grid grid-4">
          <NuxtLink to="/learning/math" class="learning-card">
            <span class="learning-icon">🧮</span>
            <h3>Math Help</h3>
            <p>Calculators, formulas, step-by-step solutions</p>
          </NuxtLink>
          <NuxtLink to="/learning/writing" class="learning-card">
            <span class="learning-icon">✍️</span>
            <h3>Writing Help</h3>
            <p>Grammar tips, essay structure, citations</p>
          </NuxtLink>
          <NuxtLink to="/learning/study" class="learning-card">
            <span class="learning-icon">📖</span>
            <h3>Study Techniques</h3>
            <p>Flashcards, memory tricks, focus tips</p>
          </NuxtLink>
          <NuxtLink to="/learning/science" class="learning-card">
            <span class="learning-icon">🔬</span>
            <h3>Science Help</h3>
            <p>Physics, chemistry, biology resources</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- More Tools Section -->
    <section class="more-tools section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">🛠️ Even More Tools</span>
          <h2 class="section-title">And There's More...</h2>
          <p class="section-subtitle">
            We're constantly adding new tools based on what you need.
          </p>
        </div>
        
        <div class="more-grid">
          <NuxtLink to="/tools/calculator" class="more-item">
            <span>🧮</span>
            <span>Scientific Calculator</span>
          </NuxtLink>
          <NuxtLink to="/tools/countdown" class="more-item">
            <span>⏳</span>
            <span>Countdown Timer</span>
          </NuxtLink>
          <NuxtLink to="/tools/markdown" class="more-item">
            <span>📑</span>
            <span>Markdown Editor</span>
          </NuxtLink>
          <NuxtLink to="/tools/lorem" class="more-item">
            <span>📝</span>
            <span>Lorem Ipsum Generator</span>
          </NuxtLink>
          <NuxtLink to="/tools/hash" class="more-item">
            <span>🔒</span>
            <span>Hash Generator</span>
          </NuxtLink>
          <NuxtLink to="/tools/base64" class="more-item">
            <span>🔄</span>
            <span>Base64 Encoder</span>
          </NuxtLink>
          <NuxtLink to="/tools/regex" class="more-item">
            <span>🔍</span>
            <span>Regex Tester</span>
          </NuxtLink>
          <NuxtLink to="/tools/diff" class="more-item">
            <span>📊</span>
            <span>Text Diff Checker</span>
          </NuxtLink>
          <NuxtLink to="/tools/timestamp" class="more-item">
            <span>🕐</span>
            <span>Timestamp Converter</span>
          </NuxtLink>
          <NuxtLink to="/tools/aspect" class="more-item">
            <span>📐</span>
            <span>Aspect Ratio Calculator</span>
          </NuxtLink>
          <NuxtLink to="/tools/case" class="more-item">
            <span>Aa</span>
            <span>Case Converter</span>
          </NuxtLink>
          <NuxtLink to="/tools/wordcount" class="more-item">
            <span>📊</span>
            <span>Word Counter</span>
          </NuxtLink>
        </div>
        
        <div class="more-cta">
          <NuxtLink to="/tools" class="btn btn-secondary btn-lg">
            View All Tools <span class="btn-arrow">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content glass">
          <h2>Ready to Get Help?</h2>
          <p>All our tools are free, private, and work directly in your browser.</p>
          <div class="cta-actions">
            <NuxtLink to="/tools" class="btn btn-primary btn-lg">
              Start Using Tools
            </NuxtLink>
            <NuxtLink to="/about" class="btn btn-ghost btn-lg">
              Learn More About Us
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'QuickHelp.lol - Your All-in-One Help Hub',
  meta: [
    { name: 'description', content: 'Get quick help with anything - mental health support, productivity tools, math homework, and more. Free, no sign-ups, no ads.' }
  ]
})
</script>

<style scoped>
/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  position: relative;
  overflow: hidden;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: 50px;
  font-size: 13px;
  color: #a5b4fc;
  margin-bottom: 24px;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 72px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 32px;
  max-width: 540px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 15px;
}

.hero-stats {
  display: flex;
  gap: 48px;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 14px;
  color: var(--text-muted);
}

.hero-visual {
  position: relative;
  height: 500px;
}

.hero-cards {
  position: relative;
  width: 100%;
  height: 100%;
}

.floating-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: floatCard 6s ease-in-out infinite;
}

.card-icon {
  font-size: 24px;
}

.card-1 { top: 10%; left: 10%; animation-delay: 0s; }
.card-2 { top: 30%; right: 10%; animation-delay: 1s; }
.card-3 { top: 55%; left: 5%; animation-delay: 2s; }
.card-4 { top: 45%; left: 40%; animation-delay: 0.5s; }
.card-5 { bottom: 10%; right: 20%; animation-delay: 1.5s; }

@keyframes floatCard {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50px;
  font-size: 13px;
  font-weight: 500;
  color: #a5b4fc;
  margin-bottom: 16px;
}

/* Quick Tools */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.quick-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.quick-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.2);
}

.quick-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.quick-icon.purple { background: rgba(99, 102, 241, 0.2); }
.quick-icon.pink { background: rgba(236, 72, 153, 0.2); }
.quick-icon.teal { background: rgba(20, 184, 166, 0.2); }
.quick-icon.orange { background: rgba(245, 158, 11, 0.2); }

.quick-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.quick-info p {
  font-size: 13px;
  color: var(--text-muted);
}

.quick-arrow {
  margin-left: auto;
  font-size: 18px;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.quick-card:hover .quick-arrow {
  color: var(--primary);
  transform: translateX(4px);
}

/* Tool Cards */
.tool-card {
  padding: 32px;
}

.tool-card h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.tool-card p {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 20px;
}

.tool-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--primary);
  text-decoration: none;
  transition: all 0.2s ease;
}

.tool-link:hover {
  gap: 12px;
}

/* Mental Health Section */
.mental-section {
  background: linear-gradient(180deg, transparent 0%, rgba(99, 102, 241, 0.05) 50%, transparent 100%);
}

.mental-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.mental-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 32px 0;
}

.mental-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 10px;
  font-size: 14px;
  color: white;
}

.mental-visual {
  display: flex;
  justify-content: center;
}

.mental-card {
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.breathing-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(236, 72, 153, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  animation: breathe 4s ease-in-out infinite;
}

.breathing-inner {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: var(--surface);
  position: absolute;
}

.breathing-circle span {
  position: relative;
  z-index: 1;
  font-size: 18px;
  font-weight: 500;
  color: white;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Learning Section */
.learning-card {
  padding: 32px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s ease;
}

.learning-card:hover {
  border-color: var(--primary);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.learning-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.learning-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.learning-card p {
  font-size: 14px;
  color: var(--text-muted);
}

/* More Tools */
.more-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 40px;
}

.more-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  text-decoration: none;
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  transition: all 0.2s ease;
}

.more-item span:first-child {
  font-size: 24px;
}

.more-item:hover {
  border-color: var(--primary);
  color: white;
  transform: translateY(-2px);
}

.more-cta {
  text-align: center;
}

/* CTA Section */
.cta-section {
  padding: 60px 0;
}

.cta-content {
  text-align: center;
  padding: 80px 60px;
}

.cta-content h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-content p {
  font-size: 18px;
  color: var(--text-muted);
  margin-bottom: 32px;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* Responsive */
@media (max-width: 1200px) {
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .more-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .hero-title {
    font-size: 48px;
  }

  .hero-subtitle {
    max-width: 100%;
  }

  .hero-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .hero-stats {
    justify-content: center;
  }

  .hero-visual {
    display: none;
  }

  .mental-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .mental-visual {
    order: -1;
  }

  .more-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 36px;
  }

  .quick-grid {
    grid-template-columns: 1fr;
  }

  .more-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-actions {
    flex-direction: column;
  }
}
</style>
