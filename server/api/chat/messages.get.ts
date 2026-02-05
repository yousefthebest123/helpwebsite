import { getDb } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { sessionId, since } = query as { sessionId: string; since?: string }

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      message: 'Session ID is required'
    })
  }

  const db = await getDb()

  // Build query
  const messageQuery: any = { sessionId }
  
  // If 'since' timestamp provided, only get newer messages (for polling)
  if (since) {
    messageQuery.timestamp = { $gt: new Date(since) }
  }

  const messages = await db.collection('chat_messages')
    .find(messageQuery)
    .sort({ timestamp: 1 })
    .toArray()

  // Get session info
  const session = await db.collection('chat_sessions').findOne({
    _id: new ObjectId(sessionId)
  })

  return {
    success: true,
    messages: messages.map(m => ({
      id: m._id.toString(),
      content: m.content,
      sender: m.sender,
      senderName: m.senderName,
      timestamp: m.timestamp,
      read: m.read
    })),
    session: session ? {
      id: session._id.toString(),
      userName: session.userName,
      userEmail: session.userEmail,
      status: session.status,
      assignedTo: session.assignedTo
    } : null
  }
})
