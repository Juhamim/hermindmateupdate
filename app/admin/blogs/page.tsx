"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { PlusCircle, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useEffect, useState } from "react";
import { deleteBlog } from "@/app/lib/actions/blog";
import { useRouter } from "next/navigation";

interface Blog {
    id: string;
    title: string;
    slug: string;
    is_published: boolean;
    created_at: string;
}

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBlogs = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
            );

            const { data, error } = await supabase
                .from('blogs')
                .select('id, title, slug, is_published, created_at')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Error fetching blogs (Full):", JSON.stringify(error, null, 2));
                console.error("Error details:", error.message, error.code, error.details);
            } else {
                setBlogs(data || []);
            }
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this blog?")) {
            try {
                await deleteBlog(id);
                setBlogs(blogs.filter(blog => blog.id !== id));
            } catch (error) {
                console.error("Failed to delete blog:", error);
                alert("Failed to delete blog. Please try again.");
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading blogs...</div>;

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="bg-background border-b px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold">Manage Blogs</h1>
                </div>
                <Button asChild>
                    <Link href="/admin/blogs/add">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Blog
                    </Link>
                </Button>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-card border rounded-lg shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b">
                                <tr>
                                    <th className="p-4 font-medium">Title</th>
                                    <th className="p-4 font-medium">Slug</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No blogs found. Create your first one!
                                        </td>
                                    </tr>
                                ) : (
                                    blogs.map((blog) => (
                                        <tr key={blog.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-medium">{blog.title}</td>
                                            <td className="p-4 text-muted-foreground">{blog.slug}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${blog.is_published
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                    }`}>
                                                    {blog.is_published ? "Published" : "Draft"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/admin/blogs/${blog.id}`}>
                                                            <Pencil className="w-4 h-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(blog.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
