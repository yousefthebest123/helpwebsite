<template>
  <div class="min-h-screen pt-20">
    <div class="cyber-grid"></div>

    <main class="container mx-auto px-6 pb-16">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm mb-6">
          <span>💬</span>
          <span>Live Support</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="gradient-text">Support Center</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Need help? Create a support ticket and our team will assist you as soon as possible.
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Create Ticket Form -->
        <div class="lg:col-span-2">
          <div class="glass-card p-8">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <span class="text-2xl">🎫</span>
              Create New Ticket
            </h2>

            <form @submit.prevent="handleCreateTicket" class="space-y-6">
              <!-- Guest info (if not logged in) -->
              <div v-if="!isAuthenticated" class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Your Name</label>
                  <input
                    v-model="ticketForm.guestName"
                    type="text"
                    placeholder="John Doe"
                    class="input"
                    required
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                  <input
                    v-model="ticketForm.guestEmail"
                    type="email"
                    placeholder="john@example.com"
                    class="input"
                    required
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                <input
                  v-model="ticketForm.subject"
                  type="text"
                  placeholder="Brief description of your issue"
                  class="input"
                  required
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                <div class="grid grid-cols-4 gap-3">
                  <button
                    v-for="p in priorities"
                    :key="p.value"
                    type="button"
                    @click="ticketForm.priority = p.value"
                    :class="[
                      'py-3 px-4 rounded-xl border transition-all duration-300 text-sm font-medium',
                      ticketForm.priority === p.value
                        ? `${p.activeClass} border-current`
                        : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                    ]"
                  >
                    {{ p.label }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea
                  v-model="ticketForm.description"
                  rows="5"
                  placeholder="Please describe your issue in detail..."
                  class="input resize-none"
                  required
                ></textarea>
              </div>

              <div v-if="error" class="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {{ error }}
              </div>

              <div v-if="success" class="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                <div class="flex items-center gap-2 mb-2">
                  <span>✅</span>
                  <span class="font-semibold">Ticket Created Successfully!</span>
                </div>
                <p>Your ticket ID is <code class="bg-slate-800 px-2 py-1 rounded text-cyan-400">{{ createdTicketId }}</code></p>
                <p class="text-xs mt-2 text-slate-500">Save this ID to track your ticket status.</p>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full btn btn-primary btn-lg group"
              >
                <span v-if="isLoading" class="flex items-center justify-center gap-2">
                  <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Creating Ticket...
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  Submit Ticket
                  <span class="group-hover:translate-x-1 transition-transform">📤</span>
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Help -->
          <div class="glass-card p-6">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>⚡</span>
              Quick Help
            </h3>
            <div class="space-y-3">
              <a 
                v-for="link in quickLinks" 
                :key="link.title"
                :href="link.url"
                class="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors group"
              >
                <span class="text-xl">{{ link.icon }}</span>
                <div class="flex-1">
                  <p class="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors">{{ link.title }}</p>
                  <p class="text-slate-500 text-xs">{{ link.desc }}</p>
                </div>
                <span class="text-slate-500 group-hover:text-cyan-400 transition-colors">→</span>
              </a>
            </div>
          </div>

          <!-- Track Ticket -->
          <div class="glass-card p-6">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🔍</span>
              Track Your Ticket
            </h3>
            <div class="space-y-4">
              <input
                v-model="trackTicketId"
                type="text"
                placeholder="Enter ticket ID..."
                class="input font-mono"
              />
              <button 
                @click="trackTicket"
                class="w-full btn btn-secondary"
                :disabled="!trackTicketId.trim()"
              >
                Find Ticket
              </button>
            </div>
          </div>

          <!-- My Tickets (if logged in) -->
          <div v-if="isAuthenticated" class="glass-card p-6">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📋</span>
              My Tickets
            </h3>
            <div class="space-y-3">
              <div 
                v-for="ticket in myTickets.slice(0, 5)" 
                :key="ticket._id"
                @click="openTicket(ticket)"
                class="p-3 bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-slate-500 text-xs font-mono">#{{ ticket.ticketId }}</span>
                  <span :class="[
                    'text-xs px-2 py-0.5 rounded-full',
                    ticket.status === 'open' ? 'bg-green-500/20 text-green-400' :
                    ticket.status === 'in-progress' ? 'bg-cyan-500/20 text-cyan-400' :
                    ticket.status === 'resolved' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-slate-500/20 text-slate-400'
                  ]">
                    {{ ticket.status }}
                  </span>
                </div>
                <p class="text-white text-sm truncate">{{ ticket.subject }}</p>
              </div>
              <p v-if="!myTickets.length" class="text-slate-500 text-sm text-center py-4">
                No tickets yet
              </p>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="glass-card p-6">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📞</span>
              Other Ways to Reach Us
            </h3>
            <div class="space-y-3 text-sm">
              <p class="text-slate-400">
                <span class="text-slate-500">Email:</span> support@quickhelp.lol
              </p>
              <p class="text-slate-400">
                <span class="text-slate-500">Response Time:</span> Usually within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

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

        <!-- Messages -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <!-- Original message -->
          <div class="p-4 bg-slate-800/50 rounded-xl">
            <p class="text-white">{{ selectedTicket.description }}</p>
            <p class="text-slate-500 text-sm mt-2">You • {{ formatDate(selectedTicket.createdAt) }}</p>
          </div>

          <!-- Thread messages -->
          <div 
            v-for="msg in selectedTicket.messages" 
            :key="msg.id"
            :class="['chat-bubble', msg.sender === 'staff' ? 'received' : 'sent']"
          >
            <p>{{ msg.content }}</p>
            <p class="text-xs opacity-70 mt-1">{{ msg.senderName }} • {{ formatDate(msg.timestamp) }}</p>
          </div>

          <div v-if="selectedTicket.status === 'resolved' || selectedTicket.status === 'closed'" 
            class="text-center py-4 text-slate-500 text-sm">
            This ticket has been {{ selectedTicket.status }}.
          </div>
        </div>

        <!-- Reply (if not closed) -->
        <div v-if="selectedTicket.status !== 'closed'" class="p-6 border-t border-slate-700/50">
          <div class="flex gap-3">
            <input
              v-model="replyMessage"
              type="text"
              placeholder="Type your message..."
              class="input flex-1"
              @keyup.enter="sendTicketReply"
            />
            <button 
              @click="sendTicketReply" 
              class="btn btn-primary"
              :disabled="!replyMessage.trim() || isSending"
            >
              {{ isSending ? '...' : 'Send 📤' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, initAuth } = useAuth()
const { tickets: myTickets, createTicket, fetchTickets, sendMessage, getTicket, isLoading } = useTickets()

const error = ref('')
const success = ref(false)
const createdTicketId = ref('')
const trackTicketId = ref('')
const selectedTicket = ref<any>(null)
const replyMessage = ref('')
const isSending = ref(false)

const ticketForm = ref({
  subject: '',
  description: '',
  priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  guestName: '',
  guestEmail: ''
})

const priorities: { value: 'low' | 'medium' | 'high' | 'urgent'; label: string; activeClass: string }[] = [
  { value: 'low', label: 'Low', activeClass: 'bg-slate-500/20 text-slate-300' },
  { value: 'medium', label: 'Medium', activeClass: 'bg-yellow-500/20 text-yellow-400' },
  { value: 'high', label: 'High', activeClass: 'bg-orange-500/20 text-orange-400' },
  { value: 'urgent', label: 'Urgent', activeClass: 'bg-red-500/20 text-red-400' }
]

const quickLinks = [
  { icon: '📚', title: 'FAQ & Guides', desc: 'Common questions answered', url: '/about' },
  { icon: '🔧', title: 'Tools Help', desc: 'How to use our tools', url: '/tools' },
  { icon: '💡', title: 'Feature Requests', desc: 'Suggest new features', url: '/about' }
]

onMounted(async () => {
  initAuth()
  if (isAuthenticated.value) {
    await fetchTickets()
  }
})

const handleCreateTicket = async () => {
  error.value = ''
  success.value = false

  const result = await createTicket({
    subject: ticketForm.value.subject,
    description: ticketForm.value.description,
    priority: ticketForm.value.priority,
    guestName: ticketForm.value.guestName || undefined,
    guestEmail: ticketForm.value.guestEmail || undefined
  })

  if (result.success && result.ticket) {
    success.value = true
    createdTicketId.value = result.ticket.ticketId
    ticketForm.value = {
      subject: '',
      description: '',
      priority: 'medium',
      guestName: '',
      guestEmail: ''
    }
  } else {
    error.value = result.error || 'Failed to create ticket'
  }
}

const trackTicket = async () => {
  const result = await getTicket(trackTicketId.value.trim())
  if (result.success && result.ticket) {
    selectedTicket.value = result.ticket
    trackTicketId.value = ''
  } else {
    error.value = 'Ticket not found'
    setTimeout(() => error.value = '', 3000)
  }
}

const openTicket = (ticket: any) => {
  selectedTicket.value = ticket
}

const sendTicketReply = async () => {
  if (!selectedTicket.value || !replyMessage.value.trim()) return

  isSending.value = true
  const result = await sendMessage(selectedTicket.value.ticketId, replyMessage.value.trim())
  
  if (result.success) {
    replyMessage.value = ''
    // Refresh ticket
    const refreshed = await getTicket(selectedTicket.value.ticketId)
    if (refreshed.success) {
      selectedTicket.value = refreshed.ticket
    }
  }
  isSending.value = false
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

useHead({
  title: 'Support - QuickHelp.lol'
})
</script>

<style scoped>
/* Uses global .glass-card and .gradient-text from main.css */

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
  animation: fadeInUp 0.6s ease;
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
</style>
