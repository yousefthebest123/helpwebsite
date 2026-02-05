import { MongoClient, Db } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (db) return db

  const uri = process.env.MONGODB_URI || ''
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  client = new MongoClient(uri)
  await client.connect()
  db = client.db('quickhelp')
  
  // Create indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('users').createIndex({ username: 1 }, { unique: true })
  await db.collection('support_members').createIndex({ code: 1 }, { unique: true })
  await db.collection('tickets').createIndex({ oderId: 1 })
  await db.collection('tickets').createIndex({ status: 1 })
  await db.collection('messages').createIndex({ ticketId: 1 })
  
  return db
}

export async function getDb(): Promise<Db> {
  if (!db) {
    return connectToDatabase()
  }
  return db
}
