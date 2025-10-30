import 'server-only'
import { auth } from '@/../auth'
import { cache } from 'react'

export const verifySession = cache(async () => {
  const session = await auth()

  if (!session?.user) {
    return { isAuth: false, userId: null, role: null }
  }

  return {
    isAuth: true,
    userId: session.user.id,
    role: session.user.role,
  }
})

export async function getSession() {
  return await auth()
}
