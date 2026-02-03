"use server";

import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";

export async function getPsychologistPatients() {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // Get current user id
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get psychologist profile linked to this user
    // Use admin client to ensure we can read the psychologists table if RLS is restrictive
    const { data: psychologist } = await adminSupabase
        .from('psychologists')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!psychologist) {
        // Not a psychologist or not valid
        return [];
    }

    // Fetch unique patients from sessions or bookings
    // Using sessions is better as it implies clinical relationship
    // But bookings might also be relevant if sessions haven't started.
    // Let's use Bookings as the source of "Patients List" as it captures anyone who booked.

    // Distinct selection is tricky in Supabase basic client without raw sql for complex distincts
    // But we can fetch all and dedup in JS for MVP scale.

    // List patients by user_email
    // Use admin client to bypass RLS for bookings view
    const { data: bookings, error } = await adminSupabase
        .from('bookings')
        .select(`
            user_email,
            user_name,
            user_phone,
            start_time,
            sessions (
                id
            )
        `)
        .eq('psychologist_id', psychologist.id)
        .order('start_time', { ascending: false });

    if (error) {
        console.error("Error fetching patients:", error);
        return [];
    }

    // Deduplicate by user_email
    const uniquePatients = new Map();

    bookings?.forEach(booking => {
        const key = booking.user_email;

        if (!uniquePatients.has(key)) {
            uniquePatients.set(key, {
                email: booking.user_email,
                name: booking.user_name,
                phone: booking.user_phone,
                last_visit: booking.start_time,
                total_sessions: 0
            });
        }

        const patient = uniquePatients.get(key);

        // Count sessions
        if (booking.sessions) {
            // Supabase returns array for 1:many (though schema implies 1:1, usually safer to check)
            if (Array.isArray(booking.sessions)) {
                patient.total_sessions += booking.sessions.length;
            } else if (booking.sessions) {
                patient.total_sessions += 1;
            }
        }
    });

    return Array.from(uniquePatients.values());
}

export async function getPatientHistory(patientEmail: string) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return []; // Return empty array instead of null for consistency

    const { data: psychologist } = await adminSupabase
        .from('psychologists')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!psychologist) return [];

    // Fetch all bookings (and associated sessions) for this patient & psychologist
    // We query bookings first because that defines the event.
    // decode email just in case, though usually passed decoded to function
    const email = decodeURIComponent(patientEmail);

    const { data: bookings, error } = await adminSupabase
        .from('bookings')
        .select(`
            id,
            start_time,
            status,
            meeting_link,
            user_name,
            user_email,
            user_phone,
            sessions (
                id,
                notes,
                mood_rating,
                tags,
                prescription,
                created_at
            )
        `)
        .eq('psychologist_id', psychologist.id)
        .eq('user_email', email) // Filter by user_email
        .order('start_time', { ascending: false });

    if (error) {
        console.error("Error fetching patient history", error);
        return [];
    }

    return bookings;
}
