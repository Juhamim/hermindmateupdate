"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/app/lib/utils";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Find Specialists", href: "/search" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-6xl px-4 md:px-6">
            <nav
                className="mx-auto rounded-full border border-white/20 bg-background/30 backdrop-blur-md shadow-lg"
                aria-label="Global"
            >
                <div className="flex items-center justify-between h-16 px-6 sm:px-8"> {/* Adjusted padding for the rounded container */}
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative h-12 w-48 transition-all duration-300">
                                <Image
                                    src="/logo.png"
                                    alt="Her MindMate Logo"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                    </div>

                    <div className="hidden md:flex md:gap-x-8">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium leading-6 text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="https://calendar.app.google/sfbz8KEjeM12NBcM8"
                            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-all hover:scale-105"
                        >
                            Book A Free Session
                        </Link>
                    </div>

                    <div className="flex md:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground hover:text-foreground"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu - displaying outside the rounded nav for better space, or could be inside. 
                Let's make it a floating dropdown below the main nav. */}
            {isOpen && (
                <div className="absolute top-20 left-0 right-0 mx-auto max-w-6xl px-4 md:px-6 z-40">
                    <div className="rounded-3xl border border-white/20 bg-background/95 backdrop-blur-xl shadow-xl overflow-hidden">
                        <div className="space-y-1 px-4 pb-3 pt-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="mt-4 flex flex-col gap-2 pb-2">
                                <Link
                                    href="https://calendar.app.google/sfbz8KEjeM12NBcM8"
                                    className="block w-full text-center rounded-md bg-primary px-3 py-2 text-base font-medium text-white hover:bg-primary/90"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Book A Free Session
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
