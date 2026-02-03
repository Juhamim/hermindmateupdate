"use client";

import { User, Users, Baby, Sparkles, Heart, Flower2 } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
    {
        title: "Individual",
        description: "Therapy for me",
        icon: User,
        href: "/search?category=individual"
    },
    {
        title: "Couples",
        description: "Therapy for us.",
        icon: Users,
        href: "/search?category=couples"
    },
    {
        title: "Children & Adolescent",
        description: "Therapy for minors",
        icon: User,
        href: "/search?category=adolescent"
    },
    {
        title: "Queer Affirmative Therapy",
        description: "Safe space",
        icon: Sparkles,
        href: "/search?category=queer-affirmation"
    },
    {
        title: "Sexual counselling",
        description: "Intimacy & Care",
        icon: Heart,
        href: "/search?category=sexual-counselling"
    },
    {
        title: "Yoga & Meditation",
        description: "Mind & Body",
        icon: Flower2,
        href: "/search?category=yoga-meditation"
    }
];

export function CategoryCards() {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 z-20 relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                {CATEGORIES.map((category, index) => (
                    <Link
                        key={index}
                        href={category.href}
                        className="group bg-white rounded-[2rem] p-6 md:p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="mb-4 text-gray-400 group-hover:text-primary transition-colors duration-300">
                            <category.icon className="w-10 h-10 md:w-12 md:h-12" />
                        </div>
                        <h3 className="font-sans text-lg md:text-xl text-gray-900 font-medium mb-1">
                            {category.title}
                        </h3>
                        <p className="text-sm text-gray-500 font-light">
                            {category.description}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
