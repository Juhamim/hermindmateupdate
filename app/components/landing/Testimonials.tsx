"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
    {
        id: 1,
        name: "Sarah M.",
        quote: "I struggled with anxiety for years, and nothing seemed to help until I found Mindmate. Their personalized therapy plan gave me the tools to reclaim my peace, and for the first time, I finally feel truly in control of my life!",
        service: "Anxiety Relief",
        duration: "8 weeks",
        rating: "5.0",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "James L.",
        quote: "The compassionate guidance I received here was life-changing. I learned to communicate better and reconnect with my partner. It wasn't just therapy; it was a journey to a better version of myself.",
        service: "Relationship Counseling",
        duration: "12 weeks",
        rating: "4.9",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "Emily R.",
        quote: "Finding a therapist who truly understands was difficult until I came here. The warmth and professionalism made me feel safe to open up immediately.",
        service: "Depression Support",
        duration: "10 weeks",
        rating: "5.0",
        image: "https://images.unsplash.com/photo-1554151228-14d9def656ec?q=80&w=800&auto=format&fit=crop" // Woman with glasses
    }
];

export function Testimonials() {
    const containerRef = useScrollAnimation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Auto-advance
    useEffect(() => {
        const timer = setInterval(nextTestimonial, 8000); // 8 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <section ref={containerRef} className="py-16 px-6 md:px-12 lg:px-24 bg-background">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center space-y-4 animate-scale-up">
                    <span className="text-secondary-foreground/60 text-xs font-bold uppercase tracking-[0.2em] block">
                        Testimonials
                    </span>
                    <h2 className="font-sans text-5xl md:text-6xl text-foreground leading-tight">
                        Real Growth, <br />
                        <span className="text-secondary-foreground/60">Real Confidence.</span>
                    </h2>
                </div>

                {/* Carousel Container */}
                <div className="relative max-w-5xl mx-auto">
                    {/* Navigation Buttons - Absolute positioned on desktop, hidden on very small mobile? or just smaller */}
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 rounded-full border border-border bg-background/50 hover:bg-background flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-5 h-5 text-foreground" />
                    </button>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 rounded-full border border-border bg-background/50 hover:bg-background flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-5 h-5 text-foreground" />
                    </button>

                    {/* Main Card Area */}
                    <div className="relative overflow-hidden min-h-[550px] md:min-h-[500px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="w-full h-full"
                            >
                                <div className="flex flex-col lg:flex-row bg-gradient-to-br from-white to-primary/20 rounded-[2.5rem] overflow-hidden border border-border h-full shadow-lg">
                                    {/* Image Side */}
                                    <div className="relative w-full lg:w-5/12 aspect-square lg:aspect-auto min-h-[300px] lg:min-h-full">
                                        <Image
                                            src={testimonials[currentIndex].image}
                                            alt={testimonials[currentIndex].name}
                                            fill
                                            className="object-cover"
                                        />
                                        {/* Overlay for depth */}
                                        <div className="absolute inset-0 bg-black/5" />
                                    </div>

                                    {/* Content Side */}
                                    <div className="w-full lg:w-7/12 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
                                        <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
                                            <span className="font-sans text-9xl text-primary/20 leading-none">“</span>
                                        </div>

                                        <blockquote className="font-sans text-2xl md:text-3xl text-foreground leading-snug relative z-10 mb-8">
                                            {testimonials[currentIndex].quote}
                                        </blockquote>

                                        <div className="space-y-1">
                                            <div className="font-sans text-xl text-foreground font-medium">
                                                {testimonials[currentIndex].name}
                                            </div>
                                            <div className="flex items-center gap-1 text-primary">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current" />
                                                ))}
                                            </div>
                                        </div>


                                        {/* Details Row */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-border mt-8">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Service</p>
                                                <p className="font-sans text-foreground text-sm md:text-base">{testimonials[currentIndex].service}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Duration</p>
                                                <p className="font-sans text-foreground text-sm md:text-base">{testimonials[currentIndex].duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Dots Navigation */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'w-8 bg-primary' : 'bg-primary/30 hover:bg-primary/60'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
