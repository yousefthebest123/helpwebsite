import { getDb } from '../../utils/mongodb'
import { generateToken } from '../../utils/auth'

// Owner credentials from login.txt
const OWNER_USER = 'ysf'
const OWNER_PASS = 'ysfak1410@!'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password, code } = body

  const db = await getDb()

  // Owner login
  if (username && password) {
    if (username === OWNER_USER && password === OWNER_PASS) {
      const token = generateToken({
        id: 'owner',
        username: OWNER_USER,
        role: 'owner'
      })

      return {
        success: true,
        token,
        user: {
          id: 'owner',
          username: OWNER_USER,
          role: 'owner'
        }
      }
    }
    
    throw createError({
      statusCode: 401,
      message: 'Invalid owner credentials'
    })
  }

  // Support/Admin login with code
  if (code) {
    const member = await db.collection('support_members').findOne({ code, active: true })

    if (!member) {
      throw createError({
        statusCode: 401,
        message: 'Invalid or inactive code'
      })
    }

    // Update last login
    await db.collection('support_members').updateOne(
      { _id: member._id },
      { $set: { lastLogin: new Date() } }
    )

    const token = generateToken({
      id: member._id.toString(),
      username: member.name,
      role: member.role
    })

    return {
      success: true,
      token,
      user: {
        id: member._id.toString(),
        username: member.name,
        role: member.role
      }
    }
  }

  throw createError({
    statusCode: 400,
    message: 'Provide owner credentials or support code'
  })
})
