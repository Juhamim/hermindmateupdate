"use server";

import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: 'admin' | 'psychologist' | 'patient') {
    const supabase = await createClient();

    // Verify current user is admin (Backend check + RLS will also enforce)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: currentUserProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profileError || currentUserProfile.role !== 'admin') {
        throw new Error("Unauthorized: Only admins can perform this action");
    }

    const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) {
        console.error("Error updating user role:", error);
        throw new Error("Failed to update user role");
    }

    revalidatePath('/admin/users');
}

import { createAdminClient } from "../supabase/admin";

export async function deleteUser(userId: string) {
    const supabase = await createClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (currentUserProfile?.role !== 'admin') {
        throw new Error("Unauthorized");
    }

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase.auth.admin.deleteUser(userId);

    if (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
    }

    revalidatePath('/admin/users');
}

export async function createUser(data: { email: string; password?: string; fullName: string; role: 'admin' | 'psychologist' | 'patient' }) {
    const supabase = await createClient();

    // Verify current user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (currentUserProfile?.role !== 'admin') {
        throw new Error("Unauthorized");
    }

    const adminSupabase = createAdminClient();

    // Create auth user
    const { data: newUser, error: createError } = await adminSupabase.auth.admin.createUser({
        email: data.email,
        password: data.password || 'TemporaryPass123!', // Provide a default or use temporary
        email_confirm: true,
        user_metadata: {
            full_name: data.fullName
        }
    });

    if (createError) {
        console.error("Error creating user:", createError);
        throw new Error(createError.message);
    }

    // Role will be set to 'patient' by default trigger, we need to update it if it's different
    if (newUser.user && data.role !== 'patient') {
        // Wait briefly for trigger to create profile (it's usually fast, but good to be safe) or assume trigger worked
        // Since we are using admin client, we can direct update the profile role
        // However, the trigger might run asynchronously.
        // A safer bet is to upsert the profile manually with admin client to ensure role is set correctly immediately

        const { error: profileError } = await adminSupabase
            .from('profiles') // adminSupabase bypasses RLS
            .upsert({
                id: newUser.user.id,
                email: data.email,
                full_name: data.fullName,
                role: data.role
            });

        if (profileError) {
            console.error("Error setting user role/profile:", profileError);
            // Don't throw here, the user is created, just role might be wrong (patient)
        }
    }

    revalidatePath('/admin/users');
    return newUser.user;
}
