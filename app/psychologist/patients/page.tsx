"use client";

import { useEffect, useState } from "react";
import { getPsychologistPatients } from "@/app/lib/actions/patients";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/Card";
import { Button } from "@/app/components/ui/Button";
import { Search, User, Phone, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/app/components/ui/Input";

export default function PatientsPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPsychologistPatients();
                setPatients(data);
            } catch (error) {
                console.error("Failed to fetch patients", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Patients</h1>
                    <p className="text-muted-foreground">Manage your patient records and history</p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patients..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-muted-foreground">Loading patients...</div>
            ) : filteredPatients.length === 0 ? (
                <div className="text-center py-20 bg-card border rounded-lg text-muted-foreground">
                    <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No patients found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <Card key={patient.email} className="hover:shadow-md transition-shadow cursor-pointer group">
                            <Link href={`/psychologist/patients/${encodeURIComponent(patient.email)}`}>
                                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                        {patient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-base font-semibold truncate">{patient.name}</CardTitle>
                                        <p className="text-xs text-muted-foreground truncate">{patient.email}</p>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="w-3 h-3" />
                                            <span className="truncate">{patient.phone || "N/A"}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            <span>
                                                {(() => {
                                                    if (!patient.last_visit) return "N/A";
                                                    const date = new Date(patient.last_visit);
                                                    return isNaN(date.getTime())
                                                        ? "N/A"
                                                        : date.toLocaleDateString(undefined, {
                                                            month: 'short', day: 'numeric'
                                                        });
                                                })()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t text-xs">
                                        <span className="font-medium bg-muted px-2 py-1 rounded-full">
                                            {patient.total_sessions} Sessions
                                        </span>
                                        <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                            View History <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
