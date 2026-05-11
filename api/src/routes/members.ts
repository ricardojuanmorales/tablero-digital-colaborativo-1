import { Hono } from 'hono';
import { db } from '../db.js';
import { boards, boardMembers, users } from '../schema.js';
import { eq, and } from 'drizzle-orm';

const app = new Hono();

// GET /api/boards/:boardId/members
app.get('/', async (c) => {
  const boardId = c.req.param('boardId');
  const userId  = c.get('userId');
  try {
    // Verify caller is owner or member
    const [board] = await db.select({ userId: boards.userId }).from(boards).where(eq(boards.id, boardId));
    if (!board) return c.json({ error: 'Tablero no encontrado' }, 404);

    const rows = await db
      .select({
        userId:      boardMembers.userId,
        role:        boardMembers.role,
        name:        users.name,
        email:       users.email,
        avatarColor: users.avatarColor,
      })
      .from(boardMembers)
      .innerJoin(users, eq(boardMembers.userId, users.id))
      .where(eq(boardMembers.boardId, boardId));

    // Prepend owner entry
    const [owner] = await db
      .select({ userId: users.id, name: users.name, email: users.email, avatarColor: users.avatarColor })
      .from(users)
      .where(eq(users.id, board.userId!));

    const result = [
      { ...(owner ?? {}), userId: board.userId, role: 'owner' },
      ...rows,
    ];
    return c.json(result);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// POST /api/boards/:boardId/members — añadir colaborador por email
app.post('/', async (c) => {
  const boardId = c.req.param('boardId');
  const callerId = c.get('userId');
  try {
    const { email, role } = await c.req.json();
    if (!email) return c.json({ error: 'email requerido' }, 400);

    // Verify caller is the board owner
    const [board] = await db.select({ userId: boards.userId }).from(boards).where(eq(boards.id, boardId));
    if (!board) return c.json({ error: 'Tablero no encontrado' }, 404);
    if (board.userId !== callerId) return c.json({ error: 'Sin permiso' }, 403);

    // Find the user by email
    const [target] = await db
      .select({ id: users.id, name: users.name, email: users.email, avatarColor: users.avatarColor })
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()));
    if (!target) return c.json({ error: 'Usuario no encontrado' }, 404);
    if (target.id === callerId) return c.json({ error: 'No puedes añadirte a ti mismo' }, 400);

    // Upsert membership
    const memberRole = role === 'viewer' ? 'viewer' : 'editor';
    await db
      .insert(boardMembers)
      .values({ boardId, userId: target.id, role: memberRole })
      .onConflictDoUpdate({
        target: [boardMembers.boardId, boardMembers.userId],
        set: { role: memberRole },
      });

    return c.json({ ...target, role: memberRole }, 201);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// DELETE /api/boards/:boardId/members/:memberId — quitar colaborador
app.delete('/:memberId', async (c) => {
  const boardId  = c.req.param('boardId');
  const memberId = c.req.param('memberId');
  const callerId = c.get('userId');
  try {
    // Only the board owner can remove members
    const [board] = await db.select({ userId: boards.userId }).from(boards).where(eq(boards.id, boardId));
    if (!board) return c.json({ error: 'Tablero no encontrado' }, 404);
    if (board.userId !== callerId) return c.json({ error: 'Sin permiso' }, 403);

    const [deleted] = await db
      .delete(boardMembers)
      .where(and(eq(boardMembers.boardId, boardId), eq(boardMembers.userId, memberId)))
      .returning();
    if (!deleted) return c.json({ error: 'Miembro no encontrado' }, 404);
    return c.json({ ok: true });
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

export default app;
