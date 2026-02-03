"use server";

import { createClient } from "../supabase/server";
import { Database } from "../database.types";

export type Psychologist = Database['public']['Tables']['psychologists']['Row'];

export type PsychologistInsert = Database['public']['Tables']['psychologists']['Insert'];

import { createAdminClient } from "../supabase/admin";

export async function createPsychologist(psychologistData: any) {
    const supabase = await createClient();

    // 1. Verify verify Admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized: Only admins can manage psychologists");
    }

    const adminSupabase = createAdminClient();
    const { email, password, name, startTime, endTime, workingDays, packages, availabilityBlocks, ...profileData } = psychologistData;

    // 2. Create Auth User
    const { data: newUser, error: createUserError } = await adminSupabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Auto confirm
        user_metadata: { full_name: name }
    });

    if (createUserError) {
        console.error("Error creating auth user:", createUserError);
        throw new Error(`Failed to create login account: ${createUserError.message}`);
    }

    if (!newUser.user) throw new Error("User created but no ID returned");

    // 3. Update Profile Role (Trigger creates it as 'patient' usually)
    // Wait for trigger? Or just upsert.
    // Trigger is sync usually? standard postgres triggers are transaction sync.
    // So profile should exist.

    // We update role to 'psychologist'
    const { error: updateProfileError } = await adminSupabase
        .from('profiles')
        .update({ role: 'psychologist', full_name: name })
        .eq('id', newUser.user.id);

    // If profile doesn't exist yet (race condition?), upsert
    if (updateProfileError) {
        // Try insert if update failed (unlikely with trigger)
        const { error: insertProfileError } = await adminSupabase
            .from('profiles')
            .upsert({
                id: newUser.user.id,
                email: email,
                role: 'psychologist',
                full_name: name
            });
        if (insertProfileError) console.error("Error ensuring profile:", insertProfileError);
    }

    // 4. Create Psychologist Entry linked to user
    const { data, error } = await adminSupabase
        .from('psychologists')
        .insert([{
            ...profileData,
            name: name, // Ensure name is passed
            user_id: newUser.user.id
        }])
        .select()
        .single();

    if (error) {
        console.error('Error creating psychologist profile:', error);
        // Clean up user?
        await adminSupabase.auth.admin.deleteUser(newUser.user.id);
        throw new Error(`Failed to create psychologist profile: ${error.message}`);
    }

    // 5. Insert Availability if provided
    // availabilityBlocks: { days: number[], startTime: string, endTime: string }[]


    if (data && availabilityBlocks && Array.isArray(availabilityBlocks)) {
        let allInserts: any[] = [];

        availabilityBlocks.forEach((block: any) => {
            if (block.days && Array.isArray(block.days)) {
                const inserts = block.days.map((day: number) => ({
                    psychologist_id: data.id,
                    day_of_week: day,
                    start_time: block.startTime || '09:00',
                    end_time: block.endTime || '17:00'
                }));
                allInserts = [...allInserts, ...inserts];
            }
        });

        if (allInserts.length > 0) {
            const { error: availError } = await adminSupabase
                .from('availability')
                .insert(allInserts);

            if (availError) {
                console.error('Error creating availability:', availError);
            }
        }
    } else if (data && workingDays && Array.isArray(workingDays) && workingDays.length > 0) {
        // Fallback for getting started or legacy calls
        const availabilityInserts = workingDays.map((day: number) => ({
            psychologist_id: data.id,
            day_of_week: day,
            start_time: startTime || '09:00',
            end_time: endTime || '17:00'
        }));

        const { error: availError } = await adminSupabase
            .from('availability')
            .insert(availabilityInserts);
        if (availError) console.error(availError);
    }

    // 6. Insert Packages if provided
    if (data && packages && Array.isArray(packages) && packages.length > 0) {
        const packageInserts = packages.map((pkg: any) => ({
            psychologist_id: data.id,
            name: pkg.name,
            session_count: pkg.session_count,
            price: pkg.price,
            description: pkg.description
        }));

        const { error: pkgError } = await adminSupabase
            .from('psychologist_packages')
            .insert(packageInserts);

        if (pkgError) {
            console.error('Error creating packages:', pkgError);
        }
    }

    return data;
}

export async function getPsychologistUsers() {
    const supabase = await createClient();

    // Fetch users with role 'psychologist'
    const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('role', 'psychologist');

    if (error) {
        console.error('Error fetching psychologist users:', error);
        return [];
    }

    return data || [];
}

export interface SearchFilters {
    specializations?: string[];
    priceRange?: string[];
}

export async function getPsychologists(searchQuery?: string, filters?: SearchFilters): Promise<Psychologist[]> {
    const supabase = await createClient();

    // Fetch ALL psychologists (MVP: Dataset is small enough)
    // We do this to handle complex filtering (arrays, case-insensitivity) reliably in code
    // avoiding PostgreSQL "operator does not exist" errors for array columns.
    const { data, error } = await supabase
        .from('psychologists')
        .select('*, availability(*)');

    if (error) {
        console.error('Error fetching psychologists:', error);
        return [];
    }

    let results = data as Psychologist[];

    // 1. Apply Search Query (Global Search)
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(p => {
            const nameMatch = p.name.toLowerCase().includes(query);
            const bioMatch = p.bio?.toLowerCase().includes(query);
            const titleMatch = p.title.toLowerCase().includes(query);

            // Check arrays (Specializations, Languages)
            const specMatch = p.specializations?.some(s => s.toLowerCase().includes(query));
            const langMatch = p.languages?.some(l => l.toLowerCase().includes(query));

            return nameMatch || bioMatch || titleMatch || specMatch || langMatch;
        });
    }

    // 2. Apply Filters
    if (filters) {
        // Specializations (OR logic: if matches ANY selected)
        if (filters.specializations && filters.specializations.length > 0) {
            const selectedSpecs = filters.specializations.map(s => s.toLowerCase());
            results = results.filter(p =>
                p.specializations?.some(s => {
                    const lowerSpec = s.toLowerCase();
                    return selectedSpecs.some(filter => lowerSpec.includes(filter));
                })
            );
        }

        // Price Range (OR logic)
        if (filters.priceRange && filters.priceRange.length > 0) {
            results = results.filter(p => {
                return filters.priceRange?.some(range => {
                    if (range === 'under_500') return p.price < 500;
                    if (range === '500_1500') return p.price >= 500 && p.price <= 1500;
                    if (range === '1500_plus') return p.price > 1500;
                    return false;
                });
            });
        }
    }

    // Process data to calculate 'nextAvailable'
    const psychologists = results.map((psych: any) => {
        const nextAvailable = calculateNextSlot(psych.availability || []);
        return {
            ...psych,
            nextAvailable
        };
    });

    return psychologists;
}

function calculateNextSlot(availability: any[]): string {
    if (!availability || availability.length === 0) return "Contact for slot";

    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Look ahead for the next 7 days
    for (let i = 0; i < 7; i++) {
        const checkDay = (currentDay + i) % 7;
        const isToday = i === 0;

        // Find blocks for this day
        const dayBlocks = availability.filter((a: any) => a.day_of_week === checkDay);

        // Sort blocks by start time
        dayBlocks.sort((a: any, b: any) => a.start_time.localeCompare(b.start_time));

        for (const block of dayBlocks) {
            const [startH, startM] = block.start_time.split(':').map(Number);
            const [endH, endM] = block.end_time.split(':').map(Number);

            // If today, check if time has passed
            if (isToday) {
                // If start time is in future, valid.
                // If start time passed but end time is future? Maybe "Available Now"?
                // User asked for "slots", likely upcoming.

                // Case 1: Slot hasn't started yet today
                if (startH > currentHour || (startH === currentHour && startM > currentMinute)) {
                    return `Today, ${formatTime(block.start_time)}`;
                }
                // Case 2: Currently within slot?
                // Usually "Next available" implies future capacity. Let's stick to future starts for simplicity, 
                // or if currently active, show "Now".
                // Let's stick to simple "upcoming start time".
            } else {
                // Not today, so the first block of this day is the winner
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][checkDay];
                return `${dayName}, ${formatTime(block.start_time)}`;
            }
        }
    }

    return "Check availability";
}

function formatTime(timeStr: string): string {
    // 14:00:00 -> 2:00 PM
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

export async function getPsychologistById(id: string): Promise<Psychologist | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('psychologists')
        .select('*, availability_slots:availability(*), packages:psychologist_packages(*)')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching psychologist ${id}:`, error);
        return null;
    }

    return data;
}


export async function updatePsychologist(id: string, updates: any) {
    const supabase = await createClient();

    // 1. Verify Admin permissions
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        throw new Error("Unauthorized: Only admins can manage psychologists");
    }

    const { workingDays, startTime, endTime, availability_slots, created_at, packages, availabilityBlocks, id: _id, ...psychologistData } = updates;
    const adminSupabase = createAdminClient();

    // 2. Update Psychologist Entry
    const { data, error } = await adminSupabase
        .from('psychologists')
        .update(psychologistData)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating psychologist:', error);
        throw new Error(`Failed to update psychologist: ${error.message}`);
    }

    // 3. Update Availability if provided (Overwrite approach for simplicity)


    if (availabilityBlocks && Array.isArray(availabilityBlocks)) {
        // Delete existing availability
        await adminSupabase.from('availability').delete().eq('psychologist_id', id);

        let allInserts: any[] = [];
        availabilityBlocks.forEach((block: any) => {
            if (block.days && Array.isArray(block.days)) {
                const inserts = block.days.map((day: number) => ({
                    psychologist_id: id,
                    day_of_week: day,
                    start_time: block.startTime || '09:00',
                    end_time: block.endTime || '17:00'
                }));
                allInserts = [...allInserts, ...inserts];
            }
        });

        if (allInserts.length > 0) {
            const { error: availError } = await adminSupabase
                .from('availability')
                .insert(allInserts);
            if (availError) console.error("Error updating availability", availError);
        }

    } else if (workingDays && Array.isArray(workingDays)) {
        // Fallback Legacay
        await adminSupabase.from('availability').delete().eq('psychologist_id', id);

        // Insert new
        if (workingDays.length > 0) {
            const availabilityInserts = workingDays.map((day: number) => ({
                psychologist_id: id,
                day_of_week: day,
                start_time: startTime || '09:00',
                end_time: endTime || '17:00'
            }));

            const { error: availError } = await adminSupabase
                .from('availability')
                .insert(availabilityInserts);

            if (availError) console.error("Error updating availability", availError);
        }
    }

    return data;
}

export async function getPsychologistPackages(psychologistId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('psychologist_packages')
        .select('*')
        .eq('psychologist_id', psychologistId)
        .order('session_count', { ascending: true }); // Order by size

    if (error) {
        console.error('Error fetching packages:', error);
        return [];
    }
    return data || [];
}

export async function upsertPsychologistPackages(psychologistId: string, packages: any[]) {
    const supabase = await createClient(); // Use admin client?

    // 1. Verify Admin (reuse logic or abstract it)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Unauthorized");

    const adminSupabase = createAdminClient();

    // 2. Process packages
    // We can delete all and recreate, or upsert.
    // For simplicity, let's upsert based on ID if present, otherwise insert.
    // However, handling deletions from UI is tricky with simple upsert.
    // "Dynamic" means we can add/remove. 
    // Strategy: Inputs will be the FULL list of desired packages.
    // We can fetch existing, find diff, delete missing, upsert present.

    // Get existing IDs
    const { data: existing } = await adminSupabase
        .from('psychologist_packages')
        .select('id')
        .eq('psychologist_id', psychologistId);

    const existingIds = existing?.map(p => p.id) || [];
    const incomingIds = packages.filter(p => p.id).map(p => p.id);
    const toDelete = existingIds.filter(id => !incomingIds.includes(id));

    // Delete removed
    if (toDelete.length > 0) {
        await adminSupabase.from('psychologist_packages').delete().in('id', toDelete);
    }

    // Upsert (Insert/Update)
    if (packages.length > 0) {
        const toUpsert = packages.map(p => {
            const cleanPkg: any = {
                psychologist_id: psychologistId,
                name: p.name,
                session_count: p.session_count,
                price: p.price,
                description: p.description
            };
            // Only add ID if it's a valid string (not null/empty)
            if (p.id) {
                cleanPkg.id = p.id;
            }
            return cleanPkg;
        });

        const { error } = await adminSupabase
            .from('psychologist_packages')
            .upsert(toUpsert);

        if (error) throw new Error(`Error saving packages: ${error.message}`);
    }
}
