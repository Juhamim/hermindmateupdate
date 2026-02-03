"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Stethoscope,
    Calendar,
    BookOpen,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/app/lib/utils";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/bookings", label: "Bookings", icon: Calendar },
        { href: "/admin/psychologists", label: "Psychologists", icon: Stethoscope },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/blogs", label: "Journal / Blog", icon: BookOpen },
    ];

    const handleLogout = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await supabase.auth.signOut();
        router.push("/login"); // or /
    };

    return (
        <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col fixed left-0 top-0 h-full z-40 hidden md:flex">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-border">
                <span className="text-xl font-bold font-sans text-primary">Her MindMate</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-border">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
