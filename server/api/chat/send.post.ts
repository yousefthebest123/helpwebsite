import { getDb } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { sessionId, content, sender, senderName } = body

  if (!sessionId || !content || !sender) {
    throw createError({
      statusCode: 400,
      message: 'Session ID, content, and sender are required'
    })
  }

  if (!['user', 'staff', 'system'].includes(sender)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid sender type'
    })
  }

  const db = await getDb()
  
  // Verify session exists
  const session = await db.collection('chat_sessions').findOne({
    _id: new ObjectId(sessionId)
  })

  if (!session) {
    throw createError({
      statusCode: 404,
      message: 'Chat session not found'
    })
  }

  // Create message
  const message = {
    sessionId,
    content,
    sender,
    senderName: senderName || (sender === 'user' ? session.userName : 'Support'),
    timestamp: new Date(),
    read: false
  }

  const result = await db.collection('chat_messages').insertOne(message)

  // Update session
  const updateData: any = {
    updatedAt: new Date(),
    lastMessageAt: new Date(),
    lastMessage: content.substring(0, 100)
  }

  if (sender === 'user') {
    updateData.unreadByStaff = (session.unreadByStaff || 0) + 1
  } else if (sender === 'staff') {
    updateData.unreadByUser = (session.unreadByUser || 0) + 1
  }

  await db.collection('chat_sessions').updateOne(
    { _id: new ObjectId(sessionId) },
    { $set: updateData }
  )

  return {
    success: true,
    message: {
      _id: result.insertedId.toString(),
      ...message
    }
  }
})
