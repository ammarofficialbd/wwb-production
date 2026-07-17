import { NextResponse } from 'next/server'
import { supabaseMain } from '@/lib/supabase'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  
  // Very simple secret check (Vercel Cron usually sends a Bearer token)
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { data: result, error } = await supabaseMain
      .from('users')
      .update({ credits: 1000 })
      .eq('role', 'seller')
      .select()

    if (error) {
      throw error
    }

    return NextResponse.json({ 
      success: true, 
      message: `Reset credits for ${result?.length || 0} sellers.`
    })
  } catch (error) {
    console.error('Cron reset error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
