import { NextResponse } from 'next/server'
import { supabaseMain } from '@/lib/supabase'
import { createSession } from '@/lib/session'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, role, avatarId } = body

    if (!username || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (role !== 'seller' && role !== 'buyer') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Check if username exists
    const { data: existing } = await supabaseMain
      .from('users')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user (seller gets 1000 credits automatically)
    const credits = role === 'seller' ? 1000 : 0
    const { data: user, error: createError } = await supabaseMain
      .from('users')
      .insert({
        username,
        passwordHash,
        role,
        avatarId: avatarId || 0,
        credits
      })
      .select()
      .single()

    if (createError || !user) {
      console.error('Supabase creation error:', createError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
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
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
