"use server";

import { supabaseMain } from "@/lib/supabase";

export async function getPosts() {
  const { data: posts, error } = await supabaseMain
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    // Try alternate column name for ordering
    const { data: posts2, error: err2 } = await supabaseMain
      .from('articles')
      .select('*');
    if (err2) {
      console.error("Error fetching articles:", err2);
      return [];
    }
    return posts2 || [];
  }
  return posts || [];
}
