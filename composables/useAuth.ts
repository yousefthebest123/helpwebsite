// Authentication composable for managing user state
import { ref, computed } from 'vue'

interface User {
  _id: string
  username: string
  email: string
  savedData?: {
    notes: any[]
    flashcards: any[]
    moods: any[]
    tasks: any[]
    palettes: any[]
  }
}

interface StaffUser {
  _id?: string
  username: string
  role: 'owner' | 'admin' | 'support'
  code?: string
}

const user = ref<User | null>(null)
const staffUser = ref<StaffUser | null>(null)
const token = ref<string | null>(null)
const staffToken = ref<string | null>(null)
const isLoading = ref(false)

export function useAuth() {
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isStaffAuthenticated = computed(() => !!staffToken.value && !!staffUser.value)
  const isOwner = computed(() => staffUser.value?.role === 'owner')
  const isAdmin = computed(() => staffUser.value?.role === 'admin' || staffUser.value?.role === 'owner')

  // Initialize from localStorage
  const initAuth = () => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      const savedStaffToken = localStorage.getItem('staff_token')
      const savedStaffUser = localStorage.getItem('staff_user')

      if (savedToken && savedUser) {
        token.value = savedToken
        try {
          user.value = JSON.parse(savedUser)
        } catch {
          logout()
        }
      }

      if (savedStaffToken && savedStaffUser) {
        staffToken.value = savedStaffToken
        try {
          staffUser.value = JSON.parse(savedStaffUser)
        } catch {
          staffLogout()
        }
      }
    }
  }

  // User signup
  const signup = async (username: string, email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; token: string; user: User; error?: string }>('/api/auth/signup', {
        method: 'POST',
        body: { username, email, password }
      })

      if (response.success && response.token && response.user) {
        token.value = response.token
        user.value = response.user
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        return { success: true }
      }
      return { success: false, error: response.error || 'Signup failed' }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Signup failed' }
    } finally {
      isLoading.value = false
    }
  }

  // User login
  const login = async (email: string, password: string) => {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; token: string; user: User; error?: string }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success && response.token && response.user) {
        token.value = response.token
        user.value = response.user
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        return { success: true }
      }
      return { success: false, error: response.error || 'Login failed' }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Login failed' }
    } finally {
      isLoading.value = false
    }
  }

  // User logout
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
  }

  // Staff login (owner/admin/support)
  const staffLogin = async (username: string, password: string, code?: string) => {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; token: string; user: StaffUser; error?: string }>('/api/auth/staff-login', {
        method: 'POST',
        body: { username, password, code }
      })

      if (response.success && response.token && response.user) {
        staffToken.value = response.token
        staffUser.value = response.user
        localStorage.setItem('staff_token', response.token)
        localStorage.setItem('staff_user', JSON.stringify(response.user))
        return { success: true }
      }
      return { success: false, error: response.error || 'Login failed' }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Login failed' }
    } finally {
      isLoading.value = false
    }
  }

  // Staff logout
  const staffLogout = () => {
    staffToken.value = null
    staffUser.value = null
    localStorage.removeItem('staff_token')
    localStorage.removeItem('staff_user')
  }

  // Save user data
  const saveUserData = async (dataType: string, data: any) => {
    if (!token.value) return { success: false, error: 'Not authenticated' }

    try {
      const response = await $fetch<{ success: boolean; error?: string }>('/api/user/save-data', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
        body: { dataType, data }
      })

      if (response.success && user.value) {
        // Update local user data
        if (!user.value.savedData) {
          user.value.savedData = { notes: [], flashcards: [], moods: [], tasks: [], palettes: [] }
        }
        (user.value.savedData as any)[dataType] = data
        localStorage.setItem('auth_user', JSON.stringify(user.value))
      }

      return response
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Save failed' }
    }
  }

  // Get current user
  const fetchCurrentUser = async () => {
    if (!token.value) return null

    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/user/me', {
        headers: { Authorization: `Bearer ${token.value}` }
      })

      if (response.success && response.user) {
        user.value = response.user
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        return response.user
      }
      return null
    } catch {
      logout()
      return null
    }
  }

  // Generate staff code (owner only)
  const generateStaffCode = async (role: 'admin' | 'support', username: string) => {
    if (!staffToken.value || !isOwner.value) {
      return { success: false, error: 'Unauthorized' }
    }

    try {
      const response = await $fetch<{ success: boolean; code: string; error?: string }>('/api/admin/generate-code', {
        method: 'POST',
        headers: { Authorization: `Bearer ${staffToken.value}` },
        body: { role, username }
      })

      return response
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to generate code' }
    }
  }

  // Get support members (owner/admin)
  const getSupportMembers = async () => {
    if (!staffToken.value) return { success: false, error: 'Unauthorized' }

    try {
      const response = await $fetch<{ success: boolean; members: any[]; error?: string }>('/api/admin/members', {
        headers: { Authorization: `Bearer ${staffToken.value}` }
      })

      return response
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch members' }
    }
  }

  // Toggle member status (owner only)
  const toggleMemberStatus = async (memberId: string, active: boolean) => {
    if (!staffToken.value || !isOwner.value) {
      return { success: false, error: 'Unauthorized' }
    }

    try {
      const response = await $fetch<{ success: boolean; error?: string }>('/api/admin/toggle-member', {
        method: 'POST',
        headers: { Authorization: `Bearer ${staffToken.value}` },
        body: { memberId, active }
      })

      return response
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to update member' }
    }
  }

  // Get dashboard stats
  const getDashboardStats = async () => {
    if (!staffToken.value) return { success: false, error: 'Unauthorized' }

    try {
      const response = await $fetch<{ success: boolean; stats: any; error?: string }>('/api/admin/stats', {
        headers: { Authorization: `Bearer ${staffToken.value}` }
      })

      return response
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch stats' }
    }
  }

  return {
    user,
    staffUser,
    token,
    staffToken,
    isLoading,
    isAuthenticated,
    isStaffAuthenticated,
    isOwner,
    isAdmin,
    initAuth,
    signup,
    login,
    logout,
    staffLogin,
    staffLogout,
    saveUserData,
    fetchCurrentUser,
    generateStaffCode,
    getSupportMembers,
    toggleMemberStatus,
    getDashboardStats
  }
}
