import { getSession } from '@/lib/auth'
import { supabaseDiscussion } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// GET /api/discussion/channels/[id]/stream — SSE real-time messages
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id: channelId } = await context.params

  // Verify channel exists
  const { data: channel } = await supabaseDiscussion
    .from('channels')
    .select('type')
    .eq('id', channelId)
    .single()

  if (!channel) {
    return new Response('Channel not found', { status: 404 })
  }

  // For private channels, check membership
  if (channel.type === 'private') {
    const { data: membership } = await supabaseDiscussion
      .from('channel_members')
      .select('id')
      .eq('channel_id', channelId)
      .eq('user_id', String(session.userId))
      .single()

    if (!membership) {
      return new Response('Not a member', { status: 403 })
    }
  }

  let lastChecked = new Date().toISOString()

  const stream = new ReadableStream({
    start(controller) {
      // Send a heartbeat immediately
      controller.enqueue(`data: {"type":"connected"}\n\n`)

      const interval = setInterval(async () => {
        try {
          // Poll for new messages since last check
          const { data: newMessages } = await supabaseDiscussion
            .from('messages')
            .select('*')
            .eq('channel_id', channelId)
            .gt('created_at', lastChecked)
            .order('created_at', { ascending: true })

          if (newMessages && newMessages.length > 0) {
            lastChecked = newMessages[newMessages.length - 1].created_at
            for (const msg of newMessages) {
              const camelMsg = {
                id: msg.id,
                channelId: msg.channel_id,
                userId: msg.user_id,
                username: msg.username,
                avatarId: msg.avatar_id,
                content: msg.content,
                createdAt: msg.created_at,
              }
              controller.enqueue(`data: ${JSON.stringify({ type: 'message', message: camelMsg })}\n\n`)
            }
          } else {
            // Heartbeat to keep connection alive
            controller.enqueue(`data: {"type":"ping"}\n\n`)
          }
        } catch (err) {
          // Connection may be closed
          clearInterval(interval)
          try { controller.close() } catch {}
        }
      }, 1500) // Poll every 1.5 seconds

      // Clean up when client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        try { controller.close() } catch {}
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
