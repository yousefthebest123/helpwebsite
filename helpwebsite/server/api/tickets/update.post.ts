import { getDb } from '../../utils/mongodb'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyToken(token)

  if (!payload || !['owner', 'admin', 'support'].includes(payload.role)) {
    throw createError({ statusCode: 403, message: 'Staff access required' })
  }

  const body = await readBody(event)
  const { ticketId, status, priority, assignedTo } = body

  if (!ticketId) {
    throw createError({ statusCode: 400, message: 'Ticket ID required' })
  }

  const db = await getDb()
  
  const updates: any = { updatedAt: new Date() }
  
  if (status) updates.status = status
  if (priority) updates.priority = priority
  if (assignedTo !== undefined) updates.assignedTo = assignedTo

  await db.collection('tickets').updateOne(
    { ticketId },
    { $set: updates }
  )

  return { success: true }
})
