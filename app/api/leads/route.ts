import { NextResponse } from 'next/server'
import { supabaseMain } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch all leads with their authors (using Supabase foreign key join)
  const { data: leads, error } = await supabaseMain
    .from('leads')
    .select(`
      *,
      author:users!authorId(
        username,
        "companyName",
        "isVerified"
      )
    `)
    .order('createdAt', { ascending: false })

  if (error || !leads) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }

  // Privacy Guard: If the user is a seller, hide company details and contact info
  const sanitizedLeads = leads.map(lead => {
    if (session.role === 'seller') {
      return {
        ...lead,
        companyName: null,
        contactInfo: null,
        author: {
          ...lead.author,
          companyName: null
        }
      }
    }
    return lead
  })

  return NextResponse.json({ leads: sanitizedLeads })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'buyer') {
    return NextResponse.json({ error: 'Unauthorized. Only buyers can post leads.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, category, orderValue, country, companyName, contactInfo, certNumber, isVerified } = body

    if (!title || !description || !orderValue || !country) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update buyer's profile if they provided full details (didn't skip)
    if (isVerified) {
      await supabaseMain
        .from('users')
        .update({
          companyName,
          country,
          certNumber,
          isVerified: true
        })
        .eq('id', session.userId)
    }

    // Create the lead
    const { data: lead, error: createError } = await supabaseMain
      .from('leads')
      .insert({
        title,
        description,
        category: category || 'General',
        orderValue: parseFloat(orderValue),
        country,
        companyName,
        contactInfo,
        isVerified: !!isVerified,
        authorId: session.userId
      })
      .select()
      .single()

    if (createError) {
      throw createError
    }

    return NextResponse.json({ success: true, lead })
  } catch (error) {
    console.error('Lead post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
