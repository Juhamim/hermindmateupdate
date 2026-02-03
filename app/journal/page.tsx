import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

export const metadata: Metadata = {
    title: 'Journal - Mindmate',
    description: 'Insights on refined living and mental clarity.',
};

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

async function getBlogs() {
    const { data: blogs } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

    return blogs || [];
}

export default async function JournalPage() {
    const articles = await getBlogs();

    return (
        <div className="min-h-screen bg-[#fcfbf9]">
            <div className="pt-24 pb-24 px-6 lg:px-12 max-w-7xl mx-auto">
                <div className="text-center space-y-6 mb-20 animate-fade-up">
                    <h1 className="font-sans text-5xl md:text-7xl text-[#332d2b] tracking-tight">
                        The Journal
                    </h1>
                    <p className="text-lg text-gray-500 font-light max-w-xl mx-auto">
                        Curated narratives on psychology, culture, and the pursuit of a balanced life.
                    </p>
                </div>

                {articles.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        <p>No articles published yet.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-16">
                        {articles.map((article, index) => (
                            <Link
                                href={`/journal/${article.slug}`}
                                key={article.id}
                                className={`group cursor-pointer animate-fade-up`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <article>
                                    <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-6 overflow-hidden relative">
                                        {article.image_url ? (
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                                (No Image)
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#f7dfd4]/40 to-[#f6accb]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-xs tracking-widest uppercase font-medium text-[#a66e6e]">
                                            <span>Journal</span>
                                            <span className="w-1 h-1 rounded-full bg-[#a66e6e]" />
                                            <span>{new Date(article.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <h3 className="font-sans text-2xl text-[#332d2b] group-hover:text-[#a66e6e] transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-500 font-light leading-relaxed line-clamp-2">
                                            {article.summary || article.content?.substring(0, 150)}
                                        </p>
                                        <div className="pt-2">
                                            <span className="inline-flex items-center text-sm font-medium text-[#332d2b] group-hover:gap-2 transition-all">
                                                Read Article <ArrowUpRight className="w-4 h-4 ml-1" />
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

