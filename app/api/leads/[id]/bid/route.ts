import { NextResponse } from 'next/server'
import { supabaseMain } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== 'seller') {
    return NextResponse.json({ error: 'Unauthorized. Only sellers can bid.' }, { status: 401 })
  }

  try {
    const params = await context.params
    const leadId = parseInt(params.id)
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 })
    }

    const body = await request.json()
    const { message, amount } = body

    // 1. Get the lead to check if it's open and calculate credit cost
    const { data: lead, error: leadError } = await supabaseMain
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead || lead.status !== 'open') {
      return NextResponse.json({ error: 'Lead not available for bidding' }, { status: 400 })
    }

    // Check if seller already bid on this
    const { data: existingBid } = await supabaseMain
      .from('bids')
      .select('id')
      .eq('sellerId', session.userId)
      .eq('leadId', leadId)
      .single()

    if (existingBid) {
      return NextResponse.json({ error: 'You have already placed a bid on this lead' }, { status: 400 })
    }

    // Dynamic Bidding Logic
    let creditCost = 50
    if (lead.orderValue >= 15000) {
      creditCost = 150
    } else if (lead.orderValue >= 5000) {
      creditCost = 80
    } else if (lead.orderValue >= 1000) {
      creditCost = 60
    }

    // 2. Manual transaction: check and deduct credits, then create bid
    const { data: user } = await supabaseMain
      .from('users')
      .select('credits')
      .eq('id', session.userId)
      .single()

    if (!user || user.credits < creditCost) {
      throw new Error('Insufficient credits')
    }

    // Deduct credits
    const { data: updatedSeller, error: updateError } = await supabaseMain
      .from('users')
      .update({ credits: user.credits - creditCost })
      .eq('id', session.userId)
      .select('credits')
      .single()

    if (updateError || !updatedSeller) {
      throw new Error('Failed to update credits')
    }

    try {
      // Create bid
      const { data: bid, error: bidError } = await supabaseMain
        .from('bids')
        .insert({
          message,
          "creditCost": creditCost,
          amount: amount ? parseFloat(amount) : null,
          "sellerId": session.userId,
          "leadId": lead.id
        })
        .select()
        .single()

      if (bidError || !bid) {
        throw bidError || new Error('Failed to create bid')
      }

      return NextResponse.json({ success: true, bid, credits: updatedSeller.credits })
    } catch (dbError) {
      // Rollback credits if bid creation fails
      await supabaseMain
        .from('users')
        .update({ credits: user.credits })
        .eq('id', session.userId)
        
      throw dbError
    }


  } catch (error: any) {
    console.error('Bidding error:', error)
    if (error.message === 'Insufficient credits') {
      return NextResponse.json({ error: 'Insufficient credits to place this bid' }, { status: 402 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
