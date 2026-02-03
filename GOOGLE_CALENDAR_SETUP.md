# Google Calendar API Setup Guide

This guide will help you set up Google Calendar API access for generating Google Meet links.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click **"New Project"**
4. Enter a project name (e.g., "HerMindMate Calendar")
5. Click **"Create"**
6. Wait for the project to be created and select it

## Step 2: Enable Google Calendar API

1. In the Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google Calendar API"**
3. Click on it and click **"Enable"**
4. Wait for it to enable (may take a minute)

## Step 3: Create a Service Account

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"Service account"**
4. Fill in the details:
   - **Service account name**: `calendar-service` (or any name you prefer)
   - **Service account ID**: Will auto-generate
   - **Description**: `Service account for creating calendar events and Meet links`
5. Click **"Create and Continue"**
6. Skip the optional steps (Grant access, Grant users access) and click **"Done"**

## Step 4: Create and Download Service Account Key

1. In the **"Credentials"** page, find your newly created service account
2. Click on the service account email
3. Go to the **"Keys"** tab
4. Click **"Add Key"** → **"Create new key"**
5. Select **"JSON"** format
6. Click **"Create"**
7. A JSON file will download automatically - **SAVE THIS FILE SECURELY** (you won't be able to download it again)

## Step 5: Extract Credentials from JSON File

Open the downloaded JSON file. It will look like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "calendar-service@your-project-id.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

## Step 6: Add to Environment Variables

Add these to your `.env.local` file:

```bash
# Google Calendar API (Service Account)
GOOGLE_CLIENT_EMAIL=calendar-service@your-project-id.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary
```

**Important Notes:**
- Copy the `client_email` value from the JSON file
- Copy the entire `private_key` value (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines)
- Keep the quotes around the private key in `.env.local`
- The `\n` characters in the private key should be preserved (they represent newlines)

## Step 7: Share a Calendar with the Service Account

Service accounts don't have a "primary" calendar by default. You need to share a calendar with them:

1. Go to [Google Calendar](https://calendar.google.com)
2. Create a new calendar (or use an existing one):
   - Click the **"+"** next to "Other calendars"
   - Select **"Create new calendar"**
   - Give it a name (e.g., "HerMindMate Bookings")
   - Click **"Create calendar"**
3. Share the calendar with your service account:
   - Click the three dots (⋮) next to your calendar
   - Select **"Settings and sharing"**
   - Scroll down to **"Share with specific people"**
   - Click **"Add people"**
   - Enter your service account email (the `client_email` from Step 5)
   - Set permission to **"Make changes to events"**
   - Click **"Send"**

## Step 8: Get Calendar ID (Optional)

If you want to use a specific calendar:

1. In Google Calendar, click the three dots (⋮) next to your calendar
2. Select **"Settings and sharing"**
3. Scroll down to **"Integrate calendar"**
4. Copy the **"Calendar ID"** (it looks like an email address)
5. Set it in your `.env.local`:
   ```bash
   GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
   ```

If you leave `GOOGLE_CALENDAR_ID` unset or set it to `primary`, the code will automatically use the first calendar shared with the service account.

## Step 9: Test the Setup

Run the debug script to verify everything works:

```bash
npx tsx debug-calendar.ts
```

This will:
- Verify your credentials
- List accessible calendars
- Create a test event with a Meet link
- Show you the Meet link URL

## Troubleshooting

### "Not Found" Error
- Make sure you've shared a calendar with the service account email
- Wait a few seconds after sharing (it takes time to propagate)
- Run the debug script to see which calendars are accessible

### "Permission Denied" Error
- Ensure the service account has "Make changes to events" permission
- Check that Google Calendar API is enabled in your project

### "Invalid Credentials" Error
- Verify the `GOOGLE_CLIENT_EMAIL` matches the `client_email` in your JSON file
- Ensure the `GOOGLE_PRIVATE_KEY` includes the full key with BEGIN/END markers
- Check that there are no extra spaces or line breaks in your `.env.local`

### No Meet Link Generated
- Ensure the calendar supports Google Meet (most do by default)
- Check that `conferenceDataVersion: 1` is being sent (it is in the code)
- Verify the calendar is not a read-only calendar

## Security Notes

⚠️ **Important Security Practices:**
- Never commit your `.env.local` file to git
- Never share your service account JSON file
- The private key should be kept secret
- Consider using environment variables in your hosting platform instead of files

## Alternative: Using OAuth 2.0 (Not Recommended for Server-Side)

If you wanted to use OAuth 2.0 instead of a Service Account, you would need:
- User consent flow
- Refresh tokens
- More complex setup

Service Accounts are the recommended approach for server-side applications like this booking system.

