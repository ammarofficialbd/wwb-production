import { createClient } from '@supabase/supabase-js'
import fs from 'fs';
import path from 'path';

async function main() {
  console.log('Importing blog data from blogData.json...');
  
  // Load environment variables directly from .env.local
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });

  const supabaseUrlMain = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKeyMain = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  const supabaseMain = createClient(supabaseUrlMain, supabaseKeyMain)

  const dataPath = path.join(process.cwd(), 'blogData.json');
  if (!fs.existsSync(dataPath)) {
    console.log('blogData.json not found, skipping import');
    return;
  }
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const posts = JSON.parse(rawData);

  for (const postData of posts) {
    let { data: author } = await supabaseMain.from('authors').select('*').eq('name', postData.author.name).single();
    if (!author) {
      const { data: newAuthor } = await supabaseMain.from('authors').insert(postData.author).select().single();
      author = newAuthor;
    }

    let { data: category } = await supabaseMain.from('categories').select('*').eq('slug', postData.category.slug).single();
    if (!category) {
      const { data: newCategory } = await supabaseMain.from('categories').insert(postData.category).select().single();
      category = newCategory;
    }

    const { data: existingPost } = await supabaseMain.from('posts').select('id').eq('slug', postData.slug).single();
    
    const viewsNum = parseInt(postData.metrics?.views?.replace(/,/g, '') || "0");
    const likesNum = parseInt(postData.metrics?.likes?.replace(/,/g, '') || "0");
    const commentsNum = parseInt(postData.metrics?.comments?.replace(/,/g, '') || "0");

    if (!existingPost) {
      await supabaseMain.from('posts').insert({
        title: postData.title,
        slug: postData.slug,
        "categoryId": category.id,
        "authorId": author.id,
        "readTime": postData.metrics?.readTime || postData.readTime,
        views: viewsNum || 0,
        likes: likesNum || 0,
        comments: commentsNum || 0,
        intro: postData.intro,
        sections: postData.sections,
        "lastUpdated": new Date(postData.lastUpdated)
      });
      console.log(`Created post: ${postData.title}`);
    } else {
      console.log(`Post already exists: ${postData.title}, skipping...`);
    }
  }
  console.log('Database import completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
