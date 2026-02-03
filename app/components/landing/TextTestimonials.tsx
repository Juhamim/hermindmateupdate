"use client";

import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { Quote } from "lucide-react";

const testimonials = [
    {
        quote: "Her MindMate helped me feel heard and understood. The sessions were calm and supportive.",
        author: "Haya Farooq",
        role: "Client"
    },
    {
        quote: "The sessions gave us a safe space to talk and resolve issues calmly.",
        author: "Mr & Mrs Zaman",
        role: "Couple Therapy"
    },
    {
        quote: "We saw a positive change in our child’s confidence and emotional wellbeing. Her MindMate provided gentle and professional support for our teenager.",
        author: "Parent of Dina",
        role: "Teen Therapy"
    }
];

export function TextTestimonials() {
    const containerRef = useScrollAnimation();

    return (
        <section ref={containerRef} className="py-24 px-6 lg:px-12 bg-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-10 left-10 w-64 h-64 bg-[#f7dfd4] rounded-full blur-[100px]" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#f6accb]/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4 animate-fade-up">
                    <span className="text-secondary-foreground text-xs font-bold uppercase tracking-[0.2em] block">
                        Client Stories
                    </span>
                    <h2 className="font-sans text-4xl md:text-5xl text-[#332d2b] leading-tight">
                        Voices of <span className=" text-[#a66e6e]">Healing</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12 animate-stagger-container">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="flex flex-col text-center md:text-left space-y-6 group animate-stagger-item"
                        >
                            <div className="mx-auto md:mx-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#fcfbf9] text-[#a66e6e] mb-2 group-hover:scale-110 transition-transform duration-500">
                                <Quote className="w-5 h-5 fill-current" />
                            </div>

                            <p className="font-sans text-xl md:text-2xl text-[#332d2b] leading-relaxed flex-grow">
                                "{testimonial.quote}"
                            </p>

                            <div className="pt-6 border-t border-[#f7dfd4]/50">
                                <p className="font-bold text-[#332d2b] tracking-wide">{testimonial.author}</p>
                                <p className="text-sm text-gray-500 font-light mt-1 uppercase tracking-wider">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
