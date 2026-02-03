"use client";

import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import {
    PlusCircle,
    LogOut,
    Users,
    BookOpen,
    UserCheck,
    BarChart3,
    Globe,
    ExternalLink
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "@/app/components/admin/AdminSidebar";
import { DashboardStats } from "@/app/components/admin/DashboardStats";
import { RevenueChart } from "@/app/components/admin/RevenueChart";

export default function AdminDashboard() {
    const router = useRouter();
    const [role, setRole] = useState<'admin' | 'psychologist' | 'patient' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            setRole(profile?.role as any || 'patient');
            setLoading(false);
        };
        fetchRole();
    }, [router]);

    const handleLogout = async () => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
        );
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (role === 'patient') {
        return <div className="p-8 text-center">You do not have permission to access this area.</div>;
    }

    // --- PSYCHOLOGIST VIEW (Simple Portal) ---
    if (role === 'psychologist') {
        return (
            <div className="min-h-screen bg-muted/30">
                <header className="bg-background border-b px-6 py-4 flex justify-between items-center sticky top-0 z-30">
                    <h1 className="text-xl font-bold text-foreground">Psychologist Dashboard</h1>
                    <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* My Sessions */}
                        <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg">My Sessions</h3>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">
                                View your upcoming sessions and join meetings.
                            </p>
                            <Button variant="default" className="w-full" asChild>
                                <Link href="/admin/bookings">View Schedule</Link>
                            </Button>
                        </div>

                        {/* My Patients */}
                        <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 group-hover:scale-110 transition-transform">
                                    <UserCheck className="w-6 h-6" />
                                </div>
                                <h3 className="font-semibold text-lg">My Patients</h3>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">
                                View list of patients and clinical notes history.
                            </p>
                            <Button variant="outline" className="w-full" asChild>
                                <Link href="/admin/patients">View Patients</Link>
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    // --- ADMIN VIEW (Full Dashboard) ---
    return (
        <div className="min-h-screen bg-gray-50/50 flex">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content (Shifted right by w-64 on desktop) */}
            <main className="flex-1 md:ml-64 p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-sans text-gray-900">Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Welcome back, Administrator.</p>
                    </div>
                    <div className="flex gap-3">
                        {/* Quick Actions */}
                        <Button asChild size="sm" className="hidden md:flex">
                            <Link href="/admin/psychologists/add"><PlusCircle className="mr-2 h-4 w-4" /> Add Psychologist</Link>
                        </Button>
                    </div>
                </div>

                {/* 1. Key Metrics */}
                <div className="mb-8">
                    <DashboardStats />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 2. Charts Section (Takes 2 columns) */}
                    <div className="lg:col-span-2 space-y-8">
                        <RevenueChart />
                    </div>

                    {/* 3. Side Tools / Quick Links (Takes 1 column) */}
                    <div className="space-y-6">
                        {/* Google Analytics Card */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <BarChart3 className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="font-semibold">Web Analytics</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">
                                Google Analytics is active (ID: G-S851B23HM7).
                                View detailed traffic reports on the Google console.
                            </p>
                            <Button variant="outline" className="w-full justify-between" asChild>
                                <a href="https://analytics.google.com/analytics/web/" target="_blank" rel="noopener noreferrer">
                                    Open Google Analytics <ExternalLink className="w-4 h-4 ml-2" />
                                </a>
                            </Button>
                        </div>

                        {/* Website Status */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <Globe className="w-5 h-5 text-primary" />
                                <h3 className="font-semibold text-primary">Live Website</h3>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                                <span className="text-sm font-medium">Operational</span>
                            </div>
                            <Button className="w-full" asChild>
                                <Link href="/" target="_blank">Visit Site</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
