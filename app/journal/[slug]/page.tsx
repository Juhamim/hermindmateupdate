import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

// Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const slug = (await params).slug;
    const { data: blog } = await supabase.from('blogs').select('title, summary').eq('slug', slug).single();

    if (!blog) return { title: 'Not Found' };

    return {
        title: `${blog.title} - Mindmate Journal`,
        description: blog.summary || `Read about ${blog.title}`,
    };
}

async function getBlog(slug: string) {
    const { data: blog } = await supabase
        .from('blogs')
        .select('*, profiles(full_name)')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

    return blog;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const blog = await getBlog(slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#fcfbf9]">
            <article className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto">
                <Link
                    href="/journal"
                    className="inline-flex items-center text-sm text-gray-500 hover:text-[#a66e6e] mb-12 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Journal
                </Link>

                <header className="space-y-6 mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase font-medium text-[#a66e6e]">
                        <span>Journal</span>
                        <span className="w-1 h-1 rounded-full bg-[#a66e6e]" />
                        <span>{new Date(blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl text-[#332d2b] tracking-tight leading-tight">
                        {blog.title}
                    </h1>
                    {blog.summary && (
                        <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                            {blog.summary}
                        </p>
                    )}
                </header>

                {blog.image_url && (
                    <div className="aspect-video w-full bg-gray-200 rounded-2xl mb-12 overflow-hidden shadow-sm">
                        <img
                            src={blog.image_url}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg prose-stone mx-auto max-w-none 
                    prose-headings:font-sans prose-headings:font-normal prose-headings:text-[#332d2b]
                    prose-p:text-gray-600 prose-p:leading-loose prose-p:font-light
                    prose-a:text-[#a66e6e] prose-a:no-underline hover:prose-a:underline
                    prose-blockquote:border-l-[#a66e6e] prose-blockquote:bg-[#f7dfd4]/10 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic
                    prose-img:rounded-xl">
                    {/* 
                        If we implement rich text later, we'd use a parser here. 
                        For now, assuming simple formatting or pre-formatted HTML if the admin puts it in.
                        But since the input is just a textarea, we'll just display it with whitespace preservation 
                        or minimal formatting. For true markdown we'd need a library.
                        For this task, I'll just render it inside a div with whitespace-pre-wrap to respect newlines.
                    */}
                    <div className="whitespace-pre-wrap font-serif">
                        {blog.content}
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                        Written by <span className="font-medium text-[#332d2b]">{blog.profiles?.full_name || 'Mindmate Team'}</span>
                    </div>

                </div>
            </article>
        </div>
    );
}
