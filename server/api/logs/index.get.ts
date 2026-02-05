import { getDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { type, level, limit, page } = query as { 
    type?: string
    level?: string
    limit?: string
    page?: string
  }

  const db = await getDb()

  // Build query
  const logQuery: any = {}
  
  if (type) {
    logQuery.type = type
  }
  
  if (level) {
    logQuery.level = level
  }

  const pageNum = parseInt(page || '1')
  const limitNum = parseInt(limit || '50')
  const skip = (pageNum - 1) * limitNum

  const [logs, total] = await Promise.all([
    db.collection('system_logs')
      .find(logQuery)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray(),
    db.collection('system_logs').countDocuments(logQuery)
  ])

  return {
    success: true,
    logs: logs.map(l => ({
      id: l._id.toString(),
      timestamp: l.timestamp,
      type: l.type,
      level: l.level,
      message: l.message,
      user: l.user,
      metadata: l.metadata
    })),
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    }
  }
})
