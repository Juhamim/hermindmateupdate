"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, Wallet, Stethoscope } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export function DashboardStats() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPsychologists: 0,
        activeBookings: 0,
        revenue: 0 // Mock or calculate if table has amount
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // 1. Users (Role = patient)
            const { count: userCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('role', 'patient');

            // 2. Psychologists
            const { count: psychCount } = await supabase
                .from('psychologists')
                .select('*', { count: 'exact', head: true });

            // 3. Bookings (Confirmed/Pending)
            const { count: bookingCount } = await supabase
                .from('bookings')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'cancelled');

            // 4. Revenue (Sum amount from confirmed bookings)
            const { data: revenueData } = await supabase
                .from('bookings')
                .select('amount')
                .eq('status', 'confirmed');

            const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.amount || 0), 0) || 0;

            setStats({
                totalUsers: userCount || 0,
                totalPsychologists: psychCount || 0,
                activeBookings: bookingCount || 0,
                revenue: totalRevenue
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total Users",
            value: stats.totalUsers,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/20"
        },
        {
            label: "Psychologists",
            value: stats.totalPsychologists,
            icon: Stethoscope,
            color: "text-teal-600",
            bg: "bg-teal-100 dark:bg-teal-900/20"
        },
        {
            label: "Total Bookings",
            value: stats.activeBookings,
            icon: Calendar,
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/20"
        },
        {
            label: "Total Revenue",
            value: `₹${stats.revenue.toLocaleString()}`,
            icon: Wallet,
            color: "text-orange-600",
            bg: "bg-orange-100 dark:bg-orange-900/20"
        }
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
                <div key={stat.label} className="bg-card border border-border/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-2xl font-bold mt-1 text-foreground">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bg}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
