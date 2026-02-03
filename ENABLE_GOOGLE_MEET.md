# How to Enable Google Meet for Your Calendar

If events are being created without Google Meet links, follow these steps:

## Solution 1: Use Your Primary Calendar (Recommended)

Your primary Google Calendar typically has Google Meet enabled by default.

1. **Set your primary calendar ID in `.env.local`:**
   ```bash
   GOOGLE_CALENDAR_ID=your-email@gmail.com
   ```
   (Replace with your actual Gmail address)

2. **Share your primary calendar with the service account:**
   - Go to [calendar.google.com](https://calendar.google.com)
   - Click the three dots (⋮) next to your primary calendar (usually your email)
   - Select "Settings and sharing"
   - Scroll to "Share with specific people"
   - Add your service account email: `calendar-service@hermindmate.iam.gserviceaccount.com`
   - Set permission to "Make changes to events"
   - Click "Send"

## Solution 2: Understanding the "Automatically add Google Meet" Setting

**Important:** If you see **"Automatically add Google Meet video conferences to events that I create"** checked in your settings:

✅ **This setting applies to events YOU create manually** in the Google Calendar web interface or mobile app.

❌ **This setting does NOT apply to events created via API** by service accounts.

### Why API-Created Events Need Different Handling

When a service account creates events via the Google Calendar API:
- The calendar must support Google Meet at the API level
- The API request must explicitly request a Meet link (which our code does)
- Some calendars (especially secondary calendars) don't support Meet via API even if the manual setting is enabled

### The Solution

**Use your primary calendar** - it has the best API support for Google Meet:
1. Primary calendars support Meet via API by default
2. No additional configuration needed
3. More reliable than secondary calendars

### If You Must Use a Secondary Calendar

If you need to use "booking-automation" or another secondary calendar:

1. **Test if it supports Meet via API:**
   ```bash
   npx tsx debug-calendar.ts
   ```
   Look for: `✅ Google Meet is enabled for this calendar`

2. **If it doesn't support Meet:**
   - The calendar likely doesn't support Meet via API
   - Switch to your primary calendar (Solution 1)
   - Or create events in the primary calendar and copy them to the secondary calendar (not recommended)

**Bottom line:** The manual "Automatically add Google Meet" setting doesn't help with API-created events. Use your primary calendar for API-created events with Meet links.

### For Google Workspace Accounts:

1. **Admin Console Settings:**
   - Go to [admin.google.com](https://admin.google.com)
   - Navigate to **Apps** → **Google Workspace** → **Calendar**
   - Click **"Sharing settings"**
   - Ensure **"Video calls"** is enabled
   - Save changes

2. **User-Level Settings:**
   - Go to [calendar.google.com](https://calendar.google.com)
   - Settings → Look for video conferencing options
   - Enable Google Meet if available

## Solution 3: Verify Meet Support via API

Run the debug script to check if your calendar supports Meet:

```bash
npx tsx debug-calendar.ts
```

Look for:
- ✅ "Google Meet is enabled for this calendar"
- ✅ "Supported conference types: ['hangoutsMeet']"

If you see:
- ⚠️ "No conference types supported" → Use Solution 1 or 2 above

## Troubleshooting

### "Event created but no Meet link"

**Possible causes:**
1. Calendar doesn't support Google Meet
2. Google Meet not enabled for the calendar
3. Service account doesn't have permission to create conferences

**Solutions:**
1. Use your primary calendar (Solution 1)
2. Enable Google Meet for the calendar (Solution 2)
3. Ensure service account has "Make changes to events" permission

### "Invalid conference type value"

**Solution:**
- The calendar doesn't support the conference type
- Switch to your primary calendar
- Or enable Google Meet for the calendar (Solution 2)

### Calendar Shows Event But No Meet Link

**Check:**
1. Open the event in Google Calendar
2. Look for a "Join with Google Meet" button
3. If missing, the calendar doesn't support Meet

**Fix:**
- Use your primary calendar instead
- Or enable Meet for this calendar (Solution 2)

## Quick Fix: Use Primary Calendar (RECOMMENDED)

**This is the easiest and most reliable solution.** Primary calendars support Google Meet by default.

1. **Update your `.env.local` file:**
   ```bash
   GOOGLE_CALENDAR_ID=amankmdilu@gmail.com
   ```
   (Replace with your actual Gmail address)

2. **Share your primary calendar with the service account:**
   - Go to [calendar.google.com](https://calendar.google.com)
   - In the left sidebar, find your primary calendar (usually shows your email address)
   - Click the **three dots (⋮)** next to it
   - Select **"Settings and sharing"**
   - Scroll down to **"Share with specific people"**
   - Click **"Add people"**
   - Enter: `calendar-service@hermindmate.iam.gserviceaccount.com`
   - Set permission to **"Make changes to events"**
   - Click **"Send"**

3. **Wait 30 seconds** for the changes to propagate

4. **Test it:**
   ```bash
   npx tsx debug-calendar.ts
   ```

5. **Try creating a booking** - Meet links should now be generated automatically!

**Why this works:** Primary calendars have Google Meet enabled by default and don't require additional configuration. Secondary calendars (like "booking-automation") often don't support Meet unless they're part of a Google Workspace domain.

