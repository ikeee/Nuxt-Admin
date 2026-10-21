import { requireUser } from '~~/server/utils/auth'
import { getMembershipByUserId, isMembershipActive } from '~~/server/utils/memberships'

/** Return the signed-in user's access status for the teacher tools gate. */
export default defineEventHandler(async (event) => {
  const ctx = await requireUser(event)
  const membership = await getMembershipByUserId(ctx.user.id)
  const isAdmin = ctx.role?.name === 'admin'

  return {
    isAdmin,
    active: isAdmin || isMembershipActive(membership),
    membership: membership
      ? {
          planCode: membership.planCode,
          status: membership.status,
          source: membership.source,
          startedAt: membership.startedAt,
          expiresAt: membership.expiresAt
        }
      : null
  }
})
