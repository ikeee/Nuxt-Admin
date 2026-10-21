import { eq } from 'drizzle-orm'
import { db } from './db'
import { memberships, type Membership } from '../database/schema'

/**
 * Return the user's single membership row, if one exists.
 *
 * The MVP stores one row per user. A later payment integration can update
 * planCode/status/expiresAt in place; if subscription history is needed, add a
 * separate history table without changing the gate contract.
 */
export async function getMembershipByUserId(userId: number): Promise<Membership | null> {
  const [row] = await db
    .select()
    .from(memberships)
    .where(eq(memberships.userId, userId))
    .limit(1)
  return row ?? null
}

/** Whether a membership currently grants access. */
export function isMembershipActive(
  membership: Membership | null | undefined,
  now = new Date()
): boolean {
  if (!membership || membership.status !== 'active') return false
  if (membership.expiresAt && membership.expiresAt.getTime() <= now.getTime()) return false
  return true
}

export async function hasActiveMembership(userId: number): Promise<boolean> {
  return isMembershipActive(await getMembershipByUserId(userId))
}
