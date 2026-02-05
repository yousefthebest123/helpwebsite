import { getDb } from '../../utils/mongodb'
import { hashPassword, generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body

  if (!username || !email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Username, email, and password are required'
    })
  }

  if (password.length < 6) {
    throw createError({
      statusCode: 400,
      message: 'Password must be at least 6 characters'
    })
  }

  const db = await getDb()
  
  // Check if user exists
  const existingUser = await db.collection('users').findOne({
    $or: [{ email }, { username }]
  })

  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'User with this email or username already exists'
    })
  }

  const hashedPassword = await hashPassword(password)
  
  const user = {
    username,
    email,
    password: hashedPassword,
    role: 'user',
    createdAt: new Date(),
    settings: {
      theme: 'dark',
      notifications: true
    },
    savedData: {
      notes: [],
      flashcards: [],
      moods: [],
      tasks: [],
      palettes: []
    }
  }

  const result = await db.collection('users').insertOne(user)
  
  const token = generateToken({
    id: result.insertedId.toString(),
    email,
    username,
    role: 'user'
  })

  return {
    success: true,
    token,
    user: {
      id: result.insertedId.toString(),
      username,
      email,
      role: 'user',
      settings: user.settings
    }
  }
})
