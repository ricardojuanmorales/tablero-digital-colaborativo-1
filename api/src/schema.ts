import { pgTable, uuid, text, timestamp, integer, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id:          uuid('id').primaryKey().defaultRandom(),
  email:       text('email').notNull(),
  name:        text('name'),
  avatarColor: text('avatar_color').default('#6EE7B7'),
  role:        text('role').default('personal'),
  createdAt:   timestamp('created_at').defaultNow(),
});

export const boards = pgTable('boards', {
  id:            uuid('id').primaryKey().defaultRandom(),
  userId:        uuid('user_id').references(() => users.id),
  title:         text('title').notNull(),
  description:   text('description').default(''),
  icon:          text('icon').default('📋'),
  color:         text('color').default('#FDE68A'),
  privacy:       text('privacy').default('team'),
  tmpl:          text('tmpl').default('blank'),
  defaultLayout: text('default_layout').default('wall'),
  version:       integer('version').default(1),
  orderIndex:    integer('order_index').default(0),
  createdAt:     timestamp('created_at').defaultNow(),
  updatedAt:     timestamp('updated_at').defaultNow(),
});

export const boardMembers = pgTable('board_members', {
  boardId: uuid('board_id').references(() => boards.id).notNull(),
  userId:  uuid('user_id').references(() => users.id).notNull(),
  role:    text('role').default('editor'),
}, (t) => ({ pk: primaryKey({ columns: [t.boardId, t.userId] }) }));

export const posts = pgTable('posts', {
  id:        uuid('id').primaryKey().defaultRandom(),
  boardId:   uuid('board_id').references(() => boards.id),
  userId:    uuid('user_id').references(() => users.id),
  title:     text('title').notNull(),
  content:   text('content').default(''),
  tag:        text('tag').default(''),         // mantenido por compatibilidad
  tags:       text('tags').array().default([]),
  image:      text('image').default(''),
  sourceUrl:  text('source_url').default(''),
  sourceUrl2: text('source_url_2').default(''),
  color:     text('color').default('violet'),
  kanbanCol: text('kanban_col').default(''),
  createdAt: timestamp('created_at').defaultNow(),
});
