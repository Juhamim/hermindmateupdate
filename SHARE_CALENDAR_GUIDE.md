# How to Share a Google Calendar with Service Account

## Step-by-Step Instructions

### Option 1: Create a New Calendar (Recommended)

#### Step 1: Create the Calendar
1. Go to [calendar.google.com](https://calendar.google.com)
2. On the left sidebar, look for **"Other calendars"** section
3. Click the **"+"** (plus icon) next to "Other calendars"
4. Select **"Create new calendar"**
5. Fill in the details:
   - **Name**: `HerMindMate Bookings` (or any name you prefer)
   - **Description**: `Calendar for booking appointments` (optional)
   - **Time zone**: Select your timezone
6. Click **"Create calendar"**

#### Step 2: Share the Calendar
1. After creating, you'll see a confirmation. Click **"Settings"** (or go back to the calendar list)
2. In the left sidebar, find your newly created calendar under "My calendars"
3. Click the **three dots (⋮)** next to your calendar name
4. Select **"Settings and sharing"** from the dropdown menu

#### Step 3: Add Service Account
1. Scroll down to the **"Share with specific people"** section
2. Click the **"Add people"** button
3. In the popup that appears:
   - **Enter email**: Paste your service account email
     - This is the `client_email` from your JSON file
     - It looks like: `calendar-service@your-project-id.iam.gserviceaccount.com`
   - **Permission**: Select **"Make changes to events"** from the dropdown
4. Click **"Send"** (or "Add" depending on the interface)

#### Step 4: Verify Sharing
1. You should see your service account email appear in the "Share with specific people" list
2. Make sure the permission shows as **"Make changes to events"**
3. Wait 10-30 seconds for the changes to propagate

---

### Option 2: Share an Existing Calendar

#### Step 1: Find Your Calendar
1. Go to [calendar.google.com](https://calendar.google.com)
2. In the left sidebar, find your calendar under **"My calendars"**
3. Click the **three dots (⋮)** next to the calendar name

#### Step 2: Open Settings
1. Select **"Settings and sharing"** from the dropdown

#### Step 3: Share with Service Account
1. Scroll down to **"Share with specific people"**
2. Click **"Add people"**
3. Enter your service account email
4. Set permission to **"Make changes to events"**
5. Click **"Send"**

---

## Visual Guide (What You'll See)

### Finding the Three Dots Menu:
```
My calendars
  📅 Calendar Name          ⋮  ← Click these three dots
  📅 Another Calendar       ⋮
```

### Settings Page Layout:
```
Calendar Settings
├── General
├── Event notifications
├── Access permissions
│   └── Make available to public: [No]
└── Share with specific people  ← Scroll down here
    └── [Add people] button
```

### Add People Dialog:
```
Share with specific people

Email address:
[calendar-service@project.iam.gserviceaccount.com]  ← Paste here

Permission:
[Make changes to events ▼]  ← Select this option

[Cancel]  [Send]  ← Click Send
```

---

## Getting Your Calendar ID (Optional)

If you want to use a specific calendar ID in your `.env.local`:

1. In the **"Settings and sharing"** page
2. Scroll down to **"Integrate calendar"** section
3. Find **"Calendar ID"** - it looks like an email address
4. Copy this ID
5. Add to your `.env.local`:
   ```bash
   GOOGLE_CALENDAR_ID=your-calendar-id@group.calendar.google.com
   ```

**Note**: If you don't set `GOOGLE_CALENDAR_ID`, the code will automatically use the first calendar shared with the service account.

---

## Troubleshooting

### "Can't find the three dots"
- Make sure you're looking at **"My calendars"** section (not "Other calendars")
- The three dots appear when you hover over a calendar name
- Try refreshing the page

### "Add people button is grayed out"
- Make sure you're the owner of the calendar
- Some calendars (like "Holidays") can't be shared - create a new one instead

### "Permission denied" errors
- Make sure you selected **"Make changes to events"** (not "See all event details")
- Wait 30-60 seconds after sharing for changes to propagate
- Double-check the service account email is correct

### "Calendar not found" error
- Wait a few minutes after sharing
- Run the debug script: `npx tsx debug-calendar.ts`
- Verify the service account email matches exactly (case-sensitive)

---

## Quick Checklist

- [ ] Created a calendar (or using existing one)
- [ ] Opened "Settings and sharing"
- [ ] Added service account email to "Share with specific people"
- [ ] Set permission to "Make changes to events"
- [ ] Clicked "Send"
- [ ] Service account appears in the shared list
- [ ] Waited 30 seconds for propagation

---

## Alternative: Using Your Primary Calendar

If you want to use your main Google Calendar:

1. Go to calendar settings
2. Find your primary calendar (usually your email address)
3. Share it with the service account
4. Set `GOOGLE_CALENDAR_ID=primary` in `.env.local`

**Note**: Using a dedicated calendar is recommended to keep booking events separate from your personal calendar.

