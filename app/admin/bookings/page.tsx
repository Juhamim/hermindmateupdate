"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, ExternalLink, Calendar, User, UserCheck } from "lucide-react";
import { getAllBookings } from "@/app/lib/actions/bookings";
import { Database } from "@/app/lib/database.types";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

// Type definition for the joined data
type BookingWithPsychologist = Database['public']['Tables']['bookings']['Row'] & {
    psychologists: {
        name: string;
        image_url: string | null;
        title: string;
    } | null;
};

export default function BookingsPage() {
    const router = useRouter();
    const [bookings, setBookings] = useState<BookingWithPsychologist[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<'admin' | 'psychologist' | 'patient' | null>(null);

    // Action States
    const [selectedBooking, setSelectedBooking] = useState<BookingWithPsychologist | null>(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [meetingLink, setMeetingLink] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const init = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
            );
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Fetch Role
            const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            setRole(profile?.role as any);

            // Fetch Bookings
            try {
                const data = await getAllBookings();
                // @ts-ignore
                setBookings(data as BookingWithPsychologist[]);
            } catch (error) {
                console.error("Failed to load bookings", error);
            } finally {
                setLoading(false);
            }
        };

        init();
    }, [router]);

    const handleApproveClick = (booking: BookingWithPsychologist) => {
        setSelectedBooking(booking);
        setMeetingLink(""); // Reset
        setIsApproveModalOpen(true);
    };

    const handleConfirmApprove = async () => {
        if (!selectedBooking || !meetingLink) return;

        setActionLoading(true);
        try {
            const { approveBooking } = await import("@/app/lib/actions/admin");
            await approveBooking(selectedBooking.id, meetingLink);

            // Refresh list
            const data = await getAllBookings();
            // @ts-ignore
            setBookings(data as BookingWithPsychologist[]);
            setIsApproveModalOpen(false);
            setSelectedBooking(null);
        } catch (error) {
            console.error("Failed to approve", error);
            alert("Failed to approve booking");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectClick = async (booking: BookingWithPsychologist) => {
        if (!confirm("Are you sure you want to REJECT this booking? This action cannot be undone.")) return;

        setActionLoading(true);
        try {
            const { rejectBooking } = await import("@/app/lib/actions/admin");
            await rejectBooking(booking.id);

            // Refresh list
            const data = await getAllBookings();
            // @ts-ignore
            setBookings(data as BookingWithPsychologist[]);
        } catch (error) {
            console.error("Failed to reject", error);
            alert("Failed to reject booking");
        } finally {
            setActionLoading(false);
        }
    };

    const getWhatsAppLink = (booking: BookingWithPsychologist) => {
        if (!booking.user_phone) return "#";
        const message = `Hello ${booking.user_name}, your session with ${booking.psychologists?.name} has been confirmed! You can join via this link: ${booking.meeting_link || "[Link Pending]"}`;
        return `https://wa.me/${booking.user_phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Asia/Kolkata',
        });
    };

    // Import Modal dynamically or ensure it is imported at top
    const { Modal } = require("@/app/components/ui/Modal");
    const { Input } = require("@/app/components/ui/Input"); // Ensure Input is imported

    const isAdmin = role === 'admin';

    // Filter validation: Psychologists shouldn't see bookings they're not assigned to (RLS handles this but UI guard is nice)
    // Actually RLS handles it, so fetched bookings are correct.

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="bg-background border-b px-6 py-4 flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">
                    {isAdmin ? 'All Bookings' : 'My Sessions'}
                </h1>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            Loading bookings...
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No bookings found</h3>
                            <p>Once users book appointments, they will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 font-medium text-muted-foreground">Date & Time</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground">Client</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground">Psychologist</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                                        <th className="px-6 py-4 font-medium text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                                            {/* Date */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium">{formatDate(booking.start_time)}</div>
                                                <div className="text-xs text-muted-foreground">{booking.payment_status || 'Unpaid'}</div>
                                            </td>

                                            {/* Client */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{booking.user_name}</div>
                                                        <div className="text-xs text-muted-foreground">{booking.user_email}</div>
                                                        <div className="text-xs text-muted-foreground">{booking.user_phone}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Psychologist */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary-foreground">
                                                        <UserCheck className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{booking.psychologists?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-muted-foreground">{booking.psychologists?.title}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                                                    ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                                                    ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                                                `}>
                                                    {booking.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            {isAdmin ? (
                                                                <>
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                                                                        onClick={() => handleApproveClick(booking)}
                                                                        disabled={actionLoading}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        className="h-8 text-xs"
                                                                        onClick={() => handleRejectClick(booking)}
                                                                        disabled={actionLoading}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <span className="text-muted-foreground text-xs">
                                                                    Awaiting Admin Approval
                                                                </span>
                                                            )}
                                                        </>
                                                    )}

                                                    {booking.status === 'confirmed' && (
                                                        <div className="flex flex-col gap-1 items-start">
                                                            {booking.meeting_link ? (
                                                                <a
                                                                    href={booking.meeting_link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-xs"
                                                                >
                                                                    Join Meeting
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted-foreground text-xs">
                                                                    Link missing
                                                                </span>
                                                            )}
                                                            {isAdmin && (
                                                                <a
                                                                    href={getWhatsAppLink(booking)}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-green-600 hover:underline text-xs"
                                                                >
                                                                    WhatsApp Client
                                                                </a>
                                                            )}
                                                        </div>
                                                    )}

                                                    {booking.status === 'cancelled' && (
                                                        <span className="text-muted-foreground text-xs">Cancelled</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Approve Modal */}
            <Modal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                title="Approve Booking"
            >
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        To approve the session for <strong>{selectedBooking?.user_name}</strong>,
                        please generate a Google Meet link and paste it below.
                    </p>

                    <div className="space-y-2">
                        <label htmlFor="meetLink" className="text-sm font-medium">Google Meet Link</label>
                        <Input
                            id="meetLink"
                            placeholder="https://meet.google.com/..."
                            value={meetingLink}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMeetingLink(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Go to <a href="https://meet.google.com" target="_blank" className="underline text-primary">meet.google.com</a> to create a new meeting.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmApprove}
                            disabled={!meetingLink || actionLoading}
                        >
                            {actionLoading ? "Approving..." : "Confirm & Send"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
