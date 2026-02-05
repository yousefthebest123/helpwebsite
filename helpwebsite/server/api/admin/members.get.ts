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
  const members = await db.collection('support_members')
    .find({})
    .project({ password: 0 })
    .sort({ createdAt: -1 })
    .toArray()

  return {
    success: true,
    members
  }
})
