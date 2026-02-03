"use server";

import { createClient } from "@/app/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBlog(data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    image_url: string;
    is_published: boolean;
    author_id: string;
}) {
    const supabase = await createClient();

    const { data: blog, error } = await supabase
        .from('blogs')
        .insert([data])
        .select()
        .single();

    if (error) {
        console.error('Error creating blog (Full):', JSON.stringify(error, null, 2));
        console.error('Error details:', error.message, error.code, error.details);
        throw new Error('Failed to create blog');
    }

    revalidatePath('/admin/blogs');
    revalidatePath('/journal');
    return blog;
}

export async function updateBlog(id: string, data: {
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    image_url?: string;
    is_published?: boolean;
}) {
    const supabase = await createClient();

    const { data: blog, error } = await supabase
        .from('blogs')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating blog (Full):', JSON.stringify(error, null, 2));
        console.error('Error details:', error.message, error.code, error.details);
        throw new Error('Failed to update blog');
    }

    revalidatePath('/admin/blogs');
    revalidatePath(`/admin/blogs/${id}`);
    revalidatePath('/journal');
    return blog;
}

export async function deleteBlog(id: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting blog (Full):', JSON.stringify(error, null, 2));
        console.error('Error details:', error.message, error.code, error.details);
        throw new Error('Failed to delete blog');
    }

    revalidatePath('/admin/blogs');
    revalidatePath('/journal');
}

export async function getBlogById(id: string) {
    // For reading, we can use the server client too to ensure consistent behavior
    // although public read policy allows anon.
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching blog:', error);
        return null;
    }

    return data;
}

export async function getBlogBySlug(slug: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching blog by slug:', error);
        return null;
    }

    return data;
}
