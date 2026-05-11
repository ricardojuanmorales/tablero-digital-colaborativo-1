import { Hono } from 'hono';
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq } from 'drizzle-orm';

const app = new Hono();

// POST /api/users/me — upsert perfil del usuario autenticado al hacer login
app.post('/me', async (c) => {
  const userId = c.get('userId');
  try {
    const body = await c.req.json();
    const [user] = await db
      .insert(users)
      .values({
        id:          userId,
        email:       body.email       || '',
        name:        body.name        || null,
        avatarColor: body.avatarColor || '#6EE7B7',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name:        body.name        || null,
          avatarColor: body.avatarColor || '#6EE7B7',
        },
      })
      .returning();
    return c.json(user);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

// GET /api/users/by-email?email=... — buscar usuario por email (para invitar colaboradores)
app.get('/by-email', async (c) => {
  const email = c.req.query('email');
  if (!email) return c.json({ error: 'email requerido' }, 400);
  try {
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, avatarColor: users.avatarColor })
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()));
    if (!user) return c.json({ error: 'Usuario no encontrado' }, 404);
    return c.json(user);
  } catch (e) {
    console.error(e);
    return c.json({ error: 'Error interno' }, 500);
  }
});

export default app;
