"use client";

import { useState, useEffect, useMemo } from "react";
import { PsychologistCard, Psychologist } from "@/app/components/features/PsychologistCard";
import { getPsychologists } from "@/app/lib/actions/psychologists";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

    // Derived State for Sorted Groups
    const sortedGroups = useMemo(() => {
        const clinical: Psychologist[] = [];
        const consultant: Psychologist[] = [];

        psychologists.forEach(p => {
            const title = p.title?.toLowerCase() || "";
            if (title.includes('clinical')) {
                clinical.push(p);
            } else {
                consultant.push(p);
            }
        });

        // Sort Clinical: Years (High to Low)
        clinical.sort((a, b) => (b.years_of_experience || 0) - (a.years_of_experience || 0));

        // Sort Consultant: Tier (PhD > Standard > Intern) then Years
        consultant.sort((a, b) => {
            const getTier = (p: Psychologist) => {
                const title = p.title?.toLowerCase() || "";
                const name = p.name?.toLowerCase() || "";
                const education = p.education?.map(e => e.toLowerCase()) || [];

                // Tier 1: PhD (Highest)
                if (title.includes('phd') || education.some(e => e.includes('phd')) || name.startsWith('dr')) return 3;

                // Tier 3: Intern (Lowest)
                if (title.includes('intern')) return 1;

                // Tier 2: Standard
                return 2;
            };

            const tierA = getTier(a);
            const tierB = getTier(b);

            if (tierA !== tierB) return tierB - tierA; // Higher tier first

            // If same tier, sort by years
            return (b.years_of_experience || 0) - (a.years_of_experience || 0);
        });

        return { clinical, consultant };
    }, [psychologists]);

    useEffect(() => {
        const fetchPsychologists = async () => {
            setLoading(true);
            try {
                const data = await getPsychologists(searchTerm, {
                    specializations: selectedSpecializations,
                    priceRange: selectedPriceRanges
                });
                setPsychologists(data);
            } catch (error) {
                console.error("Failed to fetch psychologists", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchPsychologists, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, selectedSpecializations, selectedPriceRanges]);

    const handleSpecializationChange = (spec: string) => {
        setSelectedSpecializations(prev =>
            prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
        );
    };

    const handlePriceRangeChange = (range: string) => {
        setSelectedPriceRanges(prev =>
            prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
        );
    };

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-sans text-foreground mb-1">OUR SPECIALISTS</h1>
                        <p className="text-muted-foreground text-sm md:text-base font-light">Finding the right therapist is.......?</p>
                    </div>

                    <div className="flex w-full md:w-auto gap-2">
                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by name or specialization..."
                                className="pl-9 bg-background/50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters (Hidden on mobile for MVP simplicity, would be a Sheet/Modal) */}
                    <div className="hidden lg:block lg:col-span-1 space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold uppercase tracking-wider text-sm">Specialization</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    {[
                                        { label: "Anxiety", value: "anxiety" },
                                        { label: "Depression", value: "depression" },
                                        { label: "Family Therapy", value: "family" },
                                        { label: "Career Counseling", value: "career" },
                                        { label: "Trauma", value: "trauma" },
                                        { label: "Relationships", value: "relationship" },
                                        { label: "Queer Affirmation", value: "queer" },
                                        { label: "Sexual Wellness", value: "sexual" },
                                        { label: "Yoga & Meditation", value: "yoga" }
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={selectedSpecializations.includes(option.value)}
                                                onChange={() => handleSpecializationChange(option.value)}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold uppercase tracking-wider text-sm">Price Range</h3>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedPriceRanges.includes('under_500')}
                                        onChange={() => handlePriceRangeChange('under_500')}
                                    />
                                    Under ₹500
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedPriceRanges.includes('500_1500')}
                                        onChange={() => handlePriceRangeChange('500_1500')}
                                    />
                                    ₹500 - ₹1500
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedPriceRanges.includes('1500_plus')}
                                        onChange={() => handlePriceRangeChange('1500_plus')}
                                    />
                                    ₹1500+
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            {/* Reset Filters */}
                            <Button
                                className="w-full"
                                variant="secondary"
                                onClick={() => {
                                    setSelectedSpecializations([]);
                                    setSelectedPriceRanges([]);
                                    setSearchTerm("");
                                }}
                            >
                                Reset Filters
                            </Button>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="lg:col-span-3 space-y-12">
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : psychologists.length > 0 ? (
                            <>
                                {/* Clinical Psychologists Section */}
                                {sortedGroups.clinical.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-xl font-sans font-bold text-foreground">
                                                Clinical Psychologists
                                            </h2>
                                            <div className="h-[1px] flex-1 bg-border/50"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {sortedGroups.clinical.map((psyc, index) => (
                                                <PsychologistCard key={psyc.id} psychologist={psyc} index={index} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Consultant Psychologists Section */}
                                {sortedGroups.consultant.length > 0 && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-xl font-sans font-bold text-foreground">
                                                Consultant Psychologists
                                            </h2>
                                            <div className="h-[1px] flex-1 bg-border/50"></div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {sortedGroups.consultant.map((psyc, index) => (
                                                <PsychologistCard key={psyc.id} psychologist={psyc} index={index} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 text-muted-foreground">
                                No psychologists found matching your search.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
