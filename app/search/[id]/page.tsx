import { Button } from "@/app/components/ui/Button";
import { BadgeCheck, Calendar, Clock, MapPin, Star, Video, Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPsychologistById } from "@/app/lib/actions/psychologists";

export default async function PsychologistDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const psychologist = await getPsychologistById(id);

    if (!psychologist) return notFound();

    // Default values if fields are null/empty
    const education = psychologist.education && psychologist.education.length > 0
        ? psychologist.education
        : ["Education not listed"];

    const availability = psychologist.availability || "Contact for availability";
    const languages = ["English"]; // Placeholder

    // We can add "Years of Experience" somewhere, maybe in the About section or header?
    // Let's add it to the header badges

    const rating = 5.0; // Still placeholder as we don't have reviews table yet
    const reviewCount = 0; // Still placeholder
    const about = psychologist.bio || "Professional psychologist dedicated to mental well-being.";

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Banner */}
            <div className="bg-muted/30 border-b border-border">
                <div className="mx-auto max-w-7xl px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative h-48 w-48 shrink-0 rounded-xl overflow-hidden border-4 border-background shadow-sm">
                            <Image
                                src={psychologist.image_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"}
                                alt={psychologist.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                    {psychologist.name}
                                    <BadgeCheck className="text-blue-500 w-6 h-6" />
                                </h1>
                                <p className="text-lg text-muted-foreground">{psychologist.title}</p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">{rating}</span>
                                    <span className="text-muted-foreground">({reviewCount} reviews)</span>
                                </div>
                                {psychologist.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{psychologist.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-1">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    <span>{languages.join(", ")}</span>
                                </div>
                                {psychologist.years_of_experience && psychologist.years_of_experience > 0 && (
                                    <div className="flex items-center gap-1">
                                        <BadgeCheck className="w-4 h-4 text-muted-foreground" />
                                        <span>{psychologist.years_of_experience} Years Exp.</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-2">
                                {psychologist.specializations?.map(spec => (
                                    <span key={spec} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-sm font-medium">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px] bg-card p-6 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-muted-foreground">Session Fee</span>
                                <span className="text-2xl font-bold text-primary">₹{psychologist.price}</span>
                            </div>
                            <Button size="lg" className="w-full font-semibold" asChild>
                                <Link href={`/book/${psychologist.id}`}>Book Appointment</Link>
                            </Button>
                            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                                <Video className="w-3 h-3" /> Online sessions available
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">About</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {about}
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Education & Experience</h2>
                        <ul className="space-y-3">
                            {education.map((edu, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                                    <span className="text-muted-foreground">{edu}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Client Reviews</h2>
                        {/* Mock Review */}
                        <div className="space-y-6">
                            <div className="border-b border-border pb-6 last:border-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                    <span className="font-semibold text-sm">Life changing experience</span>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    "Incredible experience. Highly recommended."
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">— Verified Patient</p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar with Availability or other info */}
                <div className="space-y-6">
                    <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/20">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Calendar className="w-5 h-5 text-secondary" />
                            Availability
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Typical Availability</span>
                                <span className="font-medium text-right">{availability}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
