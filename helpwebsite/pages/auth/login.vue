<template>
  <div class="auth-page">
    <!-- Animated Background -->
    <div class="auth-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Floating Elements -->
    <div class="floating-shapes">
      <div class="shape shape-1">⚡</div>
      <div class="shape shape-2">🔐</div>
      <div class="shape shape-3">✨</div>
      <div class="shape shape-4">🚀</div>
    </div>

    <div class="auth-container">
      <!-- Left Side - Branding -->
      <div class="auth-branding">
        <div class="brand-content">
          <NuxtLink to="/" class="brand-logo">
            <div class="logo-icon">
              <span>⚡</span>
              <div class="logo-ring"></div>
            </div>
            <span class="logo-text">
              <span class="text-gradient">Quick</span>Help
            </span>
          </NuxtLink>

          <h1 class="brand-headline">
            <span class="line">Welcome to the</span>
            <span class="line highlight">Future of Productivity</span>
          </h1>

          <p class="brand-description">
            Access 20+ powerful tools, track your progress, and boost your workflow with our all-in-one platform.
          </p>

          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">🛠️</div>
              <span>20+ Free Tools</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">☁️</div>
              <span>Cloud Sync</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔒</div>
              <span>Secure & Private</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <span>Lightning Fast</span>
            </div>
          </div>
        </div>

        <div class="testimonial-card">
          <div class="stars">★★★★★</div>
          <p>"QuickHelp has completely transformed how I work. The tools are incredible!"</p>
          <div class="author">
            <div class="avatar">JD</div>
            <div>
              <strong>John Doe</strong>
              <span>Developer</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Auth Form -->
      <div class="auth-form-section">
        <div class="auth-card" :class="{ 'flip': isFlipping }">
          <!-- Decorative Elements -->
          <div class="card-glow"></div>
          <div class="card-border"></div>

          <!-- Tab Switcher -->
          <div class="auth-tabs">
            <button 
              @click="switchTab('login')"
              :class="['tab', { active: activeTab === 'login' }]"
            >
              <span class="tab-icon">🔑</span>
              Sign In
            </button>
            <button 
              @click="switchTab('signup')"
              :class="['tab', { active: activeTab === 'signup' }]"
            >
              <span class="tab-icon">✨</span>
              Sign Up
            </button>
            <div class="tab-indicator" :style="{ left: activeTab === 'login' ? '0' : '50%' }"></div>
          </div>

          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
            <div class="form-header">
              <h2>Welcome Back!</h2>
              <p>Sign in to continue your journey</p>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">📧</span>
                <input
                  v-model="loginForm.email"
                  type="email"
                  placeholder="Enter your email"
                  class="auth-input"
                  required
                  @focus="focusedInput = 'email'"
                  @blur="focusedInput = ''"
                />
                <div class="input-highlight" :class="{ active: focusedInput === 'email' }"></div>
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="auth-input"
                  required
                  @focus="focusedInput = 'password'"
                  @blur="focusedInput = ''"
                />
                <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
                <div class="input-highlight" :class="{ active: focusedInput === 'password' }"></div>
              </div>
            </div>

            <div v-if="error" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ error }}
            </div>

            <button type="submit" :disabled="isLoading" class="submit-btn">
              <span v-if="isLoading" class="loader"></span>
              <span v-else>
                Sign In
                <span class="btn-arrow">→</span>
              </span>
              <div class="btn-shine"></div>
            </button>

            <div class="forgot-link">
              <a href="#">Forgot password?</a>
            </div>
          </form>

          <!-- Signup Form -->
          <form v-else @submit.prevent="handleSignup" class="auth-form">
            <div class="form-header">
              <h2>Create Account</h2>
              <p>Join thousands of productive users</p>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input
                  v-model="signupForm.username"
                  type="text"
                  placeholder="Choose a username"
                  class="auth-input"
                  required
                  minlength="3"
                  @focus="focusedInput = 'username'"
                  @blur="focusedInput = ''"
                />
                <div class="input-highlight" :class="{ active: focusedInput === 'username' }"></div>
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">📧</span>
                <input
                  v-model="signupForm.email"
                  type="email"
                  placeholder="Enter your email"
                  class="auth-input"
                  required
                  @focus="focusedInput = 'email'"
                  @blur="focusedInput = ''"
                />
                <div class="input-highlight" :class="{ active: focusedInput === 'email' }"></div>
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input
                  v-model="signupForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Create a password"
                  class="auth-input"
                  required
                  minlength="6"
                  @focus="focusedInput = 'password'"
                  @blur="focusedInput = ''"
                />
                <button type="button" @click="showPassword = !showPassword" class="password-toggle">
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
                <div class="input-highlight" :class="{ active: focusedInput === 'password' }"></div>
              </div>
              <div class="password-strength" v-if="signupForm.password">
                <div class="strength-bar" :style="{ width: passwordStrength + '%' }" :class="strengthClass"></div>
                <span class="strength-text">{{ strengthText }}</span>
              </div>
            </div>

            <div class="input-group">
              <div class="input-wrapper">
                <span class="input-icon">🔐</span>
                <input
                  v-model="signupForm.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Confirm password"
                  class="auth-input"
                  required
                  @focus="focusedInput = 'confirm'"
                  @blur="focusedInput = ''"
                />
                <div class="input-highlight" :class="{ active: focusedInput === 'confirm' }"></div>
              </div>
            </div>

            <div v-if="error" class="error-message">
              <span class="error-icon">⚠️</span>
              {{ error }}
            </div>

            <button type="submit" :disabled="isLoading" class="submit-btn">
              <span v-if="isLoading" class="loader"></span>
              <span v-else>
                Create Account
                <span class="btn-arrow">→</span>
              </span>
              <div class="btn-shine"></div>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>or</span>
          </div>

          <!-- Guest Mode -->
          <NuxtLink to="/" class="guest-btn">
            <span class="guest-icon">👻</span>
            Continue as Guest
          </NuxtLink>

          <p class="guest-note">Guest data is saved locally and may be lost</p>

          <!-- Staff Link -->
          <div class="staff-link">
            <NuxtLink to="/staff/login">
              Staff Portal →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { login, signup, isLoading, isAuthenticated, initAuth } = useAuth()

const activeTab = ref<'login' | 'signup'>('login')
const showPassword = ref(false)
const error = ref('')
const isFlipping = ref(false)
const focusedInput = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const passwordStrength = computed(() => {
  const pwd = signupForm.value.password
  if (!pwd) return 0
  let strength = 0
  if (pwd.length >= 6) strength += 25
  if (pwd.length >= 10) strength += 25
  if (/[A-Z]/.test(pwd)) strength += 25
  if (/[0-9!@#$%^&*]/.test(pwd)) strength += 25
  return strength
})

const strengthClass = computed(() => {
  if (passwordStrength.value <= 25) return 'weak'
  if (passwordStrength.value <= 50) return 'fair'
  if (passwordStrength.value <= 75) return 'good'
  return 'strong'
})

const strengthText = computed(() => {
  if (passwordStrength.value <= 25) return 'Weak'
  if (passwordStrength.value <= 50) return 'Fair'
  if (passwordStrength.value <= 75) return 'Good'
  return 'Strong'
})

const switchTab = (tab: 'login' | 'signup') => {
  if (tab === activeTab.value) return
  isFlipping.value = true
  setTimeout(() => {
    activeTab.value = tab
    error.value = ''
    isFlipping.value = false
  }, 150)
}

onMounted(() => {
  initAuth()
  if (isAuthenticated.value) {
    router.push('/')
  }
})

const handleLogin = async () => {
  error.value = ''
  const result = await login(loginForm.value.email, loginForm.value.password)
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || 'Login failed'
  }
}

const handleSignup = async () => {
  error.value = ''
  
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  if (signupForm.value.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  const result = await signup(
    signupForm.value.username,
    signupForm.value.email,
    signupForm.value.password
  )
  
  if (result.success) {
    router.push('/')
  } else {
    error.value = result.error || 'Signup failed'
  }
}

useHead({
  title: 'Login - QuickHelp.lol'
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.auth-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: #030712;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent 70%);
  top: -200px;
  left: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent 70%);
  bottom: -150px;
  right: -150px;
  animation-delay: -7s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.3), transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -14s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(30px, -30px) scale(1.1); }
  50% { transform: translate(-20px, 20px) scale(0.95); }
  75% { transform: translate(20px, 30px) scale(1.05); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 30s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}

/* Floating Shapes */
.floating-shapes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.shape {
  position: absolute;
  font-size: 30px;
  animation: shapeFloat 15s ease-in-out infinite;
  opacity: 0.3;
}

.shape-1 { top: 10%; left: 5%; animation-delay: 0s; }
.shape-2 { top: 60%; left: 8%; animation-delay: -3s; }
.shape-3 { top: 20%; right: 10%; animation-delay: -6s; }
.shape-4 { bottom: 15%; right: 5%; animation-delay: -9s; }

@keyframes shapeFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(20px, -20px) rotate(90deg); }
  50% { transform: translate(-10px, -40px) rotate(180deg); }
  75% { transform: translate(-20px, -20px) rotate(270deg); }
}

/* Container */
.auth-container {
  display: flex;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 2;
  gap: 60px;
  align-items: center;
}

/* Branding Side */
.auth-branding {
  flex: 1;
  display: none;
  flex-direction: column;
  gap: 40px;
  padding: 40px;
}

@media (min-width: 1024px) {
  .auth-branding {
    display: flex;
  }
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  margin-bottom: 20px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  position: relative;
  box-shadow: 0 10px 40px rgba(6, 182, 212, 0.4);
}

.logo-ring {
  position: absolute;
  inset: -4px;
  border-radius: 20px;
  border: 2px solid rgba(6, 182, 212, 0.3);
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

.logo-text {
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.text-gradient {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-headline {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  color: white;
}

.brand-headline .line {
  display: block;
}

.brand-headline .highlight {
  background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-description {
  font-size: 18px;
  color: #94a3b8;
  line-height: 1.7;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 14px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  border-color: rgba(6, 182, 212, 0.3);
  transform: translateX(5px);
}

.feature-icon {
  font-size: 24px;
}

.testimonial-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 20px;
  padding: 24px;
  backdrop-filter: blur(10px);
}

.testimonial-card .stars {
  color: #fbbf24;
  font-size: 18px;
  margin-bottom: 12px;
}

.testimonial-card p {
  color: #e2e8f0;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.testimonial-card .author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
}

.author strong {
  display: block;
  color: white;
  font-size: 14px;
}

.author span {
  color: #64748b;
  font-size: 12px;
}

/* Auth Form Section */
.auth-form-section {
  flex: 1;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
}

.auth-card {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 28px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: transform 0.3s ease;
}

.auth-card.flip {
  transform: scale(0.98);
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(from 0deg, transparent, rgba(6, 182, 212, 0.1), transparent 30%);
  animation: glowRotate 8s linear infinite;
}

@keyframes glowRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.card-border {
  position: absolute;
  inset: 0;
  border-radius: 28px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.5), transparent 50%, rgba(139, 92, 246, 0.5));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Tabs */
.auth-tabs {
  display: flex;
  position: relative;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  padding: 6px;
  margin-bottom: 32px;
}

.tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.tab.active {
  color: white;
}

.tab-icon {
  font-size: 18px;
}

.tab-indicator {
  position: absolute;
  top: 6px;
  bottom: 6px;
  width: calc(50% - 6px);
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 12px;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
}

/* Form */
.auth-form {
  position: relative;
  z-index: 1;
}

.form-header {
  text-align: center;
  margin-bottom: 28px;
}

.form-header h2 {
  font-size: 26px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.form-header p {
  color: #64748b;
  font-size: 14px;
}

.input-group {
  margin-bottom: 20px;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  z-index: 2;
}

.auth-input {
  width: 100%;
  padding: 16px 16px 16px 50px;
  font-size: 15px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 14px;
  color: white;
  outline: none;
  transition: all 0.3s ease;
}

.auth-input:focus {
  border-color: #06b6d4;
  background: rgba(30, 41, 59, 0.8);
}

.auth-input::placeholder {
  color: #64748b;
}

.input-highlight {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2), 0 0 20px rgba(6, 182, 212, 0.1);
}

.input-highlight.active {
  opacity: 1;
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.password-toggle:hover {
  opacity: 1;
}

/* Password Strength */
.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-bar.weak { background: #ef4444; }
.strength-bar.fair { background: #f59e0b; }
.strength-bar.good { background: #10b981; }
.strength-bar.strong { background: #06b6d4; }

.strength-text {
  font-size: 12px;
  color: #64748b;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #f87171;
  font-size: 14px;
  margin-bottom: 20px;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.error-icon {
  font-size: 18px;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 18px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(6, 182, 212, 0.5);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.btn-arrow {
  display: inline-block;
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.submit-btn:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: shine 3s ease-in-out infinite;
}

@keyframes shine {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}

.loader {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.forgot-link {
  text-align: center;
  margin-top: 16px;
}

.forgot-link a {
  color: #64748b;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}

.forgot-link a:hover {
  color: #06b6d4;
}

/* Divider */
.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 28px 0;
  position: relative;
  z-index: 1;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(100, 116, 139, 0.3), transparent);
}

.divider span {
  color: #64748b;
  font-size: 13px;
}

/* Guest Button */
.guest-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px;
  font-size: 15px;
  font-weight: 500;
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.guest-btn:hover {
  color: white;
  background: rgba(30, 41, 59, 0.8);
  border-color: rgba(6, 182, 212, 0.3);
}

.guest-icon {
  font-size: 20px;
}

.guest-note {
  text-align: center;
  color: #475569;
  font-size: 12px;
  margin-top: 12px;
  position: relative;
  z-index: 1;
}

.staff-link {
  text-align: center;
  margin-top: 24px;
  position: relative;
  z-index: 1;
}

.staff-link a {
  color: #475569;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.2s;
}

.staff-link a:hover {
  color: #06b6d4;
}

/* Mobile Logo */
@media (max-width: 1023px) {
  .auth-form-section::before {
    content: '⚡';
    display: block;
    text-align: center;
    font-size: 48px;
    margin-bottom: 20px;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
}
</style>
