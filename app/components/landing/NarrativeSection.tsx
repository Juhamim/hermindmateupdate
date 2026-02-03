import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

const stats = [
    { value: "50K+", label: "Clients Supported" },
    { value: "1,200+", label: "Therapy Hours Delivered" },
    { value: "95%", label: "Client Satisfaction Rate" },
    { value: "10+", label: "Years of Experience" },
];

export function NarrativeSection() {
    return (
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-background">
            <div className="max-w-7xl mx-auto space-y-16">

                {/* 1. Centered Header */}
                <div className="text-center max-w-4xl mx-auto space-y-6">
                    <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-600">
                        Who We Are
                    </span>
                    <h2 className="font-sans text-2xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                        Every Step Towards Mental Health Is a Step Towards a <br className="hidden md:block" />
                        Better Life. <span className="text-primary">Your Mind Deserves Peace and Care.</span>
                    </h2>
                    <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl mx-auto">
                        Her MindMate is dedicated to providing compassionate, accessible, and culturally sensitive support for women of all ages. We commit to empowering women with emotional, psychological, and practical support during times of distress, trauma, transition, and resilience.
                    </p>
                </div>

                {/* 2. Large Feature Image */}
                <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-sm">
                    <img
                        src="/aboutlsc.jpg"
                        alt="Group therapy session"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* 3. Vision & Mission Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Vision Card */}
                    <div className="bg-secondary p-10 rounded-2xl flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-sans text-3xl text-foreground mb-4">Vision</h3>
                            <p className="text-gray-600 font-light leading-relaxed max-w-xs">
                                To ensure that every woman — across age, ability, identity, and life stage — receives the care she truly needs, so no woman suffers in silence.
                            </p>
                        </div>
                        {/* Decorative image inside Vision card */}
                        <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
                            <img
                                src="/hero.jpg"
                                alt="Vision"
                                className="object-cover w-full h-full mix-blend-multiply opacity-20"
                            />
                        </div>
                    </div>

                    {/* Mission Card */}
                    <div className="bg-card p-10 rounded-2xl border border-border flex flex-col justify-center min-h-[300px]">
                        <h3 className="font-sans text-3xl text-foreground mb-8">Mission</h3>
                        <ul className="space-y-4">
                            {[
                                "Compassionate & Culturally Sensitive Support",
                                "Advocating Equity & Inclusion",
                                "Raising Awareness & Accessibility",
                                "Amplifying Women's Voices"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center gap-3 text-muted-foreground font-light">
                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 4. Statistics Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-12 border-t border-border">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center space-y-2">
                            <span className="block font-sans text-5xl md:text-6xl text-foreground">
                                {stat.value}
                            </span>
                            <span className="text-sm uppercase tracking-wider text-muted-foreground">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
