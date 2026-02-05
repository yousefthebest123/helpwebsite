import { getDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { category, search } = query as { category?: string; search?: string }

  const db = await getDb()

  // Build query
  const articleQuery: any = { published: true }
  
  if (category) {
    articleQuery.category = category
  }
  
  if (search) {
    articleQuery.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } }
    ]
  }

  const articles = await db.collection('kb_articles')
    .find(articleQuery)
    .sort({ updatedAt: -1 })
    .toArray()

  // Get categories with counts
  const categories = await db.collection('kb_articles').aggregate([
    { $match: { published: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]).toArray()

  return {
    success: true,
    articles: articles.map(a => ({
      id: a._id.toString(),
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      views: a.views || 0,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt
    })),
    categories: categories.map(c => ({
      name: c._id,
      count: c.count
    }))
  }
})
