import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { SERVICES_LIST } from "@/app/lib/constants/services";

export const metadata: Metadata = {
    title: 'Services - Her MindMate',
    description: 'Comprehensive mental health services tailored to your needs.',
};



export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-[#fcfbf9]">
            <section className="pt-32 pb-20 px-6 lg:px-12 text-center">
                <h1 className="font-sans text-5xl md:text-7xl text-[#332d2b] mb-6 animate-fade-up">
                    Our Services
                </h1>
                <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto animate-fade-up delay-100">
                    Expert care tailored to your unique journey. Choose the path that resonates with you.
                </p>
            </section>

            <section className="px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SERVICES_LIST.map((service, index) => (
                        <div
                            key={index}
                            className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer"
                        >
                            {/* Background Image */}
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300" />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="font-sans text-xl sm:text-2xl text-white mb-2 leading-tight">
                                        {service.title}
                                    </h3>
                                    <p className="text-white/80 text-sm font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 line-clamp-3">
                                        {service.description}
                                    </p>
                                    <div className="mt-4 flex items-center text-white/90 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                                        Learn More <ArrowUpRight className="w-3 h-3 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="px-6 lg:px-12 pb-24">
                <div className="max-w-7xl mx-auto bg-[#332d2b] rounded-[3rem] p-12 lg:p-24 text-center text-[#fcfbf9] relative overflow-hidden">
                    <div className="relative z-10 space-y-8">
                        <h2 className="font-sans text-4xl md:text-5xl">Ready to Start?</h2>
                        <p className="font-light text-white/70 max-w-xl mx-auto">
                            Taking the first step is often the hardest. We are here to make it the most rewarding.
                        </p>
                        <Link
                            href="/search"
                            className="inline-block bg-[#fcfbf9] text-[#332d2b] px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform"
                        >
                            Find Your Specialist
                        </Link>
                    </div>
                    {/* Decorative Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
                </div>
            </section>
        </div>
    );
}
