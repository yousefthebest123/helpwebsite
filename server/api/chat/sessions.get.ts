import { getDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { status, assignedTo } = query as { status?: string; assignedTo?: string }

  const db = await getDb()

  // Build query
  const sessionQuery: any = {}
  
  if (status) {
    sessionQuery.status = status
  }
  
  if (assignedTo) {
    sessionQuery.assignedTo = assignedTo
  }

  const sessions = await db.collection('chat_sessions')
    .find(sessionQuery)
    .sort({ lastMessageAt: -1 })
    .limit(50)
    .toArray()

  // Get last message for each session
  const sessionsWithMessages = await Promise.all(
    sessions.map(async (session) => {
      const lastMessage = await db.collection('chat_messages')
        .find({ sessionId: session._id.toString() })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray()

      return {
        id: session._id.toString(),
        userName: session.userName,
        userEmail: session.userEmail,
        status: session.status,
        createdAt: session.createdAt,
        lastMessageAt: session.lastMessageAt,
        lastMessage: lastMessage[0]?.content || '',
        unread: session.unreadByStaff || 0,
        assignedTo: session.assignedTo
      }
    })
  )

  return {
    success: true,
    sessions: sessionsWithMessages
  }
})
