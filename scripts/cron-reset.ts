import { createClient } from '@supabase/supabase-js'

async function resetCredits() {
  console.log("Running monthly credit reset...");
  try {
    // Load environment variables directly from .env.local
    const dotenv = await import('dotenv');
    dotenv.config({ path: '.env.local' });

    const supabaseUrlMain = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKeyMain = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    const supabaseMain = createClient(supabaseUrlMain, supabaseKeyMain)

    const { data: result, error } = await supabaseMain
      .from('users')
      .update({ credits: 1000 })
      .eq('role', "seller")
      .select()

    if (error) {
      throw error
    }
    console.log(`Successfully reset credits for ${result?.length || 0} sellers.`);
  } catch (error) {
    console.error("Error resetting credits:", error);
  }
}

resetCredits();
