"use server";

import { supabase } from "../supabase";
import { Database } from "../database.types";

export type SessionInsert = Database['public']['Tables']['sessions']['Insert'];

export async function upsertSession(sessionData: SessionInsert) {
    // Check if session exists for this booking
    const { data: existingSession } = await supabase
        .from('sessions')
        .select('id')
        .eq('booking_id', sessionData.booking_id)
        .single();

    let result;

    if (existingSession) {
        // Update
        result = await supabase
            .from('sessions')
            .update(sessionData)
            .eq('id', existingSession.id)
            .select()
            .single();
    } else {
        // Insert
        result = await supabase
            .from('sessions')
            .insert([sessionData])
            .select()
            .single();
    }

    if (result.error) {
        console.error('Error upserting session:', result.error);
        throw new Error('Failed to save session details');
    }

    return result.data;
}

export async function getSessionByBookingId(bookingId: string) {
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('booking_id', bookingId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching session:', error);
        return null;
    }

    return data;
}
