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

      <!-- Staff Auth Card -->
      <div class="glass-card p-8">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 mb-4 shadow-lg shadow-purple-500/30">
            <span class="text-3xl">🛡️</span>
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">Staff Portal</h1>
          <p class="text-slate-400 text-sm">Login to access the admin dashboard</p>
        </div>

        <!-- Login Type Tabs -->
        <div class="flex gap-2 p-1 bg-slate-800/50 rounded-xl mb-6">
          <button
            @click="loginType = 'owner'"
            :class="[
              'flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-300',
              loginType === 'owner' 
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            ]"
          >
            👑 Owner
          </button>
          <button
            @click="loginType = 'staff'"
            :class="[
              'flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-all duration-300',
              loginType === 'staff' 
                ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            ]"
          >
            👨‍💼 Staff
          </button>
        </div>

        <!-- Owner Login Form -->
        <form v-if="loginType === 'owner'" @submit.prevent="handleOwnerLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Username</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
              <input
                v-model="ownerForm.username"
                type="text"
                placeholder="Owner username"
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
                v-model="ownerForm.password"
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
              Authenticating...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              👑 Login as Owner
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </form>

        <!-- Staff Login Form -->
        <form v-else @submit.prevent="handleStaffLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Access Code</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔑</span>
              <input
                v-model="staffForm.code"
                type="text"
                placeholder="Enter your access code"
                class="input pl-12 uppercase tracking-widest font-mono"
                required
                maxlength="10"
              />
            </div>
            <p class="text-xs text-slate-500 mt-1">The 10-character code provided by the owner</p>
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
              Verifying...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              🔐 Verify & Login
              <span class="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </form>

        <!-- Info box -->
        <div class="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
          <div class="flex items-start gap-3">
            <span class="text-cyan-400">ℹ️</span>
            <div class="text-sm">
              <p class="text-slate-300 font-medium mb-1">
                {{ loginType === 'owner' ? 'Owner Access' : 'Staff Access' }}
              </p>
              <p class="text-slate-500 text-xs">
                {{ loginType === 'owner' 
                  ? 'Full access to all admin features, user management, and system settings.'
                  : 'Support staff can manage tickets and chat with users. Contact the owner for access codes.'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to user login -->
      <div class="text-center mt-6">
        <NuxtLink 
          to="/auth/login" 
          class="text-slate-500 hover:text-cyan-400 text-sm transition-colors"
        >
          ← Back to User Login
        </NuxtLink>
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
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
}
</style>
