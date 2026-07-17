import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseMain } from '@/lib/supabase'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null })
  }

  const { data: dbUser } = await supabaseMain
    .from('users')
    .select('*')
    .eq('id', session.userId)
    .single()

  if (!dbUser) {
    return NextResponse.json({ user: null })
  }

  const user = {
    id: dbUser.id,
    username: dbUser.username,
    role: dbUser.role,
    credits: dbUser.credits,
    avatarId: dbUser.avatarId,
    companyName: dbUser.companyName,
    isVerified: dbUser.isVerified
  }

  if (!user) {
    return NextResponse.json({ user: null })
  }

  return NextResponse.json({ user })
}
