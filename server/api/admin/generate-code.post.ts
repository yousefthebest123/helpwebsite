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
  const { name, role } = body

  if (!name || !role || !['support', 'admin'].includes(role)) {
    throw createError({
      statusCode: 400,
      message: 'Name and valid role (support/admin) required'
    })
  }

  const db = await getDb()
  const code = generateCode(10)

  const member = {
    name,
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
      name,
      role,
      code
    }
  }
})
