"use server";

import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
import { Database } from "../database.types";

export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];



export async function createBooking(bookingData: BookingInsert) {
    // Use Admin Client to bypass RLS (Guest users need to insert and select back)
    const supabase = createAdminClient();

    // 1. Calculate End Time (Assuming 1 hour session for now)
    const startTime = new Date(bookingData.start_time);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

    // 2. Default to Pending status, No automatic meeting link
    // The admin will manually approve and add the link later.
    const meetingLink: string | null = null;
    let status: 'pending' | 'confirmed' | 'cancelled' = 'pending'; // Force pending

    // Sanitize input: remove package_details if present (not in schema)
    const { package_details, ...cleanBookingData } = bookingData as any;

    // 3. Add link to booking data
    const bookingPayload = {
        ...cleanBookingData,
        status: status,
        meeting_link: meetingLink,
    };

    const { data, error } = await supabase
        .from('bookings')
        .insert([bookingPayload])
        .select()
        .single();

    if (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
    }

    return data;
}

export async function getBookingById(id: string) {
    // Use Admin Client to allow Guest users to view their booking confirmation
    // UUID knowledge is the authorization token here.
    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            psychologists (
                name,
                image_url,
                title
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching booking ${id}:`, error);
        return null;
    }

    return data;
}

export async function checkAvailability(psychologistId: string, startTime: string) {
    // Use Admin Client to see ALL bookings for availability check
    const supabase = createAdminClient();

    // Check if there is any booking for this psychologist at this time
    // that is NOT cancelled
    const { data, error } = await supabase
        .from('bookings')
        .select('id')
        .eq('psychologist_id', psychologistId)
        .eq('start_time', startTime)
        .neq('status', 'cancelled')
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
        console.error('Error checking availability:', error);
        // Default to NOT available (safe) or handle logic
        return false;
    }

    // If data exists, it means there is a booking -> NOT available
    return !data;
}

export async function getBookedSlots(psychologistId: string, startDate: Date, endDate: Date) {
    // Use Admin Client to fetch all slots (Guest needs to see busy slots)
    const supabase = createAdminClient();

    // Get all bookings for this psychologist within the date range
    // that are NOT cancelled
    const startISO = startDate.toISOString();
    const endISO = endDate.toISOString();

    const { data, error } = await supabase
        .from('bookings')
        .select('start_time')
        .eq('psychologist_id', psychologistId)
        .gte('start_time', startISO)
        .lt('start_time', endISO)
        .neq('status', 'cancelled');

    if (error) {
        console.error('Error fetching booked slots:', error);
        return [];
    }

    // Return array of ISO date strings for booked slots
    return (data || []).map(booking => booking.start_time);
}

export async function getAllBookings() {
    // Standard Client - relies on Authenticated User RLS (Admins only)
    // DO NOT use Admin Client here, as we want to enforce Admin Role check via RLS
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            *,
            psychologists (
                name,
                image_url,
                title,
                location
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all bookings:', error);
        return [];
    }

    return data;
}
