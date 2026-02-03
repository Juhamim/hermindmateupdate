"use server";

import { createClient } from "../supabase/server";
import { sendBookingApprovedEmail, sendBookingRejectedEmail } from "../email";

export async function approveBooking(bookingId: string, meetingLink: string) {
    const supabase = await createClient();

    // 1. Update Booking Status and Link
    const { data, error } = await supabase
        .from('bookings')
        .update({
            status: 'confirmed',
            meeting_link: meetingLink
        })
        .eq('id', bookingId)
        .select(`
            *,
            psychologists (
                name
            )
        `)
        .single();

    if (error) {
        console.error('Error approving booking:', error);
        throw new Error('Failed to approve booking');
    }

    // 2. Trigger Notification
    try {
        await sendBookingApprovedEmail(data.user_email, {
            userName: data.user_name,
            psychologistName: data.psychologists?.name || 'Psychologist',
            date: new Date(data.start_time).toLocaleDateString(),
            time: new Date(data.start_time).toLocaleTimeString(),
            meetingLink: meetingLink
        });
        console.log(`[Admin] Booking ${bookingId} approved. Email sent.`);
    } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
    }

    return data;
}

export async function rejectBooking(bookingId: string) {
    const supabase = await createClient();

    // 1. Update Booking Status
    const { data, error } = await supabase
        .from('bookings')
        .update({
            status: 'cancelled'
        })
        .eq('id', bookingId)
        .select()
        .single();

    if (error) {
        console.error('Error rejecting booking:', error);
        throw new Error('Failed to reject booking');
    }

    // 2. Trigger Notification
    try {
        await sendBookingRejectedEmail(data.user_email, data.user_name);
        console.log(`[Admin] Booking ${bookingId} rejected. Email sent.`);
    } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
    }

    return data;
}
