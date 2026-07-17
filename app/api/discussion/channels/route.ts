import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseDiscussion, supabaseMain } from '@/lib/supabase'

// GET /api/discussion/channels — list channels for current user
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Always include the global channel
  const { data: globalChannel } = await supabaseDiscussion
    .from('channels')
    .select('*')
    .eq('type', 'global')
    .single()

  // Get private channels the user is a member of
  const { data: memberRows } = await supabaseDiscussion
    .from('channel_members')
    .select('channelId')
    .eq('userId', session.userId)

  const memberChannelIds = (memberRows || []).map((r: any) => r.channelId)

  let privateChannels: any[] = []
  if (memberChannelIds.length > 0) {
    const { data } = await supabaseDiscussion
      .from('channels')
      .select('*')
      .eq('type', 'private')
      .in('id', memberChannelIds)
      .order('createdAt', { ascending: false })
    privateChannels = data || []
  }

  // Count channels created by user (for limit check)
  const { data: ownedChannels } = await supabaseDiscussion
    .from('channels')
    .select('id')
    .eq('type', 'private')
    .eq('createdBy', session.userId)

  return NextResponse.json({
    globalChannel,
    privateChannels,
    ownedCount: (ownedChannels || []).length
  })
}

// POST /api/discussion/channels — create a private channel
export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, description } = await request.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Channel name required' }, { status: 400 })
  }

  // Check limit: free users can only create 2 private channels
  const { data: ownedChannels } = await supabaseDiscussion
    .from('channels')
    .select('id')
    .eq('type', 'private')
    .eq('createdBy', session.userId)

  if ((ownedChannels || []).length >= 2) {
    return NextResponse.json({ error: 'Free users can only create 2 private channels' }, { status: 403 })
  }

  // Create channel
  const { data: channel, error } = await supabaseDiscussion
    .from('channels')
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      type: 'private',
      createdBy: session.userId
    })
    .select()
    .single()

  if (error || !channel) {
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 })
  }

  // Auto-add creator as admin member
  await supabaseDiscussion.from('channel_members').insert({
    channelId: channel.id,
    userId: session.userId,
    username: session.username,
    avatarId: session.avatarId || 0,
    role: 'admin'
  })

  return NextResponse.json({ channel })
}
