
"use client";

import { useScrollAnimation } from "@/app/hooks/useScrollAnimation";
import { Mail, MapPin, Phone, Send, Instagram, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export function ContactSection() {
    const containerRef = useScrollAnimation();

    return (
        <section ref={containerRef} className="py-16 px-6 md:px-12 lg:px-24 bg-background">
            {/* Split Layout Container */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

                {/* Left: Content & Info */}
                <div className="space-y-12 animate-fade-up">
                    <div className="space-y-6">
                        <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em] block">
                            Get in Touch
                        </span>
                        <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight">
                            Start Your Journey <br />
                            <span className=" text-muted-foreground font-light">to Healing Today.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg font-light leading-relaxed max-w-md">
                            We are here to listen. Whether you have questions or are ready to book your first session, reach out to us.
                        </p>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-8">
                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                <Mail className="w-5 h-5 text-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-foreground font-medium">Email Us</h3>
                                <p className="text-muted-foreground font-light">info@hermindmate.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                <Phone className="w-5 h-5 text-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-foreground font-medium">Call Us</h3>
                                <p className="text-muted-foreground font-light">+91 77363 33277</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                <MapPin className="w-5 h-5 text-foreground" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-foreground font-medium">Visit Us</h3>
                                <p className="text-muted-foreground font-light">Kozhikode, Kerala</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="pt-8 border-t border-border flex gap-6">
                        <a href="https://www.instagram.com/hermindmate?igsh=dm55YW5uZmhleGNj&utm_source=qr" className="text-muted-foreground hover:text-secondary transition-colors"><Instagram className="w-5 h-5" /></a>
                    </div>
                </div>

                {/* Right: Contact Form */}
                <div className="bg-secondary p-8 md:p-10 rounded-3xl border border-border shadow-2xl shadow-black/5 animate-scale-up">
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Name</label>
                                <input
                                    type="text"
                                    placeholder="Jane Doe"
                                    className="w-full bg-background border border-input rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Email</label>
                                <input
                                    type="email"
                                    placeholder="jane@example.com"
                                    className="w-full bg-background border border-input rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Subject</label>
                            <input
                                type="text"
                                placeholder="How can we help?"
                                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-muted-foreground uppercase tracking-wide font-medium">Message</label>
                            <textarea
                                rows={4}
                                placeholder="Tell us about what you're going through..."
                                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            />
                        </div>

                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl text-lg transition-all shadow-lg shadow-black/5 flex items-center justify-center gap-2">
                            Send Message <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>

            </div>
        </section>
    );
}
