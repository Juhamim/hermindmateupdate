import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from '@/app/lib/database.types'
import { redirect } from 'next/navigation'

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: bookingId } = await params
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

    // Fetch Booking & Session Data
    const { data: bookingData } = await supabase
        .from('bookings')
        .select(`
            *,
            sessions (*)
        `)
        .eq('id', bookingId)
        .single()

    type BookingWithSession = Database['public']['Tables']['bookings']['Row'] & {
        sessions: Database['public']['Tables']['sessions']['Row'][]
    }

    const booking = bookingData as BookingWithSession | null

    if (!booking) {
        return <div>Session not found</div>
    }

    const session = booking.sessions?.[0] || null

    async function saveNotes(formData: FormData) {
        'use server'
        const notes = formData.get('notes') as string
        const prescription = formData.get('prescription') as string
        const tags = (formData.get('tags') as string).split(',').map(s => s.trim())

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

        if (session) {
            await supabase
                .from('sessions')
                .update({ notes, prescription, tags })
                .eq('id', session.id)
        } else {
            if (!booking) throw new Error('Booking context missing')

            // Create new session record if it doesn't exist
            await supabase.from('sessions').insert({
                booking_id: bookingId,
                psychologist_id: booking.psychologist_id,
                notes,
                prescription,
                tags
            })
        }

        redirect(`/admin/psychologist/sessions/${bookingId}`)
    }

    async function lockSession() {
        'use server'
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

        if (session) {
            await supabase
                .from('sessions')
                .update({ is_locked: true })
                .eq('id', session.id)
        }
        redirect(`/admin/psychologist/sessions/${bookingId}`)
    }

    return (
        <div className="max-w-3xl mx-auto p-8">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-2xl font-bold mb-2">Clinical Session: {booking.user_name}</h1>
                <div className="flex justify-between items-center text-gray-600">
                    <p>{new Date(booking.start_time).toLocaleString()}</p>
                    <span className={`px-2 py-1 rounded text-sm ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {booking.status}
                    </span>
                </div>
            </header>

            {session?.is_locked ? (
                <div className="bg-gray-50 p-6 rounded-lg border">
                    <div className="flex items-center gap-2 mb-4 text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">Session Locked</span>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Tags</h3>
                            <div className="flex gap-2 mt-1">
                                {session.tags?.map(tag => (
                                    <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{tag}</span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Clinical Notes</h3>
                            <p className="mt-1 whitespace-pre-wrap">{session.notes}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase">Prescription / Plan</h3>
                            <p className="mt-1 whitespace-pre-wrap">{session.prescription}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <form action={saveNotes} className="space-y-6">
                    <div>
                        <label className="block font-medium mb-1">Session Tags (comma separated)</label>
                        <input
                            name="tags"
                            defaultValue={session?.tags?.join(', ')}
                            className="w-full border rounded p-2"
                            placeholder="Anxiety, Work Stress, Insomnia"
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Clinical Notes</label>
                        <textarea
                            name="notes"
                            defaultValue={session?.notes || ''}
                            rows={10}
                            className="w-full border rounded p-2"
                            placeholder="Patient presented with..."
                        />
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Prescription / Recommendations</label>
                        <textarea
                            name="prescription"
                            defaultValue={session?.prescription || ''}
                            rows={4}
                            className="w-full border rounded p-2"
                            placeholder="Recommended exercises..."
                        />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                        >
                            Save Updates
                        </button>

                        {session && (
                            <button
                                formAction={lockSession}
                                className="bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-900 flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                Lock Session
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    )
}
