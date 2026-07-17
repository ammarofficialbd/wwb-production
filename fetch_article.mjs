import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase.from('articles').select('*').limit(1);
  if (error) {
    console.error(error);
  } else {
    fs.writeFileSync('temp_article.json', JSON.stringify(data[0], null, 2));
    console.log('Saved to temp_article.json');
  }
}

main();
