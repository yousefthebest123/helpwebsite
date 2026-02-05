import { getDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userName, userEmail } = body

  if (!userName || !userEmail) {
    throw createError({
      statusCode: 400,
      message: 'Name and email are required'
    })
  }

  const db = await getDb()
  
  // Check if there's an existing active session for this email
  const existingSession = await db.collection('chat_sessions').findOne({
    userEmail,
    status: 'active'
  })

  if (existingSession) {
    return {
      success: true,
      sessionId: existingSession._id.toString(),
      isExisting: true
    }
  }

  // Create new chat session
  const session = {
    userName,
    userEmail,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessageAt: new Date(),
    unreadByStaff: 0,
    unreadByUser: 0,
    assignedTo: null
  }

  const result = await db.collection('chat_sessions').insertOne(session)

  // Add system message
  await db.collection('chat_messages').insertOne({
    sessionId: result.insertedId.toString(),
    content: `Chat started with ${userName}`,
    sender: 'system',
    timestamp: new Date()
  })

  return {
    success: true,
    sessionId: result.insertedId.toString(),
    isExisting: false
  }
})
