"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { createBlog } from "@/app/lib/actions/blog";
import { createBrowserClient } from "@supabase/ssr";
import { ImageUpload } from "@/app/components/ui/ImageUpload";

export default function AddBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        summary: "",
        content: "",
        image_url: "",
        is_published: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            // Auto-generate slug from title if slug hasn't been manually edited
            if (name === 'title' && !prev.slug) {
                newData.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            }
            return newData;
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
            );

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) throw new Error("Not authenticated");

            await createBlog({
                ...formData,
                author_id: user.id
            });

            router.push('/admin/blogs');
            router.refresh();
        } catch (error) {
            console.error("Error creating blog:", error);
            alert("Failed to create blog. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="bg-background border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/blogs">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold">New Blog Post</h1>
                </div>
                <Button onClick={handleSubmit} disabled={loading}>
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Blog"}
                </Button>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-card border rounded-lg p-6 shadow-sm space-y-6">

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter blog title"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Slug (URL)</label>
                            <input
                                type="text"
                                name="slug"
                                required
                                value={formData.slug}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="my-blog-post"
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Summary</label>
                            <textarea
                                name="summary"
                                rows={3}
                                value={formData.summary}
                                onChange={handleChange}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Short description for the card..."
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Cover Image</label>
                            <ImageUpload
                                value={formData.image_url}
                                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="is_published"
                                id="is_published"
                                checked={formData.is_published}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor="is_published" className="text-sm font-medium">
                                Publish immediately
                            </label>
                        </div>

                    </div>

                    <div className="bg-card border rounded-lg p-6 shadow-sm space-y-4">
                        <label className="text-lg font-semibold">Content</label>
                        <textarea
                            name="content"
                            required
                            rows={20}
                            value={formData.content}
                            onChange={handleChange}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            placeholder="Write your article content here (Markdown supported if you implement it)..."
                        />
                    </div>
                </form>
            </main>
        </div>
    );
}
