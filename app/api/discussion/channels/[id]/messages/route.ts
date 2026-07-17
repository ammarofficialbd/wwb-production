import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseDiscussion } from '@/lib/supabase'

// GET /api/discussion/channels/[id]/messages
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: channelId } = await context.params

  // Verify user is member or channel is global
  const { data: channel } = await supabaseDiscussion
    .from('channels')
    .select('type')
    .eq('id', channelId)
    .single()

  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
  }

  if (channel.type === 'private') {
    const { data: membership } = await supabaseDiscussion
      .from('channel_members')
      .select('id')
      .eq('channelId', channelId)
      .eq('userId', session.userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 })
    }
  }

  const { data: messages } = await supabaseDiscussion
    .from('messages')
    .select('*')
    .eq('channelId', channelId)
    .order('createdAt', { ascending: true })
    .limit(100)

  return NextResponse.json({ messages: messages || [] })
}

// POST /api/discussion/channels/[id]/messages
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: channelId } = await context.params
  const { content } = await request.json()

  if (!content?.trim()) {
    return NextResponse.json({ error: 'Message content required' }, { status: 400 })
  }

  // Verify access
  const { data: channel } = await supabaseDiscussion
    .from('channels')
    .select('type')
    .eq('id', channelId)
    .single()

  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
  }

  if (channel.type === 'private') {
    const { data: membership } = await supabaseDiscussion
      .from('channel_members')
      .select('id')
      .eq('channelId', channelId)
      .eq('userId', session.userId)
      .single()

    if (!membership) {
      return NextResponse.json({ error: 'Not a member' }, { status: 403 })
    }
  }

  const { data: message, error } = await supabaseDiscussion
    .from('messages')
    .insert({
      channelId,
      userId: session.userId,
      username: session.username,
      avatarId: session.avatarId || 0,
      content: content.trim()
    })
    .select()
    .single()

  if (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: 'Failed to send message', details: error }, { status: 500 })
  }

  return NextResponse.json({ message })
}
