"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface DateSelectionProps {
    onSelect: (date: Date, time: string) => void;
    selectedDate?: Date;
    selectedTime?: string;
    bookedSlots?: string[]; // Array of ISO date strings for booked slots
    psychologistId?: string; // Optional: for loading state
    psychologist?: any; // Includes availability
}

export function DateSelection({ onSelect, selectedDate, selectedTime, bookedSlots = [], psychologistId, psychologist }: DateSelectionProps) {
    // Mock generating next 7 days
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(today.getDate() + i);
        return d;
    });

    const [viewDate, setViewDate] = useState(dates[0]);

    // Generate slots dynamically based on availability
    const getSlotsForDate = (date: Date) => {
        // Fallback for legacy data without availability_slots
        if (!psychologist?.availability_slots || psychologist.availability_slots.length === 0) {
            return [
                "09:00 AM", "10:00 AM", "11:00 AM",
                "01:00 PM", "02:00 PM", "03:00 PM",
                "04:00 PM"
            ];
        }

        const dayOfWeek = date.getDay(); // 0 = Sunday
        const avail = psychologist.availability_slots.find((a: any) => a.day_of_week === dayOfWeek);

        if (!avail) return []; // No slots for this day

        const slots = [];
        let [startH] = avail.start_time.split(':').map(Number);
        const [endH] = avail.end_time.split(':').map(Number);

        // Generate 1-hour slots
        let currentH = startH;
        while (currentH < endH) {
            const meridiem = currentH >= 12 ? 'PM' : 'AM';
            const displayH = currentH > 12 ? currentH - 12 : (currentH === 0 ? 12 : currentH);
            const dhStr = displayH.toString().padStart(2, '0');
            slots.push(`${dhStr}:00 ${meridiem}`);
            currentH++;
        }
        return slots;
    };

    const timeSlots = getSlotsForDate(viewDate);

    const handleDateClick = (date: Date) => {
        setViewDate(date);
        // Reset time if date changes? Maybe not necessary for this UX
    };

    const handleTimeClick = (time: string) => {
        onSelect(viewDate, time);
    };

    // Helper function to check if a slot is booked
    const isSlotBooked = (date: Date, time: string): boolean => {
        if (!bookedSlots || bookedSlots.length === 0) return false;

        // Convert time string to hours/minutes
        const [timePart, meridiem] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
        if (meridiem === 'PM' && hours !== 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;

        // Create the slot datetime
        const slotDate = new Date(date);
        slotDate.setHours(hours, minutes, 0, 0);

        // Force IST context check is safer, but basic date comparison works if dates are consistent.
        // Using timestamp buffer
        const slotTime = slotDate.getTime();

        return bookedSlots.some(bookedSlot => {
            const bookedDate = new Date(bookedSlot);
            // Check within 1 minute
            return Math.abs(bookedDate.getTime() - slotTime) < 60000;
        });
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric' }).format(date);
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Select Date</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {dates.map((date) => {
                        const isSelected = viewDate.toDateString() === date.toDateString();
                        const isAvailableDay = !psychologist?.availability_slots || psychologist.availability_slots.length === 0 ||
                            psychologist.availability_slots.some((a: any) => a.day_of_week === date.getDay());

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => handleDateClick(date)}
                                className={cn(
                                    "flex flex-col items-center justify-center min-w-[4.5rem] h-20 rounded-xl border transition-all",
                                    isSelected
                                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                        : isAvailableDay
                                            ? "bg-background hover:bg-muted border-border"
                                            : "bg-muted/30 text-muted-foreground border-transparent opacity-50"
                                )}
                            >
                                <span className="text-xs font-medium uppercase opacity-80">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="text-xl font-bold">
                                    {date.getDate()}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Select Time</h3>
                {timeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {timeSlots.map((time) => {
                            const isSelected = selectedTime === time && selectedDate?.toDateString() === viewDate.toDateString();
                            const isBooked = isSlotBooked(viewDate, time);

                            return (
                                <Button
                                    key={time}
                                    variant={isSelected ? "default" : isBooked ? "ghost" : "outline"}
                                    className={cn(
                                        "w-full relative",
                                        isSelected && "ring-2 ring-offset-2 ring-primary",
                                        isBooked && "opacity-50 cursor-not-allowed bg-muted/50 text-muted-foreground hover:bg-muted/50"
                                    )}
                                    onClick={() => !isBooked && handleTimeClick(time)}
                                    disabled={isBooked}
                                    title={isBooked ? "This slot is already booked" : undefined}
                                >
                                    {time}
                                    {isBooked && (
                                        <span className="ml-1.5 text-xs" aria-label="Booked">🔒</span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                        <p>No available slots for this date.</p>
                    </div>
                )}

                {bookedSlots.length > 0 && timeSlots.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-2">
                        Locked slots (🔒) are already booked
                    </p>
                )}
            </div>

            <div className="text-sm text-muted-foreground pt-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>All times are in IST (Indian Standard Time)</span>
            </div>
        </div>
    );
}
