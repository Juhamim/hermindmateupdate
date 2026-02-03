/**
 * Debug script to test Google Calendar API access
 * Run with: npx tsx debug-calendar.ts
 */

require('dotenv').config({ path: '.env.local' });
const { google } = require('googleapis');

async function debugCalendar() {
    console.log('🔍 Google Calendar API Debug Tool\n');

    // Check environment variables
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    if (!clientEmail) {
        console.error('❌ GOOGLE_CLIENT_EMAIL is not set');
        return;
    }
    if (!privateKey) {
        console.error('❌ GOOGLE_PRIVATE_KEY is not set');
        return;
    }

    console.log('✅ Environment variables found');
    console.log(`   Service Account: ${clientEmail}`);
    console.log(`   Calendar ID: ${calendarId}\n`);

    try {
        // Authenticate
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const calendar = google.calendar({ version: 'v3', auth });
        console.log('✅ Authentication successful\n');

        // List all accessible calendars
        console.log('📅 Listing accessible calendars...');
        const calendarList = await calendar.calendarList.list();
        const calendars = calendarList.data.items || [];

        if (calendars.length === 0) {
            console.error('\n❌ No calendars found!');
            console.error('\n📋 SOLUTION:');
            console.error('   1. Go to Google Calendar (calendar.google.com)');
            console.error('   2. Create a new calendar or use an existing one');
            console.error('   3. Click on the calendar → Settings and sharing');
            console.error(`   4. Under "Share with specific people", add: ${clientEmail}`);
            console.error('   5. Give it "Make changes to events" permission');
            console.error('   6. Save and wait a few seconds');
            console.error('   7. Run this script again\n');
            return;
        }

        console.log(`\n✅ Found ${calendars.length} accessible calendar(s):\n`);
        calendars.forEach((cal: any, index: number) => {
            const isPrimary = cal.id === calendarId || (calendarId === 'primary' && cal.primary);
            const marker = isPrimary ? '👉' : '  ';
            console.log(`${marker} ${index + 1}. ${cal.summary || cal.id}`);
            console.log(`     ID: ${cal.id}`);
            console.log(`     Access Role: ${cal.accessRole}`);
            if (cal.primary) console.log(`     ⭐ Primary calendar`);
            console.log('');
        });

        // Try to access the specified calendar
        console.log(`\n🔍 Testing access to calendar: ${calendarId}`);
        try {
            const cal = await calendar.calendars.get({ calendarId });
            console.log(`✅ Calendar "${cal.data.summary}" is accessible`);
            console.log(`   Timezone: ${cal.data.timeZone}`);
            
            // Check if Meet is enabled
            const conferenceTypes = cal.data.conferenceProperties?.allowedConferenceSolutionTypes || [];
            if (conferenceTypes.includes('hangoutsMeet')) {
                console.log('✅ Google Meet is enabled for this calendar');
            } else {
                console.log('⚠️  Google Meet may not be enabled for this calendar');
            }
        } catch (error: any) {
            console.error(`❌ Cannot access calendar "${calendarId}"`);
            console.error(`   Error: ${error.message}`);
            
            if (calendars.length > 0) {
                console.error(`\n💡 TIP: Use one of the accessible calendars above:`);
                console.error(`   Set GOOGLE_CALENDAR_ID=${calendars[0].id} in your .env.local`);
            }
        }

        // Test creating an event
        console.log('\n🧪 Testing event creation...');
        const testEvent = {
            summary: 'Test Event - Can be deleted',
            description: 'This is a test event to verify Google Meet link generation',
            start: {
                dateTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
                timeZone: 'UTC',
            },
            end: {
                dateTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
                timeZone: 'UTC',
            },
            conferenceData: {
                createRequest: {
                    requestId: `test-${Date.now()}`,
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                },
            },
        };

        const targetCalendarId = calendars.length > 0 ? calendars[0].id : calendarId;
        const response = await calendar.events.insert({
            calendarId: targetCalendarId,
            requestBody: testEvent,
            conferenceDataVersion: 1,
        });

        if (response.data.hangoutLink) {
            console.log('✅ Event created successfully!');
            console.log(`   Meet Link: ${response.data.hangoutLink}`);
            console.log(`   Event ID: ${response.data.id}`);
            console.log('\n💡 You can delete this test event from your calendar');
        } else {
            console.log('⚠️  Event created but no Meet link generated');
            console.log('   Response:', JSON.stringify(response.data, null, 2));
        }

    } catch (error: any) {
        console.error('\n❌ Error:', error.message);
        if (error.response?.data) {
            console.error('   Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

debugCalendar().catch(console.error);

