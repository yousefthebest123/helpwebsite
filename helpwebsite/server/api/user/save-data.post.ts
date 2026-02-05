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

  if (!payload || payload.role === 'guest') {
    throw createError({ statusCode: 403, message: 'Login required' })
  }

  const body = await readBody(event)
  const { data } = body

  if (!data) {
    throw createError({ statusCode: 400, message: 'Data required' })
  }

  const db = await getDb()
  
  await db.collection('users').updateOne(
    { _id: new ObjectId(payload.id) },
    { $set: { savedData: data, updatedAt: new Date() } }
  )

  return { success: true }
})
