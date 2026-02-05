import { getDb } from '../../utils/mongodb'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { period } = query as { period?: string }

  const db = await getDb()
  const now = new Date()
  
  // Calculate date ranges
  let startDate: Date
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }

  // Get ticket stats
  const [
    totalTickets,
    openTickets,
    resolvedTickets,
    avgResolutionTime,
    ticketsByDay,
    ticketsByPriority,
    ticketsByStatus
  ] = await Promise.all([
    db.collection('tickets').countDocuments({ createdAt: { $gte: startDate } }),
    db.collection('tickets').countDocuments({ status: 'open' }),
    db.collection('tickets').countDocuments({ status: 'resolved', updatedAt: { $gte: startDate } }),
    db.collection('tickets').aggregate([
      { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
      { $project: { 
        resolutionTime: { $subtract: ['$resolvedAt', '$createdAt'] }
      }},
      { $group: { _id: null, avg: { $avg: '$resolutionTime' } } }
    ]).toArray(),
    db.collection('tickets').aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]).toArray(),
    db.collection('tickets').aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]).toArray(),
    db.collection('tickets').aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray()
  ])

  // Get chat stats
  const [
    totalChats,
    activeChats,
    chatsByDay
  ] = await Promise.all([
    db.collection('chat_sessions').countDocuments({ createdAt: { $gte: startDate } }),
    db.collection('chat_sessions').countDocuments({ status: 'active' }),
    db.collection('chat_sessions').aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { _id: 1 } }
    ]).toArray()
  ])

  // Get user stats
  const [
    totalUsers,
    newUsers
  ] = await Promise.all([
    db.collection('users').countDocuments(),
    db.collection('users').countDocuments({ createdAt: { $gte: startDate } })
  ])

  // Get KB stats
  const [
    totalArticles,
    totalViews
  ] = await Promise.all([
    db.collection('kb_articles').countDocuments({ published: true }),
    db.collection('kb_articles').aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]).toArray()
  ])

  // Process daily data for charts
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
    const dateStr = date.toISOString().split('T')[0]
    const ticketData = ticketsByDay.find(d => d._id === dateStr)
    const chatData = chatsByDay.find(d => d._id === dateStr)
    
    days.push({
      date: dateStr,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      tickets: ticketData?.count || 0,
      chats: chatData?.count || 0
    })
  }

  return {
    success: true,
    analytics: {
      tickets: {
        total: totalTickets,
        open: openTickets,
        resolved: resolvedTickets,
        avgResolutionTime: avgResolutionTime[0]?.avg || 0,
        byPriority: ticketsByPriority.reduce((acc, p) => ({ ...acc, [p._id]: p.count }), {}),
        byStatus: ticketsByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
      },
      chats: {
        total: totalChats,
        active: activeChats
      },
      users: {
        total: totalUsers,
        new: newUsers
      },
      knowledgeBase: {
        articles: totalArticles,
        views: totalViews[0]?.total || 0
      },
      daily: days
    }
  }
})
