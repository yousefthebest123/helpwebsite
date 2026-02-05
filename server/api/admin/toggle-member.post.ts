import { getDb } from '../../utils/mongodb'
import { verifyToken } from '../../utils/auth'
import { ObjectId } from 'mongodb'

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

  const body = await readBody(event)
  const { memberId, active } = body

  if (!memberId || typeof active !== 'boolean') {
    throw createError({
      statusCode: 400,
      message: 'Member ID and active status required'
    })
  }

  const db = await getDb()
  
  await db.collection('support_members').updateOne(
    { _id: new ObjectId(memberId) },
    { $set: { active } }
  )

  return { success: true }
})
