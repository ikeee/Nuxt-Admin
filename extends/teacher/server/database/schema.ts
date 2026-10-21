import {
  boolean,
  foreignKey,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar
} from 'drizzle-orm/pg-core'

export const teacherGroups = pgTable(
  'teacher_groups',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 50 }).notNull(),
    titleEn: varchar('title_en', { length: 100 }).notNull(),
    titleZh: varchar('title_zh', { length: 100 }).notNull(),
    noteEn: varchar('note_en', { length: 255 }).default('').notNull(),
    noteZh: varchar('note_zh', { length: 255 }).default('').notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  table => ({
    slugIdx: uniqueIndex('teacher_groups_slug_idx').on(table.slug),
    activeSortIdx: index('teacher_groups_active_sort_idx').on(table.isActive, table.sortOrder)
  })
)

export const teacherApps = pgTable(
  'teacher_apps',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 60 }).notNull(),
    groupId: integer('group_id').notNull(),
    titleEn: varchar('title_en', { length: 120 }).notNull(),
    titleZh: varchar('title_zh', { length: 120 }).notNull(),
    descEn: text('desc_en').default('').notNull(),
    descZh: text('desc_zh').default('').notNull(),
    href: varchar('href', { length: 500 }).default('').notNull(),
    icon: varchar('icon', { length: 100 }).default('i-lucide-wrench').notNull(),
    markEn: varchar('mark_en', { length: 100 }).default('').notNull(),
    markZh: varchar('mark_zh', { length: 100 }).default('').notNull(),
    status: varchar('status', { length: 20 }).default('live').notNull(),
    pinned: boolean('pinned').default(false).notNull(),
    external: boolean('external').default(false).notNull(),
    sortOrder: integer('sort_order').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
  },
  table => ({
    slugIdx: uniqueIndex('teacher_apps_slug_idx').on(table.slug),
    groupSortIdx: index('teacher_apps_group_sort_idx').on(table.groupId, table.sortOrder),
    groupFk: foreignKey({ columns: [table.groupId], foreignColumns: [teacherGroups.id] })
      .onDelete('cascade')
      .onUpdate('cascade')
  })
)

export type TeacherGroup = typeof teacherGroups.$inferSelect
export type TeacherApp = typeof teacherApps.$inferSelect
