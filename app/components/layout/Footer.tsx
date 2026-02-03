"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";

export function Footer() {
    const containerRef = useScrollAnimation();

    return (
        <footer ref={containerRef} className="bg-white py-12 px-4 sm:px-6 relative z-10 overflow-hidden animate-fade-up">
            <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-gradient-to-br from-white to-primary/60 px-8 pb-12 pt-16 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-16">
                    {/* Brand Column */}
                    <div className="md:col-span-4 space-y-6">
                        <h2 className="font-sans text-3xl text-foreground">Her MindMate</h2>
                        <p className="text-gray-500 font-light leading-relaxed max-w-sm">
                            Elevating mental wellness to a state of art. A sanctuary for your mind, crafted with empathy and precision.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram].map((Icon, i) => (
                                <Link key={i} href="#" className="p-2 rounded-full border border-foreground/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-foreground">
                                    <Icon className="w-4 h-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-xs uppercase tracking-widest font-semibold text-foreground/80">Sitemap</h4>
                        <ul className="space-y-4 text-sm font-light text-gray-600">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/search" className="hover:text-primary transition-colors">Our Specialists</Link></li>
                            <li><Link href="/#assessment" className="hover:text-primary transition-colors">Free Assessment</Link></li>
                            <li><Link href="/narrative" className="hover:text-primary transition-colors">The Narrative</Link></li>
                            <li><Link href="/journal" className="hover:text-primary transition-colors">Journal</Link></li>
                        </ul>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <h4 className="text-xs uppercase tracking-widest font-semibold text-foreground/80">Legal</h4>
                        <ul className="space-y-4 text-sm font-light text-gray-600">
                            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact */}
                    <div className="md:col-span-4 space-y-6">
                        <h4 className="text-xs uppercase tracking-widest font-semibold text-foreground/80">Stay Connected</h4>
                        <p className="text-sm text-gray-500 font-light">
                            Join our inner circle for insights on refined living and mental clarity.
                        </p>
                        <div className="flex gap-2 border-b border-foreground/20 pb-2">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground w-full"
                            />
                            <button className="text-primary hover:text-foreground transition-colors">
                                <ArrowUpRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-foreground/10 text-xs text-gray-400 tracking-wide uppercase">
                    <p>&copy; {new Date().getFullYear()} Her MindMate. All rights reserved.</p>
                    <p>Designed for Serenity.</p>
                </div>
            </div>
        </footer>
    );
}
