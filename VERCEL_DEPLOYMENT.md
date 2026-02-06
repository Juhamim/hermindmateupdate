# Vercel Deployment Guide for HerMindmate

## Quick Deploy via Vercel Dashboard (Recommended)

### Step 1: Connect GitHub Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click "Add New Project"
3. Import your GitHub repository: `https://github.com/Juhamim/hermindmateupdate`
4. Authorize Vercel to access your GitHub account if needed

### Step 2: Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 3: Add Environment Variables

In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://lcgjbpmrkjkrrsiygvld.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_iZ70wl-nsLGJzNpoMbbu9Q_Qw9hVOS3
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_actual_razorpay_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nyour_actual_key\n-----END PRIVATE KEY-----\n
GOOGLE_CALENDAR_ID=primary
```

⚠️ **IMPORTANT**: Replace the placeholder values with your actual credentials:
- Get real Razorpay keys from https://dashboard.razorpay.com/
- Get Google Calendar credentials following GOOGLE_CALENDAR_SETUP.md

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Vercel will provide you with a live URL

---

## Option 2: Deploy via CLI

If you prefer using the command line:

1. Login to Vercel:
   ```
   vercel login
   ```

2. Deploy:
   ```
   vercel --prod
   ```

3. Follow the prompts to link your project

---

## Troubleshooting

### Build Errors
- Check that all environment variables are set correctly
- Ensure Supabase URL and keys are valid
- Verify that the database is accessible

### 404 Errors
- Make sure the main branch is pushed to GitHub
- Redeploy from Vercel dashboard
- Check that the deployment completed successfully

### Environment Variables Not Working
- Make sure you're using `NEXT_PUBLIC_` prefix for client-side variables
- Redeploy after adding new environment variables
- Check for typos in variable names

---

## Post-Deployment Checklist

- [ ] Site loads at the Vercel URL
- [ ] Supabase connection works
- [ ] Admin panel is accessible
- [ ] Booking flow works
- [ ] Payment integration works (with real keys)
- [ ] Google Calendar integration works (with real credentials)

---

## Current Status

✅ Code pushed to GitHub: https://github.com/Juhamim/hermindmateupdate.git
✅ vercel.json configuration added
⏳ Next step: Deploy via Vercel Dashboard

