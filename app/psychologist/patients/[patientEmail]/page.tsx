import { getPatientHistory } from "@/app/lib/actions/patients";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Calendar, FileText, Clock, Video } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/app/lib/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ patientEmail: string }>;
}

export default async function PatientDetailsPage({ params }: PageProps) {
    const { patientEmail } = await params;
    const history = await getPatientHistory(decodeURIComponent(patientEmail));
    const supabase = await createClient();

    // Fetch basic user info (name/email) from the most recent booking if available
    // or try profile if possible. History contains bookings, so we can grab info from the first one.
    const patientInfo = history && history.length > 0 ? {
        name: history[0].user_name,
        email: history[0].user_email,
        phone: history[0].user_phone
    } : { name: "Unknown Patient", email: "", phone: "" };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/psychologist/patients">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{patientInfo.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{patientInfo.email}</span>
                        {patientInfo.phone && <span>• {patientInfo.phone}</span>}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Session History</h2>

                {history.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
                        No session history found.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {history.map((booking: any) => {
                            const session = booking.sessions; // May be object or null
                            // If array (from 1:many inference), take first
                            const sessionData = Array.isArray(session) && session.length > 0 ? session[0] : (session && !Array.isArray(session) ? session : null);

                            const isUpcoming = new Date(booking.start_time) > new Date();

                            return (
                                <div key={booking.id} className="bg-card border rounded-lg p-6 flex flex-col md:flex-row gap-6 transition-all hover:border-primary/50">
                                    <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-muted/30 rounded-lg min-w-[100px] text-center">
                                        <span className="text-2xl font-bold text-primary">
                                            {(() => {
                                                const d = new Date(booking.start_time);
                                                return isNaN(d.getTime()) ? "?" : d.getDate();
                                            })()}
                                        </span>
                                        <span className="text-xs uppercase font-semibold text-muted-foreground">
                                            {(() => {
                                                const d = new Date(booking.start_time);
                                                return isNaN(d.getTime()) ? "UNK" : d.toLocaleDateString('en-US', { month: 'short' });
                                            })()}
                                        </span>
                                        <span className="text-xs text-muted-foreground mt-1">
                                            {(() => {
                                                const d = new Date(booking.start_time);
                                                return isNaN(d.getTime()) ? "--:--" : d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                                            })()}
                                        </span>
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    Session {isUpcoming ? "(Upcoming)" : ""}
                                                    {booking.status === 'confirmed' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Confirmed</span>}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {sessionData ? "Notes & Prescriptions Added" : "No notes recorded yet"}
                                                </p>
                                            </div>
                                            <Button size="sm" variant={sessionData ? "secondary" : "default"} asChild>
                                                <Link href={`/psychologist/sessions/${booking.id}`}>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    {sessionData ? "Edit Notes" : "Add Notes"}
                                                </Link>
                                            </Button>
                                        </div>

                                        {sessionData && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-2 bg-muted/10 p-3 rounded border">
                                                {sessionData.notes && (
                                                    <div>
                                                        <span className="font-semibold text-muted-foreground text-xs uppercase">Notes Excerpt</span>
                                                        <p className="line-clamp-2 text-muted-foreground">"{sessionData.notes}"</p>
                                                    </div>
                                                )}
                                                {sessionData.prescription && (
                                                    <div>
                                                        <span className="font-semibold text-muted-foreground text-xs uppercase">Prescription</span>
                                                        <p className="line-clamp-2 text-muted-foreground">"{sessionData.prescription}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {booking.meeting_link && (
                                            <div className="pt-2">
                                                <a href={booking.meeting_link} target="_blank" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                                                    <Video className="w-3 h-3" /> Meeting Link
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
