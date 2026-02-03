import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { CheckCircle2, Calendar, Video, ExternalLink } from "lucide-react";
import { getBookingById } from "@/app/lib/actions/bookings";

interface SuccessPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    const params = await searchParams;
    const bookingId = params.bookingId as string;

    let booking = null;
    if (bookingId) {
        booking = await getBookingById(bookingId);
    }

    const formattedDate = booking ? new Date(booking.start_time).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    }) : "Date & Time";

    // Helper to generate Google Calendar Template URL (Fallback)
    const getCalendarUrl = () => {
        if (!booking) return "#";

        const startTime = new Date(booking.start_time);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Assume 1 hour

        const formatDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');
        const start = formatDate(startTime);
        const end = formatDate(endTime);

        const url = new URL('https://calendar.google.com/calendar/render');
        url.searchParams.set('action', 'TEMPLATE');
        url.searchParams.set('text', `Session with ${booking.psychologists?.name || 'Psychologist'}`);
        url.searchParams.set('details', 'Psychology consultation session.');
        url.searchParams.set('dates', `${start}/${end}`);

        return url.toString();
    };

    const isPending = booking?.status === 'pending';

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className={`rounded-full p-4 ${isPending ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                        {isPending ? (
                            <Calendar className="w-16 h-16 text-yellow-600 dark:text-yellow-500" />
                        ) : (
                            <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-500" />
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {isPending ? "Booking Request Received" : "Booking Confirmed!"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isPending
                            ? `Your appointment request ${booking?.psychologists ? `with ${booking.psychologists.name}` : ""} has been received. You will receive a confirmation email once it is approved.`
                            : `Your appointment ${booking?.psychologists ? `with ${booking.psychologists.name}` : ""} has been successfully scheduled. A confirmation email has been sent to your inbox.`
                        }
                    </p>
                </div>

                <div className="bg-card border rounded-lg p-6 space-y-6 text-left shadow-sm">
                    {/* Date & Time Section */}
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold text-lg">Date & Time</p>
                            <p className="text-muted-foreground">{formattedDate}</p>
                            <a
                                href={getCalendarUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary hover:underline mt-1 inline-flex items-center gap-1"
                            >
                                Add to Google Calendar <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>

                    {/* Meeting Link Section - Only show if confirmed and link exists */}
                    {booking?.meeting_link && !isPending && (
                        <div className="flex items-start gap-4 pt-4 border-t">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                                <Video className="w-6 h-6" />
                            </div>
                            <div className="w-full">
                                <p className="font-semibold text-lg mb-1">Video Meeting</p>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Join the session using the link below.
                                </p>
                                <Button className="w-full" asChild>
                                    <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer">
                                        Join Google Meet
                                    </a>
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Pending Status Note */}
                    {isPending && (
                        <div className="flex items-start gap-4 pt-4 border-t">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="w-full">
                                <p className="font-semibold text-lg mb-1">Status: Pending Approval</p>
                                <p className="text-sm text-muted-foreground">
                                    Our team will verify your request and send the meeting details via email & WhatsApp shortly.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
