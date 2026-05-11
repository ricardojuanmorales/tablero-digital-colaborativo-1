import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createClient } from '@supabase/supabase-js';
import boardsRoute from './routes/boards.js';
import postsRoute from './routes/posts.js';
import usersRoute from './routes/users.js';
import membersRoute from './routes/members.js';

const app = new Hono();

// CORS
app.use('*', cors({ origin: '*' }));

// Middleware de autenticación JWT
app.use('/api/*', async (c, next) => {
  const auth = c.req.header('Authorization');
  if (!auth?.startsWith('Bearer ')) {
    return c.json({ error: 'No autorizado' }, 401);
  }
  const token = auth.slice(7);
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return c.json({ error: 'Token inválido' }, 401);
  }
  c.set('userId', data.user.id);
  await next();
});

// Rutas
app.route('/api/boards', boardsRoute);
app.route('/api/boards/:boardId/posts', postsRoute);
app.route('/api/users', usersRoute);
app.route('/api/boards/:boardId/members', membersRoute);

// Health check
app.get('/', (c) => c.json({ status: 'ok', app: 'Tablero API' }));

const port = Number(process.env.PORT) || 3000;
console.log(`🚀 Tablero API corriendo en http://localhost:${port}`);

serve({ fetch: app.fetch, port });
