"use client";

import { User, Briefcase, Home, Baby, Heart, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

const supportGroups = [
    {
        title: "Adolescents & Young Women",
        description: "Navigating the chaos of finding yourself.",
        icon: <User className="w-6 h-6 text-primary" />
    },
    {
        title: "Working Professionals",
        description: "Balancing ambition with inner peace.",
        icon: <Briefcase className="w-6 h-6 text-primary" />
    },
    {
        title: "Homemakers",
        description: "Finding value in every unseen labor of love.",
        icon: <Home className="w-6 h-6 text-primary" />
    },
    {
        title: "Pregnant & Postpartum",
        description: "Embracing the transformation of motherhood.",
        icon: <Baby className="w-6 h-6 text-primary" />
    },
    {
        title: "Senior Women",
        description: "Honoring the wisdom of your journey.",
        icon: <Heart className="w-6 h-6 text-primary" />
    },
    {
        title: "Queer & Diverse",
        description: "Celebrating your authentic self in a safe space.",
        icon: <Sparkles className="w-6 h-6 text-primary" />
    }
];

export function WhoWeSupport() {
    const containerRef = useScrollAnimation();

    return (
        <section ref={containerRef} className="py-16 px-6 md:px-12 lg:px-24 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 space-y-4 animate-fade-up">
                    <span className="text-secondary-foreground text-xs font-bold uppercase tracking-[0.2em] block">
                        Who We Support
                    </span>
                    <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight">
                        You Are Not <span className=" text-muted-foreground font-light">Alone.</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
                        Every stage of life brings its own unique challenges. We are here to walk beside you through them all.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger-container">
                    {supportGroups.map((group, index) => (
                        <div
                            key={index}
                            className="group bg-card p-8 rounded-3xl border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 relative overflow-hidden animate-stagger-item"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                                    {group.icon}
                                </div>

                                <div>
                                    <h3 className="font-sans text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {group.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                                        “{group.description}”
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
