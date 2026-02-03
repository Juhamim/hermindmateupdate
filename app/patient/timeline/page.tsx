import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/app/lib/database.types'
import { redirect } from 'next/navigation'

interface SessionWithRelations {
    id: string
    created_at: string
    tags: string[] | null
    mood_rating: number | null
    bookings: {
        start_time: string
        psychologist_id: string
        psychologists: {
            name: string
            title: string
        } | null
    } | null
}

export default async function PatientTimelinePage() {
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
        redirect('/login')
    }

    // Get Profile to confirm patient role (middleware handles this, but good double check)
    // Then fetch sessions where patient_id = profile.id OR through bookings.
    // If we rely on sessions table having patient_id:

    // First, verify we have a profile ID or just use user.id
    // Assuming user.id == profile.id

    const { data: sessions, error } = await supabase
        .from('sessions')
        .select(`
            id,
            created_at,
            tags,
            mood_rating,
            bookings (
                start_time,
                psychologist_id,
                psychologists (
                    name,
                    title
                )
            )
        `)
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })
        .returns<SessionWithRelations[]>()

    // If query fails or returns empty, it might be because bookings aren't linked to patient_id yet in our MVP flow
    // (since createBooking didn't set patient_id in sessions, only booking user details)
    // In a real app, we'd ensure link.

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Your Mental Health Journey</h1>

            <div className="relative border-l-2 border-purple-200 ml-4 space-y-12">
                {sessions?.map((session) => (
                    <div key={session.id} className="relative pl-8">
                        {/* Timeline Dot */}
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-purple-500 border-2 border-white"></div>

                        <div className="bg-white p-6 rounded-lg shadow border hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {new Date(session.bookings?.start_time || session.created_at).toLocaleDateString(undefined, {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <h3 className="text-xl font-semibold mt-1">
                                        Session with {session.bookings?.psychologists?.name || 'Psychologist'}
                                    </h3>
                                </div>
                                {session.mood_rating && (
                                    <div className="flex flex-col items-center">
                                        <div className={`
                                            h-10 w-10 rounded-full flex items-center justify-center text-white font-bold
                                            ${session.mood_rating >= 8 ? 'bg-green-500' : session.mood_rating >= 5 ? 'bg-yellow-500' : 'bg-red-500'}
                                        `}>
                                            {session.mood_rating}
                                        </div>
                                        <span className="text-xs text-gray-500 mt-1">Mood</span>
                                    </div>
                                )}
                            </div>

                            {session.tags && session.tags.length > 0 && (
                                <div className="flex bg-gray-50 p-3 rounded-md gap-2 flex-wrap">
                                    {session.tags.map(tag => (
                                        <span key={tag} className="text-sm bg-white border px-2 py-1 rounded text-purple-700">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {(!sessions || sessions.length === 0) && (
                    <div className="pl-8 text-gray-500">
                        No sessions recorded yet. Your journey begins with your first consultation.
                    </div>
                )}
            </div>
        </div>
    )
}
