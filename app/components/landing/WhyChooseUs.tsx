"use client";

import { ShieldCheck, Sprout, HeartHandshake, Users, Award } from "lucide-react";
import Image from "next/image";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

export function WhyChooseUs() {
    const containerRef = useScrollAnimation();

    return (
        <section ref={containerRef} className="py-16 px-6 md:px-12 lg:px-24 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Main Light Card Container */}
                <div className="bg-gradient-to-br from-white to-primary/20 rounded-[2.5rem] p-6 md:p-12 shadow-xl shadow-black/5 border border-border">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left: Large Feature Image */}
                        <div className="relative aspect-[4/5] lg:aspect-square rounded-2xl overflow-hidden bg-muted animate-scale-up">
                            <Image
                                src="/whywe.png" // Reusing an existing serene image
                                alt="Peaceful natural healing"
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>

                        {/* Right: Content */}
                        <div className="space-y-12">
                            <div className="space-y-6 animate-fade-up">
                                <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span>Why Choose Us</span>
                                </div>
                                <h2 className="font-sans text-3xl md:text-4xl text-foreground leading-tight">
                                    Her MindMate as a support system, <br />
                                    <span className="text-muted-foreground font-light">not a gender divide.</span>
                                </h2>
                                <p className="text-gray-600 font-light leading-relaxed text-sm md:text-base">
                                    Women’s empowerment is not just a matter of equality, but of equity — ensuring fair access to support, opportunities, and dignity based on individual needs and contexts. Her MindMate is committed to being the compassionate bridge between women’s silent struggles and their empowered voices.
                                </p>
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 animate-stagger-container">
                                <div className="space-y-3 animate-stagger-item">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm border border-border">
                                        <Sprout className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-sans text-xl text-foreground">Holistic Approach</h3>
                                    <p className="text-sm text-foreground/80 font-light leading-relaxed">
                                        Integrating mind, body, and spirit for comprehensive healing beyond just symptoms.
                                    </p>
                                </div>

                                <div className="space-y-3 animate-stagger-item">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm border border-border">
                                        <Award className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-sans text-xl text-foreground">Expert Guidance</h3>
                                    <p className="text-sm text-foreground/80 font-light leading-relaxed">
                                        Connect with licensed professionals dedicated to your personal growth journey.
                                    </p>
                                </div>

                                <div className="space-y-3 animate-stagger-item">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm border border-border">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-sans text-xl text-foreground">Supportive Team</h3>
                                    <p className="text-sm text-foreground/80 font-light leading-relaxed">
                                        Join a compassionate space where you are seen, heard, and never alone.
                                    </p>
                                </div>

                                <div className="space-y-3 animate-stagger-item">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-2 shadow-sm border border-border">
                                        <HeartHandshake className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-sans text-xl text-foreground">Real Results</h3>
                                    <p className="text-sm text-foreground/80 font-light leading-relaxed">
                                        Evidence-based methods that empower you to make lasting life changes.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
