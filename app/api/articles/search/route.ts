import { NextResponse } from 'next/server';
import { supabaseMain } from '@/lib/supabase';

// GET /api/articles/search?keyword=Investment
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword')?.trim();

  if (!keyword || keyword.length < 2) {
    return NextResponse.json({ articles: [] });
  }

  // Search in title, intro, tags, and category_name — limit to 3 results
  const { data: articles, error } = await supabaseMain
    .from('articles')
    .select('id, title, slug, intro, main_image, category_name, published_at')
    .or(`title.ilike.%${keyword}%,intro.ilike.%${keyword}%,tags.cs.{${keyword}}`)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    // Fallback: search only title and intro if tags search fails
    const { data: fallback } = await supabaseMain
      .from('articles')
      .select('id, title, slug, intro, main_image, category_name, published_at')
      .or(`title.ilike.%${keyword}%,intro.ilike.%${keyword}%`)
      .order('published_at', { ascending: false })
      .limit(3);

    return NextResponse.json({ articles: fallback || [] });
  }

  return NextResponse.json({ articles: articles || [] });
}
