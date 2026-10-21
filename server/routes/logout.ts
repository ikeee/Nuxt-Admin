import { sendRedirect } from 'h3'
import { endSession } from '~~/server/utils/auth'

/** Browser-friendly logout route used by the static portal's header link. */
export default defineEventHandler(async (event) => {
  await endSession(event)
  return sendRedirect(event, '/')
})
