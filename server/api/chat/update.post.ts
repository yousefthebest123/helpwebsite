import { getDb } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { sessionId, status, assignedTo, markReadByStaff, markReadByUser } = body

  if (!sessionId) {
    throw createError({
      statusCode: 400,
      message: 'Session ID is required'
    })
  }

  const db = await getDb()

  const updateData: any = {
    updatedAt: new Date()
  }

  if (status) {
    if (!['active', 'closed', 'waiting'].includes(status)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid status'
      })
    }
    updateData.status = status
  }

  if (assignedTo !== undefined) {
    updateData.assignedTo = assignedTo
  }

  if (markReadByStaff) {
    updateData.unreadByStaff = 0
  }

  if (markReadByUser) {
    updateData.unreadByUser = 0
  }

  const result = await db.collection('chat_sessions').updateOne(
    { _id: new ObjectId(sessionId) },
    { $set: updateData }
  )

  if (result.matchedCount === 0) {
    throw createError({
      statusCode: 404,
      message: 'Chat session not found'
    })
  }

  // If closing, add system message
  if (status === 'closed') {
    await db.collection('chat_messages').insertOne({
      sessionId,
      content: 'Chat session ended',
      sender: 'system',
      timestamp: new Date()
    })
  }

  return {
    success: true
  }
})
