import { NextResponse } from 'next/server'
import { supabaseMain } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get('username')

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  const { data: user } = await supabaseMain
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

  return NextResponse.json({ available: !user })
}
