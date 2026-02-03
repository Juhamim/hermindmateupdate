"use client";

import { useEffect, useState } from "react";
import { getPsychologistPatients } from "@/app/lib/actions/patients";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, User, Calendar, Phone } from "lucide-react";

export default function MyPatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPsychologistPatients().then(data => {
            setPatients(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-muted/30">
            <header className="bg-background border-b px-6 py-4 flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">My Patients</h1>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div>Loading patients...</div>
                ) : patients.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No patients found. Bookings will appear here.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.map((patient) => (
                            <div key={patient.email} className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{patient.name}</h3>
                                            <p className="text-xs text-muted-foreground">{patient.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{patient.phone || 'No phone'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Last Visit: {new Date(patient.last_visit).toLocaleDateString()}</span>
                                    </div>
                                    <div className="pt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                            {patient.total_sessions} Sessions Recorded
                                        </span>
                                    </div>
                                </div>

                                <Button className="w-full" asChild variant="outline">
                                    <Link href={`/admin/patients/${encodeURIComponent(patient.email)}`}>
                                        View History & Notes
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
