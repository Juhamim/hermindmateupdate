"use client";

import { useState } from "react";
import { Plus, Brain, Moon, Scale, ShieldCheck } from "lucide-react";
import Image from "next/image";

const hotspots = [
    {
        id: 1,
        top: "30%",
        left: "60%",
        icon: <Brain className="w-5 h-5 text-[#332d2b]" />,
        title: "Mental Clarity",
        description: "Free your thoughts from noise and embrace focus like never before."
    },
    {
        id: 2,
        top: "45%",
        left: "65%",
        icon: <Moon className="w-5 h-5 text-[#332d2b]" />,
        title: "Deep Rest",
        description: "Experience sleep that truly restores your body and mind."
    },
    {
        id: 3,
        top: "55%",
        left: "75%",
        icon: <Scale className="w-5 h-5 text-[#332d2b]" />,
        title: "Emotional Balance",
        description: "Find equilibrium in the midst of life's daily fluctuations."
    },
    {
        id: 4,
        top: "70%",
        left: "68%",
        icon: <ShieldCheck className="w-5 h-5 text-[#332d2b]" />,
        title: "Inner resilience",
        description: "Build a core of strength that protects your peace."
    }
];

export function CTASection() {
    const [activeSpot, setActiveSpot] = useState<number | null>(1);

    return (
        <section className="relative w-full h-[800px] overflow-hidden bg-black">
            {/* Background Image */}
            <Image
                src="/homecta.png" // Using hero image for now, can be swapped for specific woman-sitting image
                alt="Woman sitting in calm meditation"
                fill
                className="object-cover opacity-60"
            />

            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

            <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex items-center">
                <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full">

                    {/* Left: Text Content - Bottom Aligned */}
                    <div className="flex flex-col justify-end pb-24 space-y-8">
                        <h2 className="font-sans text-5xl md:text-6xl text-white leading-tight">
                            Crafted to Elevate <br />
                            both <span className=" font-light">Body and Mind.</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md font-light">
                            Every benefit is not just felt—it is lived. At Her MindMate, transformation is woven into your very being, leaving lasting impressions of calm, balance, and elevated vitality.
                        </p>
                    </div>

                    {/* Right: Interactive Hotspots Area */}
                    <div className="relative hidden lg:block">
                        {hotspots.map((spot) => (
                            <div
                                key={spot.id}
                                className="absolute"
                                style={{ top: spot.top, left: spot.left }}
                            >
                                <div className="relative group">
                                    {/* Pulse Effect */}
                                    <div className={`absolute -inset-4 rounded-full bg-white/20 animate-ping ${activeSpot === spot.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`} />

                                    {/* Trigger Button */}
                                    <button
                                        onClick={() => setActiveSpot(activeSpot === spot.id ? null : spot.id)}
                                        onMouseEnter={() => setActiveSpot(spot.id)}
                                        className={`relative z-20 w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 transition-all duration-300 ${activeSpot === spot.id ? 'bg-white scale-110' : 'bg-white/10 hover:bg-white/20'}`}
                                    >
                                        {activeSpot === spot.id ? spot.icon : <Plus className="w-5 h-5 text-white" />}
                                    </button>

                                    {/* Tooltip Card */}
                                    <div
                                        className={`absolute left-16 top-0 w-64 bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-2xl transition-all duration-500 origin-left ${activeSpot === spot.id ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-4 scale-95 pointer-events-none'}`}
                                    >
                                        <h4 className="font-sans text-xl text-white mb-2">{spot.title}</h4>
                                        <p className="text-sm text-gray-300 font-light leading-relaxed">
                                            {spot.description}
                                        </p>
                                    </div>

                                    {/* Connecting Line */}
                                    <div className={`absolute left-6 top-6 w-10 h-[1px] bg-white/30 transition-all duration-500 ${activeSpot === spot.id ? 'opacity-100 w-10' : 'opacity-0 w-0'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
