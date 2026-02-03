import { createClient } from "@/app/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import {
    LayoutDashboard,
    Calendar,
    Users,
    LogOut,
    Menu
} from "lucide-react";

export default async function PsychologistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // 1. Check Auth
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    // 2. Refresh Role Check (Optional but recommended)
    // In a real app we'd check if role === 'psychologist'
    // const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
    // if (profile?.role !== 'psychologist') redirect('/'); 

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-card border-r h-screen sticky top-0">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Her MindMate
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1">Psychologist Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                        <Link href="/psychologist">
                            <LayoutDashboard className="w-5 h-5" />
                            Dashboard
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                        <Link href="/psychologist/schedule">
                            <Calendar className="w-5 h-5" />
                            My Schedule
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3" asChild>
                        <Link href="/psychologist/patients">
                            <Users className="w-5 h-5" />
                            My Patients
                        </Link>
                    </Button>
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            DR
                        </div>
                        <div className="text-sm">
                            <p className="font-medium">Dr. {session.user.user_metadata.full_name || 'Psychologist'}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{session.user.email}</p>
                        </div>
                    </div>
                    {/* Logout Form - In server component we might need a client component for logout action or just a link to an API route */}
                    {/* For now, just a visual button */}
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive">
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Button>
                    </form>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden bg-background border-b p-4 flex items-center justify-between sticky top-0 z-30">
                <span className="font-bold">Her MindMate</span>
                <Button variant="ghost" size="icon">
                    <Menu className="w-5 h-5" />
                </Button>
            </div>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {children}
            </main>
        </div>
    );
}
