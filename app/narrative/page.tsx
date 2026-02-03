import { Metadata } from 'next';
import Image from "next/image";

export const metadata: Metadata = {
    title: 'The Narrative - Her Mindmate',
    description: 'Our story and mission in mental wellness.',
};

export default function NarrativePage() {
    return (
        <div className="min-h-screen bg-[#fcfbf9]">
            <div className="relative py-24 px-6 lg:px-12 overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                    <div className="text-center space-y-6 animate-fade-up">
                        <h1 className="font-sans text-5xl md:text-7xl text-[#332d2b] tracking-tight">
                            The Narrative
                        </h1>
                        <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                            We believe that mental wellness is not just a practice, but a continuous story of becoming.
                        </p>
                    </div>

                    <div className="aspect-[16/9] w-full relative rounded-3xl overflow-hidden shadow-2xl animate-fade-up delay-100">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#f6accb]/20 to-transparent mix-blend-overlay" />
                        <Image
                            src="/narrative.png"
                            alt="The Narrative"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-24 pt-12 animate-fade-up delay-200">
                        <div className="space-y-6">
                            <h2 className="font-sans text-3xl text-[#332d2b]">Our Origin</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Her Mindmate was born from a simple yet profound realization: the journey to mental clarity deserves a space that is as beautiful and dignified as the destination itself. We set out to create a sanctuary where clinical excellence meets human empathy, wrapped in an experience that feels less like a clinic and more like a retreat for the soul.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <h2 className="font-sans text-3xl text-[#332d2b]">Our Philosophy</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                We bridge the gap between rigorous psychological science and the intuitive art of healing. Every specialist in our network is chosen not just for their credentials, but for their capacity to listen, understand, and guide with genuine compassion. Your story matters, and we are here to help you write its next chapter.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[800px] h-[800px] bg-[#f7dfd4]/30 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-[#f6accb]/20 rounded-full blur-3xl pointer-events-none" />
            </div>
        </div>
    );
}
