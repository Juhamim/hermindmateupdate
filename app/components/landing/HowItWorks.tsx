import { MessageCircle, Users, Shield, HeartHandshake } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Choose your concern",
        description: "Select what’s on your mind.",
        icon: <MessageCircle className="w-6 h-6 text-primary" />
    },
    {
        number: "02",
        title: "Connect with expert",
        description: "Find a specialist who resonates with you.",
        icon: <Users className="w-6 h-6 text-primary" />
    },
    {
        number: "03",
        title: "Safe & confidential",
        description: "Your privacy is our sacred promise.",
        icon: <Shield className="w-6 h-6 text-primary" />
    },
    {
        number: "04",
        title: "Ongoing support",
        description: "We walk with you beyond the session.",
        icon: <HeartHandshake className="w-6 h-6 text-primary" />
    }
];

export function HowItWorks() {
    return (
        <section className="py-16 px-6 md:px-12 lg:px-24 bg-background">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <span className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] block">
                        How It Works
                    </span>
                    <h2 className="font-sans text-4xl md:text-5xl text-foreground leading-tight">
                        Your Journey to <span className=" text-gray-400 font-light">Better.</span>
                    </h2>
                </div>

                {/* Steps Flow */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center space-y-6 group">
                            {/* Step Number & Icon Container */}
                            <div className="relative">
                                {/* Large Number Background */}
                                <span className="absolute -top-8 -left-6 font-sans text-8xl text-muted opacity-50 select-none group-hover:text-muted-foreground transition-colors duration-500">
                                    {step.number}
                                </span>

                                {/* Icon Circle */}
                                <div className="relative z-10 w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg shadow-primary/5 group-hover:scale-110 transition-transform duration-500 border border-border">
                                    {step.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="space-y-3 relative z-10">
                                <h3 className="font-sans text-xl text-foreground">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-[200px] mx-auto">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
