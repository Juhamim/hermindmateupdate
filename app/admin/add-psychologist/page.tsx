"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { createPsychologist } from "@/app/lib/actions/psychologists";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, PlusCircle, Lock, Mail, Clock, Package, Trash2 } from "lucide-react";
import { ImageUpload } from "@/app/components/ui/ImageUpload";

export default function AddPsychologistPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
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
        email: "",
        password: "",
        // startTime: "09:00", // Deprecated
        // endTime: "17:00", // Deprecated
        // workingDays: [1, 2, 3, 4, 5] as number[], // Deprecated
        availabilityBlocks: [
            { days: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "17:00" }
        ] as { days: number[]; startTime: string; endTime: string }[],
        packages: [] as { name: string; session_count: number; price: number; description: string }[]
    });

    const [newPackage, setNewPackage] = useState({
        name: "",
        session_count: 3,
        price: 0,
        description: ""
    });

    const addPackage = () => {
        if (!newPackage.name || newPackage.price <= 0) {
            alert("Please enter a valid name and price for the package.");
            return;
        }
        setFormData(prev => ({
            ...prev,
            packages: [...prev.packages, { ...newPackage }]
        }));
        setNewPackage({ name: "", session_count: 3, price: 0, description: "" });
    };

    const removePackage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            packages: prev.packages.filter((_, i) => i !== index)
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Process data
            const specializationsArray = formData.specializations.split(',').map(s => s.trim()).filter(Boolean);
            const languagesArray = formData.languages.split(',').map(s => s.trim()).filter(Boolean);
            const educationArray = formData.education.split(',').map(s => s.trim()).filter(Boolean);
            const priceNumber = parseFloat(formData.price) || 0;
            const experienceNumber = parseInt(formData.years_of_experience) || 0;

            await createPsychologist({
                ...formData,
                specializations: specializationsArray,
                languages: languagesArray,
                education: educationArray,
                years_of_experience: experienceNumber,
                price: priceNumber,
                // Optional fields handling logic moved to action or handled here
                // We pass raw formData merged
            });

            alert("Psychologist account created successfully!");
            router.push("/admin/add-psychologist");
            setFormData({
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
                email: "",
                password: "",
                availabilityBlocks: [{ days: [1, 2, 3, 4, 5], startTime: "09:00", endTime: "17:00" }],
                packages: []
            });
        } catch (error: any) {
            console.error(error);
            alert(error.message || "Failed to add psychologist. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <button onClick={() => router.push("/")} className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </button>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Add New Psychologist - Her MindMate Admin</h2>
                    <p className="text-muted-foreground">Create a login account and profile for a new doctor.</p>
                </div>

                <div className="bg-card border rounded-lg p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Credentials Section */}
                        <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/50 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Lock className="w-4 h-4" /> Account Credentials
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Login Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                        <Input required type="email" name="email" className="pl-9" placeholder="doctor@hermindmate.com" value={formData.email} onChange={handleInputChange} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password *</label>
                                    <Input required type="password" name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Name (Display Name) *</label>
                                <Input required name="name" placeholder="Dr. Jane Doe" value={formData.name} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Professional Title *</label>
                                <Input required name="title" placeholder="Clinical Psychologist" value={formData.title} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Bio</label>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                name="bio"
                                placeholder="Short biography..."
                                value={formData.bio}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Specializations (comma separated) *</label>
                            <Input required name="specializations" placeholder="Anxiety, Depression, CBT" value={formData.specializations} onChange={handleInputChange} />
                            <p className="text-xs text-muted-foreground">Separate multiple values with commas.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Languages Spoken (comma separated) *</label>
                            <Input required name="languages" placeholder="English, Hindi, Marathi" value={formData.languages} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Education (comma separated)</label>
                            <Input name="education" placeholder="Ph.D. in Psychology, M.S. in Counseling" value={formData.education} onChange={handleInputChange} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Years of Experience</label>
                                <Input type="number" name="years_of_experience" placeholder="e.g. 10" value={formData.years_of_experience} onChange={handleInputChange} />
                            </div>
                            <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/50 space-y-4 md:col-span-2">
                                <h4 className="font-semibold text-sm flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Working Hours & Availability</span>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
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
                                        <PlusCircle className="w-3 h-3 mr-2" /> Add Time Block
                                    </Button>
                                </h4>

                                <div className="space-y-4">
                                    {formData.availabilityBlocks?.map((block, blockIndex) => (
                                        <div key={blockIndex} className="bg-background p-4 rounded-md border space-y-3 relative">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 h-6 w-6 p-0"
                                                onClick={() => {
                                                    const newBlocks = formData.availabilityBlocks.filter((_, i) => i !== blockIndex);
                                                    setFormData(prev => ({ ...prev, availabilityBlocks: newBlocks }));
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
                                                            setFormData(prev => ({ ...prev, availabilityBlocks: newBlocks }));
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
                                                            setFormData(prev => ({ ...prev, availabilityBlocks: newBlocks }));
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
                                                                    newBlocks[blockIndex].days = currentDays.filter(d => d !== dayIndex);
                                                                } else {
                                                                    newBlocks[blockIndex].days = [...currentDays, dayIndex].sort();
                                                                }
                                                                setFormData(prev => ({ ...prev, availabilityBlocks: newBlocks }));
                                                            }}
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${block.days.includes(dayIndex)
                                                                ? "bg-primary text-primary-foreground border-primary"
                                                                : "bg-background hover:bg-muted border-input"
                                                                }`}
                                                        >
                                                            {day}
                                                        </button>
                                                    ))}
                                                </div>
                                                {block.days.length === 0 && <p className="text-[10px] text-red-500">Select at least one day.</p>}
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
                                    <label className="text-sm font-medium">Availability Display Text (Manual Override)</label>
                                    <Input name="availability" placeholder="e.g. Mon-Fri 9-5, Sat 10-2" value={formData.availability} onChange={handleInputChange} />
                                    <p className="text-[10px] text-muted-foreground">Text shown on the profile card.</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price per Session (INR) *</label>
                                <Input required type="number" name="price" placeholder="1500" value={formData.price} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location</label>
                                <Input name="location" placeholder="Mumbai, India" value={formData.location} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Profile Image</label>
                            <ImageUpload
                                value={formData.image_url}
                                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                            />
                        </div>

                        {/* Packages Section */}
                        <div className="bg-secondary/20 p-4 rounded-lg border border-secondary/50 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Package className="w-4 h-4" /> Packages
                            </h3>
                            <p className="text-sm text-muted-foreground">Add discounted packages (e.g., 3 Sessions for ₹3000).</p>

                            <div className="space-y-4">
                                {/* Applied Packages List */}
                                {formData.packages.length > 0 && (
                                    <div className="grid gap-3">
                                        {formData.packages.map((pkg, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-background border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{pkg.name}</p>
                                                    <p className="text-xs text-muted-foreground">{pkg.session_count} Sessions • ₹{pkg.price}</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removePackage(index)}
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Package Loop */}
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-medium">Package Name</label>
                                        <Input
                                            placeholder="e.g. Starter Pack"
                                            value={newPackage.name}
                                            onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium">Sessions</label>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={newPackage.session_count}
                                            onChange={(e) => setNewPackage(prev => ({ ...prev, session_count: parseInt(e.target.value) }))}
                                        >
                                            <option value="2">2 Sessions</option>
                                            <option value="3">3 Sessions</option>
                                            <option value="5">5 Sessions</option>
                                            <option value="7">7 Sessions</option>
                                            <option value="10">10 Sessions</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium">Price (INR)</label>
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            value={newPackage.price}
                                            onChange={(e) => setNewPackage(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                                        />
                                    </div>
                                </div>
                                <Button type="button" onClick={addPackage} variant="secondary" size="sm" className="w-full">
                                    <PlusCircle className="w-4 h-4 mr-2" /> Add Package
                                </Button>
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PlusCircle className="w-4 h-4 mr-2" />}
                                Create Account & Profile
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
