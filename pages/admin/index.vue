<template>
  <div class="min-h-screen">
    <div class="animated-bg"></div>
    <div class="cyber-grid"></div>

    <!-- Admin Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-cyan-500/20">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-6">
            <NuxtLink to="/" class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/30">
                ⚡
              </div>
              <span class="text-xl font-bold">
                <span class="gradient-text">Quick</span><span class="text-white">Help</span>
              </span>
            </NuxtLink>
            <div class="h-6 w-px bg-slate-700"></div>
            <span class="text-slate-400">Admin Panel</span>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-xl">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-sm text-slate-300">{{ staffUser?.username }}</span>
              <span :class="[
                'px-2 py-0.5 rounded-full text-xs font-semibold',
                staffUser?.role === 'owner' ? 'bg-purple-500/20 text-purple-400' :
                staffUser?.role === 'admin' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-green-500/20 text-green-400'
              ]">
                {{ staffUser?.role }}
              </span>
            </div>
            <button @click="handleLogout" class="btn btn-ghost text-slate-400 hover:text-red-400">
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Sidebar & Content -->
    <div class="flex pt-20">
      <!-- Sidebar -->
      <aside class="fixed left-0 top-20 bottom-0 w-64 glass-light border-r border-cyan-500/10 p-4 overflow-y-auto">
        <nav class="space-y-2">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="activeSection = item.id"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
              activeSection === item.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            ]"
          >
            <span class="text-xl">{{ item.icon }}</span>
            <span class="font-medium">{{ item.label }}</span>
            <span v-if="item.badge" class="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
              {{ item.badge }}
            </span>
          </button>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 ml-64 p-8">
        <!-- Dashboard Section -->
        <section v-if="activeSection === 'dashboard'" class="animate-fade-in-up">
          <h1 class="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="glass-card p-6 hover-lift">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">
                  👥
                </div>
                <span class="text-cyan-400 text-sm">+12%</span>
              </div>
              <p class="text-3xl font-bold text-white">{{ stats.totalUsers }}</p>
              <p class="text-slate-400 text-sm">Total Users</p>
            </div>

            <div class="glass-card p-6 hover-lift">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
                  🎫
                </div>
                <span class="text-green-400 text-sm">Active</span>
              </div>
              <p class="text-3xl font-bold text-white">{{ stats.openTickets }}</p>
              <p class="text-slate-400 text-sm">Open Tickets</p>
            </div>

            <div class="glass-card p-6 hover-lift">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl">
                  ✅
                </div>
              </div>
              <p class="text-3xl font-bold text-white">{{ stats.resolvedTickets }}</p>
              <p class="text-slate-400 text-sm">Resolved Today</p>
            </div>

            <div class="glass-card p-6 hover-lift">
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-2xl">
                  👨‍💼
                </div>
              </div>
              <p class="text-3xl font-bold text-white">{{ stats.activeStaff }}</p>
              <p class="text-slate-400 text-sm">Active Staff</p>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="glass-card p-6">
            <h2 class="text-xl font-bold text-white mb-6">Recent Activity</h2>
            <div class="space-y-4">
              <div v-for="activity in stats.recentActivity" :key="activity._id" class="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl">
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center text-lg',
                  activity.type === 'ticket' ? 'bg-cyan-500/20' :
                  activity.type === 'user' ? 'bg-green-500/20' : 'bg-purple-500/20'
                ]">
                  {{ activity.type === 'ticket' ? '🎫' : activity.type === 'user' ? '👤' : '💬' }}
                </div>
                <div class="flex-1">
                  <p class="text-white">{{ activity.description }}</p>
                  <p class="text-slate-500 text-sm">{{ formatDate(activity.createdAt) }}</p>
                </div>
              </div>
              <div v-if="!stats.recentActivity?.length" class="text-center py-8 text-slate-500">
                No recent activity
              </div>
            </div>
          </div>
        </section>

        <!-- Tickets Section -->
        <section v-if="activeSection === 'tickets'" class="animate-fade-in-up">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-white">Support Tickets</h1>
            <div class="flex items-center gap-4">
              <select v-model="ticketFilter.status" class="input bg-slate-800/50 border-slate-700 w-40">
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select v-model="ticketFilter.priority" class="input bg-slate-800/50 border-slate-700 w-40">
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div class="space-y-4">
            <div 
              v-for="ticket in tickets" 
              :key="ticket._id"
              @click="openTicketModal(ticket)"
              class="glass-card p-6 cursor-pointer hover:border-cyan-500/50 transition-all"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-slate-500 font-mono text-sm">#{{ ticket.ticketId }}</span>
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      ticket.status === 'open' ? 'bg-green-500/20 text-green-400' :
                      ticket.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-400' :
                      ticket.status === 'resolved' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-slate-500/20 text-slate-400'
                    ]">
                      {{ ticket.status }}
                    </span>
                    <span :class="[
                      'px-2 py-0.5 rounded-full text-xs font-semibold',
                      ticket.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                      ticket.priority === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      ticket.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-500/20 text-slate-400'
                    ]">
                      {{ ticket.priority }}
                    </span>
                  </div>
                  <h3 class="text-lg font-semibold text-white">{{ ticket.subject }}</h3>
                  <p class="text-slate-400 text-sm mt-1 line-clamp-2">{{ ticket.description }}</p>
                </div>
                <span class="text-slate-500 text-sm">{{ formatDate(ticket.createdAt) }}</span>
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-500">
                  From: {{ ticket.guestName || ticket.userId || 'Anonymous' }}
                </span>
                <span class="text-cyan-400">
                  {{ ticket.messages?.length || 0 }} messages
                </span>
              </div>
            </div>
            
            <div v-if="!tickets.length" class="text-center py-16 text-slate-500">
              <span class="text-4xl mb-4 block">🎫</span>
              No tickets found
            </div>
          </div>
        </section>

        <!-- Team Section (Owner Only) -->
        <section v-if="activeSection === 'team' && isOwner" class="animate-fade-in-up">
          <div class="flex items-center justify-between mb-8">
            <h1 class="text-3xl font-bold text-white">Team Management</h1>
            <button @click="showCodeModal = true" class="btn btn-primary">
              ➕ Generate Access Code
            </button>
          </div>

          <!-- Members Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="member in members" 
              :key="member._id"
              class="glass-card p-6"
            >
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-xl">
                  {{ member.role === 'admin' ? '👨‍💼' : '🎧' }}
                </div>
                <div>
                  <h3 class="font-semibold text-white">{{ member.username }}</h3>
                  <span :class="[
                    'text-xs px-2 py-0.5 rounded-full',
                    member.role === 'admin' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-400'
                  ]">
                    {{ member.role }}
                  </span>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div :class="['w-2 h-2 rounded-full', member.active ? 'bg-green-500' : 'bg-slate-500']"></div>
                  <span class="text-sm text-slate-400">{{ member.active ? 'Active' : 'Inactive' }}</span>
                </div>
                <button 
                  @click="toggleMember(member._id, !member.active)"
                  :class="[
                    'btn btn-sm',
                    member.active ? 'btn-ghost text-red-400' : 'btn-ghost text-green-400'
                  ]"
                >
                  {{ member.active ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </div>
            
            <div v-if="!members.length" class="col-span-full text-center py-16 text-slate-500">
              <span class="text-4xl mb-4 block">👥</span>
              No team members yet. Generate access codes to add staff.
            </div>
          </div>
        </section>

        <!-- Settings Section -->
        <section v-if="activeSection === 'settings'" class="animate-fade-in-up">
          <h1 class="text-3xl font-bold text-white mb-8">Settings</h1>
          
          <div class="glass-card p-6">
            <h2 class="text-xl font-semibold text-white mb-6">Notification Preferences</h2>
            <div class="space-y-4">
              <label class="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl cursor-pointer">
                <div>
                  <p class="text-white">New Ticket Alerts</p>
                  <p class="text-slate-500 text-sm">Get notified when new tickets are created</p>
                </div>
                <div class="toggle active"></div>
              </label>
              <label class="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl cursor-pointer">
                <div>
                  <p class="text-white">Urgent Priority Alerts</p>
                  <p class="text-slate-500 text-sm">Instant notifications for urgent tickets</p>
                </div>
                <div class="toggle active"></div>
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Generate Code Modal -->
    <div v-if="showCodeModal" class="modal-overlay" @click.self="showCodeModal = false">
      <div class="glass-card p-8 w-full max-w-md animate-scale-in">
        <h2 class="text-2xl font-bold text-white mb-6">Generate Access Code</h2>
        
        <form @submit.prevent="handleGenerateCode" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Staff Username</label>
            <input
              v-model="codeForm.username"
              type="text"
              placeholder="Enter username"
              class="input"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select v-model="codeForm.role" class="input">
              <option value="support">Support Staff</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div v-if="generatedCode" class="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
            <p class="text-green-400 text-sm mb-2">Access code generated!</p>
            <div class="flex items-center gap-2">
              <code class="flex-1 bg-slate-800 px-4 py-2 rounded-lg text-cyan-400 font-mono text-lg tracking-widest">
                {{ generatedCode }}
              </code>
              <button @click="copyCode" class="btn btn-sm btn-secondary">📋</button>
            </div>
            <p class="text-slate-500 text-xs mt-2">Share this code with the staff member</p>
          </div>

          <div class="flex gap-4">
            <button type="button" @click="showCodeModal = false; generatedCode = ''" class="btn btn-secondary flex-1">
              Close
            </button>
            <button type="submit" :disabled="isLoading" class="btn btn-primary flex-1">
              {{ isLoading ? 'Generating...' : 'Generate Code' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div v-if="selectedTicket" class="modal-overlay" @click.self="selectedTicket = null">
      <div class="glass-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        <!-- Header -->
        <div class="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span class="text-slate-500 font-mono">#{{ selectedTicket.ticketId }}</span>
              <span :class="[
                'px-2 py-0.5 rounded-full text-xs font-semibold',
                selectedTicket.status === 'open' ? 'bg-green-500/20 text-green-400' :
                selectedTicket.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-400' :
                selectedTicket.status === 'resolved' ? 'bg-purple-500/20 text-purple-400' :
                'bg-slate-500/20 text-slate-400'
              ]">
                {{ selectedTicket.status }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-white">{{ selectedTicket.subject }}</h2>
          </div>
          <button @click="selectedTicket = null" class="text-slate-400 hover:text-white text-2xl">×</button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- Original message -->
          <div class="p-4 bg-slate-800/50 rounded-xl">
            <p class="text-white">{{ selectedTicket.description }}</p>
            <p class="text-slate-500 text-sm mt-2">
              {{ selectedTicket.guestName || 'User' }} • {{ formatDate(selectedTicket.createdAt) }}
            </p>
          </div>

          <!-- Messages -->
          <div v-for="msg in selectedTicket.messages" :key="msg.id" 
            :class="['chat-bubble', msg.sender === 'staff' ? 'sent' : 'received']">
            <p>{{ msg.content }}</p>
            <p class="text-xs opacity-70 mt-1">{{ msg.senderName }} • {{ formatDate(msg.timestamp) }}</p>
          </div>
        </div>

        <!-- Actions & Reply -->
        <div class="p-6 border-t border-slate-700/50 space-y-4">
          <!-- Status/Priority actions -->
          <div class="flex items-center gap-4">
            <select 
              v-model="selectedTicket.status"
              @change="updateTicketStatus"
              class="input bg-slate-800/50 border-slate-700 w-40"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select 
              v-model="selectedTicket.priority"
              @change="updateTicketPriority"
              class="input bg-slate-800/50 border-slate-700 w-40"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <!-- Reply form -->
          <div class="flex gap-3">
            <input
              v-model="replyMessage"
              type="text"
              placeholder="Type your reply..."
              class="input flex-1"
              @keyup.enter="sendReply"
            />
            <button @click="sendReply" class="btn btn-primary" :disabled="!replyMessage.trim()">
              Send 📤
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { staffUser, staffLogout, isStaffAuthenticated, isOwner, initAuth, generateStaffCode, getSupportMembers, toggleMemberStatus, getDashboardStats, isLoading } = useAuth()
const { tickets, fetchTickets, sendMessage, updateTicket } = useTickets()

const activeSection = ref('dashboard')
const showCodeModal = ref(false)
const generatedCode = ref('')
const selectedTicket = ref<any>(null)
const replyMessage = ref('')
const members = ref<any[]>([])
const stats = ref({
  totalUsers: 0,
  openTickets: 0,
  resolvedTickets: 0,
  activeStaff: 0,
  recentActivity: [] as any[]
})

const ticketFilter = ref({
  status: '',
  priority: ''
})

const codeForm = ref({
  username: '',
  role: 'support' as 'admin' | 'support'
})

const menuItems = computed(() => [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'tickets', label: 'Tickets', icon: '🎫', badge: stats.value.openTickets || undefined },
  ...(isOwner.value ? [{ id: 'team', label: 'Team', icon: '👥' }] : []),
  { id: 'settings', label: 'Settings', icon: '⚙️' }
])

onMounted(async () => {
  initAuth()
  if (!isStaffAuthenticated.value) {
    router.push('/staff/login')
    return
  }
  
  await loadData()
})

watch(ticketFilter, async () => {
  await fetchTickets({
    status: ticketFilter.value.status || undefined,
    priority: ticketFilter.value.priority || undefined
  })
}, { deep: true })

const loadData = async () => {
  const [statsResult, ticketsResult] = await Promise.all([
    getDashboardStats(),
    fetchTickets()
  ])

  if (statsResult.success && statsResult.stats) {
    stats.value = statsResult.stats
  }

  if (isOwner.value) {
    const membersResult = await getSupportMembers()
    if (membersResult.success && membersResult.members) {
      members.value = membersResult.members
    }
  }
}

const handleLogout = () => {
  staffLogout()
  router.push('/staff/login')
}

const handleGenerateCode = async () => {
  const result = await generateStaffCode(codeForm.value.role, codeForm.value.username)
  if (result.success && result.code) {
    generatedCode.value = result.code
    codeForm.value = { username: '', role: 'support' }
    await loadData()
  }
}

const copyCode = () => {
  navigator.clipboard.writeText(generatedCode.value)
}

const toggleMember = async (memberId: string, active: boolean) => {
  const result = await toggleMemberStatus(memberId, active)
  if (result.success) {
    await loadData()
  }
}

const openTicketModal = (ticket: any) => {
  selectedTicket.value = { ...ticket }
}

const updateTicketStatus = async () => {
  if (!selectedTicket.value) return
  await updateTicket(selectedTicket.value.ticketId, { status: selectedTicket.value.status })
}

const updateTicketPriority = async () => {
  if (!selectedTicket.value) return
  await updateTicket(selectedTicket.value.ticketId, { priority: selectedTicket.value.priority })
}

const sendReply = async () => {
  if (!selectedTicket.value || !replyMessage.value.trim()) return
  
  const result = await sendMessage(selectedTicket.value.ticketId, replyMessage.value.trim())
  if (result.success) {
    replyMessage.value = ''
  }
}

const formatDate = (date: any) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Page meta
useHead({
  title: 'Admin Dashboard - QuickHelp.lol'
})

definePageMeta({
  layout: false
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
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 20px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.9);
  backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.animate-fade-in-up {
  animation: fadeInUp 0.4s ease;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.chat-bubble {
  padding: 12px 16px;
  border-radius: 16px;
  max-width: 80%;
}

.chat-bubble.sent {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.chat-bubble.received {
  background: rgba(30, 41, 59, 0.8);
  color: white;
  border-bottom-left-radius: 4px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
