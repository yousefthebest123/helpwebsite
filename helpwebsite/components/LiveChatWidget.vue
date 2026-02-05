<template>
  <div class="live-chat-widget">
    <!-- Chat Toggle Button -->
    <button 
      @click="toggleChat"
      :class="['chat-toggle', { active: isOpen }]"
    >
      <span v-if="!isOpen" class="toggle-icon">💬</span>
      <span v-else class="toggle-icon">✕</span>
      <span v-if="unreadCount && !isOpen" class="unread-badge">{{ unreadCount }}</span>
    </button>

    <!-- Chat Window -->
    <Transition name="chat">
      <div v-if="isOpen" class="chat-window">
        <div class="chat-header">
          <div class="header-info">
            <div class="support-avatar">
              <span>🎧</span>
              <span class="online-dot"></span>
            </div>
            <div>
              <h3>Live Support</h3>
              <span class="status">{{ isConnected ? 'Online' : 'Connecting...' }}</span>
            </div>
          </div>
          <button @click="toggleChat" class="close-btn">✕</button>
        </div>

        <div class="chat-body" ref="chatBody">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="welcome-message">
            <div class="welcome-icon">👋</div>
            <h4>Welcome to Live Support!</h4>
            <p>How can we help you today?</p>
            <div class="quick-actions">
              <button @click="sendQuickMessage('I need help with a tool')">
                🛠️ Tool Help
              </button>
              <button @click="sendQuickMessage('I have a technical issue')">
                ⚙️ Technical Issue
              </button>
              <button @click="sendQuickMessage('General question')">
                ❓ General Question
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div 
            v-for="msg in messages" 
            :key="msg.id"
            :class="['message', msg.sender]"
          >
            <div class="message-avatar" v-if="msg.sender === 'support'">
              🎧
            </div>
            <div class="message-content">
              <p>{{ msg.content }}</p>
              <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="typing-indicator">
            <div class="message-avatar">🎧</div>
            <div class="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>

        <!-- User Info Form (if not collected) -->
        <div v-if="!userInfo.collected" class="user-info-form">
          <p>Please provide your info to start chatting:</p>
          <input 
            v-model="userInfo.name" 
            type="text" 
            placeholder="Your name"
          />
          <input 
            v-model="userInfo.email" 
            type="email" 
            placeholder="Your email"
          />
          <button @click="submitUserInfo" :disabled="!userInfo.name || !userInfo.email">
            Start Chat
          </button>
        </div>

        <!-- Chat Input -->
        <div v-else class="chat-input">
          <input 
            v-model="newMessage" 
            type="text" 
            placeholder="Type your message..."
            @keyup.enter="sendMessage"
            :disabled="!isConnected"
          />
          <button @click="sendMessage" :disabled="!newMessage.trim() || !isConnected">
            📤
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const isConnected = ref(true)
const isTyping = ref(false)
const unreadCount = ref(0)
const newMessage = ref('')
const chatBody = ref<HTMLElement | null>(null)

const userInfo = ref({
  name: '',
  email: '',
  collected: false
})

interface Message {
  id: string
  content: string
  sender: 'user' | 'support'
  timestamp: Date
}

const messages = ref<Message[]>([])

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    unreadCount.value = 0
  }
}

const submitUserInfo = () => {
  if (userInfo.value.name && userInfo.value.email) {
    userInfo.value.collected = true
    // Send initial greeting
    setTimeout(() => {
      addSupportMessage(`Hi ${userInfo.value.name}! 👋 Thanks for reaching out. How can I help you today?`)
    }, 1000)
  }
}

const sendQuickMessage = (message: string) => {
  if (!userInfo.value.collected) {
    userInfo.value.collected = true
    userInfo.value.name = 'Guest'
  }
  addUserMessage(message)
  simulateSupportResponse(message)
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return
  
  addUserMessage(newMessage.value)
  const msg = newMessage.value
  newMessage.value = ''
  simulateSupportResponse(msg)
}

const addUserMessage = (content: string) => {
  messages.value.push({
    id: Date.now().toString(),
    content,
    sender: 'user',
    timestamp: new Date()
  })
  scrollToBottom()
}

const addSupportMessage = (content: string) => {
  messages.value.push({
    id: Date.now().toString(),
    content,
    sender: 'support',
    timestamp: new Date()
  })
  
  if (!isOpen.value) {
    unreadCount.value++
  }
  scrollToBottom()
}

const simulateSupportResponse = (userMessage: string) => {
  isTyping.value = true
  scrollToBottom()
  
  const responses: Record<string, string> = {
    'tool': "I'd be happy to help with our tools! Which specific tool are you having trouble with? We have password generators, QR code tools, text converters, and many more.",
    'technical': "I understand you're experiencing a technical issue. Could you please describe what's happening? Include any error messages you're seeing.",
    'general': "Of course! Feel free to ask me anything about QuickHelp. I'm here to assist you.",
    'default': "Thanks for your message! A support team member will respond shortly. In the meantime, is there anything specific I can help you with?"
  }
  
  let response = responses.default
  const lowerMsg = userMessage.toLowerCase()
  
  if (lowerMsg.includes('tool') || lowerMsg.includes('help')) {
    response = responses.tool
  } else if (lowerMsg.includes('technical') || lowerMsg.includes('issue') || lowerMsg.includes('error')) {
    response = responses.technical
  } else if (lowerMsg.includes('general') || lowerMsg.includes('question')) {
    response = responses.general
  }
  
  setTimeout(() => {
    isTyping.value = false
    addSupportMessage(response)
  }, 1500 + Math.random() * 1000)
}

const scrollToBottom = () => {
  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// Load saved user info
onMounted(() => {
  const saved = localStorage.getItem('chat-user-info')
  if (saved) {
    const parsed = JSON.parse(saved)
    userInfo.value = { ...parsed, collected: true }
  }
})

// Save user info when collected
watch(() => userInfo.value.collected, (collected) => {
  if (collected && userInfo.value.name !== 'Guest') {
    localStorage.setItem('chat-user-info', JSON.stringify({
      name: userInfo.value.name,
      email: userInfo.value.email
    }))
  }
})
</script>

<style scoped>
.live-chat-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.chat-toggle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(6, 182, 212, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.chat-toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(6, 182, 212, 0.5);
}

.chat-toggle.active {
  background: linear-gradient(135deg, #64748b, #475569);
}

.toggle-icon {
  font-size: 24px;
}

.unread-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 380px;
  height: 520px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.chat-enter-active,
.chat-leave-active {
  transition: all 0.3s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.support-avatar {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  position: relative;
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #10b981;
  border: 2px solid #06b6d4;
  border-radius: 50%;
}

.chat-header h3 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 2px;
}

.chat-header .status {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.close-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.chat-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.welcome-message {
  text-align: center;
  padding: 20px;
}

.welcome-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.welcome-message h4 {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.welcome-message p {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 20px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-actions button {
  padding: 12px 16px;
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  color: #22d3ee;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.quick-actions button:hover {
  background: rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.4);
}

.message {
  display: flex;
  gap: 10px;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message.support {
  align-self: flex-start;
}

.message-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.message-content {
  padding: 12px 16px;
  border-radius: 16px;
}

.message.support .message-content {
  background: rgba(30, 41, 59, 0.8);
  border-bottom-left-radius: 4px;
}

.message.user .message-content {
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border-bottom-right-radius: 4px;
}

.message-content p {
  color: white;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.message-time {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
}

.typing-indicator {
  display: flex;
  gap: 10px;
  align-items: center;
}

.typing-dots {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 16px;
  border-bottom-left-radius: 4px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  background: #94a3b8;
  border-radius: 50%;
  animation: typingBounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typingBounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.user-info-form {
  padding: 16px 20px;
  border-top: 1px solid rgba(6, 182, 212, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-info-form p {
  color: #94a3b8;
  font-size: 13px;
  text-align: center;
}

.user-info-form input {
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  outline: none;
}

.user-info-form input:focus {
  border-color: #06b6d4;
}

.user-info-form button {
  padding: 12px 16px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.user-info-form button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.user-info-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-input {
  display: flex;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid rgba(6, 182, 212, 0.1);
}

.chat-input input {
  flex: 1;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  outline: none;
}

.chat-input input:focus {
  border-color: #06b6d4;
}

.chat-input button {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #06b6d4, #3b82f6);
  border: none;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-input button:hover:not(:disabled) {
  transform: scale(1.05);
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 48px);
    height: 70vh;
    bottom: 70px;
  }
  
  .live-chat-widget {
    bottom: 16px;
    right: 16px;
  }
}
</style>
