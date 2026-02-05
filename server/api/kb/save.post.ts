import { getDb } from '../../utils/mongodb'
import { ObjectId } from 'mongodb'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, title, content, excerpt, category, published, author } = body

  if (!title || !content || !category) {
    throw createError({
      statusCode: 400,
      message: 'Title, content, and category are required'
    })
  }

  const db = await getDb()

  if (id) {
    // Update existing article
    const result = await db.collection('kb_articles').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          excerpt: excerpt || content.substring(0, 150) + '...',
          category,
          published: published !== false,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      throw createError({
        statusCode: 404,
        message: 'Article not found'
      })
    }

    return {
      success: true,
      id
    }
  } else {
    // Create new article
    const article = {
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      category,
      published: published !== false,
      views: 0,
      author: author || 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('kb_articles').insertOne(article)

    return {
      success: true,
      id: result.insertedId.toString()
    }
  }
})
