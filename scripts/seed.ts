import { createClient } from '@supabase/supabase-js'
import bcrypt from "bcryptjs";

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Default for local dev
  
  // Load environment variables directly from .env.local
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });

  const supabaseUrlMain = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKeyMain = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  const supabaseMain = createClient(supabaseUrlMain, supabaseKeyMain)

  const { data: existingAdmin } = await supabaseMain
    .from('users')
    .select('id')
    .eq('username', adminUsername)
    .single()

  if (existingAdmin) {
    console.log(`Admin user '${adminUsername}' already exists.`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const { data: admin, error } = await supabaseMain
    .from('users')
    .insert({
      username: adminUsername,
      role: "admin",
      "passwordHash": passwordHash,
    })
    .select()
    .single()

  if (error || !admin) {
    console.error("Failed to seed admin user:", error)
    return
  }

  console.log(`Successfully seeded admin user. Username: ${admin.username}, Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
    // supabase client doesn't need explicit disconnect here
