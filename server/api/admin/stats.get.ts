import { getDb } from '../../utils/mongodb'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyToken(token)

  if (!payload || !['owner', 'admin'].includes(payload.role)) {
    throw createError({ statusCode: 403, message: 'Admin access required' })
  }

  const db = await getDb()
  
  const totalUsers = await db.collection('users').countDocuments()
  const totalTickets = await db.collection('tickets').countDocuments()
  const openTickets = await db.collection('tickets').countDocuments({ status: 'open' })
  const totalMembers = await db.collection('support_members').countDocuments()
  const activeMembers = await db.collection('support_members').countDocuments({ active: true })
  
  const recentTickets = await db.collection('tickets')
    .find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray()

  const recentUsers = await db.collection('users')
    .find({})
    .project({ password: 0 })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray()

  return {
    success: true,
    stats: {
      totalUsers,
      totalTickets,
      openTickets,
      totalMembers,
      activeMembers
    },
    recentTickets,
    recentUsers
  }
})
