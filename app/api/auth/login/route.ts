import { NextResponse } from 'next/server'
import { supabaseMain } from '@/lib/supabase'
import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing username or password' }, { status: 400 })
    }

    // Fetch user
    const { data: user } = await supabaseMain
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }
    
    // If user has a passwordHash, check it
    if (user.passwordHash) {
      const match = await bcrypt.compare(password, user.passwordHash)
      if (!match) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
      }
    } else {
      // Legacy user with no password hash
      // We could force them to set a password, but for now we'll just deny them
      // since the system is updated
      return NextResponse.json({ error: 'Invalid legacy account, please create a new one' }, { status: 401 })
    }

    // Create session
    await createSession({
      userId: user.id,
      username: user.username,
      role: user.role as 'seller' | 'buyer',
      credits: user.credits,
      avatarId: user.avatarId
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
