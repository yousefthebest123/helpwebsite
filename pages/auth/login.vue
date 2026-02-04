<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="animated-bg"></div>
    <div class="cyber-grid"></div>
    
    <div class="w-full max-w-md">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center justify-center gap-3 mb-8">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
          ⚡
        </div>
        <span class="text-2xl font-bold">
          <span class="gradient-text">Quick</span><span class="text-white">Help</span>
        </span>
      </NuxtLink>

      <!-- Auth Card -->
      <div class="glass-card p-8">
        <!-- Tabs -->
        <div class="flex gap-2 p-1 bg-slate-800/50 rounded-xl mb-8">
          <button
            @click="activeTab = 'login'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300',
              activeTab === 'login' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' 
                : 'text-slate-400 hover:text-white'
            ]"
          >
            Sign In
          </button>
          <button
            @click="activeTab = 'signup'"
            :class="[
              'flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300',
              activeTab === 'signup' 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30' 
                : 'text-slate-400 hover:text-white'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
              <input
                v-model="loginForm.email"
                type="email"
                placeholder="your@email.com"
                class="input pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input pl-12 pr-12"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span>
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn btn-primary btn-lg relative overflow-hidden group"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Signing in...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              Sign In
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </form>

        <!-- Signup Form -->
        <form v-else @submit.prevent="handleSignup" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
              <input
                v-model="signupForm.username"
                type="text"
                placeholder="cooluser123"
                class="input pl-12"
                required
                minlength="3"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
              <input
                v-model="signupForm.email"
                type="email"
                placeholder="your@email.com"
                class="input pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                v-model="signupForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input pl-12 pr-12"
                required
                minlength="6"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <p class="text-xs text-slate-500 mt-1">At least 6 characters</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Confirm Password</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              <input
                v-model="signupForm.confirmPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input pl-12"
                required
              />
            </div>
          </div>

          <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span>
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full btn btn-primary btn-lg relative overflow-hidden group"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Creating account...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              Create Account
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-6">
          <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
          <span class="text-slate-500 text-sm">or</span>
          <div class="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
        </div>

        <!-- Guest mode -->
        <NuxtLink 
          to="/" 
          class="w-full btn btn-secondary flex items-center justify-center gap-2 text-slate-300 hover:text-white"
        >
          <span>👻</span>
          Continue as Guest
        </NuxtLink>

        <p class="text-xs text-slate-500 text-center mt-4">
          Guest data is saved locally and may be lost
        </p>
      </div>

      <!-- Staff login link -->
      <div class="text-center mt-6">
        <NuxtLink 
          to="/staff/login" 
          class="text-slate-500 hover:text-cyan-400 text-sm transition-colors"
        >
          Staff Login →
        </NuxtLink>
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

// Page meta
useHead({
  title: 'Login - QuickHelp.lol'
})
</script>

<style scoped>
.gradient-text {
  background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.7));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 24px;
  position: relative;
  overflow: hidden;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent);
}
</style>
