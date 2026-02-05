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

  if (!payload) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  if (payload.role !== 'user') {
    return { success: true, user: payload }
  }

  const db = await getDb()
  
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(payload.id) },
    { projection: { password: 0 } }
  )

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return {
    success: true,
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      settings: user.settings,
      savedData: user.savedData
    }
  }
})
