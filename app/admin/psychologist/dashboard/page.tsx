import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { Database } from '@/app/lib/database.types'

export default async function PsychologistDashboard() {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return <div>Please log in</div>
    }

    // Fetch psychologist ID for the current user
    // In a real app, we might store this in profiles or have a direct link
    // For now, let's assume we can query bookings by filtering on psychologist_id 
    // BUT since we don't have a direct link from auth.uid to psychologist.id in our schema setup explicitly 
    // (schema has `profiles` linked to `auth.users`, but `psychologists` is separate table mostly for display info)
    // We need to resolve this. 
    // OPTION: We'll assume for this MVP that the `psychologists` table has an `id` that matches `auth.uid` 
    // OR we just show ALL bookings for the logged in Admin/Psychologist if we are simplifying.

    // Better Approach: Fetch sessions where psychologist_id matches the user's profile ID if we were linking them.
    // Given the schema instructions, let's fetch bookings joined with sessions.

    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
            *,
            sessions (
                id,
                is_locked
            )
        `)
        .order('start_time', { ascending: true })

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Psychologist Dashboard</h1>

            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                    <div className="grid gap-4">
                        {bookings?.map((booking) => (
                            <div key={booking.id} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-lg">{booking.user_name}</p>
                                    <p className="text-gray-500">
                                        {new Date(booking.start_time).toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-400">Status: {booking.status}</p>
                                </div>
                                <div className="flex gap-2">
                                    {booking.meeting_link && (
                                        <a
                                            href={booking.meeting_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Join Meet
                                        </a>
                                    )}
                                    <Link
                                        href={`/admin/psychologist/sessions/${booking.id}`} // We use booking ID or Session ID? Let's use booking ID to find session or create one.
                                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                                    >
                                        Clinical Notes
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {bookings?.length === 0 && <p className="text-gray-500">No scheduled sessions.</p>}
                    </div>
                </section>
            </div>
        </div>
    )
}
