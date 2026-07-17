import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseDiscussion } from '@/lib/supabase'

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
    .eq('channelId', channelId)
    .order('joinedAt', { ascending: true })

  return NextResponse.json({ members: members || [] })
}

// POST /api/discussion/channels/[id]/members — add a member
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: channelId } = await context.params
  const { userId, username, avatarId } = await request.json()

  // Verify requester is admin of channel
  const { data: requesterMembership } = await supabaseDiscussion
    .from('channel_members')
    .select('role')
    .eq('channelId', channelId)
    .eq('userId', session.userId)
    .single()

  if (!requesterMembership || requesterMembership.role !== 'admin') {
    return NextResponse.json({ error: 'Only channel admins can add members' }, { status: 403 })
  }

  // Check member count limit (10 for free users)
  const { data: existingMembers } = await supabaseDiscussion
    .from('channel_members')
    .select('id')
    .eq('channelId', channelId)

  if ((existingMembers || []).length >= 10) {
    return NextResponse.json({ error: 'Free channels are limited to 10 members' }, { status: 403 })
  }

  // Add member
  const { data: member, error } = await supabaseDiscussion
    .from('channel_members')
    .insert({
      channelId,
      userId,
      username,
      avatarId: avatarId || 0,
      role: 'member'
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'User is already a member' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 })
  }

  return NextResponse.json({ member })
}
