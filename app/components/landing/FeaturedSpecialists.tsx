"use client";

import { Star, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import Link from "next/link";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import type { Psychologist } from "@/app/lib/actions/psychologists";

export function FeaturedSpecialists({ psychologists }: { psychologists: Psychologist[] }) {
    const containerRef = useScrollAnimation();

    return (
        <section ref={containerRef} className="py-16 px-6 md:px-12 lg:px-24 bg-background">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 max-w-7xl mx-auto gap-6 animate-fade-up">
                <div className="space-y-4">
                    <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em]">Our Experts</span>
                    <h2 className="font-sans text-4xl md:text-5xl text-foreground">
                        Guiding you towards <br /> <span className=" text-muted-foreground font-light">clarity and strength.</span>
                    </h2>
                </div>
                <Link href="/search">
                    <Button variant="outline" className="border-border text-foreground hover:bg-secondary hover:text-primary transition-colors rounded-full px-8">
                        View All Specialists
                    </Button>
                </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto animate-stagger-container">
                {psychologists.slice(0, 4).map((psych) => (
                    <div
                        key={psych.id}
                        className="group bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-stagger-item"
                    >

                        <Link href={`/search/${psych.id}`} className="block">
                            {/* Image Header */}
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                <Image
                                    src={psych.image_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"}
                                    alt={psych.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                {psych.years_of_experience && (
                                    <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-foreground tracking-wide flex items-center gap-1 border border-border/50 uppercase shadow-sm">
                                        {psych.years_of_experience}+ Years Exp.
                                    </div>
                                )}
                            </div>

                            {/* Content Body */}
                            <div className="p-5 space-y-4">
                                <div>
                                    <h3 className="font-sans text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors">
                                        {psych.name}
                                    </h3>
                                    <p className="text-muted-foreground uppercase text-[10px] tracking-widest font-semibold mt-1">
                                        {psych.title}
                                    </p>
                                </div>

                                <div className="space-y-1.5 pt-3 border-t border-border/50">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>50 min session</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground/80 font-medium">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Next available: Today</span>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <div className="px-5 pb-5 pt-0 flex items-end justify-between mt-auto">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-0.5">Starting at</p>
                                <p className="text-lg font-sans text-foreground">₹{psych.price || "1500"}</p>
                            </div>
                            <Link href={`/book/${psych.id}`} onClick={(e) => e.stopPropagation()}>
                                <Button size="sm" className="rounded-full px-6 text-xs h-9 shadow-md shadow-primary/10">
                                    Book Now
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center md:hidden">
                <Button asChild variant="outline" className="w-full rounded-full border-border text-foreground bg-transparent hover:bg-muted">
                    <Link href="/search">
                        View All Specialists
                    </Link>
                </Button>
            </div>

        </section >
    );
}
