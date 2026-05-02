import { Hono } from 'hono';
import { db } from '../db.js';
import { posts } from '../schema.js';
import { eq } from 'drizzle-orm';

const app = new Hono();

// GET /boards/:boardId/posts
app.get('/', async (c) => {
  const boardId = c.req.param('boardId');
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.boardId, boardId));
  return c.json(rows);
});

// POST /boards/:boardId/posts
app.post('/', async (c) => {
  const userId = c.get('userId');
  const boardId = c.req.param('boardId');
  const body = await c.req.json();
  const [post] = await db
    .insert(posts)
    .values({ ...body, boardId, userId })
    .returning();
  return c.json(post, 201);
});

// PUT /boards/:boardId/posts/:id
app.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const [post] = await db
    .update(posts)
    .set(body)
    .where(eq(posts.id, id))
    .returning();
  return c.json(post);
});

// DELETE /boards/:boardId/posts/:id
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(posts).where(eq(posts.id, id));
  return c.json({ ok: true });
});

export default app;
