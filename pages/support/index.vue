<template>
  <div class="support-page min-h-screen">
    <div class="cyber-grid"></div>
    <div class="animated-bg"></div>

    <main class="container mx-auto px-6 pt-32 pb-16 relative z-10">
      <!-- Header -->
      <div class="text-center mb-12 animate-fade-in-up">
        <div class="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-6 shadow-lg shadow-cyan-500/10">
          <span class="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          <span>Live Support Available</span>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          <span class="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Support Center</span>
        </h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Need help? Create a support ticket and our dedicated team will assist you as soon as possible.
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Create Ticket Form -->
        <div class="lg:col-span-2">
          <div class="support-card">
            <div class="card-header">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30">
                  🎫
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Create New Ticket</h2>
                  <p class="text-slate-400 text-sm">We typically respond within 24 hours</p>
                </div>
              </div>
            </div>

            <form @submit.prevent="handleCreateTicket" class="card-body space-y-6">
              <!-- Guest info (if not logged in) -->
              <div v-if="!isAuthenticated" class="grid md:grid-cols-2 gap-5">
                <div class="form-group">
                  <label class="form-label">
                    <span class="label-icon">👤</span>
                    Your Name
                  </label>
                  <input
                    v-model="ticketForm.guestName"
                    type="text"
                    placeholder="John Doe"
                    class="form-input"
                    required
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <span class="label-icon">📧</span>
                    Email Address
                  </label>
                  <input
                    v-model="ticketForm.guestEmail"
                    type="email"
                    placeholder="john@example.com"
                    class="form-input"
                    required
                  />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">📝</span>
                  Subject
                </label>
                <input
                  v-model="ticketForm.subject"
                  type="text"
                  placeholder="Brief description of your issue"
                  class="form-input"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">🎯</span>
                  Priority Level
                </label>
                <div class="priority-selector">
                  <button
                    v-for="p in priorities"
                    :key="p.value"
                    type="button"
                    @click="ticketForm.priority = p.value"
                    :class="['priority-btn', p.value, { active: ticketForm.priority === p.value }]"
                  >
                    <span class="priority-dot"></span>
                    {{ p.label }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <span class="label-icon">💬</span>
                  Description
                </label>
                <textarea
                  v-model="ticketForm.description"
                  rows="6"
                  placeholder="Please describe your issue in detail. Include any relevant information that will help us assist you better..."
                  class="form-input form-textarea"
                  required
                ></textarea>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="alert alert-error">
                <span class="alert-icon">⚠️</span>
                <span>{{ error }}</span>
              </div>

              <!-- Success Message -->
              <div v-if="success" class="alert alert-success">
                <div class="alert-content">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="alert-icon">✅</span>
                    <span class="font-semibold">Ticket Created Successfully!</span>
                  </div>
                  <p class="text-sm">Your ticket ID is <code class="ticket-code">{{ createdTicketId }}</code></p>
                  <p class="text-xs mt-2 opacity-70">Save this ID to track your ticket status.</p>
                </div>
              </div>

              <button
                type="submit"
                :disabled="isLoading"
                class="submit-btn"
              >
                <span v-if="isLoading" class="flex items-center justify-center gap-3">
                  <span class="btn-spinner"></span>
                  Creating Ticket...
                </span>
                <span v-else class="flex items-center justify-center gap-2">
                  <span>Submit Ticket</span>
                  <span class="btn-arrow">→</span>
                </span>
              </button>
            </form>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Help -->
          <div class="support-card">
            <div class="card-header compact">
              <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                <span class="text-yellow-400">⚡</span>
                Quick Help
              </h3>
            </div>
            <div class="card-body">
              <div class="quick-links">
                <a 
                  v-for="link in quickLinks" 
                  :key="link.title"
                  :href="link.url"
                  class="quick-link"
                >
                  <div class="quick-link-icon">{{ link.icon }}</div>
                  <div class="quick-link-content">
                    <p class="quick-link-title">{{ link.title }}</p>
                    <p class="quick-link-desc">{{ link.desc }}</p>
                  </div>
                  <span class="quick-link-arrow">→</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Track Ticket -->
          <div class="support-card">
            <div class="card-header compact">
              <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                <span class="text-blue-400">🔍</span>
                Track Your Ticket
              </h3>
            </div>
            <div class="card-body">
              <div class="space-y-4">
                <input
                  v-model="trackTicketId"
                  type="text"
                  placeholder="Enter ticket ID (e.g., TKT-XXXXX)"
                  class="form-input font-mono text-sm"
                />
                <button 
                  @click="trackTicket"
                  class="track-btn"
                  :disabled="!trackTicketId.trim()"
                >
                  <span>🔎</span>
                  Find Ticket
                </button>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div class="support-card">
            <div class="card-header compact">
              <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                <span class="text-green-400">📞</span>
                Other Ways to Reach Us
              </h3>
            </div>
            <div class="card-body">
              <div class="contact-info">
                <div class="contact-item">
                  <span class="contact-icon">📧</span>
                  <span class="contact-text">support@quickhelp.lol</span>
                </div>
                <div class="contact-item">
                  <span class="contact-icon">⏰</span>
                  <span class="contact-text">Response within 24 hours</span>
                </div>
              </div>
            </div>
          </div>

          <!-- My Tickets (if logged in) -->
          <div v-if="isAuthenticated" class="support-card">
            <div class="card-header compact">
              <h3 class="text-lg font-semibold text-white flex items-center gap-2">
                <span class="text-purple-400">📋</span>
                My Tickets
              </h3>
            </div>
            <div class="card-body">
              <div class="my-tickets">
                <div 
                  v-for="ticket in myTickets.slice(0, 5)" 
                  :key="ticket._id"
                  @click="openTicket(ticket)"
                  class="my-ticket-item"
                >
                  <div class="ticket-item-header">
                    <span class="ticket-item-id">#{{ ticket.ticketId }}</span>
                    <span :class="['ticket-status-badge', ticket.status]">
                      {{ ticket.status }}
                    </span>
                  </div>
                <p class="text-white text-sm truncate">{{ ticket.subject }}</p>
                </div>
              </div>
              <p v-if="!myTickets.length" class="text-slate-500 text-sm text-center py-4">
                No tickets yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Ticket Detail Modal -->
    <div v-if="selectedTicket" class="modal-overlay" @click.self="selectedTicket = null">
      <div class="ticket-modal animate-scale-in">
        <!-- Header -->
        <div class="modal-header">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <span class="text-slate-400 font-mono text-sm">#{{ selectedTicket.ticketId }}</span>
              <span :class="['ticket-status-badge', selectedTicket.status]">
                {{ selectedTicket.status }}
              </span>
            </div>
            <h2 class="text-xl font-bold text-white">{{ selectedTicket.subject }}</h2>
          </div>
          <button @click="selectedTicket = null" class="modal-close-btn">×</button>
        </div>

        <!-- Messages -->
        <div class="modal-messages">
          <!-- Original message -->
          <div class="message-original">
            <p class="text-slate-200">{{ selectedTicket.description }}</p>
            <p class="text-slate-500 text-sm mt-3">You • {{ formatDate(selectedTicket.createdAt) }}</p>
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
            class="text-center py-6 text-slate-500 text-sm">
            This ticket has been {{ selectedTicket.status }}.
          </div>
        </div>

        <!-- Reply (if not closed) -->
        <div v-if="selectedTicket.status !== 'closed'" class="modal-footer">
          <div class="flex gap-3">
            <input
              v-model="replyMessage"
              type="text"
              placeholder="Type your message..."
              class="form-input flex-1"
              @keyup.enter="sendTicketReply"
            />
            <button 
              @click="sendTicketReply" 
              class="reply-btn"
              :disabled="!replyMessage.trim() || isSending"
            >
              {{ isSending ? '...' : 'Send →' }}
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

const priorities: { value: 'low' | 'medium' | 'high' | 'urgent'; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
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

useHead({ title: 'Support - QuickHelp.lol' })
</script>

<style scoped>
/* Support Page Styles */
.support-page {
  position: relative;
  background: linear-gradient(180deg, #030712 0%, #0a1628 50%, #030712 100%);
}

.support-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.8));
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.support-card:hover {
  border-color: rgba(6, 182, 212, 0.3);
}

.card-header {
  padding: 24px;
  background: rgba(6, 182, 212, 0.03);
  border-bottom: 1px solid rgba(6, 182, 212, 0.1);
}

.card-header.compact {
  padding: 18px 20px;
}

.card-body {
  padding: 24px;
}

/* Form Elements */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #94a3b8;
}

.label-icon {
  font-size: 16px;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus {
  border-color: #06b6d4;
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.15), 0 0 20px rgba(6, 182, 212, 0.1);
}

.form-input::placeholder {
  color: #64748b;
}

.form-textarea {
  resize: none;
  line-height: 1.6;
}

/* Priority Selector */
.priority-selector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.priority-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(100, 116, 139, 0.3);
  border-radius: 12px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.priority-btn:hover {
  border-color: rgba(100, 116, 139, 0.5);
  background: rgba(30, 41, 59, 0.6);
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.priority-btn.low.active {
  background: rgba(100, 116, 139, 0.2);
  border-color: #64748b;
  color: #94a3b8;
}

.priority-btn.medium.active {
  background: rgba(234, 179, 8, 0.15);
  border-color: #eab308;
  color: #facc15;
}

.priority-btn.high.active {
  background: rgba(249, 115, 22, 0.15);
  border-color: #f97316;
  color: #fb923c;
}

.priority-btn.urgent.active {
  background: rgba(239, 68, 68, 0.15);
  border-color: #ef4444;
  color: #f87171;
}

/* Alerts */
.alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.alert-success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.alert-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.ticket-code {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(6, 182, 212, 0.2);
  border-radius: 6px;
  color: #22d3ee;
  font-family: monospace;
  font-weight: 600;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 18px 32px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(6, 182, 212, 0.5);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-arrow {
  transition: transform 0.3s;
}

.submit-btn:hover .btn-arrow {
  transform: translateX(4px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Quick Links */
.quick-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quick-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.quick-link:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.3);
}

.quick-link-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.quick-link-content {
  flex: 1;
  min-width: 0;
}

.quick-link-title {
  color: white;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
}

.quick-link:hover .quick-link-title {
  color: #22d3ee;
}

.quick-link-desc {
  color: #64748b;
  font-size: 12px;
}

.quick-link-arrow {
  color: #64748b;
  font-size: 18px;
  transition: all 0.3s;
}

.quick-link:hover .quick-link-arrow {
  color: #22d3ee;
  transform: translateX(4px);
}

/* Track Button */
.track-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.track-btn:hover:not(:disabled) {
  background: rgba(6, 182, 212, 0.15);
  border-color: #06b6d4;
}

.track-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
  font-size: 14px;
}

.contact-icon {
  font-size: 18px;
}

/* My Tickets */
.my-tickets {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.my-ticket-item {
  padding: 14px 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.my-ticket-item:hover {
  background: rgba(6, 182, 212, 0.1);
  border-color: rgba(6, 182, 212, 0.3);
}

.ticket-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ticket-item-id {
  font-family: monospace;
  font-size: 12px;
  color: #64748b;
}

.ticket-status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.ticket-status-badge.open {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}

.ticket-status-badge.in-progress {
  background: rgba(6, 182, 212, 0.15);
  color: #22d3ee;
}

.ticket-status-badge.resolved {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}

.ticket-status-badge.closed {
  background: rgba(100, 116, 139, 0.2);
  color: #94a3b8;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 100;
}

.ticket-modal {
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
}

.modal-header {
  padding: 24px;
  background: rgba(6, 182, 212, 0.03);
  border-bottom: 1px solid rgba(6, 182, 212, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.modal-close-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #f87171;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
}

.modal-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message-original {
  padding: 20px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-radius: 16px;
}

.chat-bubble {
  max-width: 75%;
  padding: 14px 18px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
}

.chat-bubble.sent {
  align-self: flex-end;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-bubble.received {
  align-self: flex-start;
  background: rgba(30, 41, 59, 0.8);
  color: white;
  border: 1px solid rgba(6, 182, 212, 0.1);
  border-bottom-left-radius: 4px;
}

.modal-footer {
  padding: 20px 24px;
  background: rgba(6, 182, 212, 0.03);
  border-top: 1px solid rgba(6, 182, 212, 0.1);
}

.reply-btn {
  padding: 14px 28px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.reply-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(6, 182, 212, 0.4);
}

.reply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Animations */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease;
}

/* Responsive */
@media (max-width: 640px) {
  .priority-selector {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .card-header, .card-body {
    padding: 18px;
  }
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
