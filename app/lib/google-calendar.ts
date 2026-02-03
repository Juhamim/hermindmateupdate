import { google } from "googleapis";

export async function createGoogleMeetEvent({
    summary,
    description,
    startTime,
    endTime,
    attendees,
}: {
    summary: string;
    description: string;
    startTime: string;
    endTime: string;
    attendees: string[];
}) {
    const auth = new google.auth.JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    console.log("Creating event for:", { summary, startTime, endTime });

    try {
        const res = await calendar.events.insert({
            calendarId: process.env.GOOGLE_CALENDAR_ID!,
            conferenceDataVersion: 1,
            requestBody: {
                summary,
                description,
                start: {
                    dateTime: startTime,
                    timeZone: "Asia/Kolkata",
                },
                end: {
                    dateTime: endTime,
                    timeZone: "Asia/Kolkata",
                },
                attendees: attendees.map(email => ({ email })),
                conferenceData: {
                    createRequest: {
                        requestId: `hermindmate-${Date.now()}`,
                        conferenceSolutionKey: {
                            type: "hangoutsMeet",
                        },
                    },
                },
            },
        });

        console.log("Conference data:", res.data.conferenceData);
        return res.data.hangoutLink ?? null;
    } catch (error: any) {
        console.error("Error creating Google Meet event:", error);
        // Log full error response if available
        if (error.response) {
            console.error("Full error response:", JSON.stringify(error.response.data, null, 2));
        }
        throw error;
    }
}
