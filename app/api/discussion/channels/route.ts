import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseDiscussion } from '@/lib/supabase'

// Helper to map snake_case to camelCase
function toCamel(obj: any) {
  if (!obj) return obj;
  return {
    id: obj.id,
    name: obj.name,
    description: obj.description,
    type: obj.type,
    createdBy: obj.created_by,
    createdAt: obj.created_at,
  }
}

// GET /api/discussion/channels — list channels for current user
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Always include the global channel
  let { data: globalChannel } = await supabaseDiscussion
    .from('channels')
    .select('*')
    .eq('type', 'global')
    .single()

  // Auto-create global channel if missing
  if (!globalChannel) {
    const { data: newGlobal, error } = await supabaseDiscussion
      .from('channels')
      .insert({
        name: 'Global',
        type: 'global',
        created_by: String(session.userId),
      })
      .select()
      .single()
    if (newGlobal) {
      globalChannel = newGlobal
    } else {
      console.error("Error creating global channel:", error);
    }
  }

  // Get private channels the user is a member of
  const { data: memberRows } = await supabaseDiscussion
    .from('channel_members')
    .select('channel_id')
    .eq('user_id', String(session.userId))

  const memberChannelIds = (memberRows || []).map((r: any) => r.channel_id)

  let privateChannels: any[] = []
  if (memberChannelIds.length > 0) {
    const { data } = await supabaseDiscussion
      .from('channels')
      .select('*')
      .eq('type', 'private')
      .in('id', memberChannelIds)
      .order('created_at', { ascending: false })
    privateChannels = data || []
  }

  // Count channels created by user (for limit check)
  const { data: ownedChannels } = await supabaseDiscussion
    .from('channels')
    .select('id')
    .eq('type', 'private')
    .eq('created_by', String(session.userId))

  return NextResponse.json({
    globalChannel: toCamel(globalChannel),
    privateChannels: privateChannels.map(toCamel),
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
    .eq('created_by', String(session.userId))

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
      created_by: String(session.userId)
    })
    .select()
    .single()

  if (error || !channel) {
    return NextResponse.json({ error: 'Failed to create channel' }, { status: 500 })
  }

  // Auto-add creator as admin member
  await supabaseDiscussion.from('channel_members').insert({
    channel_id: channel.id,
    user_id: String(session.userId),
    username: session.username,
    avatar_id: session.avatarId || 0,
    role: 'admin'
  })

  return NextResponse.json({ channel: toCamel(channel) })
}
