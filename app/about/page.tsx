import { Metadata } from 'next';
import Image from 'next/image';
import { NarrativeSection } from '@/app/components/landing/NarrativeSection';
import { WhoWeSupport } from '@/app/components/landing/WhoWeSupport';

export const metadata: Metadata = {
    title: 'About Us - Her MindMate',
    description: 'Learn about our mission to make mental wellness a state of art.',
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fcfbf9]">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 lg:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-fade-up">
                        <h1 className="font-sans text-5xl md:text-7xl text-[#332d2b] leading-[1.1]">
                            Reimagining <br />
                            <span className=" text-[#a66e6e]">Mental Wellness.</span>
                        </h1>
                        <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg">
                            We tend to the mind with the same reverence one would diverse for a sacred garden—cultivating peace, pruning chaos, and nurturing growth.
                        </p>
                    </div>
                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl animate-fade-up delay-100">
                        {/* Placeholder for Hero Image */}
                        <Image
                            src="/about.png"
                            alt="Her MindMate Office"
                            fill
                            className="object-cover z-0"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#332d2b]/20 to-transparent z-10" />
                    </div>
                </div>
            </section>

            <NarrativeSection />
            <WhoWeSupport />

            {/* Vision Section */}
            <section className="py-24 bg-[#fcfbf9] relative z-0">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-xl">
                                <Image
                                    src="/vision.PNG"
                                    alt="Her MindMate Vision"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#a66e6e]/40 to-transparent" />
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#f7dfd4] rounded-full -z-10 blur-2xl opacity-60" />
                        </div>
                        <div className="order-1 lg:order-2 space-y-8">
                            <h2 className="font-sans text-4xl text-[#332d2b]">Our Vision</h2>
                            <div className="space-y-6 text-gray-600 font-light leading-relaxed text-lg">
                                <p>
                                    At Her MindMate, we envision a world where every woman is safe, heard, and emotionally strong — because when a woman thrives, a home finds stability, children find security, and communities grow stronger.
                                </p>
                                <p>
                                    We believe a woman is not just an individual, but the heart of her family and the backbone of the society. When she is supported, respected, and empowerment, her strength echoes through generations.
                                </p>
                                <p>
                                    Guided by equity over equality, our vision is to ensure that every woman — across age, ability, identity, and life stage — receives the care she truly needs, so no woman suffers in silence, and no family breaks under unheard pain.
                                </p>
                                <p className="font-medium text-[#a66e6e]">
                                    To include and uplift queer and gender-diverse individuals, ensuring affirming, respectful, and stigma-free emotional support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-24 bg-white rounded-t-[4rem] relative z-10 -mt-12">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center max-w-4xl mx-auto mb-16">
                        <h2 className="font-sans text-4xl text-[#332d2b] mb-8">Our Mission</h2>
                        <p className="text-gray-600 font-light leading-relaxed text-lg text-justify md:text-center">
                            Our mission is to provide compassionate, accessible, and culturally sensitive support for women of all ages — from adolescents to elders — including homemakers, working professionals, gig-workers, physically challenged women, and those from queer and gender-diverse communities.
                        </p>
                    </div>

                    <div className="bg-[#fcfbf9] rounded-[3rem] p-8 md:p-12 lg:p-16">
                        <h3 className="font-sans text-2xl text-[#332d2b] mb-8 text-center">We commit to:</h3>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                            {[
                                "Empowering women with emotional, psychological, and practical support during times of distress, trauma, transition, and resilience.",
                                "Advocating equity by addressing the unique needs and lived experiences of every individual rather than offering one-size-fits-all solutions.",
                                "Raising awareness and accessibility of counselling, mental and sexual health, and psychosocial support across rural and urban communities.",
                                "Amplifying women’s voices and fostering communities where they are respected, dignified, and encouraged to reclaim their worth.",
                                "Cultivating supportive environments where no woman feels alone, unheard, or disrespected — whether due to domestic challenges, societal bias, discrimination, or internal stigma."
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-[#f7dfd4] flex-shrink-0 flex items-center justify-center text-[#a66e6e] text-sm font-bold mt-1">
                                        {i + 1}
                                    </div>
                                    <p className="text-gray-600 font-light leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-12 text-center p-8 bg-white/50 rounded-2xl border border-[#f7dfd4]/50">
                            <p className="text-[#332d2b] font-sans text-xl leading-relaxed">
                                "If even one woman emerges stronger from adversity with our support, we consider that as a contribution back to society and a step toward collective wellbeing."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder/Approach Section */}
            <section className="py-24 px-6 lg:px-12 bg-[#fcfbf9]">
                <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#f7dfd4] to-[#f6accb] rounded-[3rem] p-12 lg:p-24 relative overflow-hidden">
                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <h2 className="font-sans text-4xl lg:text-5xl text-[#332d2b]">Designed for <br /> Serenity</h2>
                            <p className="text-[#332d2b]/80 font-light leading-relaxed text-lg">
                                Every aspect of Her MindMate, from our digital presence to our therapy sessions, is crafted to reduce anxiety and promote a sense of calm. We are not just a service; we are a sanctuary.
                            </p>
                        </div>
                        <div className="aspect-square bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                            <p className="font-sans text-2xl text-[#332d2b]">"Healing is an art."</p>
                        </div>
                    </div>

                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
                </div>
            </section>
        </div>
    );
}
