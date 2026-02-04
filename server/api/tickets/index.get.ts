import { getDb } from '../../utils/mongodb'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { status, ticketId } = query

  const db = await getDb()

  // If ticketId provided, return single ticket
  if (ticketId) {
    const ticket = await db.collection('tickets').findOne({ ticketId: ticketId as string })
    
    if (!ticket) {
      throw createError({ statusCode: 404, message: 'Ticket not found' })
    }

    return { success: true, ticket }
  }

  // Check auth for staff listing
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyToken(token)

  if (!payload) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  let filter: any = {}

  // Regular users can only see their tickets
  if (payload.role === 'user') {
    filter.userId = payload.id
  }

  // Filter by status if provided
  if (status && status !== 'all') {
    filter.status = status
  }

  const tickets = await db.collection('tickets')
    .find(filter)
    .sort({ updatedAt: -1 })
    .toArray()

  return { success: true, tickets }
})
