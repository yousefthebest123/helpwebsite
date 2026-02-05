import { getDb } from '../../utils/mongodb'
import { verifyToken } from '../../utils/auth'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { ticketId, message } = body

  if (!ticketId || !message) {
    throw createError({
      statusCode: 400,
      message: 'Ticket ID and message required'
    })
  }

  const db = await getDb()
  
  const ticket = await db.collection('tickets').findOne({ ticketId })
  
  if (!ticket) {
    throw createError({ statusCode: 404, message: 'Ticket not found' })
  }

  let senderName = 'Guest'
  let senderRole = 'guest'

  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const payload = verifyToken(token)
    if (payload) {
      senderName = payload.username
      senderRole = payload.role
    }
  }

  const newMessage = {
    id: uuidv4(),
    sender: senderName,
    senderRole,
    content: message,
    timestamp: new Date()
  }

  await db.collection('tickets').updateOne(
    { ticketId },
    {
      $push: { messages: newMessage } as any,
      $set: { updatedAt: new Date() }
    }
  )

  return {
    success: true,
    message: newMessage
  }
})
