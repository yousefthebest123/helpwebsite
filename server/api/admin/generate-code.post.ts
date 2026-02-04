import { getDb } from '../../utils/mongodb'
import { verifyToken, generateCode } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]
  const payload = verifyToken(token)

  if (!payload || payload.role !== 'owner') {
    throw createError({ statusCode: 403, message: 'Owner access required' })
  }

  const body = await readBody(event)
  const { username, role } = body

  if (!username || !role || !['support', 'admin'].includes(role)) {
    throw createError({
      statusCode: 400,
      message: 'Username and valid role (support/admin) required'
    })
  }

  const db = await getDb()
  const code = generateCode(10)

  // Check if username already exists
  const existing = await db.collection('support_members').findOne({ username })
  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Username already exists'
    })
  }

  const member = {
    username,
    role,
    code,
    active: true,
    createdAt: new Date(),
    createdBy: 'owner',
    lastLogin: null
  }

  await db.collection('support_members').insertOne(member)

  return {
    success: true,
    member: {
      username,
      role,
      code
    }
  }
})
