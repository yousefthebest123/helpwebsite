import { getDb } from '../../utils/mongodb'
import { comparePassword, generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  const db = await getDb()
  
  const user = await db.collection('users').findOne({ email })

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  }

  const isValidPassword = await comparePassword(password, user.password)

  if (!isValidPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid email or password'
    })
  }

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    role: user.role
  })

  return {
    success: true,
    token,
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
