import { getDb } from '../../utils/mongodb'
import { verifyToken } from '../../utils/auth'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { subject, message, category } = body

  if (!subject || !message) {
    throw createError({
      statusCode: 400,
      message: 'Subject and message are required'
    })
  }

  const db = await getDb()
  
  // Check if user is logged in
  let userId = null
  let username = 'Guest'
  let email = null

  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    const payload = verifyToken(token)
    if (payload) {
      userId = payload.id
      username = payload.username
      email = payload.email
    }
  }

  const ticketId = uuidv4().substring(0, 8).toUpperCase()
  
  const ticket = {
    ticketId,
    userId,
    username,
    email,
    subject,
    category: category || 'general',
    status: 'open',
    priority: 'normal',
    createdAt: new Date(),
    updatedAt: new Date(),
    assignedTo: null,
    messages: [{
      id: uuidv4(),
      sender: username,
      senderRole: userId ? 'user' : 'guest',
      content: message,
      timestamp: new Date()
    }]
  }

  await db.collection('tickets').insertOne(ticket)

  return {
    success: true,
    ticket: {
      ticketId,
      subject,
      status: 'open',
      createdAt: ticket.createdAt
    }
  }
})
