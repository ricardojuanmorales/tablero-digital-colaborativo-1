import { Hono } from 'hono';
import { db } from '../db.js';
import { posts } from '../schema.js';
import { eq, and } from 'drizzle-orm';

const app = new Hono();

// GET /boards/:boardId/posts
app.get('/', async (c) => {
  const boardId = c.req.param('boardId');
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.boardId, boardId))
      .orderBy(posts.createdAt);
    return c.json(rows);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// POST /boards/:boardId/posts
app.post('/', async (c) => {
  const userId = c.get('userId');
  const boardId = c.req.param('boardId');
  try {
    const body = await c.req.json();
    const [post] = await db
      .insert(posts)
      .values({ ...body, boardId, userId })
      .returning();
    return c.json(post, 201);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// PUT /boards/:boardId/posts/:id (solo el autor del post)
app.put('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const [post] = await db
      .update(posts)
      .set(body)
      .where(and(eq(posts.id, id), eq(posts.userId, userId)))
      .returning();
    if (!post) return c.json({ error: 'No encontrado o sin permiso' }, 404);
    return c.json(post);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// DELETE /boards/:boardId/posts/:id (solo el autor del post)
app.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  try {
    const [deleted] = await db
      .delete(posts)
      .where(and(eq(posts.id, id), eq(posts.userId, userId)))
      .returning();
    if (!deleted) return c.json({ error: 'No encontrado o sin permiso' }, 404);
    return c.json({ ok: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

export default app;
