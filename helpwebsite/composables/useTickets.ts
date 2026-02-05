// Composable for managing support tickets
import { ref } from 'vue'

interface Message {
  id: string
  content: string
  sender: 'user' | 'staff'
  senderName: string
  timestamp: Date
}

interface Ticket {
  _id: string
  ticketId: string
  subject: string
  description: string
  status: 'open' | 'in-progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  userId?: string
  guestEmail?: string
  guestName?: string
  assignedTo?: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

const tickets = ref<Ticket[]>([])
const currentTicket = ref<Ticket | null>(null)
const isLoading = ref(false)

export function useTickets() {
  const { token, staffToken } = useAuth()

  // Create a new ticket
  const createTicket = async (data: {
    subject: string
    description: string
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    guestEmail?: string
    guestName?: string
  }) => {
    isLoading.value = true
    try {
      const headers: Record<string, string> = {}
      if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }

      const response = await $fetch<{ success: boolean; ticket: Ticket; error?: string }>('/api/tickets/create', {
        method: 'POST',
        headers,
        body: data
      })

      if (response.success && response.ticket) {
        tickets.value.unshift(response.ticket)
        return { success: true, ticket: response.ticket }
      }
      return { success: false, error: response.error || 'Failed to create ticket' }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to create ticket' }
    } finally {
      isLoading.value = false
    }
  }

  // Fetch tickets
  const fetchTickets = async (filters?: { status?: string; priority?: string }) => {
    isLoading.value = true
    try {
      const headers: Record<string, string> = {}
      if (staffToken.value) {
        headers.Authorization = `Bearer ${staffToken.value}`
      } else if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }

      const queryParams = new URLSearchParams()
      if (filters?.status) queryParams.set('status', filters.status)
      if (filters?.priority) queryParams.set('priority', filters.priority)

      const response = await $fetch<{ success: boolean; tickets: Ticket[]; error?: string }>(
        `/api/tickets?${queryParams.toString()}`,
        { headers }
      )

      if (response.success && response.tickets) {
        tickets.value = response.tickets
        return { success: true, tickets: response.tickets }
      }
      return { success: false, error: response.error || 'Failed to fetch tickets' }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch tickets' }
    } finally {
      isLoading.value = false
    }
  }

  // Get single ticket by ID
  const getTicket = async (ticketId: string) => {
    isLoading.value = true
    try {
      const headers: Record<string, string> = {}
      if (staffToken.value) {
        headers.Authorization = `Bearer ${staffToken.value}`
      } else if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }

      const response = await $fetch<{ success: boolean; tickets: Ticket[] }>(
        `/api/tickets?ticketId=${ticketId}`,
        { headers }
      )

      if (response.success && response.tickets?.length > 0) {
        currentTicket.value = response.tickets[0]
        return { success: true, ticket: response.tickets[0] }
      }
      return { success: false, error: 'Ticket not found' }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to fetch ticket' }
    } finally {
      isLoading.value = false
    }
  }

  // Send message to ticket
  const sendMessage = async (ticketId: string, content: string) => {
    try {
      const headers: Record<string, string> = {}
      if (staffToken.value) {
        headers.Authorization = `Bearer ${staffToken.value}`
      } else if (token.value) {
        headers.Authorization = `Bearer ${token.value}`
      }

      const response = await $fetch<{ success: boolean; message: Message; error?: string }>('/api/tickets/message', {
        method: 'POST',
        headers,
        body: { ticketId, content }
      })

      if (response.success && response.message && currentTicket.value) {
        currentTicket.value.messages.push(response.message)
        return { success: true, message: response.message }
      }
      return { success: false, error: response.error || 'Failed to send message' }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to send message' }
    }
  }

  // Update ticket (staff only)
  const updateTicket = async (ticketId: string, updates: {
    status?: 'open' | 'in-progress' | 'resolved' | 'closed'
    priority?: 'low' | 'medium' | 'high' | 'urgent'
    assignedTo?: string
  }) => {
    if (!staffToken.value) return { success: false, error: 'Unauthorized' }

    try {
      const response = await $fetch<{ success: boolean; ticket: Ticket; error?: string }>('/api/tickets/update', {
        method: 'POST',
        headers: { Authorization: `Bearer ${staffToken.value}` },
        body: { ticketId, ...updates }
      })

      if (response.success && response.ticket) {
        // Update in list
        const index = tickets.value.findIndex(t => t.ticketId === ticketId)
        if (index !== -1) {
          tickets.value[index] = response.ticket
        }
        if (currentTicket.value?.ticketId === ticketId) {
          currentTicket.value = response.ticket
        }
        return { success: true, ticket: response.ticket }
      }
      return { success: false, error: response.error || 'Failed to update ticket' }
    } catch (error: any) {
      return { success: false, error: error.data?.error || 'Failed to update ticket' }
    }
  }

  return {
    tickets,
    currentTicket,
    isLoading,
    createTicket,
    fetchTickets,
    getTicket,
    sendMessage,
    updateTicket
  }
}
