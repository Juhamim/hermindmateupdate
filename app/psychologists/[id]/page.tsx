import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPsychologistById } from "@/app/lib/actions/psychologists";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, Star, MapPin, Clock, GraduationCap, Award, ShieldCheck, CheckCircle2, Languages } from "lucide-react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PsychologistProfilePage({ params }: PageProps) {
    const { id } = await params;
    const psychologist = await getPsychologistById(id);

    if (!psychologist) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-neutral-50/50 pb-20">
            {/* Header / Navigation */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link
                        href="/search"
                        className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Search
                    </Link>
                    <div className="hidden sm:block text-sm font-semibold text-neutral-900">
                        {psychologist.name}
                    </div>
                    <div className="w-20" /> {/* Spacer for balance */}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Profile Card & Quick Info (Sticky on Desktop) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center text-center">
                            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-neutral-100">
                                <Image
                                    src={psychologist.image_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"}
                                    alt={psychologist.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-sans text-neutral-900 mb-2">{psychologist.name}</h1>
                            <p className="text-sm font-bold text-teal-600 uppercase tracking-wider mb-4">{psychologist.title}</p>

                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-neutral-600 mb-8">
                                <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full text-amber-700 font-medium">
                                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    <span>5.0 (Review)</span>
                                </div>
                                {psychologist.years_of_experience > 0 && (
                                    <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-full">
                                        <Award className="w-4 h-4 text-neutral-500" />
                                        <span>{psychologist.years_of_experience}+ Years</span>
                                    </div>
                                )}
                            </div>

                            <div className="w-full pt-6 border-t border-neutral-100 grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">Session Fee</p>
                                    <p className="text-xl font-sans text-neutral-900">₹{psychologist.price}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">Location</p>
                                    <div className="flex items-center gap-1 text-neutral-900">
                                        <span className="text-sm font-medium truncate">{psychologist.location || "Online"}</span>
                                    </div>
                                </div>
                            </div>

                            {psychologist.languages && psychologist.languages.length > 0 && (
                                <div className="w-full pt-4 mt-2 border-t border-neutral-100 text-left">
                                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1">Languages Spoken</p>
                                    <div className="flex items-center gap-1.5 text-neutral-900">
                                        <Languages className="w-3.5 h-3.5 text-teal-600" />
                                        <span className="text-sm font-medium">{psychologist.languages.join(", ")}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile: Sticky Bottom CTA is handled globally, but for Desktop we put it here */}
                        <div className="hidden lg:block bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
                            <h3 className="text-lg font-sans mb-4">Ready to start?</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500">Next Available</span>
                                    <span className="font-medium text-teal-600 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Today
                                    </span>
                                </div>
                                <Button asChild className="w-full rounded-full h-12 text-base shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all">
                                    <Link href={`/book/${psychologist.id}`}>
                                        Book Appointment
                                    </Link>
                                </Button>
                                <p className="text-xs text-center text-neutral-400">
                                    Secure booking & verified professional
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Bio Section */}
                        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-neutral-100">
                            <h2 className="text-xl font-sans text-neutral-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-teal-500 rounded-full"></span>
                                About Me
                            </h2>
                            <div className="prose prose-neutral prose-lg max-w-none text-neutral-600 leading-relaxed">
                                {psychologist.bio ? (
                                    <p className="whitespace-pre-line">{psychologist.bio}</p>
                                ) : (
                                    <p className=" text-neutral-400">No biography available yet.</p>
                                )}
                            </div>
                        </section>

                        {/* Specializations & Focus */}
                        <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-neutral-100">
                            <h2 className="text-xl font-sans text-neutral-900 mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
                                Expertise & Focus Areas
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {psychologist.specializations?.map((spec, i) => (
                                    <div key={i} className="flex items-center gap-2 px-4 py-3 bg-neutral-50 rounded-xl text-neutral-700 border border-neutral-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                                        <span className="text-sm font-medium">{spec}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education & Credentials */}
                        {(psychologist.education && psychologist.education.length > 0) && (
                            <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-neutral-100">
                                <h2 className="text-xl font-sans text-neutral-900 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-teal-500 rounded-full"></span>
                                    Education & Credentials
                                </h2>
                                <div className="space-y-6">
                                    {psychologist.education.map((edu, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                                                <GraduationCap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-neutral-900">{edu}</h4>
                                                {/* <p className="text-sm text-neutral-500">University Details (if parsed)</p> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Why Choose Section (Static for now, can be dynamic later) */}
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-indigo-100/50">
                                <ShieldCheck className="w-8 h-8 text-indigo-600 mb-4" />
                                <h3 className="font-sans text-lg text-indigo-900 mb-2">Verified Professional</h3>
                                <p className="text-sm text-indigo-700/80 leading-relaxed">
                                    Background checked and credential verified for your safety and peace of mind.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-2xl border border-teal-100/50">
                                <CheckCircle2 className="w-8 h-8 text-teal-600 mb-4" />
                                <h3 className="font-sans text-lg text-teal-900 mb-2">Evidence-Based </h3>
                                <p className="text-sm text-teal-700/80 leading-relaxed">
                                    Uses scientifically backed therapeutic approaches tailored to your needs.
                                </p>
                            </div>
                        </section>

                    </div>
                </div>
            </main>

            {/* Mobile Sticky CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
                <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 uppercase tracking-wide">Session Fee</span>
                        <span className="text-xl font-sans font-semibold text-neutral-900">₹{psychologist.price}</span>
                    </div>
                    <Button asChild className="rounded-full shadow-lg shadow-primary/20 flex-1 h-12 text-base">
                        <Link href={`/book/${psychologist.id}`}>
                            Book Now
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
