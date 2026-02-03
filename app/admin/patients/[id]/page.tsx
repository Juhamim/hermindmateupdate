
import { getPatientHistory } from "@/app/lib/actions/patients";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, Tag, Activity } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PatientHistoryPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const userEmail = decodeURIComponent(params.id);
    const history = await getPatientHistory(userEmail);

    if (!history) {
        // Either not auth or no history
        return <div className="p-8">Patient not found or unauthorized.</div>;
    }

    // history is an array of bookings
    const firstBooking = history[0];
    const patientName = firstBooking?.user_name || userEmail;

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="bg-background border-b px-6 py-4 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/patients">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to List
                    </Link>
                </Button>
                <div>
                    <h1 className="text-xl font-bold">Patient History</h1>
                    <p className="text-sm text-muted-foreground">{patientName} ({userEmail})</p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {history.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border">
                        No clinical notes recorded yet for this patient.
                    </div>
                ) : (
                    history.map((booking: any) => {
                        // Extract clinical session data if available
                        const sessionData = Array.isArray(booking.sessions) ? booking.sessions[0] : booking.sessions;

                        return (
                            <div key={booking.id} className="bg-card border rounded-lg p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4 border-b pb-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium text-foreground">
                                            {(() => {
                                                const time = booking.start_time || booking.created_at;
                                                if (!time) return "N/A";
                                                const d = new Date(time);
                                                return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
                                            })()}
                                        </span>
                                        <span>
                                            at {(() => {
                                                const time = booking.start_time || booking.created_at;
                                                if (!time) return "--:--";
                                                const d = new Date(time);
                                                return isNaN(d.getTime()) ? "--:--" : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            })()}
                                        </span>
                                    </div>
                                    {sessionData?.mood_rating && (
                                        <div className="flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                            <Activity className="w-4 h-4" />
                                            Mood: {sessionData.mood_rating}/10
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" /> Clinical Notes
                                        </h4>
                                        <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap">
                                            {sessionData?.notes || "No notes recorded."}
                                        </div>
                                    </div>

                                    {sessionData?.prescription && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-2">Prescription/Plan</h4>
                                            <div className="p-3 border rounded bg-yellow-50/50 text-sm">
                                                {sessionData.prescription}
                                            </div>
                                        </div>
                                    )}

                                    {sessionData?.tags && sessionData.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {sessionData.tags.map((tag: string) => (
                                                <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </main>
        </div>
    );
}
