import { Hono } from 'hono';
import { db } from '../db.js';
import { boards, boardMembers } from '../schema.js';
import { eq, or } from 'drizzle-orm';

const app = new Hono();

// GET /boards — tableros del usuario
app.get('/', async (c) => {
  const userId = c.get('userId');
  const rows = await db
    .select()
    .from(boards)
    .where(eq(boards.userId, userId));
  return c.json(rows);
});

// POST /boards — crear tablero
app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [board] = await db
    .insert(boards)
    .values({ ...body, userId })
    .returning();
  return c.json(board, 201);
});

// PUT /boards/:id — editar tablero
app.put('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  const body = await c.req.json();
  const [board] = await db
    .update(boards)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(boards.id, id))
    .returning();
  return c.json(board);
});

// DELETE /boards/:id — eliminar tablero
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  await db.delete(boards).where(eq(boards.id, id));
  return c.json({ ok: true });
});

export default app;
