import { getDb } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id } = body

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Article ID is required'
    })
  }

  const db = await getDb()

  const result = await db.collection('kb_articles').deleteOne({
    _id: new ObjectId(id)
  })

  if (result.deletedCount === 0) {
    throw createError({
      statusCode: 404,
      message: 'Article not found'
    })
  }

  return {
    success: true
  }
})
