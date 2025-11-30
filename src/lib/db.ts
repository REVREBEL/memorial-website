import type { Memory } from './memoryStore';

export interface DbMemory {
  id: string;
  headline: string;
  name: string;
  email: string;
  photo_url: string | null;
  video_url: string | null;
  short_memory: string;
  full_story: string;
  tags: string; // JSON string
  created_at: string;
  updated_at: string;
}

export interface DbLike {
  id: number;
  memory_id: string;
  ip_address: string | null;
  user_agent: string | null;
  session_id: string;
  created_at: string;
}

/**
 * Get the D1 database instance from Astro locals
 */
export function getDb(locals: any): D1Database {
  const db = locals?.runtime?.env?.DB;
  if (!db) {
    throw new Error('Database not available. Make sure D1 binding is configured in wrangler.jsonc');
  }
  return db;
}

/**
 * Convert database memory row to API memory format
 */
export function dbMemoryToMemory(dbMemory: DbMemory, likesCount: number): Memory {
  return {
    id: dbMemory.id,
    headline: dbMemory.headline,
    name: dbMemory.name,
    email: dbMemory.email,
    photo: dbMemory.photo_url || undefined,
    video: dbMemory.video_url || undefined,
    shortMemory: dbMemory.short_memory,
    fullStory: dbMemory.full_story,
    tags: dbMemory.tags ? JSON.parse(dbMemory.tags) : [],
    likes: likesCount,
    createdAt: dbMemory.created_at,
  };
}

/**
 * Get all memories with their like counts
 */
export async function getAllMemories(db: D1Database): Promise<Memory[]> {
  const { results } = await db
    .prepare(`
      SELECT 
        m.*,
        COUNT(l.id) as likes_count
      FROM memories m
      LEFT JOIN likes l ON m.id = l.memory_id
      GROUP BY m.id
      ORDER BY m.created_at DESC
    `)
    .all<DbMemory & { likes_count: number }>();

  if (!results) return [];

  return results.map(row => dbMemoryToMemory(row, row.likes_count));
}

/**
 * Get a single memory by ID with its like count
 */
export async function getMemoryById(db: D1Database, id: string): Promise<Memory | null> {
  const result = await db
    .prepare(`
      SELECT 
        m.*,
        COUNT(l.id) as likes_count
      FROM memories m
      LEFT JOIN likes l ON m.id = l.memory_id
      WHERE m.id = ?
      GROUP BY m.id
    `)
    .bind(id)
    .first<DbMemory & { likes_count: number }>();

  if (!result) return null;

  return dbMemoryToMemory(result, result.likes_count);
}

/**
 * Create a new memory
 */
export async function createMemory(
  db: D1Database,
  memory: Omit<Memory, 'id' | 'createdAt' | 'likes'>
): Promise<Memory> {
  const id = `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  await db
    .prepare(`
      INSERT INTO memories (
        id, headline, name, email, photo_url, video_url,
        short_memory, full_story, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      memory.headline,
      memory.name,
      memory.email,
      memory.photo || null,
      memory.video || null,
      memory.shortMemory,
      memory.fullStory,
      JSON.stringify(memory.tags),
      now,
      now
    )
    .run();

  return {
    id,
    ...memory,
    likes: 0,
    createdAt: now,
  };
}

/**
 * Toggle like for a memory
 * Returns the updated like count
 */
export async function toggleLike(
  db: D1Database,
  memoryId: string,
  sessionId: string,
  ipAddress?: string,
  userAgent?: string
): Promise<{ liked: boolean; likesCount: number }> {
  // Check if user already liked this memory
  const existingLike = await db
    .prepare('SELECT id FROM likes WHERE memory_id = ? AND session_id = ?')
    .bind(memoryId, sessionId)
    .first<{ id: number }>();

  if (existingLike) {
    // Unlike - remove the like
    await db
      .prepare('DELETE FROM likes WHERE memory_id = ? AND session_id = ?')
      .bind(memoryId, sessionId)
      .run();

    // Get updated count
    const countResult = await db
      .prepare('SELECT COUNT(*) as count FROM likes WHERE memory_id = ?')
      .bind(memoryId)
      .first<{ count: number }>();

    return {
      liked: false,
      likesCount: countResult?.count || 0,
    };
  } else {
    // Like - add the like
    const now = new Date().toISOString();
    await db
      .prepare(`
        INSERT INTO likes (memory_id, session_id, ip_address, user_agent, created_at)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(memoryId, sessionId, ipAddress || null, userAgent || null, now)
      .run();

    // Get updated count
    const countResult = await db
      .prepare('SELECT COUNT(*) as count FROM likes WHERE memory_id = ?')
      .bind(memoryId)
      .first<{ count: number }>();

    return {
      liked: true,
      likesCount: countResult?.count || 0,
    };
  }
}

/**
 * Check if a session has liked a memory
 */
export async function hasLiked(
  db: D1Database,
  memoryId: string,
  sessionId: string
): Promise<boolean> {
  const result = await db
    .prepare('SELECT id FROM likes WHERE memory_id = ? AND session_id = ?')
    .bind(memoryId, sessionId)
    .first<{ id: number }>();

  return !!result;
}

/**
 * Generate a session ID from IP and User Agent
 * This creates a consistent identifier for anonymous users
 */
export function generateSessionId(ipAddress?: string, userAgent?: string): string {
  const base = `${ipAddress || 'unknown'}-${userAgent || 'unknown'}`;
  // Simple hash function for session ID
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    const char = base.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `session_${Math.abs(hash)}`;
}
