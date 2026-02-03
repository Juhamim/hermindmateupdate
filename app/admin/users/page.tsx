
import { createClient } from "@/app/lib/supabase/server";
import { redirect } from "next/navigation";
import UsersList from "./UsersList";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default async function UsersPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Check if admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') redirect('/');

    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return <div className="p-8 text-center text-red-500">Error loading users. Please try again.</div>;
    }

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="bg-background border-b px-6 py-4 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">User Management</h1>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <UsersList users={users || []} />
            </main>
        </div>
    );
}
