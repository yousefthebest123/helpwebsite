<template>
  <div class="staff-login-page">
    <!-- Animated Background -->
    <div class="staff-bg">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="grid-overlay"></div>
      <div class="particles">
        <span v-for="i in 50" :key="i" class="particle" :style="{
          left: Math.random() * 100 + '%',
          animationDelay: Math.random() * 5 + 's',
          animationDuration: 3 + Math.random() * 4 + 's'
        }"></span>
      </div>
    </div>

    <!-- Floating Shield Icons -->
    <div class="floating-shields">
      <div class="shield shield-1">🛡️</div>
      <div class="shield shield-2">⚡</div>
      <div class="shield shield-3">🔐</div>
      <div class="shield shield-4">👑</div>
    </div>

    <div class="login-container">
      <!-- Left Side - Branding -->
      <div class="branding-section">
        <div class="brand-content">
          <NuxtLink to="/" class="brand-logo">
            <div class="logo-icon">
              <span>🛡️</span>
              <div class="logo-ring"></div>
              <div class="logo-ring ring-2"></div>
            </div>
            <span class="logo-text">
              <span class="text-gradient">Staff</span> Portal
            </span>
          </NuxtLink>

          <h1 class="brand-headline">
            <span class="line">Command Center</span>
            <span class="line highlight">For Excellence</span>
          </h1>

          <p class="brand-description">
            Access powerful admin tools, manage support tickets, and help users achieve their goals.
          </p>

          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">24/7</div>
              <span>Support</span>
            </div>
            <div class="stat-item">
              <div class="stat-value">100k+</div>
              <span>Users Helped</span>
            </div>
            <div class="stat-item">
              <div class="stat-value">99%</div>
              <span>Satisfaction</span>
            </div>
          </div>

          <div class="access-levels">
            <h3>Access Levels</h3>
            <div class="level-item">
              <span class="level-icon">👑</span>
              <div>
                <strong>Owner</strong>
                <p>Full system control, staff management</p>
              </div>
            </div>
            <div class="level-item">
              <span class="level-icon">👨‍💼</span>
              <div>
                <strong>Administrator</strong>
                <p>Manage tickets, view analytics</p>
              </div>
            </div>
            <div class="level-item">
              <span class="level-icon">🎧</span>
              <div>
                <strong>Support Staff</strong>
                <p>Handle tickets, chat with users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Login Form -->
      <div class="form-section">
        <div class="login-card">
          <div class="card-glow"></div>
          <div class="card-border"></div>

          <div class="card-header">
            <div class="header-icon">
              <span>{{ loginType === 'owner' ? '👑' : '🔑' }}</span>
            </div>
            <h2>{{ loginType === 'owner' ? 'Owner Login' : 'Staff Login' }}</h2>
            <p>{{ loginType === 'owner' ? 'Full administrative access' : 'Enter your access code' }}</p>
          </div>

          <!-- Login Type Tabs -->
          <div class="login-tabs">
            <button
              @click="loginType = 'owner'"
              :class="['tab', { active: loginType === 'owner' }]"
            >
              <span class="tab-icon">👑</span>
              Owner
            </button>
            <button
              @click="loginType = 'staff'"
              :class="['tab', { active: loginType === 'staff' }]"
            >
              <span class="tab-icon">👨‍💼</span>
              Staff
            </button>
            <div class="tab-indicator" :style="{ left: loginType === 'owner' ? '0' : '50%' }"></div>
          </div>

          <!-- Owner Login Form -->
          <form v-if="loginType === 'owner'" @submit.prevent="handleOwnerLogin" class="login-form">
            <div class="input-group">
              <label>Username</label>
              <div class="input-wrapper">
                <span class="input-icon">👤</span>
                <input
                  v-model="ownerForm.username"
                  type="text"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div class="input-group">
              <label>Password</label>
              <div class="input-wrapper">
                <span class="input-icon">🔒</span>
                <input
                  v-model="ownerForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="toggle-password"
                >
                  {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
            </div>

            <div v-if="error" class="error-message">
              <span>⚠️</span>
              {{ error }}
            </div>

            <button type="submit" :disabled="isLoading" class="submit-btn owner-btn">
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-else>
                👑 Access Admin Panel
                <span class="btn-arrow">→</span>
              </span>
            </button>
          </form>

          <!-- Staff Login Form -->
          <form v-else @submit.prevent="handleStaffLogin" class="login-form">
            <div class="input-group">
              <label>Access Code</label>
              <div class="input-wrapper code-input">
                <span class="input-icon">🔑</span>
                <input
                  v-model="staffForm.code"
                  type="text"
                  placeholder="XXXXXXXXXX"
                  maxlength="10"
                  required
                  class="code-field"
                />
              </div>
              <p class="input-hint">Enter the 10-character code provided by owner</p>
            </div>

            <div v-if="error" class="error-message">
              <span>⚠️</span>
              {{ error }}
            </div>

            <button type="submit" :disabled="isLoading" class="submit-btn staff-btn">
              <span v-if="isLoading" class="loading-spinner"></span>
              <span v-else>
                🔐 Verify & Login
                <span class="btn-arrow">→</span>
              </span>
            </button>
          </form>

          <!-- Info Box -->
          <div class="info-box">
            <span class="info-icon">ℹ️</span>
            <div>
              <strong>{{ loginType === 'owner' ? 'Owner Access' : 'Staff Access' }}</strong>
              <p>
                {{ loginType === 'owner' 
                  ? 'Full control over system settings, staff management, and all administrative features.'
                  : 'Support staff can manage tickets and chat with users. Contact the owner for access codes.'
                }}
              </p>
            </div>
          </div>

          <!-- Back Link -->
          <div class="back-link">
            <NuxtLink to="/">← Back to Homepage</NuxtLink>
            <span class="separator">•</span>
            <NuxtLink to="/auth/login">User Login →</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { staffLogin, isLoading, isStaffAuthenticated, initAuth } = useAuth()

const loginType = ref<'owner' | 'staff'>('owner')
const showPassword = ref(false)
const error = ref('')

const ownerForm = ref({
  username: '',
  password: ''
})

const staffForm = ref({
  code: ''
})

onMounted(() => {
  initAuth()
  if (isStaffAuthenticated.value) {
    router.push('/admin')
  }
})

const handleOwnerLogin = async () => {
  error.value = ''
  const result = await staffLogin(ownerForm.value.username, ownerForm.value.password)
  
  if (result.success) {
    router.push('/admin')
  } else {
    error.value = result.error || 'Invalid credentials'
  }
}

const handleStaffLogin = async () => {
  error.value = ''
  
  if (staffForm.value.code.length !== 10) {
    error.value = 'Access code must be 10 characters'
    return
  }

  const result = await staffLogin('', '', staffForm.value.code.toUpperCase())
  
  if (result.success) {
    router.push('/admin')
  } else {
    error.value = result.error || 'Invalid access code'
  }
}

// Page meta
useHead({
  title: 'Staff Login - QuickHelp.lol'
})

definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
.staff-login-page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.staff-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: linear-gradient(135deg, #030712 0%, #0a1628 50%, #030712 100%);
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 15s ease-in-out infinite;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent);
  top: -200px;
  left: -200px;
}

.orb-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.3), transparent);
  bottom: -150px;
  right: -150px;
  animation-delay: -5s;
}

.orb-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -10s;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}

.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(139, 92, 246, 0.6);
  border-radius: 50%;
  bottom: -10px;
  animation: rise linear infinite;
}

@keyframes rise {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(-100vh) scale(1);
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25% { transform: translate(50px, -50px) scale(1.1); }
  50% { transform: translate(0, -100px) scale(1); }
  75% { transform: translate(-50px, -50px) scale(0.9); }
}

/* Floating Shields */
.floating-shields {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.shield {
  position: absolute;
  font-size: 2rem;
  opacity: 0.2;
  animation: shieldFloat 20s ease-in-out infinite;
}

.shield-1 { top: 10%; left: 5%; animation-delay: 0s; }
.shield-2 { top: 20%; right: 10%; animation-delay: -5s; }
.shield-3 { bottom: 30%; left: 8%; animation-delay: -10s; }
.shield-4 { bottom: 15%; right: 5%; animation-delay: -15s; }

@keyframes shieldFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(10deg); }
}

/* Container */
.login-container {
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
}

/* Branding Section */
.branding-section {
  flex: 1;
  display: none;
  padding: 60px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05));
  border-right: 1px solid rgba(139, 92, 246, 0.2);
}

@media (min-width: 1024px) {
  .branding-section {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.brand-content {
  max-width: 500px;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
  margin-bottom: 48px;
}

.logo-icon {
  position: relative;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  box-shadow: 0 0 40px rgba(139, 92, 246, 0.4);
}

.logo-ring {
  position: absolute;
  inset: -8px;
  border: 2px solid rgba(139, 92, 246, 0.3);
  border-radius: 24px;
  animation: pulse 2s ease-in-out infinite;
}

.logo-ring.ring-2 {
  inset: -16px;
  border-radius: 28px;
  animation-delay: 0.5s;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}

.logo-text {
  font-size: 28px;
  font-weight: 700;
  color: white;
}

.text-gradient {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-headline {
  margin-bottom: 24px;
}

.brand-headline .line {
  display: block;
  font-size: 36px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
}

.brand-headline .highlight {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed, #8b5cf6);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

.brand-description {
  color: #94a3b8;
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 40px;
}

.stats-grid {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-item span {
  color: #64748b;
  font-size: 13px;
}

.access-levels h3 {
  color: white;
  font-size: 18px;
  margin-bottom: 20px;
}

.level-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.level-item:hover {
  background: rgba(139, 92, 246, 0.15);
  transform: translateX(8px);
}

.level-icon {
  font-size: 24px;
}

.level-item strong {
  color: white;
  font-size: 15px;
  display: block;
  margin-bottom: 4px;
}

.level-item p {
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
}

/* Form Section */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.9));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 28px;
  padding: 40px;
  position: relative;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(139, 92, 246, 0.3), transparent);
  filter: blur(60px);
  pointer-events: none;
}

.card-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #8b5cf6, #7c3aed, #8b5cf6);
  background-size: 200% auto;
  animation: shimmer 3s linear infinite;
}

.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
}

.card-header h2 {
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-header p {
  color: #94a3b8;
  font-size: 14px;
}

/* Login Tabs */
.login-tabs {
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
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  border-radius: 12px;
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
  width: 50%;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 12px;
  transition: left 0.3s ease;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);
}

/* Form Styles */
.login-form {
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  color: white;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 10px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 14px;
  transition: all 0.3s ease;
}

.input-wrapper:focus-within {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15), 0 0 30px rgba(139, 92, 246, 0.1);
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 18px;
}

.input-wrapper input {
  flex: 1;
  background: none;
  border: none;
  padding: 16px 16px 16px 50px;
  color: white;
  font-size: 15px;
  outline: none;
}

.input-wrapper input::placeholder {
  color: #64748b;
}

.input-wrapper.code-input input {
  text-align: center;
  font-family: 'Space Grotesk', monospace;
  font-size: 18px;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.toggle-password {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.toggle-password:hover {
  opacity: 1;
}

.input-hint {
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  color: #f87171;
  font-size: 14px;
  margin-bottom: 24px;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 18px 24px;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-btn.owner-btn {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  box-shadow: 0 4px 24px rgba(139, 92, 246, 0.4);
}

.submit-btn.owner-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.5);
}

.submit-btn.staff-btn {
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  box-shadow: 0 4px 24px rgba(124, 58, 237, 0.4);
}

.submit-btn.staff-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(124, 58, 237, 0.5);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.submit-btn:hover:not(:disabled) .btn-arrow {
  transform: translateX(4px);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Info Box */
.info-box {
  display: flex;
  gap: 14px;
  padding: 16px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 14px;
  margin-bottom: 24px;
}

.info-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.info-box strong {
  color: white;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
}

.info-box p {
  color: #94a3b8;
  font-size: 13px;
  margin: 0;
  line-height: 1.5;
}

/* Back Link */
.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(139, 92, 246, 0.1);
}

.back-link a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.back-link a:hover {
  color: #8b5cf6;
}

.separator {
  color: #475569;
}

/* Responsive */
@media (max-width: 640px) {
  .login-card {
    padding: 32px 24px;
  }
  
  .header-icon {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
  
  .card-header h2 {
    font-size: 20px;
  }
}
</style>
