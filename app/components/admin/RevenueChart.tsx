"use client";

import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { createBrowserClient } from "@supabase/ssr";

// Mock data structure matching what Recharts expects
interface ChartData {
    name: string; // Date (e.g. "Mon", "Jan 1")
    bookings: number;
    revenue: number;
}

export function RevenueChart() {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // Fetch last 7 days of bookings
            // For MVP simplicity, we'll fetch all and process in JS (assuming low volume)
            // Ideally use database aggregation (RPC function) for scalability
            const { data: bookings } = await supabase
                .from('bookings')
                .select('created_at, amount')
                .order('created_at', { ascending: true });

            if (!bookings) {
                setLoading(false);
                return;
            }

            // Aggregate by Date
            const groupedArgs: Record<string, { bookings: number; revenue: number }> = {};

            // Initialize last 7 days
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0]; // YYYY-MM-DD
            });

            last7Days.forEach(date => {
                groupedArgs[date] = { bookings: 0, revenue: 0 };
            });

            bookings.forEach(booking => {
                const date = booking.created_at.split('T')[0];
                if (groupedArgs[date]) {
                    groupedArgs[date].bookings += 1;
                    groupedArgs[date].revenue += (booking.amount || 0);
                }
            });

            const chartData = last7Days.map(date => ({
                name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                bookings: groupedArgs[date].bookings,
                revenue: groupedArgs[date].revenue
            }));

            setData(chartData);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-xl" />;

    return (
        <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Revenue & Bookings Overview</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#6b7280' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                            name="Revenue (₹)"
                        />
                        <Area
                            type="monotone"
                            dataKey="bookings"
                            stroke="#6366f1"
                            fillOpacity={1}
                            fill="url(#colorBookings)"
                            strokeWidth={2}
                            name="Bookings"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
