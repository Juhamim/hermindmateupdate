"use client";

import { useEffect, useState } from "react";
import { getPsychologists } from "@/app/lib/actions/psychologists";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { ArrowLeft, Edit, Plus, User } from "lucide-react";

export default function PsychologistsListPage() {
    const [psychologists, setPsychologists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPsychologists = async () => {
            try {
                const data = await getPsychologists();
                setPsychologists(data);
            } catch (error) {
                console.error("Failed to fetch psychologists", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPsychologists();
    }, []);

    return (
        <div className="min-h-screen bg-muted/30 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Button variant="ghost" size="sm" asChild className="mb-2">
                            <Link href="/admin">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Dashboard
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold">Manage Psychologists</h1>
                        <p className="text-muted-foreground">View and edit registered mental health professionals.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/add-psychologist">
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Psychologist
                        </Link>
                    </Button>
                </div>

                <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">Loading...</div>
                    ) : psychologists.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No psychologists found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Title</th>
                                        <th className="px-6 py-3">Experience</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {psychologists.map((psych) => (
                                        <tr key={psych.id} className="bg-card hover:bg-muted/20 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {psych.name}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {psych.title}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {psych.years_of_experience} years
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                ₹{psych.price}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/admin/psychologists/${psych.id}`}>
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
