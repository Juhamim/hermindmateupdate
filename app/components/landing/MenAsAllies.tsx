"use client";

import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { Heart, Users, HandHeart } from "lucide-react";

export function MenAsAllies() {
    const containerRef = useScrollAnimation();

    return (
        <section ref={containerRef} className="py-16 px-6 md:px-12 lg:px-24 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-tl from-white to-secondary/20 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-black/5 border border-border">
                    <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-up">

                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold text-xs uppercase tracking-[0.2em]">
                                <Users className="w-4 h-4" />
                                <span>Inclusivity</span>
                            </div>
                            <h2 className="font-sans text-3xl md:text-4xl text-foreground leading-tight">
                                Including Men as Allies..
                            </h2>
                            <p className="text-slate-600 font-light leading-relaxed text-sm md:text-base">
                                While our core focus remains women's well-being, we also support men who genuinely care about the women in their lives. Healthy families and relationships thrive when men are emotionally aware, respectful, and supportive.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
                            <div className="bg-white/60 p-6 rounded-2xl border border-border/50 hover:bg-white hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <HandHeart className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Supportive Partners</h3>
                                <p className="text-sm text-slate-600 font-light">
                                    Men seeking guidance to better support their partners or family members.
                                </p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-2xl border border-border/50 hover:bg-white hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Caring Fathers</h3>
                                <p className="text-sm text-slate-600 font-light">
                                    Fathers wanting to understand their children's emotional needs.
                                </p>
                            </div>

                            <div className="bg-white/60 p-6 rounded-2xl border border-border/50 hover:bg-white hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                    <Users className="w-5 h-5" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">Safe Relationships</h3>
                                <p className="text-sm text-slate-600 font-light">
                                    Partners committed to building respectful and emotionally safe relationships.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
