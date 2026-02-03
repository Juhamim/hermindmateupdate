"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { Save, Lock } from "lucide-react";
import { SessionInsert, upsertSession } from "@/app/lib/actions/psychologist";

interface SessionFormProps {
    bookingId: string;
    psychologistId: string;
    initialData: any | null; // Database['public']['Tables']['sessions']['Row']
}

export function SessionForm({ bookingId, psychologistId, initialData }: SessionFormProps) {
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [prescription, setPrescription] = useState(initialData?.prescription || "");
    const [tags, setTags] = useState<string>(initialData?.tags?.join(", ") || "");
    const [moodRating, setMoodRating] = useState(initialData?.mood_rating || 5);

    const handleSave = async () => {
        setLoading(true);
        try {
            const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);

            const payload: SessionInsert = {
                booking_id: bookingId,
                psychologist_id: psychologistId,
                notes,
                prescription,
                tags: tagsArray,
                mood_rating: Number(moodRating),
                // is_locked: false // Can add locking logic later
            };

            await upsertSession(payload);
            alert("Session details saved successfully!");
        } catch (error) {
            console.error("Failed to save", error);
            alert("Failed to save changes.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Clinical Notes */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Clinical Notes (Private)</label>
                    <textarea
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Patient observations, progress notes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Only visible to you.</p>
                </div>

                {/* Prescription & Advise */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">Prescription / Recommendations</label>
                    <textarea
                        className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Recommended exercises, medications, or follow-up..."
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Can be shared with patient (future feature).</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <Input
                        placeholder="anxiety, sleep, cbt"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Patient Mood Rating (1-10)</label>
                    <Input
                        type="number"
                        min="1"
                        max="10"
                        value={moodRating}
                        onChange={(e) => setMoodRating(Number(e.target.value))}
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} disabled={loading} className="w-full md:w-auto">
                    {loading ? "Saving..." : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Session Record
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
