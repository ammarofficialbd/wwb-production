import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseDiscussion } from '@/lib/supabase'

// POST /api/discussion/channels/[id]/invite — send invite to a user
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: channelId } = await context.params
  const { inviteeId, inviteeUsername } = await request.json()

  if (!inviteeId || !inviteeUsername) {
    return NextResponse.json({ error: 'Invitee info required' }, { status: 400 })
  }

  // Verify requester is member of the channel
  const { data: membership } = await supabaseDiscussion
    .from('channel_members')
    .select('id')
    .eq('channelId', channelId)
    .eq('userId', session.userId)
    .single()

  if (!membership) {
    return NextResponse.json({ error: 'Not a member of this channel' }, { status: 403 })
  }

  // Check if already a member
  const { data: existingMember } = await supabaseDiscussion
    .from('channel_members')
    .select('id')
    .eq('channelId', channelId)
    .eq('userId', inviteeId)
    .single()

  if (existingMember) {
    return NextResponse.json({ error: 'User is already a member' }, { status: 409 })
  }

  // Check if already invited
  const { data: existingInvite } = await supabaseDiscussion
    .from('invitations')
    .select('id')
    .eq('channelId', channelId)
    .eq('inviteeId', inviteeId)
    .eq('status', 'pending')
    .single()

  if (existingInvite) {
    return NextResponse.json({ error: 'Invitation already sent' }, { status: 409 })
  }

  const { data: invitation, error } = await supabaseDiscussion
    .from('invitations')
    .insert({
      channelId,
      inviterId: session.userId,
      inviterUsername: session.username,
      inviteeId
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to send invitation' }, { status: 500 })
  }

  return NextResponse.json({ invitation })
}
