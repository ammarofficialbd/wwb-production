import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseDiscussion } from '@/lib/supabase'

function toCamelMember(mem: any) {
  if (!mem) return mem;
  return {
    id: mem.id,
    channelId: mem.channel_id,
    userId: mem.user_id,
    username: mem.username,
    avatarId: mem.avatar_id,
    role: mem.role,
    joinedAt: mem.joined_at,
  }
}

// GET /api/discussion/channels/[id]/members
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: channelId } = await context.params

  const { data: members } = await supabaseDiscussion
    .from('channel_members')
    .select('*')
    .eq('channel_id', channelId)
    .order('joined_at', { ascending: true })

  return NextResponse.json({ members: (members || []).map(toCamelMember) })
}

// DELETE /api/discussion/channels/[id]/members (Leave or kick)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: channelId } = await context.params
  
  // For now, only support leaving the channel (delete own membership)
  const { error } = await supabaseDiscussion
    .from('channel_members')
    .delete()
    .eq('channel_id', channelId)
    .eq('user_id', String(session.userId))

  if (error) {
    return NextResponse.json({ error: 'Failed to leave channel' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
