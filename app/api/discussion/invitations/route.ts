import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { supabaseDiscussion } from '@/lib/supabase'

// GET /api/discussion/invitations — get pending invitations for current user
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: invitations } = await supabaseDiscussion
    .from('invitations')
    .select(`*, channel:channels(name, description)`)
    .eq('inviteeId', session.userId)
    .eq('status', 'pending')
    .order('createdAt', { ascending: false })

  return NextResponse.json({ invitations: invitations || [] })
}

// PATCH /api/discussion/invitations — accept or reject an invitation
export async function PATCH(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { invitationId, action } = await request.json()

  if (!['accepted', 'rejected'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const { data: invitation } = await supabaseDiscussion
    .from('invitations')
    .select('*')
    .eq('id', invitationId)
    .eq('inviteeId', session.userId)
    .single()

  if (!invitation) {
    return NextResponse.json({ error: 'Invitation not found' }, { status: 404 })
  }

  // Update invitation status
  await supabaseDiscussion
    .from('invitations')
    .update({ status: action })
    .eq('id', invitationId)

  // If accepted, add user as member
  if (action === 'accepted') {
    // Check member limit
    const { data: existingMembers } = await supabaseDiscussion
      .from('channel_members')
      .select('id')
      .eq('channelId', invitation.channelId)

    if ((existingMembers || []).length >= 10) {
      return NextResponse.json({ error: 'Channel is full (10 member limit)' }, { status: 403 })
    }

    await supabaseDiscussion.from('channel_members').insert({
      channelId: invitation.channelId,
      userId: session.userId,
      username: session.username,
      avatarId: session.avatarId || 0,
      role: 'member'
    })
  }

  return NextResponse.json({ success: true, action })
}
