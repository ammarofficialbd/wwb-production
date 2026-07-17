"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Globe,
  AtSign,
  Link2,
  ChevronRight,
  TrendingUp,
  Star,
  ShoppingBag,
  ExternalLink,
  Tag,
  MessageCircle,
  ThumbsUp,
  Eye,
  Play,
  Flame,
  Hash,
  Zap,
  ArrowUpRight,
} from "lucide-react";

/* ─── Types ─── */
interface BlogPost {
  id: number;
  image: string;
  tags: string[];
  category: string;
  date: string;
  title: string;
  desc: string;
}

interface BlogDetailPageProps {
  post: any;
  onBack?: () => void;
  relatedPosts?: any[];
}

/* ─── Content generator ─── */
/* ─── Content generator ─── */
function generateContent(post: any) {
  const cat = post.category || post.category_name || "Blog";
  
  // Parse sections
  let sections = [];
  if (Array.isArray(post.content) && post.content.length > 0) {
    sections = post.content.map((s: any) => ({
      ...s,
      body: Array.isArray(s.body) ? s.body.join('\n\n') : s.body,
      bodyBn: Array.isArray(s.bodyBn) ? s.bodyBn.join('\n\n') : s.bodyBn,
    }));
  } else if (post.sections && Array.isArray(post.sections)) {
    sections = post.sections.map((s: any) => ({
      ...s,
      body: Array.isArray(s.body) ? s.body.join('\n\n') : s.body,
      bodyBn: Array.isArray(s.bodyBn) ? s.bodyBn.join('\n\n') : s.bodyBn,
    }));
  } else {
    // fallback if no sections and content is string
    const bodyContent = typeof post.content === 'string' ? post.content : (post.description || post.desc);
    if (bodyContent && typeof bodyContent === 'string') {
      sections = [{ id: "section-1", heading: "Overview", body: bodyContent, list: [], extra: "" }];
    } else {
      sections = [
        {
          id: "section-1",
          heading: `What is ${cat} and Why Does It Matter?`,
          body: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and <strong class="font-bold text-gray-900">scrambled it to make</strong> a type specimen book.`,
          list: [
            "There are many variations of passages of Lorem Ipsum available.",
            "Majority have suffered alteration in some form, by injected humour.",
            "If you are going to use a passage of Lorem Ipsum.",
            "It uses a dictionary of over 200 Latin words, combined with a handful.",
          ],
          extra: `There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.`,
        },
        {
          id: "section-2",
          heading: `Why a ${cat} strategy can change your work performance`,
          body: `You are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.`,
          list: [
            "Combines expertise in financial analytics with regulatory frameworks.",
            "Provides actionable insights that help companies scale strategically.",
            "Trusted by 50,000+ business professionals worldwide.",
          ],
          extra: `It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable.`,
        },
        {
          id: "section-3",
          heading: `Top ${cat} Tools and Best Practices for 2025`,
          body: `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.`,
          list: [
            "Use advanced analytics to monitor compliance metrics in real time.",
            "Automate routine reporting to reduce human error and save time.",
            "Implement tiered access control for sensitive data categories.",
          ],
          extra: `The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections from classical Latin literature are also reproduced in their original form.`,
        },
      ];
    }
  }

  const authorName = post.author_name || post.author?.name || post.author || "Haseeb Abbas";
  const authorAvatar = post.author_avatar || post.author?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face";
  const authorBio = post.author_bio || post.author?.bio || "Senior Financial Analyst & Content Strategist";
  
  const readTime = post.metrics?.readTime || post.readTime || "5 min read";
  const views = post.metrics?.views || post.views?.toString() || "0";
  const likes = post.metrics?.likes || post.likes?.toString() || "0";
  const comments = post.metrics?.comments || post.comments?.toString() || "0";
  const intro = post.intro || post.desc || "";
  
  const tocItems = sections.map((s: any, idx: number) => ({
    id: s.id || `section-${idx + 1}`,
    label: s.heading || s.label || `Section ${idx + 1}`
  }));

  return {
    author: authorName,
    authorAvatar,
    authorBio,
    readTime,
    lastUpdated: post.date || new Date().toLocaleDateString(),
    views,
    likes,
    comments,
    intro,
    sections,
    tocItems,
    category: cat,
    image: post.mainImage || post.main_image || post.image || post.image_url || "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    tags: Array.isArray(post.tags) ? post.tags : ["Business", "Growth"]
  };
}

/* ─── Trending Data ─── */
const trendingPosts = [
  { id: 1, title: "How AI is Reshaping the Future of B2B Finance", category: "AI", readTime: "8 min", views: "18.4K", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=120&h=80&fit=crop" },
  { id: 2, title: "Top 5 Investment Strategies for Bear Markets in 2025", category: "Investment", readTime: "6 min", views: "12.1K", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=80&fit=crop" },
  { id: 3, title: "GDPR Compliance: What Every Business Must Know", category: "Privacy", readTime: "10 min", views: "9.8K", image: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=120&h=80&fit=crop" },
  { id: 4, title: "Bitcoin ETFs and the New Era of Digital Assets", category: "Crypto", readTime: "7 min", views: "7.3K", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=120&h=80&fit=crop" },
  { id: 5, title: "Real Estate REITs: A Complete 2025 Guide", category: "Real Estate", readTime: "9 min", views: "5.2K", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=80&fit=crop" },
];

const trendingTags = [
  { label: "#FinTech", heat: "hot" }, { label: "#AITools", heat: "hot" },
  { label: "#Crypto", heat: "hot" }, { label: "#Compliance", heat: "warm" },
  { label: "#Startups", heat: "warm" }, { label: "#B2BSaaS", heat: "warm" },
  { label: "#Investment", heat: "cool" }, { label: "#DataPrivacy", heat: "cool" },
  { label: "#RealEstate", heat: "cool" }, { label: "#Leadership", heat: "cool" },
];

/* ─── Sub-components ─── */

function HorizontalAdBanner() {
  return (
    <div className="my-2">
      <span className="block text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Advertisement</span>
      <div className="relative flex items-center gap-4 rounded-2xl px-5 py-4 overflow-hidden" style={{ background: "linear-gradient(135deg,#1a4d2e,#2d6a4f,#40916c)" }}>
        <span className="absolute top-2 right-3 text-[9px] font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded">AD</span>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/15 flex-shrink-0">
          <TrendingUp size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">Maximize Your Business Growth with AI</p>
          <p className="text-[11px] text-white/70 mt-0.5">Get expert-curated insights delivered weekly.</p>
        </div>
        <button className="flex items-center gap-1 bg-white text-[#1a4d2e] text-[11px] font-bold px-4 py-2 rounded-full flex-shrink-0 hover:opacity-90 transition-opacity">
          Try Free <ExternalLink size={11} />
        </button>
      </div>
    </div>
  );
}

function ProductCard({ name, price, rating, reviews, badge }: { name: string; price: string; rating: number; reviews: number; badge?: string }) {
  return (
    <div className="relative bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col gap-1 hover:shadow-md transition-shadow">
      {badge && <span className="absolute top-2 right-2 text-[9px] font-bold text-white bg-[#5cb85c] px-2 py-0.5 rounded-full uppercase">{badge}</span>}
      <div className="w-10 h-10 rounded-xl bg-[#f0faf0] flex items-center justify-center mb-1"><ShoppingBag size={20} className="text-[#5cb85c]" /></div>
      <p className="text-[11.5px] font-bold text-gray-800">{name}</p>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={9} className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />)}
        <span className="text-[9px] text-gray-400 ml-1">({reviews})</span>
      </div>
      <p className="text-[12px] font-extrabold text-[#5cb85c]">{price}</p>
      <button className="mt-1 text-[11px] font-bold text-white bg-[#5cb85c] hover:bg-[#4cae4c] transition-colors rounded-lg py-1.5">View Deal</button>
    </div>
  );
}

function TableOfContents({ items, activeId }: { items: { id: string; label: string }[]; activeId: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="text-[13px] font-extrabold text-gray-900 mb-3">Table Of Contents</h3>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={`flex items-start gap-1.5 text-[11.5px] font-semibold leading-snug py-1 transition-colors ${activeId === item.id ? "text-[#3a8f3a] font-bold" : "text-[#5cb85c] hover:text-[#3a8f3a]"}`}>
              <span className="text-sm leading-none mt-0.5">›</span>{item.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="my-3 border-t border-gray-100" />
      <p className="text-[12px] font-extrabold text-gray-900 mb-1">Subscribe Now</p>
      <p className="text-[10.5px] text-gray-400 mb-2">Stay up to date with the latest news:</p>
      <input type="email" placeholder="Enter your Email Address" className="w-full text-[11.5px] px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#5cb85c] mb-2" />
      <button className="w-full text-[11.5px] font-bold text-white bg-[#5cb85c] hover:bg-[#4cae4c] py-2.5 rounded-xl transition-colors">Subscribe Now →</button>
    </div>
  );
}

function VerticalAdBanner() {
  return (
    <div>
      <span className="block text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Advertisement</span>
      <div className="relative rounded-2xl p-5 flex flex-col gap-3 overflow-hidden" style={{ background: "linear-gradient(160deg,#1a4d2e,#2d6a4f,#40916c)" }}>
        <span className="absolute top-2 right-3 text-[9px] font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded">AD</span>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/15"><TrendingUp size={24} className="text-white" /></div>
        <p className="text-[13px] font-bold text-white leading-snug">Grow your portfolio with AI-driven insights</p>
        <p className="text-[11px] text-white/70">Join 500K+ investors today</p>
        <button className="flex items-center gap-1 bg-white text-[#1a4d2e] text-[11.5px] font-bold px-4 py-2 rounded-full w-fit hover:opacity-90 transition-opacity">
          Learn More <ExternalLink size={11} />
        </button>
      </div>
    </div>
  );
}

/* ─── Right Sidebar ─── */
function RightSidebar({ category }: { category: string }) {
  return (
    <aside className="w-[272px] flex-shrink-0 flex flex-col gap-4 sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      {/* Trending Posts */}
      <div className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-[9px] bg-orange-50 flex items-center justify-center flex-shrink-0">
            <Flame size={14} className="text-orange-500" />
          </div>
          <h3 className="text-[13.5px] font-extrabold text-gray-900 flex-1">Trending Now</h3>
          <span className="text-[8.5px] font-extrabold text-white px-2 py-0.5 rounded-full tracking-wider" style={{ background: "linear-gradient(135deg,#ef4444,#f97316)", animation: "pulse 2s infinite" }}>LIVE</span>
        </div>
        <ul className="flex flex-col">
          {trendingPosts.map((post, idx) => (
            <li key={post.id} className="flex items-center gap-2.5 py-2.5 border-b border-gray-50 last:border-0 cursor-pointer group hover:bg-gray-50 rounded-xl px-1 transition-colors">
              <span className={`text-lg font-black leading-none min-w-[22px] flex-shrink-0 ${idx === 0 ? "text-orange-400" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-amber-500" : "text-gray-200"}`}>
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="relative w-14 h-11 rounded-xl overflow-hidden flex-shrink-0">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="60px" unoptimized />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-bold text-[#5cb85c] uppercase tracking-wide">{post.category}</span>
                <p className="text-[11px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#5cb85c] transition-colors">{post.title}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[9px] text-gray-400 font-medium">
                  <span className="flex items-center gap-0.5"><Clock size={9} />{post.readTime}</span>
                  <span className="flex items-center gap-0.5"><Eye size={9} />{post.views}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Video Ad */}
      <div>
        <span className="block text-[9px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Sponsored Video</span>
        <div className="rounded-[20px] overflow-hidden border border-gray-100 shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 bg-white">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <Image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=220&fit=crop" alt="Video Ad" fill className="object-cover" sizes="280px" unoptimized />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55))" }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-white/40" style={{ background: "rgba(255,255,255,0.22)", backdropFilter: "blur(6px)" }}>
                <Play size={20} className="text-white fill-white ml-0.5" />
              </div>
            </div>
            <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white bg-black/55 px-1.5 py-0.5 rounded" style={{ backdropFilter: "blur(4px)" }}>2:45</span>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#3a8f3a] bg-[#f0faf0] border border-[#c3e6c3] px-2 py-0.5 rounded w-fit uppercase tracking-wide">
              <Zap size={9} /> AD
            </span>
            <p className="text-[13px] font-extrabold text-gray-900 leading-snug">Scale Your {category} Business 10x Faster with SmartGrow</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">Trusted by 20,000+ business leaders. Start your free trial today.</p>
            <button className="flex items-center gap-1.5 text-[11.5px] font-bold text-white px-4 py-2 rounded-full w-fit mt-1 hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg,#4cae4c,#5cb85c)", boxShadow: "0 3px 10px rgba(92,184,92,0.35)" }}>
              Watch Now <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Trending Tags */}
      <div className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-[9px] bg-[#f0faf0] flex items-center justify-center flex-shrink-0">
            <Hash size={14} className="text-[#5cb85c]" />
          </div>
          <h3 className="text-[13.5px] font-extrabold text-gray-900">Trending Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingTags.map((tag) => (
            <button key={tag.label} className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border-[1.5px] transition-all hover:-translate-y-0.5 ${
              tag.heat === "hot" ? "bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100" :
              tag.heat === "warm" ? "bg-[#f0faf0] border-[#c3e6c3] text-[#3a8f3a] hover:bg-[#e0f5e0]" :
              "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
            }`}>
              {tag.heat === "hot" && <Flame size={9} className="text-orange-500" />}
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="relative rounded-[22px] overflow-hidden p-6 flex flex-col gap-3" style={{ background: "linear-gradient(145deg,#0f2d1a,#1a4d2e,#2d6a4f)" }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(92,184,92,0.25),transparent 70%)" }} />
        <div className="w-11 h-11 rounded-[14px] flex items-center justify-center border border-white/20" style={{ background: "rgba(255,255,255,0.12)" }}>
          <Zap size={20} className="text-white" />
        </div>
        <h3 className="text-[15px] font-extrabold text-white leading-tight">Stay Ahead of the Curve</h3>
        <p className="text-[11.5px] text-white/65 leading-relaxed">Get the week&apos;s top business insights delivered to your inbox — free.</p>
        <input type="email" placeholder="your@email.com" className="w-full text-[12px] px-3.5 py-2.5 rounded-xl outline-none placeholder:text-white/40 text-white" style={{ background: "rgba(255,255,255,0.09)", border: "1.5px solid rgba(255,255,255,0.15)" }} />
        <button className="w-full flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-white py-3 rounded-xl transition-all hover:opacity-90" style={{ background: "#5cb85c", boxShadow: "0 4px 14px rgba(92,184,92,0.4)" }}>
          Subscribe Free <ArrowUpRight size={13} />
        </button>
        <p className="text-[10px] text-white/40 text-center">No spam · Unsubscribe anytime</p>
      </div>

    </aside>
  );
}

/* ─── Related Card ─── */
function RelatedCard({ post, onSelect }: { post: BlogPost; onSelect: () => void }) {
  return (
    <article onClick={onSelect} className="bg-white rounded-[18px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" unoptimized />
        <div className="absolute bottom-2 left-2 flex gap-1">
          {(post.tags || []).slice(0, 1).map((t: string) => <span key={t} className="text-[9.5px] font-bold text-gray-700 bg-white/88 backdrop-blur-sm px-2 py-0.5 rounded-full">{t}</span>)}
        </div>
      </div>
      <div className="p-3.5 flex flex-col gap-1">
        <span className="text-[10px] font-semibold text-gray-400">{post.date}</span>
        <h4 className="text-[12px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-[#5cb85c] transition-colors">{post.title}</h4>
        <span className="text-[11px] font-bold text-[#5cb85c] mt-1">Read More →</span>
      </div>
    </article>
  );
}

/* ─── Main Export ─── */
export default function BlogDetailPage({ post, onBack, relatedPosts = [] }: BlogDetailPageProps) {
  const router = useRouter();
  const content = generateContent(post);
  console.log(content, 'content');
  
  const [activeSection, setActiveSection] = useState(content.tocItems[0]?.id || "");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleBack = () => {
    if (onBack) onBack();
    else router.push('/blog');
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    content.tocItems.forEach(({ id }: { id: string }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    
    // SEO Update: Set page title and meta description dynamically
    const originalTitle = document.title;
    document.title = `${post.title} | Blog`;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    let originalMetaDesc = "";
    if (metaDesc) {
      originalMetaDesc = metaDesc.getAttribute("content") || "";
      metaDesc.setAttribute("content", content.intro || post.title);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', content.intro || post.title);
      document.head.appendChild(metaDesc);
    }

    return () => {
      observer.disconnect();
      // Restore SEO original values on unmount
      document.title = originalTitle;
      if (metaDesc) {
        if (originalMetaDesc) {
          metaDesc.setAttribute("content", originalMetaDesc);
        } else {
          document.head.removeChild(metaDesc);
        }
      }
    };
  }, [content.tocItems, post.title, content.intro]);

  const likeCount = (parseInt(content.likes.replace(",", "")) + (liked ? 1 : 0)).toLocaleString();

  // SEO: Generate JSON-LD Article Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": content.intro || post.title,
    "image": content.image,
    "author": {
      "@type": "Person",
      "name": content.author,
      "url": content.authorAvatar
    },
    "publisher": {
      "@type": "Organization",
      "name": "BusinessFeed",
      "logo": {
        "@type": "ImageObject",
        "url": "https://via.placeholder.com/150"
      }
    },
    "datePublished": content.lastUpdated,
    "dateModified": content.lastUpdated,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": typeof window !== 'undefined' ? window.location.href : ''
    }
  };

  return (
    <div className="flex flex-col gap-0 w-full animate-fade-in">
      {/* SEO: Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <button onClick={handleBack} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] border-gray-200 bg-white text-[12px] font-bold text-gray-600 hover:border-[#5cb85c] hover:text-[#5cb85c] hover:bg-[#f0faf0] transition-all flex-shrink-0">
          <ArrowLeft size={14} strokeWidth={2.5} /> Back
        </button>
        <div className="flex items-center gap-1 flex-wrap">
          {[{ label: "Home", click: true }, { label: "Blog", click: true }, { label: content.category, click: false }].map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={11} className="text-gray-300" />}
              <span onClick={crumb.click ? handleBack : undefined} className={`text-[11.5px] font-medium ${crumb.click ? "text-gray-400 cursor-pointer hover:text-[#5cb85c]" : "text-gray-500 font-semibold"}`}>
                {crumb.label}
              </span>
            </span>
          ))}
          <ChevronRight size={11} className="text-gray-300" />
          <span className="text-[11.5px] font-semibold text-gray-700 max-w-[200px] truncate">{post.title}</span>
        </div>
      </div>

      {/* ── Hero Row: 75% content + 25% ads — aligns with content area below ── */}
      <div className="flex gap-5 items-start mb-5">

        {/* LEFT: Hero content (flex-1, same width as left-sidebar + gap + article) */}
        <div className="flex-1 min-w-0 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">

          {/* Top section: tags + title + meta + actions */}
          <div className="px-8 pt-8 pb-5 flex flex-col gap-4">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              {content.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#3a8f3a] bg-[#f0faf0] border border-[#c3e6c3] px-3 py-1 rounded-full uppercase tracking-wider">
                  <Tag size={9} /> {tag}
                </span>
              ))}
            </div>

            {/* Title + intro */}
            <h1 className="text-2xl md:text-[1.75rem] font-extrabold text-gray-900 leading-tight tracking-tight">{post.title}</h1>
            <p className="text-[13px] text-gray-400 leading-relaxed">{content.intro}</p>

            {/* Author + Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                  <Image src={content.authorAvatar} alt={content.author} fill className="object-cover" sizes="36px" unoptimized />
                </div>
                <div>
                  {/* <p className="text-[12px] font-bold text-[#5cb85c] leading-none">By {content.author}</p> */}
                  <p className="text-[10px] text-gray-400 mt-0.5">{content.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { icon: <Calendar size={11} />, label: content.lastUpdated },
                  { icon: <Clock size={11} />, label: content.readTime },
                  { icon: <Eye size={11} />, label: `${content.views} views` },
                ].map((m, i) => (
                  <span key={i} className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                    {i > 0 && <span className="text-gray-200 mr-1">|</span>}
                    {m.icon} {m.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setLiked(!liked)} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] text-[12px] font-bold transition-all ${liked ? "border-[#5cb85c] bg-[#f0faf0] text-[#5cb85c]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                <ThumbsUp size={13} /> {likeCount}
              </button>
              <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-[12px] font-bold text-gray-600 hover:border-gray-300 transition-all">
                <MessageCircle size={13} /> {content.comments}
              </button>
              <div className="relative">
                <button onClick={() => setShareOpen(!shareOpen)} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] border-gray-200 bg-white text-[12px] font-bold text-gray-600 hover:border-gray-300 transition-all">
                  <Share2 size={13} /> Share
                </button>
                {shareOpen && (
                  <div className="absolute top-[calc(100%+6px)] left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden min-w-[140px]">
                    {[{ icon: <Globe size={13} className="text-blue-500" />, label: "Facebook" }, { icon: <AtSign size={13} className="text-sky-500" />, label: "Twitter" }, { icon: <Link2 size={13} className="text-gray-400" />, label: "Copy Link" }].map((s) => (
                      <button key={s.label} className="flex items-center gap-2 w-full px-4 py-2.5 text-[12.5px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                        {s.icon} {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setIsBookmarked(!isBookmarked)} className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border-[1.5px] text-[12px] font-bold transition-all ml-auto ${isBookmarked ? "border-amber-300 bg-amber-50 text-amber-600" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}>
                <Bookmark size={13} className={isBookmarked ? "fill-current" : ""} /> {isBookmarked ? "Saved" : "Save"}
              </button>
            </div>
          </div>

          {/* Hero image — full bleed bottom */}
          <div className="relative w-full flex-1" style={{ minHeight: "450px" }}>
            <Image src={content.image} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 75vw" priority unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            {/* Category chip over image */}
            <div className="absolute bottom-4 left-4">
              <span className="text-[11px] font-bold text-white bg-[#5cb85c]/90 backdrop-blur-sm px-3 py-1.5 rounded-full">{content.category}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Ads poster column — fixed 272px, matches right sidebar width below */}
        <div className="w-[272px] flex-shrink-0 flex flex-col gap-4">

          {/* Featured Sponsor Card */}
          <div className="relative rounded-[22px] overflow-hidden border border-gray-100 shadow-sm bg-white">
            {/* Top gradient banner */}
            <div className="h-[190px] relative flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg,#0f2d1a,#1a4d2e,#40916c)" }}>
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20 bg-white" />
              <div className="absolute -bottom-8 -left-4 w-20 h-20 rounded-full opacity-10 bg-white" />
              <div className="flex flex-col items-center gap-1 z-10">
                <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
              </div>
              <span className="absolute top-2 right-2 text-[8px] font-bold text-white/60 bg-white/10 px-1.5 py-0.5 rounded">SPONSORED</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div>
                <p className="text-[13px] font-extrabold text-gray-900 leading-snug">SmartInvest Pro — AI Portfolio Manager</p>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">Beat the market with AI-curated insights tailored to your risk profile.</p>
              </div>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-1.5">
                {[{ val: "500K+", lbl: "Users" }, { val: "34%", lbl: "Avg ROI" }, { val: "4.9★", lbl: "Rating" }].map((s) => (
                  <div key={s.lbl} className="bg-gray-50 rounded-xl p-2 text-center border border-gray-100">
                    <p className="text-[12px] font-extrabold text-gray-800">{s.val}</p>
                    <p className="text-[9px] text-gray-400 font-semibold">{s.lbl}</p>
                  </div>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-1.5 text-[12px] font-bold text-white py-2.5 rounded-xl transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg,#4cae4c,#5cb85c)", boxShadow: "0 3px 10px rgba(92,184,92,0.3)" }}>
                Start Free Trial <ArrowUpRight size={13} />
              </button>
              <p className="text-[9.5px] text-gray-400 text-center">No credit card required · Cancel anytime</p>
            </div>
          </div>

          {/* Vertical ad banner */}
          <div className="relative rounded-[22px] h-[336px] overflow-hidden p-5 flex flex-col gap-3" style={{ background: "linear-gradient(160deg,#1a4d2e,#2d6a4f,#40916c)" }}>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 bg-white pointer-events-none" />
            <span className="inline-flex w-fit text-[8.5px] font-bold text-white/70 bg-white/10 px-2 py-0.5 rounded">AD</span>
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <Zap size={22} className="text-white" />
            </div>
            <p className="text-[13px] font-bold text-white leading-snug">Grow your {content.category} portfolio with AI</p>
            <p className="text-[10.5px] text-white/65 leading-relaxed">Join 500K+ investors getting smarter every day.</p>
            <button className="inline-flex items-center gap-1.5 bg-white text-[#1a4d2e] text-[11.5px] font-bold px-4 py-2 rounded-full w-fit hover:opacity-90 transition-opacity">
              Explore <ExternalLink size={11} />
            </button>
          </div>

          {/* Quick Stats / Trust Signals 
          <div className="bg-white rounded-[22px] p-4 border border-gray-100 shadow-sm">
            <p className="text-[11px] font-extrabold text-gray-700 mb-3 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-lg bg-[#f0faf0] flex items-center justify-center"><TrendingUp size={11} className="text-[#5cb85c]" /></span>
              Article Stats
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: "Total Reads", value: content.views, bar: 85 },
                { label: "Avg. Read Time", value: content.readTime, bar: 60 },
                { label: "Engagement", value: "94%", bar: 94 },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-semibold text-gray-500">{stat.label}</span>
                    <span className="text-[10px] font-bold text-gray-800">{stat.value}</span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${stat.bar}%`, background: "linear-gradient(90deg,#5cb85c,#40916c)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
                */}
        </div>
      </div>

      {/* ── Content Area: Left sidebar + Article + Right sidebar ── */}
      <div className="flex gap-5 items-start mb-5">

        {/* Left sidebar — TOC + ads + products */}
        <aside className="w-[240px] flex-shrink-0 hidden lg:flex flex-col gap-4 sticky top-6 max-h-[calc(100vh-48px)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TableOfContents items={content.tocItems} activeId={activeSection} />
          <VerticalAdBanner />
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <h3 className="text-[12px] font-extrabold text-gray-900 flex items-center gap-1.5 mb-3"><ShoppingBag size={13} /> Recommended</h3>
            <div className="flex flex-col gap-3">
              <ProductCard name="FinanceTrack Pro" price="$29/mo" rating={5} reviews={412} badge="Best Seller" />
              <ProductCard name="DataGuard Suite" price="$49/mo" rating={4} reviews={189} />
            </div>
          </div>
        </aside>

        {/* Article body */}
        <div className="flex-1 min-w-0 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-7">
          {content.sections.map((section: any, idx: number) => (
            <section key={section.id || idx} id={section.id || `section-${idx}`} className="flex flex-col gap-4 relative">
              
              <div className="relative group/tblock">
                {section.headingBn && (
                  <button onClick={() => {
                    const el = document.getElementById(`heading-text-${idx}`);
                    const isBn = el?.getAttribute('data-lang') === 'bn';
                    if (el) {
                      el.innerText = isBn ? section.heading : section.headingBn;
                      el.setAttribute('data-lang', isBn ? 'en' : 'bn');
                      const btn = document.getElementById(`heading-btn-${idx}`);
                      if (btn) btn.innerText = isBn ? 'BN' : 'EN';
                    }
                  }} id={`heading-btn-${idx}`} className="absolute -left-10 top-1 text-[14px] font-bold border border-gray-200 bg-gray-50 hover:bg-[#f0faf0] text-gray-400 hover:text-[#5cb85c] hover:border-[#5cb85c] px-1.5 py-0.5 rounded cursor-pointer transition-all opacity-0 group-hover/tblock:opacity-100 flex items-center justify-center shadow-sm">BN</button>
                )}
                <h2 id={`heading-text-${idx}`} data-lang="en" className="text-xl font-extrabold text-gray-900 leading-tight tracking-tight pb-2 border-b-2 border-[#f0faf0]">{section.heading}</h2>
              </div>

              {section.body && (
                <div className="relative group/tblock">
                  {section.bodyBn && (
                    <button onClick={() => {
                      const el = document.getElementById(`body-text-${idx}`);
                      const isBn = el?.getAttribute('data-lang') === 'bn';
                      if (el) {
                        el.innerHTML = isBn ? section.body : section.bodyBn;
                        el.setAttribute('data-lang', isBn ? 'en' : 'bn');
                        const btn = document.getElementById(`body-btn-${idx}`);
                        if (btn) btn.innerText = isBn ? 'BN' : 'EN';
                      }
                    }} id={`body-btn-${idx}`} className="absolute -left-10 top-0 text-[12px] font-bold border border-gray-200 bg-gray-50 hover:bg-[#f0faf0] text-gray-400 hover:text-[#5cb85c] hover:border-[#5cb85c] px-1.5 py-0.5 rounded cursor-pointer transition-all opacity-0 group-hover/tblock:opacity-100 flex items-center justify-center shadow-sm">BN</button>
                  )}
                  <p id={`body-text-${idx}`} data-lang="en" className="text-[16.5px] text-gray-700 leading-[1.9] whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: section.body }} />
                </div>
              )}

              {section.list && section.list.length > 0 && (
                <div className="relative group/tblock">
                  {section.listBn && section.listBn.length > 0 && (
                    <button onClick={() => {
                      const container = document.getElementById(`list-container-${idx}`);
                      const isBn = container?.getAttribute('data-lang') === 'bn';
                      if (container) {
                        container.setAttribute('data-lang', isBn ? 'en' : 'bn');
                        const listItems = isBn ? section.list : section.listBn;
                        container.innerHTML = listItems.map((item: string, i: number) => `
                          <li class="flex items-start gap-3 text-[16.5px] text-gray-700 leading-[1.9] py-2 border-b border-gray-50">
                            <span class="text-[14px] font-bold text-[#5cb85c] min-w-[22px] flex-shrink-0 mt-0.5">${String(i + 1).padStart(2, "0")}.</span>
                            ${item}
                          </li>
                        `).join('');
                        const btn = document.getElementById(`list-btn-${idx}`);
                        if (btn) btn.innerText = isBn ? 'BN' : 'EN';
                      }
                    }} id={`list-btn-${idx}`} className="absolute -left-10 top-1 text-[12px] font-bold border border-gray-200 bg-gray-50 hover:bg-[#f0faf0] text-gray-400 hover:text-[#5cb85c] hover:border-[#5cb85c] px-1.5 py-0.5 rounded cursor-pointer transition-all opacity-0 group-hover/tblock:opacity-100 flex items-center justify-center shadow-sm z-10">BN</button>
                  )}
                  <ol id={`list-container-${idx}`} data-lang="en" className="flex flex-col gap-2">
                    {section.list.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-[16.5px] text-gray-700 leading-[1.9] py-2 border-b border-gray-50">
                        <span className="text-[14px] font-bold text-[#5cb85c] min-w-[22px] flex-shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}.</span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {section.extra && (
                <div className="relative group/tblock">
                  {section.extraBn && (
                    <button onClick={() => {
                      const el = document.getElementById(`extra-text-${idx}`);
                      const isBn = el?.getAttribute('data-lang') === 'bn';
                      if (el) {
                        el.innerText = isBn ? section.extra : section.extraBn;
                        el.setAttribute('data-lang', isBn ? 'en' : 'bn');
                        const btn = document.getElementById(`extra-btn-${idx}`);
                        if (btn) btn.innerText = isBn ? 'BN' : 'EN';
                      }
                    }} id={`extra-btn-${idx}`} className="absolute -left-10 top-0 text-[12px] font-bold border border-gray-200 bg-gray-50 hover:bg-[#f0faf0] text-gray-400 hover:text-[#5cb85c] hover:border-[#5cb85c] px-1.5 py-0.5 rounded cursor-pointer transition-all opacity-0 group-hover/tblock:opacity-100 flex items-center justify-center shadow-sm">BN</button>
                  )}
                  <p id={`extra-text-${idx}`} data-lang="en" className="text-[16.5px] text-gray-700 leading-[1.9] whitespace-pre-wrap">{section.extra}</p>
                </div>
              )}

              {idx === 0 && <HorizontalAdBanner />}
              {idx === 1 && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="flex items-center gap-1.5 text-[10.5px] font-bold text-gray-400 uppercase tracking-widest mb-3"><Tag size={11} /> Sponsored Products</p>
                  <div className="grid grid-cols-3 gap-3">
                    <ProductCard name="ComplianceAI" price="$39/mo" rating={5} reviews={230} badge="Sponsored" />
                    <ProductCard name="AuditShield" price="$19/mo" rating={4} reviews={95} />
                    <ProductCard name="LegalBot Pro" price="$59/mo" rating={5} reviews={511} badge="Top Rated" />
                  </div>
                </div>
              )}
            </section>
          ))}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
            <span className="text-[12px] font-bold text-gray-500">Tags:</span>
            {(Array.from(new Set(content.tags.concat([content.category, "Business", "Growth"]).filter(Boolean))) as string[]).map((tag: string, index: number) => (
              <span key={`${tag}-${index}`} className="text-[11px] font-semibold text-gray-600 bg-gray-100 hover:bg-[#f0faf0] hover:text-[#5cb85c] border border-gray-200 hover:border-[#5cb85c] px-3 py-1 rounded-full cursor-pointer transition-all">{tag}</span>
            ))}
          </div>

          {/* Author bio card */}
          <div className="flex items-start gap-4 bg-gray-50 border border-gray-200 rounded-2xl p-5">
            <div className="relative w-[72px] h-[72px] rounded-full overflow-hidden border-[3px] border-gray-200 flex-shrink-0">
              <Image src={content.authorAvatar} alt={content.author} fill className="object-cover" sizes="72px" unoptimized />
            </div>
            <div>
              <p className="text-[15px] font-extrabold text-gray-900">{content.author}</p>
              <p className="text-[13px] text-[#5cb85c] font-medium mt-0.5">{content.authorBio}</p>
              {/* <p className="text-[12.5px] text-gray-500 leading-relaxed mt-2">A seasoned content strategist with 10+ years of experience covering finance, technology, and business intelligence. His work has been featured in Forbes, Bloomberg, and the Wall Street Journal.</p> */}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <RightSidebar category={content.category} />
      </div>

      {/* Bottom ad */}
      <div className="mb-6"><HorizontalAdBanner /></div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div>
          <h2 className="text-[1.1rem] font-extrabold text-gray-900 mb-4">Related Articles</h2>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {relatedPosts.slice(0, 4).map((rp) => <RelatedCard key={rp.id} post={rp} onSelect={onBack ?? (() => {})} />)}
          </div>
        </div>
      )}
    </div>
  );
}
