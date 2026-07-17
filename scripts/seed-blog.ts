import { createClient } from '@supabase/supabase-js'

const posts = [
  {
    title: "Cross-Border B2B Payment Architecture for Global Trade",
    slug: "cross-border-b2b-payment-architecture-global-trade",
    category: {
      name: "Finance",
      slug: "finance"
    },
    author: {
      name: "Haseeb Abbas",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      bio: "Senior Financial Analyst & Content Strategist"
    },
    readTime: "12 minutes read",
    views: 18452,
    likes: 942,
    comments: 31,
    lastUpdated: "2026-07-11T12:00:00Z",
    intro: "With the rise in the volume of international supply chains and multi-currency transactions, bulk finance solutions have become essential to overcome data privacy, high transaction fees, and cross-border compliance challenges.",
    sections: [
      {
        id: "section-1",
        heading: "What is International Trade Finance and Why Does It Matter?",
        body: "Global B2B trade relies heavily on secure and predictable cash flows. Traditional banking infrastructure often delays international wire transfers due to outdated intermediary routing networks. Implementing a robust <strong class=\"font-bold text-gray-900\">cross-border payment architecture</strong> ensures that manufacturers receive cleared funds instantly without currency fluctuations.",
        list: [
          "Eliminates reliance on slow legacy SWIFT routing mechanisms.",
          "Reduces high intermediary banking fees on bulk apparel or IT contracts.",
          "Mitigates foreign exchange (FX) risks through automated locking systems."
        ],
        image: {
          url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
          caption: "Figure 1.1: Modern digital ledgers streamlining international escrow and B2B wire transfers."
        },
        extra: "For scalable global marketplaces, integrating modern digital financial ledgers alongside standard Letters of Credit (L/C) bridges the trust gap between buyers and sellers."
      },
      {
        id: "section-2",
        heading: "Why a dynamic liquidity strategy can change your work performance",
        body: "When enterprise buyers manage thousands of dynamic orders, liquidity management becomes the core dividing line between success and supply chain failure. Real-time cash visibility allows companies to allocate funds dynamically, reducing overhead costs.",
        list: [
          "Combines real-time financial analytics with regulatory compliance frameworks.",
          "Provides actionable insights that help global companies scale production strategically."
        ],
        image: null, 
        extra: "By automating invoice reconciliation through specialized finance modules, back-office operations can slash accounting errors by up to 40%."
      }
    ]
  },
  {
    title: "Macro Trends Shocking the Textile Industry Stock Indices",
    slug: "macro-trends-shocking-textile-industry-stock-indices",
    category: {
      name: "Investing & Stock Market",
      slug: "investing-stock-market"
    },
    author: {
      name: "Haseeb Abbas",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      bio: "Senior Financial Analyst & Content Strategist"
    },
    readTime: "15 minutes read",
    views: 29104,
    likes: 1873,
    comments: 64,
    lastUpdated: "2026-07-11T12:00:00Z",
    intro: "With the rise in the volume of volatility across global equity indices, bulk investing and stock market solutions have become essential to overcome currency devaluation, supply shocks, and changing interest rate challenges.",
    sections: [
      {
        id: "section-1",
        heading: "What is Industrial Equity Rotation and Why Does It Matter?",
        body: "Institutional investors are currently rotating capital out of high-valuation tech sectors and moving heavily into consumer cyclical and industrial manufacturing equities. Analyzing <strong class=\"font-bold text-gray-900\">publicly traded textile and manufacturing conglomerates</strong> reveals that companies utilizing automated supply chain networks are outperforming market benchmarks.",
        list: [
          "Tracks capital migration across emerging and frontier equity markets.",
          "Analyzes historical earnings per share (EPS) metrics against commodity price indices."
        ],
        image: null,
        extra: "Understanding these equity shifts allows enterprise platforms and supply networks to forecast corporate buyer behavior accurately."
      },
      {
        id: "section-2",
        heading: "Why an active asset allocation strategy can change your work performance",
        body: "Relying on passive index investing during periods of high macroeconomic instability can erode corporate wealth. Active equity assessment helps organizations diversify cash reserves into inflation-resistant market assets, balancing short-term volatility.",
        list: [
          "Combines deep fundamental equity analytics with macroeconomic risk indicators.",
          "Provides actionable portfolio structures that shield businesses from localized currency drops."
        ],
        image: {
          url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80",
          caption: "Figure 2.3: Quantitative stock chart analysis tracking industrial sector capital inflows."
        },
        extra: "Using comprehensive quantitative modeling ensures that your enterprise cash deployments are grounded in real statistical historical trends."
      }
    ]
  }
];

async function main() {
  // Load environment variables directly from .env.local
  const dotenv = await import('dotenv');
  dotenv.config({ path: '.env.local' });

  const supabaseUrlMain = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKeyMain = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  const supabaseMain = createClient(supabaseUrlMain, supabaseKeyMain)

  console.log('Seeding database...');
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
    if (!existingPost) {
      await supabaseMain.from('posts').insert({
        title: postData.title,
        slug: postData.slug,
        "categoryId": category.id,
        "authorId": author.id,
        "readTime": postData.readTime,
        views: postData.views,
        likes: postData.likes,
        comments: postData.comments,
        intro: postData.intro,
        sections: postData.sections,
        "lastUpdated": new Date(postData.lastUpdated)
      });
    }
  }
  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
