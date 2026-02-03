"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Fade Up Animation
    useGSAP(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.querySelectorAll(".animate-fade-up");

        elements.forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%", // Starts when top of element hits 85% of viewport height
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }, { scope: containerRef });

    // Stagger Fade Up Animation (for lists/grids)
    useGSAP(() => {
        if (!containerRef.current) return;

        const staggerContainers = containerRef.current.querySelectorAll(".animate-stagger-container");

        staggerContainers.forEach((container) => {
            const children = container.querySelectorAll(".animate-stagger-item");

            gsap.fromTo(
                children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1, // 0.1s delay between each item
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: container,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }, { scope: containerRef });

    // Scale Up Animation (for images)
    useGSAP(() => {
        if (!containerRef.current) return;

        const elements = containerRef.current.querySelectorAll(".animate-scale-up");

        elements.forEach((el) => {
            gsap.fromTo(
                el,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }, { scope: containerRef });

    return containerRef;
}
