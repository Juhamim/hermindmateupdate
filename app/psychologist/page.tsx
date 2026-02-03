import { createClient } from "@/app/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Calendar, Clock, DollarSign, Users, Video, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export default async function PsychologistDashboard() {
    const supabase = await createClient();

    // 1. Get Current User (Psychologist)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null; // Handled by layout

    const userId = session.user.id;
    // Assuming linked via ID or we need to look up psychologist record. 
    // Let's assume psychologist_id in bookings maps to this auth ID for now, 
    // or we fetch the psychologist record first if IDs differ.
    // Usually: auth.uid -> psychologists.id (if 1:1)

    // 2. Fetch Stats & Upcoming Bookings
    const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('psychologist_id', userId)
        .order('start_time', { ascending: true });

    const upcomingBookings = bookings?.filter(b =>
        new Date(b.start_time) > new Date() && b.status === 'confirmed'
    ) || [];

    const stats = {
        totalSessions: bookings?.filter(b => b.status === 'confirmed').length || 0,
        upcoming: upcomingBookings.length,
        totalEarnings: bookings?.reduce((acc, curr) => acc + (curr.payment_status === 'captured' ? curr.amount : 0), 0) || 0
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, Dr. {session.user.user_metadata.full_name}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.upcoming}</div>
                        <p className="text-xs text-muted-foreground mt-1">Scheduled for future</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                        <Users className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSessions}</div>
                        <p className="text-xs text-muted-foreground mt-1">Confirmed bookings</p>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Sessions List */}
            < div className="space-y-4" >
                <h2 className="text-xl font-semibold">Today & Upcoming</h2>
                {
                    upcomingBookings.length === 0 ? (
                        <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No upcoming sessions scheduled.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {upcomingBookings.map((booking) => (
                                <div key={booking.id} className="bg-card border rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-lg text-primary">
                                            <Calendar className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{booking.user_name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                <Clock className="w-3 h-3" />
                                                <span>
                                                    {new Date(booking.start_time).toLocaleString('en-US', {
                                                        weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                            {booking.meeting_link && (
                                                <a href={booking.meeting_link} target="_blank" className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
                                                    <Video className="w-3 h-3" /> Join Meeting
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <Link href={`/psychologist/sessions/${booking.id}`}>
                                                <FileText className="w-4 h-4 mr-2" />
                                                Notes & Prescriptions
                                            </Link>
                                        </Button>
                                        {booking.meeting_link && (
                                            <Button size="sm" className="flex-1" asChild>
                                                <a href={booking.meeting_link} target="_blank">
                                                    Join
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }
            </div >
        </div >
    );
}
