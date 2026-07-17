import { cookies } from 'next/headers'
import { decrypt } from './session'

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('wwb_session')?.value
  if (!session) return null
  return await decrypt(session)
}
