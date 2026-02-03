"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { ArrowUpRight } from "lucide-react";

import { SERVICES_LIST } from "@/app/lib/constants/services";

interface ServicesAccordionProps {
    limit?: number;
}

export function ServicesAccordion({ limit }: ServicesAccordionProps) {
    const containerRef = useScrollAnimation();

    return (
        <section ref={containerRef} className="py-10 px-6 md:px-12 lg:px-24 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 space-y-4 animate-fade-up">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] block">
                        Our Services
                    </span>
                    <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight">
                        Pathways to <br />
                        <span className=" text-gray-500 font-light">Holistic Healing.</span>
                    </h2>
                </div>

                {/* Services Grid/Slider */}
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:pb-0 md:mx-0 md:px-0 scrollbar-hide animate-stagger-container">
                    {SERVICES_LIST.slice(0, limit || SERVICES_LIST.length).map((service, index) => (
                        <div
                            key={index}
                            className="group relative aspect-square min-w-[85vw] md:min-w-0 snap-center rounded-[2rem] overflow-hidden cursor-pointer animate-stagger-item shadow-md hover:shadow-xl transition-all duration-500"
                        >
                            {/* Background Image */}
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay Gradient (Always visible but gets darker on hover) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="font-sans text-2xl lg:text-3xl mb-3 flex items-center justify-between">
                                        {service.title}
                                        <ArrowUpRight className="w-6 h-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-white/80" />
                                    </h3>
                                    <p className="text-white/80 font-light leading-relaxed text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        {service.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Action */}
                {/* <div className="mt-16 text-center animate-fade-up">
                    <Button
                        asChild
                        className="bg-[#f0e4d7] text-[#5e4b35] hover:bg-[#e6d5c1] rounded-full px-10 py-7 text-sm font-semibold tracking-widest uppercase shadow-sm"
                    >
                        <Link href="/search">
                            View All Services
                        </Link>
                    </Button>
                </div> */}
            </div>
        </section>
    );
}
