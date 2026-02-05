<template>
  <div class="admin-dashboard">
    <!-- Admin Navigation -->
    <nav class="admin-nav">
      <div class="nav-content">
        <div class="nav-left">
          <NuxtLink to="/" class="brand-logo">
            <div class="logo-icon">
              <span>⚡</span>
            </div>
            <span class="logo-text">
              <span class="text-gradient">Quick</span>Help
            </span>
          </NuxtLink>
          <div class="nav-divider"></div>
          <span class="nav-title">Admin Panel</span>
        </div>

        <div class="nav-right">
          <div class="user-info">
            <div class="status-dot"></div>
            <span class="username">{{ staffUser?.username }}</span>
            <span :class="['role-badge', staffUser?.role]">
              {{ staffUser?.role === 'owner' ? '👑' : staffUser?.role === 'admin' ? '👨‍💼' : '🎧' }}
              {{ staffUser?.role }}
            </span>
          </div>
          <button @click="handleLogout" class="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Layout -->
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="activeSection = item.id"
            :class="['nav-item', { active: activeSection === item.id }]"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </button>
        </nav>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h4>Quick Actions</h4>
          <button v-if="isOwner" @click="showCodeModal = true" class="action-btn">
            ➕ Generate Code
          </button>
          <NuxtLink to="/support" class="action-btn">
            💬 View Support Page
          </NuxtLink>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Dashboard Section -->
        <section v-if="activeSection === 'dashboard'" class="section animate-fade-in">
          <div class="section-header">
            <h1>Dashboard Overview</h1>
            <p>Welcome back, {{ staffUser?.username }}! Here's what's happening.</p>
          </div>
          
          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card cyan">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.totalUsers }}</span>
                <span class="stat-label">Total Users</span>
              </div>
              <div class="stat-trend up">+12%</div>
            </div>

            <div class="stat-card green">
              <div class="stat-icon">🎫</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.openTickets }}</span>
                <span class="stat-label">Open Tickets</span>
              </div>
              <div class="stat-trend">Active</div>
            </div>

            <div class="stat-card purple">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.resolvedTickets }}</span>
                <span class="stat-label">Resolved Today</span>
              </div>
            </div>

            <div class="stat-card orange">
              <div class="stat-icon">👨‍💼</div>
              <div class="stat-info">
                <span class="stat-value">{{ stats.activeStaff }}</span>
                <span class="stat-label">Active Staff</span>
              </div>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="dashboard-grid">
            <!-- Recent Activity -->
            <div class="dashboard-card activity-card">
              <div class="card-header">
                <h3>📊 Recent Activity</h3>
              </div>
              <div class="activity-list">
                <div v-for="activity in stats.recentActivity" :key="activity._id" class="activity-item">
                  <div :class="['activity-icon', activity.type]">
                    {{ activity.type === 'ticket' ? '🎫' : activity.type === 'user' ? '👤' : '💬' }}
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">{{ activity.description }}</p>
                    <span class="activity-time">{{ formatDate(activity.createdAt) }}</span>
                  </div>
                </div>
                <div v-if="!stats.recentActivity?.length" class="empty-state">
                  <span>📋</span>
                  <p>No recent activity</p>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>⚡ Quick Stats</h3>
              </div>
              <div class="quick-stats">
                <div class="quick-stat-item">
                  <span class="label">Response Time</span>
                  <span class="value">~5 min</span>
                </div>
                <div class="quick-stat-item">
                  <span class="label">Resolution Rate</span>
                  <span class="value">94%</span>
                </div>
                <div class="quick-stat-item">
                  <span class="label">User Satisfaction</span>
                  <span class="value">4.8/5</span>
                </div>
                <div class="quick-stat-item">
                  <span class="label">Active Sessions</span>
                  <span class="value">{{ stats.totalUsers > 0 ? Math.floor(stats.totalUsers * 0.1) : 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Tickets Section -->
        <section v-if="activeSection === 'tickets'" class="section animate-fade-in">
          <div class="section-header">
            <div>
              <h1>Support Tickets</h1>
              <p>Manage and respond to user support requests</p>
            </div>
            <div class="filter-row">
              <select v-model="ticketFilter.status" class="filter-select">
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <select v-model="ticketFilter.priority" class="filter-select">
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div class="tickets-list">
            <div 
              v-for="ticket in tickets" 
              :key="ticket._id"
              @click="openTicketModal(ticket)"
              class="ticket-card"
            >
              <div class="ticket-header">
                <div class="ticket-info">
                  <span class="ticket-id">#{{ ticket.ticketId }}</span>
                  <span :class="['status-badge', ticket.status]">{{ ticket.status }}</span>
                  <span :class="['priority-badge', ticket.priority]">{{ ticket.priority }}</span>
                </div>
                <span class="ticket-date">{{ formatDate(ticket.createdAt) }}</span>
              </div>
              <h3 class="ticket-subject">{{ ticket.subject }}</h3>
              <p class="ticket-preview">{{ ticket.description }}</p>
              <div class="ticket-footer">
                <span class="ticket-from">From: {{ ticket.guestName || ticket.userId || 'Anonymous' }}</span>
                <span class="ticket-messages">{{ ticket.messages?.length || 0 }} messages</span>
              </div>
            </div>
            
            <div v-if="!tickets.length" class="empty-state large">
              <span>🎫</span>
              <h3>No Tickets Found</h3>
              <p>Tickets will appear here when users create support requests</p>
            </div>
          </div>
        </section>

        <!-- Team Section (Owner Only) -->
        <section v-if="activeSection === 'team' && isOwner" class="section animate-fade-in">
          <div class="section-header">
            <div>
              <h1>Team Management</h1>
              <p>Manage your support staff and administrators</p>
            </div>
            <button @click="showCodeModal = true" class="primary-btn">
              ➕ Generate Access Code
            </button>
          </div>

          <div class="team-grid">
            <div v-for="member in members" :key="member._id" class="member-card">
              <div class="member-avatar">
                {{ member.role === 'admin' ? '👨‍💼' : '🎧' }}
              </div>
              <div class="member-info">
                <h3>{{ member.username }}</h3>
                <span :class="['role-tag', member.role]">{{ member.role }}</span>
              </div>
              <div class="member-status">
                <div :class="['status-indicator', { active: member.active }]"></div>
                <span>{{ member.active ? 'Active' : 'Inactive' }}</span>
              </div>
              <div class="member-actions">
                <button 
                  @click="toggleMember(member._id, !member.active)"
                  :class="['toggle-btn', { deactivate: member.active }]"
                >
                  {{ member.active ? 'Deactivate' : 'Activate' }}
                </button>
              </div>
            </div>
            
            <div v-if="!members.length" class="empty-state large">
              <span>👥</span>
              <h3>No Team Members Yet</h3>
              <p>Generate access codes to add staff members</p>
              <button @click="showCodeModal = true" class="primary-btn">
                Generate First Code
              </button>
            </div>
          </div>
        </section>

        <!-- Live Chat Section -->
        <section v-if="activeSection === 'livechat'" class="section animate-fade-in">
          <div class="section-header">
            <div>
              <h1>Live Chat</h1>
              <p>Chat with users in real-time</p>
            </div>
          </div>

          <div class="chat-container">
            <div class="chat-sidebar">
              <div class="chat-search">
                <input type="text" placeholder="Search conversations..." v-model="chatSearch" />
              </div>
              <div class="chat-list">
                <div 
                  v-for="chat in filteredChats" 
                  :key="chat.id"
                  @click="selectChat(chat)"
                  :class="['chat-item', { active: selectedChat?.id === chat.id }]"
                >
                  <div class="chat-avatar">{{ chat.userName?.charAt(0) || '?' }}</div>
                  <div class="chat-preview">
                    <span class="chat-name">{{ chat.userName || 'Anonymous' }}</span>
                    <span class="chat-last">{{ chat.lastMessage || 'No messages yet' }}</span>
                  </div>
                  <div class="chat-meta">
                    <span class="chat-time">{{ formatTime(chat.lastMessageTime) }}</span>
                    <span v-if="chat.unread" class="unread-badge">{{ chat.unread }}</span>
                  </div>
                </div>
                <div v-if="!filteredChats.length" class="empty-state">
                  <span>💬</span>
                  <p>No active chats</p>
                </div>
              </div>
            </div>

            <div class="chat-main">
              <div v-if="selectedChat" class="chat-active">
                <div class="chat-header">
                  <div class="chat-user-info">
                    <div class="chat-avatar large">{{ selectedChat.userName?.charAt(0) || '?' }}</div>
                    <div>
                      <h3>{{ selectedChat.userName || 'Anonymous' }}</h3>
                      <span class="online-status">{{ selectedChat.status === 'active' ? 'Online' : 'Offline' }}</span>
                    </div>
                  </div>
                  <div class="chat-header-actions">
                    <button @click="closeChatSession" class="end-chat-btn" title="End Chat">🔚</button>
                    <button @click="selectedChat = null; stopChatMessagesPolling()" class="close-chat">✕</button>
                  </div>
                </div>

                <div class="chat-messages" ref="chatMessagesRef">
                  <div 
                    v-for="msg in selectedChat.messages" 
                    :key="msg.id"
                    :class="['chat-message', msg.sender === 'staff' ? 'sent' : 'received']"
                  >
                    <p>{{ msg.content }}</p>
                    <span class="message-time">{{ formatTime(msg.timestamp) }}</span>
                  </div>
                </div>

                <div class="chat-input">
                  <input 
                    type="text" 
                    v-model="chatMessage"
                    placeholder="Type your message..."
                    @keyup.enter="sendChatMessage"
                  />
                  <button @click="sendChatMessage" :disabled="!chatMessage.trim()">
                    Send 📤
                  </button>
                </div>
              </div>

              <div v-else class="chat-empty">
                <span>💬</span>
                <h3>Select a Conversation</h3>
                <p>Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Analytics Section -->
        <section v-if="activeSection === 'analytics'" class="section animate-fade-in">
          <div class="section-header">
            <h1>Analytics</h1>
            <p>Track performance metrics and trends</p>
          </div>
          
          <div class="analytics-grid">
            <!-- Performance Overview -->
            <div class="analytics-card full-width">
              <div class="card-header">
                <h3>📈 Weekly Overview</h3>
                <div class="time-filter">
                  <button :class="{ active: analyticsTimeframe === 'week' }" @click="analyticsTimeframe = 'week'">Week</button>
                  <button :class="{ active: analyticsTimeframe === 'month' }" @click="analyticsTimeframe = 'month'">Month</button>
                  <button :class="{ active: analyticsTimeframe === 'year' }" @click="analyticsTimeframe = 'year'">Year</button>
                </div>
              </div>
              <div class="chart-container">
                <div class="mini-chart">
                  <div v-for="(val, i) in weeklyData" :key="i" class="chart-bar" :style="{ height: (val / maxWeeklyValue * 100) + '%' }">
                    <span class="bar-value">{{ val }}</span>
                  </div>
                </div>
                <div class="chart-labels">
                  <span v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">{{ day }}</span>
                </div>
              </div>
            </div>

            <!-- Ticket Stats -->
            <div class="analytics-card">
              <div class="card-header">
                <h3>🎫 Ticket Metrics</h3>
              </div>
              <div class="metric-list">
                <div class="metric-item">
                  <span class="metric-label">Avg Response Time</span>
                  <span class="metric-value good">4.2 min</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Avg Resolution Time</span>
                  <span class="metric-value">2.3 hours</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">First Contact Resolution</span>
                  <span class="metric-value good">78%</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">Ticket Backlog</span>
                  <span class="metric-value">{{ stats.openTickets }} tickets</span>
                </div>
              </div>
            </div>

            <!-- User Satisfaction -->
            <div class="analytics-card">
              <div class="card-header">
                <h3>⭐ User Satisfaction</h3>
              </div>
              <div class="satisfaction-display">
                <div class="satisfaction-score">4.8</div>
                <div class="satisfaction-stars">⭐⭐⭐⭐⭐</div>
                <p>Based on {{ Math.floor(stats.resolvedTickets * 0.6) }} reviews</p>
              </div>
              <div class="rating-breakdown">
                <div class="rating-row">
                  <span>5 ⭐</span>
                  <div class="rating-bar"><div class="rating-fill" style="width: 75%"></div></div>
                  <span>75%</span>
                </div>
                <div class="rating-row">
                  <span>4 ⭐</span>
                  <div class="rating-bar"><div class="rating-fill" style="width: 18%"></div></div>
                  <span>18%</span>
                </div>
                <div class="rating-row">
                  <span>3 ⭐</span>
                  <div class="rating-bar"><div class="rating-fill" style="width: 5%"></div></div>
                  <span>5%</span>
                </div>
                <div class="rating-row">
                  <span>2 ⭐</span>
                  <div class="rating-bar"><div class="rating-fill" style="width: 1%"></div></div>
                  <span>1%</span>
                </div>
                <div class="rating-row">
                  <span>1 ⭐</span>
                  <div class="rating-bar"><div class="rating-fill" style="width: 1%"></div></div>
                  <span>1%</span>
                </div>
              </div>
            </div>

            <!-- Team Performance -->
            <div class="analytics-card">
              <div class="card-header">
                <h3>👥 Team Performance</h3>
              </div>
              <div class="team-leaderboard">
                <div class="leaderboard-item">
                  <span class="rank gold">🥇</span>
                  <span class="name">{{ staffUser?.username }}</span>
                  <span class="tickets-resolved">{{ Math.floor(stats.resolvedTickets * 0.4) }} resolved</span>
                </div>
                <div class="leaderboard-item">
                  <span class="rank silver">🥈</span>
                  <span class="name">Support Agent 2</span>
                  <span class="tickets-resolved">{{ Math.floor(stats.resolvedTickets * 0.35) }} resolved</span>
                </div>
                <div class="leaderboard-item">
                  <span class="rank bronze">🥉</span>
                  <span class="name">Support Agent 3</span>
                  <span class="tickets-resolved">{{ Math.floor(stats.resolvedTickets * 0.25) }} resolved</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Knowledge Base Section -->
        <section v-if="activeSection === 'knowledgebase'" class="section animate-fade-in">
          <div class="section-header">
            <div>
              <h1>Knowledge Base</h1>
              <p>Manage help articles and FAQs</p>
            </div>
            <button @click="showArticleModal = true" class="primary-btn">
              ➕ New Article
            </button>
          </div>
          
          <div class="kb-grid">
            <div v-for="article in kbArticles" :key="article.id" class="kb-card">
              <div class="kb-category">{{ article.category }}</div>
              <h3>{{ article.title }}</h3>
              <p>{{ article.excerpt }}</p>
              <div class="kb-meta">
                <span>📅 {{ formatDate(article.updatedAt) }}</span>
                <span>👁️ {{ article.views }} views</span>
              </div>
              <div class="kb-actions">
                <button class="edit-btn">✏️ Edit</button>
                <button class="delete-btn">🗑️ Delete</button>
              </div>
            </div>
            
            <div class="kb-card add-new" @click="showArticleModal = true">
              <span>➕</span>
              <p>Add New Article</p>
            </div>
          </div>
        </section>

        <!-- System Logs Section (Owner Only) -->
        <section v-if="activeSection === 'logs' && isOwner" class="section animate-fade-in">
          <div class="section-header">
            <div>
              <h1>System Logs</h1>
              <p>View system activity and audit logs</p>
            </div>
            <div class="log-filters">
              <select v-model="logFilter.type" class="filter-select">
                <option value="">All Types</option>
                <option value="auth">Authentication</option>
                <option value="ticket">Tickets</option>
                <option value="admin">Admin Actions</option>
                <option value="system">System</option>
              </select>
              <select v-model="logFilter.level" class="filter-select">
                <option value="">All Levels</option>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
          
          <div class="logs-table">
            <div class="logs-header">
              <span>Timestamp</span>
              <span>Type</span>
              <span>Level</span>
              <span>Message</span>
              <span>User</span>
            </div>
            <div v-for="log in systemLogs" :key="log.id" :class="['log-row', log.level]">
              <span class="log-time">{{ formatDate(log.timestamp) }}</span>
              <span class="log-type">{{ log.type }}</span>
              <span :class="['log-level', log.level]">{{ log.level }}</span>
              <span class="log-message">{{ log.message }}</span>
              <span class="log-user">{{ log.user || 'System' }}</span>
            </div>
            
            <div v-if="!systemLogs.length" class="empty-state">
              <span>📋</span>
              <p>No logs found</p>
            </div>
          </div>
          
          <div class="logs-actions">
            <button class="secondary-btn">📥 Export Logs</button>
            <button class="danger-btn">🗑️ Clear Old Logs</button>
          </div>
        </section>

        <!-- Settings Section -->
        <section v-if="activeSection === 'settings'" class="section animate-fade-in">
          <div class="section-header">
            <h1>Settings</h1>
            <p>Configure your admin preferences</p>
          </div>
          
          <div class="settings-grid">
            <div class="settings-card">
              <div class="settings-header">
                <h3>🔔 Notification Preferences</h3>
              </div>
              <div class="settings-options">
                <label class="setting-option">
                  <div>
                    <span class="option-title">New Ticket Alerts</span>
                    <span class="option-desc">Get notified when new tickets are created</span>
                  </div>
                  <div class="toggle-switch active">
                    <div class="toggle-slider"></div>
                  </div>
                </label>
                <label class="setting-option">
                  <div>
                    <span class="option-title">Urgent Priority Alerts</span>
                    <span class="option-desc">Instant notifications for urgent tickets</span>
                  </div>
                  <div class="toggle-switch active">
                    <div class="toggle-slider"></div>
                  </div>
                </label>
                <label class="setting-option">
                  <div>
                    <span class="option-title">Live Chat Notifications</span>
                    <span class="option-desc">Sound alerts for new chat messages</span>
                  </div>
                  <div class="toggle-switch active">
                    <div class="toggle-slider"></div>
                  </div>
                </label>
              </div>
            </div>

            <div class="settings-card">
              <div class="settings-header">
                <h3>🎨 Appearance</h3>
              </div>
              <div class="settings-options">
                <label class="setting-option">
                  <div>
                    <span class="option-title">Dark Mode</span>
                    <span class="option-desc">Enable dark theme</span>
                  </div>
                  <div class="toggle-switch active">
                    <div class="toggle-slider"></div>
                  </div>
                </label>
                <label class="setting-option">
                  <div>
                    <span class="option-title">Compact Mode</span>
                    <span class="option-desc">Reduce spacing for more content</span>
                  </div>
                  <div class="toggle-switch">
                    <div class="toggle-slider"></div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Generate Code Modal -->
    <div v-if="showCodeModal" class="modal-overlay" @click.self="showCodeModal = false">
      <div class="modal-card">
        <div class="modal-header">
          <h2>➕ Generate Access Code</h2>
          <button @click="closeCodeModal" class="modal-close">✕</button>
        </div>
        
        <form @submit.prevent="handleGenerateCode" class="modal-form">
          <div class="form-group">
            <label>Staff Username</label>
            <input
              v-model="codeForm.username"
              type="text"
              placeholder="Enter username for this staff member"
              required
            />
          </div>

          <div class="form-group">
            <label>Role</label>
            <select v-model="codeForm.role">
              <option value="support">🎧 Support Staff</option>
              <option value="admin">👨‍💼 Administrator</option>
            </select>
          </div>

          <div v-if="codeError" class="code-error">
            <p class="error-label">❌ {{ codeError }}</p>
          </div>

          <div v-if="generatedCode" class="code-result">
            <p class="result-label">✅ Access code generated!</p>
            <div class="code-display">
              <code>{{ generatedCode }}</code>
              <button type="button" @click="copyCode" class="copy-btn">📋 Copy</button>
            </div>
            <p class="result-hint">Share this code with the staff member to grant access</p>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeCodeModal" class="secondary-btn">
              Close
            </button>
            <button type="submit" :disabled="codeLoading || !codeForm.username" class="primary-btn">
              <span v-if="codeLoading" class="loading-spinner"></span>
              {{ codeLoading ? 'Generating...' : 'Generate Code' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div v-if="selectedTicket" class="modal-overlay" @click.self="selectedTicket = null">
      <div class="modal-card large">
        <div class="modal-header">
          <div>
            <div class="ticket-header-info">
              <span class="ticket-id">#{{ selectedTicket.ticketId }}</span>
              <span :class="['status-badge', selectedTicket.status]">{{ selectedTicket.status }}</span>
              <span :class="['priority-badge', selectedTicket.priority]">{{ selectedTicket.priority }}</span>
            </div>
            <h2>{{ selectedTicket.subject }}</h2>
          </div>
          <button @click="selectedTicket = null" class="modal-close">✕</button>
        </div>

        <div class="ticket-content">
          <!-- Original message -->
          <div class="ticket-original">
            <p>{{ selectedTicket.description }}</p>
            <span class="ticket-meta">
              {{ selectedTicket.guestName || 'User' }} • {{ formatDate(selectedTicket.createdAt) }}
            </span>
          </div>

          <!-- Messages -->
          <div class="ticket-messages">
            <div 
              v-for="msg in selectedTicket.messages" 
              :key="msg.id" 
              :class="['message-bubble', msg.sender === 'staff' ? 'sent' : 'received']"
            >
              <p>{{ msg.content }}</p>
              <span class="message-meta">{{ msg.senderName }} • {{ formatDate(msg.timestamp) }}</span>
            </div>
          </div>
        </div>

        <div class="ticket-actions">
          <div class="action-selects">
            <select v-model="selectedTicket.status" @change="updateTicketStatus">
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select v-model="selectedTicket.priority" @change="updateTicketPriority">
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div class="reply-input">
            <input
              v-model="replyMessage"
              type="text"
              placeholder="Type your reply..."
              @keyup.enter="sendReply"
            />
            <button @click="sendReply" :disabled="!replyMessage.trim()">
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
const codeError = ref('')
const codeLoading = ref(false)
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

// Live Chat state
const chatSearch = ref('')
const selectedChat = ref<any>(null)
const chatMessage = ref('')
const chatMessagesRef = ref<HTMLElement | null>(null)

// Analytics state
const analyticsTimeframe = ref('week')
const weeklyData = ref([23, 45, 38, 52, 41, 28, 35])
const maxWeeklyValue = computed(() => Math.max(...weeklyData.value))

// Knowledge Base state
const showArticleModal = ref(false)
const kbArticles = ref<any[]>([])
const kbCategories = ref<any[]>([])
const editingArticle = ref<any>(null)
const articleForm = ref({
  title: '',
  content: '',
  excerpt: '',
  category: 'General',
  published: true
})

// System Logs state (Owner only)
const logFilter = ref({ type: '', level: '' })
const systemLogs = ref<any[]>([])
const logsLoading = ref(false)

const liveChats = ref<any[]>([])
const chatPollingInterval = ref<NodeJS.Timeout | null>(null)
const chatMessagesPollingInterval = ref<NodeJS.Timeout | null>(null)

const filteredChats = computed(() => {
  if (!chatSearch.value) return liveChats.value
  return liveChats.value.filter(chat => 
    chat.userName?.toLowerCase().includes(chatSearch.value.toLowerCase()) ||
    chat.lastMessage?.toLowerCase().includes(chatSearch.value.toLowerCase())
  )
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
  { id: 'livechat', label: 'Live Chat', icon: '💬', badge: liveChats.value.reduce((acc, c) => acc + (c.unread || 0), 0) || undefined },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'knowledgebase', label: 'Knowledge Base', icon: '📚' },
  ...(isOwner.value ? [{ id: 'team', label: 'Team', icon: '👥' }] : []),
  ...(isOwner.value ? [{ id: 'logs', label: 'System Logs', icon: '📋' }] : []),
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

  if (statsResult.success && 'stats' in statsResult) {
    stats.value = statsResult.stats
  }

  if (isOwner.value) {
    const membersResult = await getSupportMembers()
    if (membersResult.success && 'members' in membersResult) {
      members.value = membersResult.members
    }
    // Fetch system logs for owner
    fetchSystemLogs()
  }
  
  // Fetch chat sessions and start polling
  startChatSessionsPolling()
  
  // Fetch KB articles
  fetchKbArticles()
}

// Cleanup on unmount
onUnmounted(() => {
  stopChatSessionsPolling()
  stopChatMessagesPolling()
})

const handleLogout = () => {
  staffLogout()
  router.push('/staff/login')
}

const handleGenerateCode = async () => {
  if (!codeForm.value.username.trim()) {
    codeError.value = 'Please enter a username'
    return
  }
  
  codeLoading.value = true
  codeError.value = ''
  
  try {
    const result = await generateStaffCode(codeForm.value.role, codeForm.value.username)
    if (result.success && 'code' in result) {
      generatedCode.value = result.code
      codeForm.value = { username: '', role: 'support' }
      await loadData()
    } else {
      codeError.value = result.error || 'Failed to generate code'
    }
  } catch (error: any) {
    codeError.value = error.message || 'An unexpected error occurred'
  } finally {
    codeLoading.value = false
  }
}

const closeCodeModal = () => {
  showCodeModal.value = false
  generatedCode.value = ''
  codeError.value = ''
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

// Live Chat functions
const fetchChatSessions = async () => {
  try {
    const response = await $fetch<{ success: boolean; sessions: any[] }>('/api/chat/sessions')
    if (response.success) {
      liveChats.value = response.sessions.map(s => ({
        id: s.id,
        userName: s.userName,
        userEmail: s.userEmail,
        lastMessage: s.lastMessage,
        lastMessageTime: new Date(s.lastMessageAt),
        unread: s.unread,
        status: s.status,
        messages: []
      }))
    }
  } catch (error) {
    console.error('Failed to fetch chat sessions:', error)
  }
}

const fetchChatMessages = async (sessionId: string) => {
  try {
    const response = await $fetch<{ success: boolean; messages: any[] }>('/api/chat/messages', {
      query: { sessionId }
    })
    if (response.success) {
      return response.messages.map(m => ({
        id: m.id,
        content: m.content,
        sender: m.sender,
        senderName: m.senderName,
        timestamp: new Date(m.timestamp)
      }))
    }
  } catch (error) {
    console.error('Failed to fetch chat messages:', error)
  }
  return []
}

const selectChat = async (chat: any) => {
  selectedChat.value = chat
  
  // Fetch messages for this chat
  const messages = await fetchChatMessages(chat.id)
  selectedChat.value.messages = messages
  
  // Mark as read
  chat.unread = 0
  try {
    await $fetch('/api/chat/update', {
      method: 'POST',
      body: { sessionId: chat.id, markReadByStaff: true }
    })
  } catch (error) {
    console.error('Failed to mark chat as read:', error)
  }
  
  // Start polling for new messages in this chat
  startChatMessagesPolling()
}

const startChatMessagesPolling = () => {
  stopChatMessagesPolling()
  chatMessagesPollingInterval.value = setInterval(async () => {
    if (selectedChat.value) {
      const messages = await fetchChatMessages(selectedChat.value.id)
      selectedChat.value.messages = messages
      nextTick(() => {
        if (chatMessagesRef.value) {
          chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
        }
      })
    }
  }, 3000)
}

const stopChatMessagesPolling = () => {
  if (chatMessagesPollingInterval.value) {
    clearInterval(chatMessagesPollingInterval.value)
    chatMessagesPollingInterval.value = null
  }
}

const startChatSessionsPolling = () => {
  fetchChatSessions()
  chatPollingInterval.value = setInterval(fetchChatSessions, 5000)
}

const stopChatSessionsPolling = () => {
  if (chatPollingInterval.value) {
    clearInterval(chatPollingInterval.value)
    chatPollingInterval.value = null
  }
}

const sendChatMessage = async () => {
  if (!selectedChat.value || !chatMessage.value.trim()) return
  
  const content = chatMessage.value.trim()
  chatMessage.value = ''
  
  // Add locally for responsiveness
  const tempId = 'temp-' + Date.now()
  selectedChat.value.messages.push({
    id: tempId,
    content,
    sender: 'staff',
    senderName: staffUser.value?.username || 'Support',
    timestamp: new Date()
  })
  
  nextTick(() => {
    if (chatMessagesRef.value) {
      chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
    }
  })
  
  try {
    await $fetch('/api/chat/send', {
      method: 'POST',
      body: {
        sessionId: selectedChat.value.id,
        content,
        sender: 'staff',
        senderName: staffUser.value?.username || 'Support'
      }
    })
    
    selectedChat.value.lastMessage = content
    selectedChat.value.lastMessageTime = new Date()
  } catch (error) {
    console.error('Failed to send message:', error)
    // Remove temp message on error
    selectedChat.value.messages = selectedChat.value.messages.filter((m: any) => m.id !== tempId)
  }
}

const closeChatSession = async () => {
  if (!selectedChat.value) return
  
  try {
    await $fetch('/api/chat/update', {
      method: 'POST',
      body: { sessionId: selectedChat.value.id, status: 'closed' }
    })
    selectedChat.value = null
    stopChatMessagesPolling()
    await fetchChatSessions()
  } catch (error) {
    console.error('Failed to close chat:', error)
  }
}

// Knowledge Base functions
const fetchKbArticles = async () => {
  try {
    const response = await $fetch<{ success: boolean; articles: any[]; categories: any[] }>('/api/kb/articles')
    if (response.success) {
      kbArticles.value = response.articles
      kbCategories.value = response.categories
    }
  } catch (error) {
    console.error('Failed to fetch KB articles:', error)
  }
}

const openArticleModal = (article?: any) => {
  if (article) {
    editingArticle.value = article
    articleForm.value = {
      title: article.title,
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category,
      published: article.published !== false
    }
  } else {
    editingArticle.value = null
    articleForm.value = {
      title: '',
      content: '',
      excerpt: '',
      category: 'General',
      published: true
    }
  }
  showArticleModal.value = true
}

const saveArticle = async () => {
  if (!articleForm.value.title || !articleForm.value.content) return
  
  try {
    await $fetch('/api/kb/save', {
      method: 'POST',
      body: {
        id: editingArticle.value?.id,
        ...articleForm.value,
        author: staffUser.value?.username
      }
    })
    showArticleModal.value = false
    await fetchKbArticles()
  } catch (error) {
    console.error('Failed to save article:', error)
  }
}

const deleteArticle = async (id: string) => {
  if (!confirm('Are you sure you want to delete this article?')) return
  
  try {
    await $fetch('/api/kb/delete', {
      method: 'POST',
      body: { id }
    })
    await fetchKbArticles()
  } catch (error) {
    console.error('Failed to delete article:', error)
  }
}

// System Logs functions
const fetchSystemLogs = async () => {
  logsLoading.value = true
  try {
    const params: any = {}
    if (logFilter.value.type) params.type = logFilter.value.type
    if (logFilter.value.level) params.level = logFilter.value.level
    
    const response = await $fetch<{ success: boolean; logs: any[] }>('/api/logs', { query: params })
    if (response.success) {
      systemLogs.value = response.logs
    }
  } catch (error) {
    console.error('Failed to fetch logs:', error)
  } finally {
    logsLoading.value = false
  }
}

// Watch for log filter changes
watch(logFilter, () => {
  fetchSystemLogs()
}, { deep: true })

const formatDate = (date: any) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatTime = (date: any) => {
  if (!date) return ''
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

useHead({
  title: 'Admin Dashboard - QuickHelp.lol'
})

definePageMeta({
  layout: 'admin'
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #030712 0%, #0a1628 50%, #030712 100%);
}

.admin-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(124, 58, 237, 0.2);
}

.nav-content {
  max-width: 100%;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.text-gradient {
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: rgba(100, 116, 139, 0.3);
}

.nav-title {
  color: #94a3b8;
  font-size: 14px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.username {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.role-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.owner { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
.role-badge.admin { background: rgba(124, 58, 237, 0.2); color: #a78bfa; }
.role-badge.support { background: rgba(16, 185, 129, 0.2); color: #34d399; }

.logout-btn {
  padding: 8px 16px;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s;
}

.logout-btn:hover { color: #f87171; }

.admin-layout {
  display: flex;
  padding-top: 72px;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 72px;
  bottom: 0;
  width: 260px;
  background: rgba(15, 23, 42, 0.8);
  border-right: 1px solid rgba(124, 58, 237, 0.1);
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: none;
  border: none;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: rgba(30, 41, 59, 0.5);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(59, 130, 246, 0.2));
  color: #a78bfa;
  border: 1px solid rgba(124, 58, 237, 0.3);
}

.nav-icon { font-size: 20px; }
.nav-label { flex: 1; }

.nav-badge {
  padding: 2px 8px;
  background: #ef4444;
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.quick-actions {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid rgba(124, 58, 237, 0.1);
}

.quick-actions h4 {
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 13px;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(124, 58, 237, 0.1);
  color: #a78bfa;
  border-color: rgba(124, 58, 237, 0.3);
}

.main-content {
  flex: 1;
  margin-left: 260px;
  padding: 32px;
  min-height: calc(100vh - 72px);
}

.section { max-width: 1400px; }

.section-header { margin-bottom: 32px; }

.section-header h1 {
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-header p {
  color: #94a3b8;
  font-size: 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(124, 58, 237, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-card.cyan .stat-icon { background: rgba(124, 58, 237, 0.2); }
.stat-card.green .stat-icon { background: rgba(16, 185, 129, 0.2); }
.stat-card.purple .stat-icon { background: rgba(139, 92, 246, 0.2); }
.stat-card.orange .stat-icon { background: rgba(249, 115, 22, 0.2); }

.stat-info { flex: 1; }
.stat-value { display: block; color: white; font-size: 28px; font-weight: 700; }
.stat-label { color: #94a3b8; font-size: 14px; }

.stat-trend {
  padding: 4px 10px;
  background: rgba(124, 58, 237, 0.1);
  color: #a78bfa;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.stat-trend.up { background: rgba(16, 185, 129, 0.1); color: #34d399; }

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}

.dashboard-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.card-header h3 { color: white; font-size: 16px; font-weight: 600; }

.activity-list {
  padding: 16px 24px;
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 12px;
  margin-bottom: 10px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.activity-icon.ticket { background: rgba(124, 58, 237, 0.2); }
.activity-icon.user { background: rgba(16, 185, 129, 0.2); }
.activity-icon.message { background: rgba(139, 92, 246, 0.2); }

.activity-content { flex: 1; min-width: 0; }
.activity-text { color: white; font-size: 14px; margin-bottom: 4px; }
.activity-time { color: #64748b; font-size: 12px; }

.quick-stats { padding: 20px 24px; }

.quick-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.quick-stat-item:last-child { border-bottom: none; }
.quick-stat-item .label { color: #94a3b8; font-size: 14px; }
.quick-stat-item .value { color: #a78bfa; font-size: 16px; font-weight: 600; }

.filter-row { display: flex; gap: 12px; margin-top: 16px; }

.filter-select {
  padding: 10px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.filter-select:focus { border-color: #7c3aed; }

.tickets-list { display: flex; flex-direction: column; gap: 16px; }

.ticket-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.ticket-card:hover {
  border-color: rgba(124, 58, 237, 0.4);
  transform: translateY(-2px);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.ticket-info { display: flex; align-items: center; gap: 10px; }
.ticket-id { color: #64748b; font-family: monospace; font-size: 13px; }

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.open { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.status-badge.in-progress { background: rgba(124, 58, 237, 0.2); color: #a78bfa; }
.status-badge.resolved { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
.status-badge.closed { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }

.priority-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.priority-badge.urgent { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.priority-badge.high { background: rgba(249, 115, 22, 0.2); color: #fb923c; }
.priority-badge.medium { background: rgba(234, 179, 8, 0.2); color: #facc15; }
.priority-badge.low { background: rgba(100, 116, 139, 0.2); color: #94a3b8; }

.ticket-date { color: #64748b; font-size: 13px; }
.ticket-subject { color: white; font-size: 18px; font-weight: 600; margin-bottom: 8px; }

.ticket-preview {
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;
}

.ticket-footer { display: flex; justify-content: space-between; align-items: center; }
.ticket-from { color: #64748b; font-size: 13px; }
.ticket-messages { color: #a78bfa; font-size: 13px; }

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.member-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-avatar {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.member-info h3 { color: white; font-size: 18px; font-weight: 600; margin-bottom: 6px; }

.role-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-tag.admin { background: rgba(124, 58, 237, 0.2); color: #a78bfa; }
.role-tag.support { background: rgba(16, 185, 129, 0.2); color: #34d399; }

.member-status { display: flex; align-items: center; gap: 8px; }

.status-indicator {
  width: 8px;
  height: 8px;
  background: #64748b;
  border-radius: 50%;
}

.status-indicator.active {
  background: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.member-status span { color: #94a3b8; font-size: 13px; }
.member-actions { margin-top: auto; }

.toggle-btn {
  width: 100%;
  padding: 10px 16px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 10px;
  color: #34d399;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover { background: rgba(16, 185, 129, 0.2); }

.toggle-btn.deactivate {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.toggle-btn.deactivate:hover { background: rgba(239, 68, 68, 0.2); }

.chat-container {
  display: flex;
  height: calc(100vh - 240px);
  min-height: 500px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  overflow: hidden;
}

.chat-sidebar {
  width: 320px;
  border-right: 1px solid rgba(124, 58, 237, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-search { padding: 16px; border-bottom: 1px solid rgba(124, 58, 237, 0.1); }

.chat-search input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  outline: none;
}

.chat-search input:focus { border-color: #7c3aed; }

.chat-list { flex: 1; overflow-y: auto; }

.chat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(124, 58, 237, 0.05);
}

.chat-item:hover { background: rgba(30, 41, 59, 0.4); }
.chat-item.active { background: rgba(124, 58, 237, 0.1); }

.chat-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
}

.chat-avatar.large { width: 48px; height: 48px; }

.chat-preview { flex: 1; min-width: 0; }
.chat-name { display: block; color: white; font-size: 14px; font-weight: 600; margin-bottom: 4px; }

.chat-last {
  display: block;
  color: #64748b;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.chat-time { color: #64748b; font-size: 12px; }

.unread-badge {
  padding: 2px 8px;
  background: #7c3aed;
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.chat-main { flex: 1; display: flex; flex-direction: column; }
.chat-active { display: flex; flex-direction: column; height: 100%; }

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.chat-user-info { display: flex; align-items: center; gap: 14px; }
.chat-user-info h3 { color: white; font-size: 16px; font-weight: 600; margin-bottom: 2px; }
.online-status { color: #10b981; font-size: 13px; }

.close-chat {
  width: 36px;
  height: 36px;
  background: rgba(30, 41, 59, 0.6);
  border: none;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-chat:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.chat-messages {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message { max-width: 70%; padding: 14px 18px; border-radius: 16px; }

.chat-message.received {
  align-self: flex-start;
  background: rgba(30, 41, 59, 0.8);
  color: white;
  border-bottom-left-radius: 4px;
}

.chat-message.sent {
  align-self: flex-end;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  color: white;
  border-bottom-right-radius: 4px;
}

.chat-message p { font-size: 14px; line-height: 1.5; margin-bottom: 6px; }
.message-time { font-size: 11px; opacity: 0.7; }

.chat-input {
  display: flex;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid rgba(124, 58, 237, 0.1);
}

.chat-input input {
  flex: 1;
  padding: 14px 18px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  outline: none;
}

.chat-input input:focus { border-color: #7c3aed; }

.chat-input button {
  padding: 14px 24px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.chat-input button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.4);
}

.chat-input button:disabled { opacity: 0.5; cursor: not-allowed; }

.chat-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #64748b;
  text-align: center;
}

.chat-empty span { font-size: 48px; margin-bottom: 16px; }
.chat-empty h3 { color: white; font-size: 18px; margin-bottom: 8px; }

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.settings-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(124, 58, 237, 0.15);
  border-radius: 16px;
  overflow: hidden;
}

.settings-header { padding: 20px 24px; border-bottom: 1px solid rgba(124, 58, 237, 0.1); }
.settings-header h3 { color: white; font-size: 16px; font-weight: 600; }
.settings-options { padding: 8px; }

.setting-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.setting-option:hover { background: rgba(30, 41, 59, 0.6); }
.option-title { display: block; color: white; font-size: 14px; font-weight: 500; margin-bottom: 4px; }
.option-desc { display: block; color: #64748b; font-size: 13px; }

.toggle-switch {
  width: 48px;
  height: 26px;
  background: rgba(100, 116, 139, 0.3);
  border-radius: 13px;
  position: relative;
  transition: background 0.3s;
}

.toggle-switch.active { background: #7c3aed; }

.toggle-slider {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-switch.active .toggle-slider { transform: translateX(22px); }

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  text-align: center;
  color: #94a3b8;
}

.empty-state span { font-size: 32px; margin-bottom: 12px; }
.empty-state.large { padding: 64px; }
.empty-state.large span { font-size: 48px; }
.empty-state h3 { color: white; font-size: 18px; margin-bottom: 8px; }
.empty-state p { max-width: 300px; margin-bottom: 20px; color: #64748b; }

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

.modal-card {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.95));
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 20px;
  overflow: hidden;
  animation: modalIn 0.3s ease;
}

.modal-card.large {
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.1);
}

.modal-header h2 { color: white; font-size: 20px; font-weight: 600; }

.modal-close {
  width: 36px;
  height: 36px;
  background: rgba(30, 41, 59, 0.6);
  border: none;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.modal-form { padding: 24px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; color: white; font-size: 14px; font-weight: 500; margin-bottom: 8px; }

.form-group input,
.form-group select {
  width: 100%;
  padding: 14px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus { border-color: #7c3aed; }

.code-result {
  padding: 20px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 12px;
  margin-bottom: 20px;
}

.code-error {
  padding: 16px 20px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  margin-bottom: 20px;
}

.error-label { color: #f87171; font-size: 14px; font-weight: 500; }

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-label { color: #34d399; font-size: 14px; font-weight: 500; margin-bottom: 12px; }
.code-display { display: flex; gap: 12px; }

.code-display code {
  flex: 1;
  padding: 14px 18px;
  background: rgba(30, 41, 59, 0.8);
  border-radius: 10px;
  color: #a78bfa;
  font-family: 'Space Grotesk', monospace;
  font-size: 18px;
  letter-spacing: 3px;
  text-align: center;
}

.copy-btn {
  padding: 14px 18px;
  background: rgba(124, 58, 237, 0.2);
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 10px;
  color: #a78bfa;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-btn:hover { background: rgba(124, 58, 237, 0.3); }
.result-hint { color: #64748b; font-size: 12px; margin-top: 12px; }
.modal-actions { display: flex; gap: 12px; }

.primary-btn,
.secondary-btn {
  flex: 1;
  padding: 14px 24px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn {
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  color: white;
  box-shadow: 0 4px 20px rgba(124, 58, 237, 0.3);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.4);
}

.primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.secondary-btn {
  background: rgba(30, 41, 59, 0.6);
  color: #94a3b8;
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.secondary-btn:hover { background: rgba(30, 41, 59, 0.8); color: white; }

.ticket-header-info { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.ticket-content { flex: 1; overflow-y: auto; padding: 24px; }

.ticket-original {
  padding: 20px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 12px;
  margin-bottom: 20px;
}

.ticket-original p { color: white; font-size: 15px; line-height: 1.6; margin-bottom: 12px; }
.ticket-meta { color: #64748b; font-size: 13px; }

.ticket-messages { display: flex; flex-direction: column; gap: 12px; }
.message-bubble { max-width: 70%; padding: 14px 18px; border-radius: 16px; }

.message-bubble.received {
  align-self: flex-start;
  background: rgba(30, 41, 59, 0.8);
  color: white;
  border-bottom-left-radius: 4px;
}

.message-bubble.sent {
  align-self: flex-end;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble p { font-size: 14px; line-height: 1.5; margin-bottom: 6px; }
.message-meta { font-size: 11px; opacity: 0.7; }

.ticket-actions { padding: 20px 24px; border-top: 1px solid rgba(124, 58, 237, 0.1); }
.action-selects { display: flex; gap: 12px; margin-bottom: 16px; }

.action-selects select {
  flex: 1;
  padding: 12px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  outline: none;
}

.reply-input { display: flex; gap: 12px; }

.reply-input input {
  flex: 1;
  padding: 14px 18px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  outline: none;
}

.reply-input input:focus { border-color: #7c3aed; }

.reply-input button {
  padding: 14px 24px;
  background: linear-gradient(135deg, #7c3aed, #3b82f6);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reply-input button:hover:not(:disabled) { transform: translateY(-2px); }
.reply-input button:disabled { opacity: 0.5; cursor: not-allowed; }

.animate-fade-in { animation: fadeIn 0.4s ease; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 1024px) {
  .sidebar { display: none; }
  .main-content { margin-left: 0; }
  .chat-container { flex-direction: column; }
  .chat-sidebar {
    width: 100%;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid rgba(124, 58, 237, 0.1);
  }
}

@media (max-width: 640px) {
  .nav-content { padding: 12px 16px; }
  .nav-title, .nav-divider { display: none; }
  .main-content { padding: 20px 16px; }
  .section-header h1 { font-size: 24px; }
  .stats-grid { grid-template-columns: 1fr; }
}

/* Analytics Styles */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.analytics-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 16px;
  padding: 24px;
}

.analytics-card.full-width { grid-column: span 2; }

.time-filter {
  display: flex;
  gap: 8px;
}

.time-filter button {
  padding: 8px 16px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 8px;
  color: #94a3b8;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.time-filter button.active {
  background: rgba(124, 58, 237, 0.2);
  border-color: #7c3aed;
  color: #a78bfa;
}

.chart-container { margin-top: 24px; }

.mini-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 150px;
  gap: 12px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #7c3aed, #3b82f6);
  border-radius: 8px 8px 0 0;
  min-height: 20px;
  position: relative;
  transition: height 0.3s;
}

.chart-bar:hover { opacity: 0.8; }

.bar-value {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  color: #a78bfa;
  font-size: 12px;
  font-weight: 600;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.chart-labels span {
  flex: 1;
  text-align: center;
  color: #64748b;
  font-size: 12px;
}

.metric-list { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 10px;
}

.metric-label { color: #94a3b8; font-size: 14px; }
.metric-value { color: white; font-size: 16px; font-weight: 600; }
.metric-value.good { color: #10b981; }

.satisfaction-display { text-align: center; margin: 20px 0; }
.satisfaction-score { font-size: 48px; font-weight: 700; color: #fbbf24; }
.satisfaction-stars { font-size: 24px; margin: 8px 0; }
.satisfaction-display p { color: #64748b; font-size: 13px; }

.rating-breakdown { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }

.rating-row {
  display: grid;
  grid-template-columns: 50px 1fr 40px;
  align-items: center;
  gap: 12px;
}

.rating-row span:first-child { color: #94a3b8; font-size: 12px; }
.rating-row span:last-child { color: white; font-size: 12px; text-align: right; }

.rating-bar {
  height: 8px;
  background: rgba(30, 41, 59, 0.6);
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 4px;
}

.team-leaderboard { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(30, 41, 59, 0.4);
  border-radius: 10px;
}

.leaderboard-item .rank { font-size: 20px; }
.leaderboard-item .name { flex: 1; color: white; font-weight: 500; }
.leaderboard-item .tickets-resolved { color: #a78bfa; font-size: 13px; }

/* Knowledge Base Styles */
.kb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.kb-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s;
}

.kb-card:hover { border-color: rgba(124, 58, 237, 0.3); transform: translateY(-2px); }

.kb-category {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(124, 58, 237, 0.2);
  border-radius: 6px;
  color: #a78bfa;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 12px;
}

.kb-card h3 { color: white; font-size: 16px; margin-bottom: 8px; }
.kb-card p { color: #94a3b8; font-size: 13px; line-height: 1.5; margin-bottom: 16px; }

.kb-meta {
  display: flex;
  gap: 16px;
  color: #64748b;
  font-size: 12px;
  margin-bottom: 16px;
}

.kb-actions { display: flex; gap: 10px; }

.edit-btn, .delete-btn {
  padding: 8px 14px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 8px;
  color: #94a3b8;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn:hover { background: rgba(124, 58, 237, 0.1); color: #a78bfa; }
.delete-btn:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; }

.kb-card.add-new {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-style: dashed;
  cursor: pointer;
  min-height: 200px;
}

.kb-card.add-new span { font-size: 32px; color: #7c3aed; margin-bottom: 8px; }
.kb-card.add-new p { color: #94a3b8; margin: 0; }
.kb-card.add-new:hover { background: rgba(124, 58, 237, 0.05); }

/* System Logs Styles */
.log-filters { display: flex; gap: 12px; }

.logs-table {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6));
  border: 1px solid rgba(124, 58, 237, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

.logs-header {
  display: grid;
  grid-template-columns: 150px 100px 80px 1fr 100px;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(124, 58, 237, 0.1);
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.log-row {
  display: grid;
  grid-template-columns: 150px 100px 80px 1fr 100px;
  gap: 16px;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.05);
  transition: background 0.2s;
}

.log-row:hover { background: rgba(124, 58, 237, 0.05); }
.log-row:last-child { border-bottom: none; }

.log-time { color: #64748b; font-size: 12px; font-family: monospace; }
.log-type { color: #94a3b8; font-size: 13px; text-transform: capitalize; }

.log-level {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.log-level.info { background: rgba(124, 58, 237, 0.2); color: #a78bfa; }
.log-level.warning { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.log-level.error { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.log-message { color: white; font-size: 13px; }
.log-user { color: #64748b; font-size: 12px; }

.logs-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
}

.danger-btn {
  padding: 12px 20px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 10px;
  color: #f87171;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-btn:hover { background: rgba(239, 68, 68, 0.3); }
</style>
