import { and, asc, eq } from 'drizzle-orm'
import { db } from '~~/server/utils/db'
import { teacherApps, teacherGroups } from '../../database/schema'

/**
 * Public catalog for the teacher landing page.
 *
 * Only active rows are exposed. The protected tools themselves are enforced by
 * nginx + /_auth; this endpoint only controls what cards the public page shows.
 */
export default defineEventHandler(async () => {
  const groups = await db
    .select()
    .from(teacherGroups)
    .where(eq(teacherGroups.isActive, true))
    .orderBy(asc(teacherGroups.sortOrder), asc(teacherGroups.id))

  const apps = await db
    .select()
    .from(teacherApps)
    .where(and(eq(teacherApps.isActive, true)))
    .orderBy(asc(teacherApps.sortOrder), asc(teacherApps.id))

  return {
    groups: groups.map(group => ({
      ...group,
      apps: apps.filter(app => app.groupId === group.id)
    }))
  }
})
