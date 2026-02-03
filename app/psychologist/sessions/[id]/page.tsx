import { createClient } from "@/app/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { SessionForm } from "./SessionForm";
import { ArrowLeft, Calendar, User, Video, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { getSessionByBookingId } from "@/app/lib/actions/psychologist";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SessionDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Check Auth
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) redirect("/login");

    const activeUserId = session.user.id; // activeUserId

    // 2. Fetch Booking
    const { data: booking, error } = await supabase
        .from('bookings')
        .select('*, psychologists(*)')
        .eq('id', id)
        .single();

    if (error || !booking) {
        notFound();
    }

    // 3. Verify Ownership
    if (booking.psychologist_id !== activeUserId) {
        // In real app, block access. For dev/demo, might be loose if IDs don't match exactly.
        // Assuming strict check:
        // redirect("/psychologist");
        // For now, let's just log and allow if we are debugging, 
        // strictly: return <div className="p-8">Unauthorized Access</div>;
        if (booking.psychologist_id !== activeUserId) {
            return <div className="p-8 text-red-500">Unauthorized: This session does not belong to you.</div>;
        }
    }

    // 4. Fetch existing session data
    const sessionData = await getSessionByBookingId(id);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/psychologist">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Session Details</h1>
                    <p className="text-muted-foreground">{booking.user_name}</p>
                </div>
            </div>

            {/* Client Info Card */}
            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Patient</label>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <span className="font-medium">{booking.user_name}</span>
                        </div>
                        <div className="text-sm text-muted-foreground pl-6">{booking.user_email}</div>
                        <div className="text-sm text-muted-foreground pl-6">{booking.user_phone}</div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Schedule</label>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="font-medium">
                                {new Date(booking.start_time).toLocaleDateString('en-US', {
                                    weekday: 'long', month: 'long', day: 'numeric'
                                })}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>
                                {new Date(booking.start_time).toLocaleTimeString('en-US', {
                                    hour: 'numeric', minute: '2-digit'
                                })}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Meeting</label>
                        {booking.meeting_link ? (
                            <div className="flex flex-col gap-2 items-start">
                                <a
                                    href={booking.meeting_link}
                                    target="_blank"
                                    className="flex items-center gap-2 text-blue-600 hover:underline font-medium"
                                >
                                    <Video className="w-4 h-4" />
                                    Join Google Meet
                                </a>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Confirmed
                                </span>
                            </div>
                        ) : (
                            <span className="text-muted-foreground text-sm">Link pending...</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-6 border-b pb-4">Session Records</h2>
                <SessionForm
                    bookingId={booking.id}
                    psychologistId={booking.psychologist_id}
                    initialData={sessionData}
                />
            </div>
        </div>
    );
}
