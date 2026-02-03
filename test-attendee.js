
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load env
try {
    const envConfig = fs.readFileSync(path.resolve('.env'), 'utf-8');
    envConfig.split(/\r?\n/).forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            let value = valueParts.join('=');
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            process.env[key.trim()] = value;
        }
    });
} catch (e) {
    console.error('Error reading .env', e);
}

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

async function testAddAttendee() {
    console.log('Testing Event Creation WITH Attendee...');

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
        console.error('Missing env vars');
        return;
    }

    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    // Create JWT WITHOUT 'subject' (acting as itself)
    const jwtClient = new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: privateKey,
        scopes: SCOPES,
    });

    await jwtClient.authorize();
    console.log('Auth successful.');

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const event = {
        summary: 'Test Event WITH Attendee',
        description: 'Can I invite guests?',
        start: {
            dateTime: new Date().toISOString(),
            timeZone: 'Asia/Kolkata',
        },
        end: {
            dateTime: new Date(Date.now() + 3600000).toISOString(),
            timeZone: 'Asia/Kolkata',
        },
        attendees: [
            { email: 'testing@example.com' } // Using a dummy email, or user's email if known?
        ],
        // NO conferenceData
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });

        console.log('Event created with attendee!');
        console.log('HTML Link:', response.data.htmlLink);
    } catch (err) {
        console.error('Error creating event with attendee:', err.message);
        if (err.errors) console.error('Details:', JSON.stringify(err.errors, null, 2));
    }
}

testAddAttendee();
