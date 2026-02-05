import { getDb } from './mongodb'

type LogLevel = 'info' | 'warning' | 'error' | 'debug'
type LogType = 'auth' | 'ticket' | 'chat' | 'admin' | 'system' | 'user'

interface LogEntry {
  type: LogType
  level: LogLevel
  message: string
  user?: string
  metadata?: Record<string, any>
}

export async function logEvent(entry: LogEntry) {
  try {
    const db = await getDb()
    
    await db.collection('system_logs').insertOne({
      ...entry,
      timestamp: new Date()
    })
  } catch (error) {
    // Fail silently - logging should not break the app
    console.error('Failed to log event:', error)
  }
}

export async function logInfo(type: LogType, message: string, user?: string, metadata?: Record<string, any>) {
  await logEvent({ type, level: 'info', message, user, metadata })
}

export async function logWarning(type: LogType, message: string, user?: string, metadata?: Record<string, any>) {
  await logEvent({ type, level: 'warning', message, user, metadata })
}

export async function logError(type: LogType, message: string, user?: string, metadata?: Record<string, any>) {
  await logEvent({ type, level: 'error', message, user, metadata })
}
