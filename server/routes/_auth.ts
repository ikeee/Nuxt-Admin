import { setResponseHeader, setResponseStatus } from 'h3'
import { getSessionUser } from '~~/server/utils/auth'
import { getMembershipByUserId, isMembershipActive } from '~~/server/utils/memberships'

/**
 * Internal endpoint for nginx `auth_request`.
 *
 * - 204: authenticated and entitled (or an administrator)
 * - 401: no valid session
 * - 403: authenticated but the membership is inactive/expired
 *
 * nginx must keep this location `internal`; it is not a public login endpoint.
 */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'no-store')

  const ctx = await getSessionUser(event)
  if (!ctx) {
    setResponseStatus(event, 401)
    return ''
  }

  setResponseHeader(event, 'X-Auth-User', String(ctx.user.id))
  setResponseHeader(event, 'X-Auth-Role', ctx.role?.name ?? '')

  // Administrators retain access even before a membership row is created.
  if (ctx.role?.name === 'admin') {
    setResponseStatus(event, 204)
    return ''
  }

  const membership = await getMembershipByUserId(ctx.user.id)
  if (!isMembershipActive(membership)) {
    setResponseStatus(event, 403)
    return ''
  }

  setResponseHeader(event, 'X-Auth-Plan', membership?.planCode ?? '')
  if (membership?.expiresAt) {
    setResponseHeader(event, 'X-Auth-Expires-At', membership.expiresAt.toISOString())
  }

  setResponseStatus(event, 204)
  return ''
})
