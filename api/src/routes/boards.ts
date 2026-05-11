import { Hono } from 'hono';
import { db } from '../db.js';
import { boards, boardMembers } from '../schema.js';
import { eq, or, and, exists } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

const app = new Hono();

// GET /boards — tableros propios + tableros donde el usuario es miembro
app.get('/', async (c) => {
  const userId = c.get('userId');
  try {
    const rows = await db
      .select()
      .from(boards)
      .where(
        or(
          eq(boards.userId, userId),
          exists(
            db.select().from(boardMembers).where(
              and(
                eq(boardMembers.boardId, boards.id),
                eq(boardMembers.userId, userId)
              )
            )
          )
        )
      )
      .orderBy(boards.orderIndex, boards.createdAt);
    return c.json(rows);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// POST /boards — crear tablero
app.post('/', async (c) => {
  const userId = c.get('userId');
  try {
    const body = await c.req.json();
    const [board] = await db
      .insert(boards)
      .values({ ...body, userId, version: 1 })
      .returning();
    return c.json(board, 201);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// PUT /boards/:id — editar tablero (solo el dueño)
app.put('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const [board] = await db
      .update(boards)
      .set({ ...body, updatedAt: new Date(), version: sql`${boards.version} + 1` })
      .where(and(eq(boards.id, id), eq(boards.userId, userId)))
      .returning();
    if (!board) return c.json({ error: 'No encontrado o sin permiso' }, 404);
    return c.json(board);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// DELETE /boards/:id — eliminar tablero (solo el dueño)
app.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  try {
    const [deleted] = await db
      .delete(boards)
      .where(and(eq(boards.id, id), eq(boards.userId, userId)))
      .returning();
    if (!deleted) return c.json({ error: 'No encontrado o sin permiso' }, 404);
    return c.json({ ok: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

export default app;
