import type { Metadata } from "next";
import { getPosts } from "@/app/actions/blog";
import BlogDetailPage from "@/components/BlogDetailPage";
import { notFound } from "next/navigation";

// Generate static params for SSG
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post: any) => ({
    slug: (post.slug || post.id || "").toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const posts = await getPosts();
  const rawPost = posts.find((p: any) => (p.slug || p.id || "").toString() === resolvedParams.slug);

  if (!rawPost) {
    return { title: "Post Not Found" };
  }

  const title = rawPost.title || "Untitled";
  const description = rawPost.intro || rawPost.excerpt || rawPost.description || rawPost.content?.slice(0, 200) || "";
  const image = rawPost.image || rawPost.main_image || rawPost.coverImage;

  const categoryName =
    typeof rawPost.category === "object" && rawPost.category?.name
      ? rawPost.category.name
      : typeof rawPost.category === "string"
      ? rawPost.category
      : "General";

  return {
    title: `${title} | WWB`,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image] : [],
    },
    alternates: {
      canonical: `/my-feed/${resolvedParams.slug}`,
    },
  };
}

export default async function MyFeedPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const posts = await getPosts();
  const rawPost = posts.find((p: any) => (p.slug || p.id || "").toString() === resolvedParams.slug);

  if (!rawPost) {
    notFound();
  }

  // Same mapping as BusinessFeed for consistency
  const categoryName =
    typeof rawPost.category === "object" && rawPost.category?.name
      ? rawPost.category.name
      : typeof rawPost.category === "string"
      ? rawPost.category
      : "General";

  const mappedPost = {
    ...rawPost,
    image:
      rawPost.image ||
      rawPost.main_image ||
      rawPost.coverImage ||
      "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
    tags: Array.isArray(rawPost.tags) ? rawPost.tags : ["Business"],
    category: categoryName,
    date: new Date(
      rawPost.last_updated ||
        rawPost.lastUpdated ||
        rawPost.published_at ||
        rawPost.created_at ||
        Date.now()
    ).toLocaleDateString(),
    desc:
      rawPost.intro ||
      rawPost.excerpt ||
      rawPost.description ||
      rawPost.content?.slice(0, 200) ||
      "",
    title: rawPost.title || "Untitled",
  };

  const relatedPosts = posts
    .filter((p: any) => p.id !== rawPost.id)
    .slice(0, 4)
    .map((p: any) => ({
      ...p,
      image: p.image || p.main_image || p.coverImage || "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80",
      tags: Array.isArray(p.tags) ? p.tags : ["Business"],
      date: new Date(p.created_at || Date.now()).toLocaleDateString(),
      title: p.title || "Untitled",
    }));

  return <BlogDetailPage post={mappedPost} relatedPosts={relatedPosts} />;
}
