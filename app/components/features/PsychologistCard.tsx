import Link from "next/link"
import { Star, Clock, MapPin } from "lucide-react"
import { Button } from "@/app/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/Card"
import Image from "next/image"

import { Psychologist as DBPsychologist } from "@/app/lib/actions/psychologists";

export type Psychologist = DBPsychologist & {
    rating?: number;
    reviewCount?: number;
    nextAvailable?: string;
}

interface PsychologistCardProps {
    psychologist: Psychologist;
    index: number;
}

export function PsychologistCard({ psychologist, index }: PsychologistCardProps) {
    return (
        <Link href={`/psychologists/${psychologist.id}`} className="block h-full w-full outline-none">
            <div className="flex flex-col h-full w-full group bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/30">

                {/* Identity Section (Photo + Name) */}
                <div className="w-full flex-shrink-0 flex flex-col p-5 bg-muted/30 border-b border-border/50 group-hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-white rounded-xl overflow-hidden border border-border/50 shadow-sm group-hover:shadow-md transition-all">
                            <Image
                                src={psychologist.image_url || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"}
                                alt={psychologist.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex-1 space-y-1">
                            <h3 className="text-lg font-sans text-foreground leading-tight group-hover:text-primary transition-colors">
                                {psychologist.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </h3>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{psychologist.title}</p>


                            <div className="flex items-center gap-1.5 pt-1 text-xs font-medium text-muted-foreground/80">
                                <span className="flex items-center gap-1 bg-secondary/30 px-2 py-0.5 rounded-full border border-secondary/50">
                                    <span className="text-[10px] uppercase font-bold tracking-wider">Exp:</span>
                                    {psychologist.years_of_experience || 1}+ Years
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Section (Help With + CTA) */}
                <div className="flex-1 p-5 flex flex-col justify-between bg-card relative">

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[9px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-primary"></span>
                                I Can Help You With
                            </h4>
                            <ul className="grid grid-cols-1 gap-y-1.5">
                                {psychologist.specializations.slice(0, 4).map((spec, i) => (
                                    <li key={spec} className="flex items-start gap-2 text-muted-foreground text-xs group-hover/list:text-foreground transition-colors">
                                        <span className="w-1 h-1 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                                        {spec}
                                    </li>
                                ))}
                                {psychologist.specializations.length > 4 && (
                                    <li className="text-[10px] text-muted-foreground pl-3">
                                        +{psychologist.specializations.length - 4} more...
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                            <div className="space-y-0.5">
                                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Next Available</p>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                    <Clock className="w-3.5 h-3.5 text-primary/70" />
                                    <span>{psychologist.nextAvailable || "Check Availability"}</span>
                                </div>
                            </div>
                            {psychologist.languages && psychologist.languages.length > 0 && (
                                <div className="space-y-0.5">
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Languages</p>
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                                        <span className="truncate">{psychologist.languages.slice(0, 2).join(", ")}{psychologist.languages.length > 2 && "..."}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-6 pt-4 border-t border-border/50">
                        <div>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold mb-0.5">Session Fee</p>
                            <p className="text-lg font-sans text-foreground">₹{psychologist.price}</p>
                        </div>

                        <div className="h-9 px-5 rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/20 flex items-center justify-center gap-2 text-xs font-medium transition-all group-hover:bg-primary/90 group-hover:scale-105 group-hover:shadow-primary/30">
                            Book <span className="text-sm">›</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
