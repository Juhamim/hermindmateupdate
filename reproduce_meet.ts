import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { google } from 'googleapis';

async function test() {
    console.log('Testing Google Meet Generation...');
    console.log('Service Account Email:', process.env.GOOGLE_CLIENT_EMAIL);
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        const calendar = google.calendar({ version: 'v3', auth });

        // 1. Check allowed conference types
        console.log('Fetching calendar list...');
        const calendarList = await calendar.calendarList.list();
        const calendars = calendarList.data.items || [];
        console.log(`Found ${calendars.length} accessible calendars:`);

        for (const cal of calendars) {
            console.log(`- ID: ${cal.id} (Summary: ${cal.summary})`);
            console.log(`  Access Role: ${cal.accessRole}`);

            // Check conference properties for each
            try {
                // If we don't own it, we might not see conference properties in list, try explicit get
                // but usually list has it.
                console.log(`  Conference Types:`, cal.conferenceProperties?.allowedConferenceSolutionTypes);
            } catch (e) {
                console.log(`  Could not fetch detailed props for ${cal.id}`);
            }
        }

        // Use the first calendar that looks like a user email if primary is empty/useless
        const userCalendar = calendars.find(c => c.id && c.id.includes('@') && !c.id.includes('gserviceaccount.com'));
        let targetCalendarId = 'primary';

        if (userCalendar) {
            console.log(`\n✅ FOUND SHARED CALENDAR: ${userCalendar.id}`);
            console.log(`   Switching test to use this calendar as it likely supports Meet.`);
            targetCalendarId = userCalendar.id!;
        } else {
            console.log(`\n❌ NO SHARED CALENDAR FOUND.`);
            console.log(`   Please share your Google Calendar with: ${process.env.GOOGLE_CLIENT_EMAIL}`);
            console.log(`   Make sure to grant "Make changes to events" permission.`);
        }

        // Return checking primary for reference
        if (targetCalendarId === 'primary') {
            const calMeta = await calendar.calendars.get({ calendarId: 'primary' });
            console.log('\nPrimary Calendar Conference Types:', calMeta.data.conferenceProperties?.allowedConferenceSolutionTypes);
        }

        // 2. Try creating event
        const requestId = Math.random().toString(36).substring(7);
        console.log('Creating event with requestId:', requestId);

        const event = {
            summary: 'Test Meeting',
            description: 'Testing API',
            start: { dateTime: new Date().toISOString() },
            end: { dateTime: new Date(Date.now() + 3600000).toISOString() },
            conferenceData: {
                createRequest: {
                    requestId: requestId,
                    conferenceSolutionKey: { type: 'hangoutsMeet' },
                },
            },
        };

        console.log(`Using Calendar ID: ${targetCalendarId}`);

        const response = await calendar.events.insert({
            calendarId: targetCalendarId,
            requestBody: event,
            conferenceDataVersion: 1,
        });


        console.log('Response Status:', response.status);
        if (response.data.hangoutLink) {
            console.log('✅ SUCCESS! Meet Link Generated:', response.data.hangoutLink);
        } else {
            console.log('⚠️  Event created, but NO Meet link.');
            console.log('   (This usually means the calendar does not support API-generated conferences)');
        }

    } catch (e: any) {
        console.error('Test Failed:', e.message);
        if (e.response) {
            console.error('Error Response:', JSON.stringify(e.response.data, null, 2));
        }
    }
}

test();
