import { getDb } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { id } = query as { id: string }

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Article ID is required'
    })
  }

  const db = await getDb()

  const article = await db.collection('kb_articles').findOne({
    _id: new ObjectId(id)
  })

  if (!article) {
    throw createError({
      statusCode: 404,
      message: 'Article not found'
    })
  }

  // Increment views
  await db.collection('kb_articles').updateOne(
    { _id: new ObjectId(id) },
    { $inc: { views: 1 } }
  )

  return {
    success: true,
    article: {
      id: article._id.toString(),
      title: article.title,
      content: article.content,
      excerpt: article.excerpt,
      category: article.category,
      views: (article.views || 0) + 1,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      author: article.author
    }
  }
})
