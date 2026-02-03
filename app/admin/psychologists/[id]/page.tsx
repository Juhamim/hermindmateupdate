"use client";

import { useEffect, useState, use } from "react";
import { getPsychologistById, updatePsychologist, upsertPsychologistPackages } from "@/app/lib/actions/psychologists";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ArrowLeft, Loader2, Save, Clock, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { ImageUpload } from "@/app/components/ui/ImageUpload";

export default function EditPsychologistPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<any>({
        name: "",
        title: "",
        bio: "",
        specializations: "",
        languages: "",
        education: "",
        years_of_experience: "",
        availability: "",
        price: "",
        image_url: "",
        location: "",
        // startTime: "09:00", // Deprecated
        // endTime: "17:00", // Deprecated
        // workingDays: [] as number[], // Deprecated
        availabilityBlocks: [] as { days: number[], startTime: string, endTime: string }[],
        packages: []
    });

    useEffect(() => {
        const fetchPsychologist = async () => {
            try {
                const data = await getPsychologistById(id);
                if (data) {
                    // Normalize data for form
                    const avail = (data as any).availability_slots || [];

                    // Group availability by Start/End time to reconstruct blocks
                    const blocksMap = new Map<string, { days: number[], startTime: string, endTime: string }>();

                    avail.forEach((slot: any) => {
                        const key = `${slot.start_time}-${slot.end_time}`;
                        if (!blocksMap.has(key)) {
                            blocksMap.set(key, {
                                days: [],
                                startTime: slot.start_time, // Postgres Time format HH:MM:SS usually, but <input type="time"> handles HH:MM
                                endTime: slot.end_time
                            });
                        }
                        blocksMap.get(key)?.days.push(slot.day_of_week);
                    });

                    // Format Times to HH:MM for input compatibility
                    const availabilityBlocks = Array.from(blocksMap.values()).map(b => ({
                        ...b,
                        startTime: b.startTime.slice(0, 5), // '09:00:00' -> '09:00'
                        endTime: b.endTime.slice(0, 5)
                    }));

                    const packages = (data as any).packages || []; // Existing packages

                    setFormData({
                        ...data,
                        specializations: Array.isArray(data.specializations) ? data.specializations.join(", ") : data.specializations,
                        languages: Array.isArray(data.languages) ? data.languages.join(", ") : data.languages,
                        education: Array.isArray(data.education) ? data.education.join(", ") : data.education,
                        years_of_experience: data.years_of_experience || "",
                        price: data.price || "",
                        availabilityBlocks,
                        packages
                    });
                }
            } catch (error) {
                console.error("Failed to fetch", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPsychologist();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const specializationsArray = formData.specializations.includes(',')
                ? formData.specializations.split(',').map((s: string) => s.trim()).filter(Boolean)
                : [formData.specializations];

            const languagesArray = formData.languages.includes(',')
                ? formData.languages.split(',').map((s: string) => s.trim()).filter(Boolean)
                : [formData.languages];

            const educationArray = formData.education.includes(',')
                ? formData.education.split(',').map((s: string) => s.trim()).filter(Boolean)
                : [formData.education];

            await updatePsychologist(id, {
                ...formData,
                specializations: specializationsArray,
                languages: languagesArray,
                education: educationArray,
                years_of_experience: Number(formData.years_of_experience),
                price: Number(formData.price)
            });

            // Update Packages
            if (formData.packages) {
                await upsertPsychologistPackages(id, formData.packages);
            }

            alert("Psychologist and packages updated successfully!");
            router.push("/admin/psychologists");
        } catch (error) {
            console.error(error);
            alert("Failed to update.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-muted-foreground">Loading details...</div>;

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/psychologists">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to List
                    </Link>
                </Button>

                <div className="bg-card border rounded-lg p-6 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Edit Psychologist</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input required name="name" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input required name="title" value={formData.title} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[100px]"
                                name="bio"
                                value={formData.bio || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Specializations</label>
                                <Input name="specializations" value={formData.specializations} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Languages (comma separated)</label>
                                <Input name="languages" value={formData.languages} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Education</label>
                                <Input name="education" value={formData.education} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Years of Experience</label>
                                <Input type="number" name="years_of_experience" value={formData.years_of_experience} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price (INR)</label>
                                <Input type="number" name="price" value={formData.price} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/50 space-y-4">
                            <h4 className="font-semibold text-sm flex items-center justify-between">
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Working Hours & Availability</span>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setFormData((prev: any) => ({
                                            ...prev,
                                            availabilityBlocks: [
                                                ...(prev.availabilityBlocks || []),
                                                { days: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "17:00" }
                                            ]
                                        }));
                                    }}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Plus className="w-3 h-3 mr-2" /> Add Time Block
                                </Button>
                            </h4>

                            <div className="space-y-4">
                                {formData.availabilityBlocks?.map((block: any, blockIndex: number) => (
                                    <div key={blockIndex} className="bg-background p-4 rounded-md border space-y-3 relative">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                            onClick={() => {
                                                const newBlocks = formData.availabilityBlocks.filter((_: any, i: number) => i !== blockIndex);
                                                setFormData((prev: any) => ({ ...prev, availabilityBlocks: newBlocks }));
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium">Start Time</label>
                                                <Input
                                                    type="time"
                                                    value={block.startTime}
                                                    onChange={(e) => {
                                                        const newBlocks = [...formData.availabilityBlocks];
                                                        newBlocks[blockIndex].startTime = e.target.value;
                                                        setFormData((prev: any) => ({ ...prev, availabilityBlocks: newBlocks }));
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-medium">End Time</label>
                                                <Input
                                                    type="time"
                                                    value={block.endTime}
                                                    onChange={(e) => {
                                                        const newBlocks = [...formData.availabilityBlocks];
                                                        newBlocks[blockIndex].endTime = e.target.value;
                                                        setFormData((prev: any) => ({ ...prev, availabilityBlocks: newBlocks }));
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-medium">Working Days</label>
                                            <div className="flex flex-wrap gap-2">
                                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIndex) => (
                                                    <button
                                                        key={day}
                                                        type="button"
                                                        onClick={() => {
                                                            const newBlocks = [...formData.availabilityBlocks];
                                                            const currentDays = newBlocks[blockIndex].days;
                                                            if (currentDays.includes(dayIndex)) {
                                                                newBlocks[blockIndex].days = currentDays.filter((d: number) => d !== dayIndex);
                                                            } else {
                                                                newBlocks[blockIndex].days = [...currentDays, dayIndex].sort();
                                                            }
                                                            setFormData((prev: any) => ({ ...prev, availabilityBlocks: newBlocks }));
                                                        }}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${block.days?.includes(dayIndex)
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-background hover:bg-muted border-input"
                                                            }`}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                            {(!block.days || block.days.length === 0) && <p className="text-[10px] text-red-500">Select at least one day.</p>}
                                        </div>
                                    </div>
                                ))}
                                {(!formData.availabilityBlocks || formData.availabilityBlocks.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-4 border-2 border-dashed rounded-md">
                                        No working hours added. Click "Add Time Block" to set schedule.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 pt-2 border-t">
                                <label className="text-sm font-medium">Availability Display Text</label>
                                <Input name="availability" placeholder="Mon - Fri, 9 AM - 6 PM" value={formData.availability || ""} onChange={handleInputChange} />
                                <p className="text-[10px] text-muted-foreground">Text shown on the profile card.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Profile Image</label>
                            <ImageUpload
                                value={formData.image_url}
                                onChange={(url) => setFormData((prev: any) => ({ ...prev, image_url: url }))}
                            />
                        </div>

                        {/* Packages Section */}
                        <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/50 space-y-4">
                            <h4 className="font-semibold text-sm flex items-center justify-between">
                                <span>Packages (Dynamic)</span>
                                <Button
                                    type="button"
                                    onClick={() => {
                                        setFormData((prev: any) => ({
                                            ...prev,
                                            packages: [
                                                ...(prev.packages || []),
                                                { name: "", session_count: 3, price: 0 } // Default
                                            ]
                                        }));
                                    }}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Plus className="w-3 h-3 mr-2" />
                                    Add Package
                                </Button>
                            </h4>
                            <div className="space-y-3">
                                {formData.packages?.map((pkg: any, index: number) => (
                                    <div key={index} className="flex gap-2 items-end bg-background p-3 rounded-md border">
                                        <div className="flex-1 space-y-1">
                                            <label className="text-xs font-medium">Name</label>
                                            <Input
                                                value={pkg.name}
                                                placeholder="e.g. 3 Sessions"
                                                onChange={(e) => {
                                                    const newPackages = [...formData.packages];
                                                    newPackages[index].name = e.target.value;
                                                    setFormData({ ...formData, packages: newPackages });
                                                }}
                                            />
                                        </div>
                                        <div className="w-24 space-y-1">
                                            <label className="text-xs font-medium">Sessions</label>
                                            <Input
                                                type="number"
                                                value={pkg.session_count}
                                                onChange={(e) => {
                                                    const newPackages = [...formData.packages];
                                                    newPackages[index].session_count = Number(e.target.value);
                                                    setFormData({ ...formData, packages: newPackages });
                                                }}
                                            />
                                        </div>
                                        <div className="w-32 space-y-1">
                                            <label className="text-xs font-medium">Price (₹)</label>
                                            <Input
                                                type="number"
                                                value={pkg.price}
                                                onChange={(e) => {
                                                    const newPackages = [...formData.packages];
                                                    newPackages[index].price = Number(e.target.value);
                                                    setFormData({ ...formData, packages: newPackages });
                                                }}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                const newPackages = formData.packages.filter((_: any, i: number) => i !== index);
                                                setFormData({ ...formData, packages: newPackages });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                {(!formData.packages || formData.packages.length === 0) && (
                                    <p className="text-xs text-muted-foreground text-center">No packages added.</p>
                                )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={saving}>
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                Update Profile & Packages
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
