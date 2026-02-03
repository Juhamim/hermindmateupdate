"use client";

import { useState } from "react";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { FreeAssessment } from "@/app/components/assessment/FreeAssessment";
import { CategoryCards } from "@/app/components/landing/CategoryCards";
import { Modal } from "@/app/components/ui/Modal";
import { Button } from "@/app/components/ui/Button";

export function HeroSection() {
    const containerRef = useScrollAnimation();
    const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);

    return (
        <section ref={containerRef} className="relative min-h-[100vh] w-full overflow-hidden -mt-16 flex flex-col font-sans">
            {/* Background Gradient */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-pink-50 to-purple-200 animate-gradient-slow" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full mx-auto flex flex-col flex-grow h-full pt-32 sm:pt-28 pb-12 justify-center gap-10">

                {/* Centered Hero Content */}
                <div className="flex flex-col items-center justify-center text-center px-4 md:px-6 max-w-5xl mx-auto space-y-6">

                    {/* Text */}
                    <div className="space-y-4 animate-fade-up">
                        <div className="flex items-center justify-center gap-4 md:gap-8 mb-2 opacity-50">
                            {/* Placeholder for small menu items if needed per sketch "Home Services..." */}
                        </div>

                        <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl text-gray-900 leading-[1.0] lg:leading-[1.0] tracking-tight">
                            Here for all, <br />
                            <span className="font-light text-gray-500">no matter what.</span>
                        </h1>

                        <p className="text-gray-600 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
                            Well-Being is an ongoing journey of healing, balance, and self-investment.
                        </p>
                    </div>

                    {/* Free Assessment Button */}
                    <div className="animate-fade-up delay-100">
                        <Button
                            size="lg"
                            className="rounded-full px-8 py-6 text-lg shadow-xl hover:scale-105 transition-all duration-300"
                            onClick={() => setIsAssessmentOpen(true)}
                        >
                            Free Assessment
                        </Button>
                    </div>

                </div>

                {/* Overlapping Category Cards at the Bottom */}
                <div className="w-full mt-8 animate-fade-up delay-200">
                    <CategoryCards />
                </div>

            </div>

            {/* Assessment Modal */}
            <Modal
                isOpen={isAssessmentOpen}
                onClose={() => setIsAssessmentOpen(false)}
                title="Free Mental Health Assessment"
            >
                <FreeAssessment />
            </Modal>
        </section >
    );
}


