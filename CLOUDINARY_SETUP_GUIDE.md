# 🖼️ Cloudinary Image Upload Setup Guide

## Overview
Cloudinary is used for uploading and managing images (psychologist profile pictures, articles, etc.) in your HerMindmate application.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Free Cloudinary Account

1. **Sign up** at: https://cloudinary.com/users/register_free
2. **Verify your email** address
3. You'll get:
   - **Cloud Name** (e.g., `dkpo8qps9`)
   - **API Key**
   - **API Secret**

### Step 2: Create Upload Preset

1. **Log in** to Cloudinary Dashboard: https://console.cloudinary.com/
2. Go to **Settings** → **Upload** tab
3. Scroll to **Upload Presets** section
4. Click **"Add upload preset"**

5. **Configure preset:**
   - **Preset name**: `hermindmate_uploads` (or any name you like)
   - **Signing Mode**: **Unsigned** ✅ (Important!)
   - **Folder**: `hermindmate` (optional, for organization)
   - **Access Mode**: `public`
   - **Allowed formats**: `jpg, png, gif, webp, svg`
   - **Maximum file size**: `10 MB`
  - **Image transformations**: (optional)
     - Width: `800`
     - Height: `800`
     - Crop: `limit`

6. **Click "Save"**

### Step 3: Get Your Credentials

1.
 Go to **Dashboard**: https://console.cloudinary.com/console
2. You'll see:
   ```
   Cloud name: dkpo8qps9
   API Key: 123456789012345
   API Secret: hidden
   ```
3. **Copy** your **Cloud Name** (you'll need this)
4. **Copy** your **Upload Preset** name (e.g., `hermindmate_uploads`)

### Step 4: Add to `.env` File

Add these variables to your `.env` file:

```bash
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name-here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=hermindmate_uploads
```

**Replace with your actual values:**
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your cloud name (e.g., `dkpo8qps9`)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Your upload preset name (e.g., `hermindmate_uploads`)

### Step 5: Add to Vercel Environment Variables

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add these 2 variables:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - Value: `your-cloud-name-here`
   - Environments: Production, Preview, Development

   **Variable 2:**
   - Name: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
   - Value: `hermindmate_uploads`
   - Environments: Production, Preview, Development

3. **Click "Save"**
4. **Redeploy** your application

### Step 6: Test Image Upload

1. **Restart your dev server**: `npm run dev`
2. **Go to Admin panel**: http://localhost:3000/admin
3. **Create/Edit a psychologist**
4. **Click the image upload area**
5. **Upload a test image**
6. **Verify** the image appears correctly

---

## 📋 Complete `.env` File

Your `.env` file should now have:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-secret

# Google Calendar
GOOGLE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nkey\n-----END PRIVATE KEY-----\n
GOOGLE_CALENDAR_ID=primary

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Cloudinary (NEW)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=hermindmate_uploads
```

---

## 🎯 Where Cloudinary is Used

### Admin Panel - Image Uploads:
- ✅ **Psychologist profile pictures**
- ✅ **Service images**
- ✅ **Article featured images**
- ✅ **Any other user-uploaded content**

### Features:
- ✅ Drag & drop upload
- ✅ Automatic image optimization
- ✅ Crop & resize before upload
- ✅ CDN delivery (fast loading)
- ✅ Circular profile picture preview
- ✅ Delete uploaded images

---

## 🆓 Cloudinary Free Tier

Perfect for your app! Includes:
- ✅ **25 GB storage**
- ✅ **25 GB bandwidth/month**
- ✅ **25,000 transformations/month**
- ✅ **500,000 total images**
- ✅ **Unlimited uploads**

---

## 🔒 Security Best Practices

### Upload Preset Settings:
- ✅ **Unsigned mode** - Allows public uploads (safe for your use case)
- ✅ **Folder restriction** - Keep uploads organized
- ✅ **File size limit** - Prevent huge uploads
- ✅ **Format restriction** - Only allow image types
- ✅ **Auto-moderation** - Optional, to prevent inappropriate content

### Environment Variables:
- ✅ Never commit `.env` to Git
- ✅ Use `NEXT_PUBLIC_` prefix for client-side variables
- ✅ Store Upload Preset in environment (can be changed easily)

---

## 🎨 Image Upload Component Features

Current implementation (`ImageUpload.tsx`):

### Features:
- ✅ Click to upload interface
- ✅ Cloudinary upload widget
- ✅ Square crop (1:1 aspect ratio)
- ✅ Circular preview for profiles
- ✅ Delete/replace uploaded images
- ✅ Fallback manual URL input (if Cloudinary not configured)
- ✅ Loading states
- ✅ Error handling

### Supported Sources:
- ✅ Local computer
- ✅ URL (paste image URL)
- ✅ Drag & drop

---

## ⚙️ Advanced Configuration (Optional)

### Custom Upload Preset Settings:

1. **Image Quality**:
   - Quality: `auto:good` (smaller files, good quality)
   - Format: `auto` (use best format)

2. **Transformations**:
   - Width: `800px` (reasonable size)
   - Height: `800px`
   - Crop mode: `fill` (maintain aspect ratio)
   - Gravity: `face` (focus on faces for portraits)

3. **Storage**:
   - Folder: `hermindmate/psychologists`
   - Resource type: `image`
   - Public ID: `auto` (random unique ID)

4. **AI Features** (Paid):
   - Auto-tagging
   - Content moderation
   - Background removal
   - Face detection

---

## 🐛 Troubleshooting

### Issue: "Cloudinary not configured" message

**Solution:**
1. Check `.env` file has both variables
2. Restart dev server after adding variables
3. Clear browser cache
4. Check variable names (must match exactly)

### Issue: Upload widget doesn't open

**Solutions:**
1. Check browser console for errors
2. Verify upload preset is **unsigned**
3. Check cloud name is correct
4. Try different browser
5. Disable ad blockers (they sometimes block Cloudinary)

### Issue: Images upload but don't display

**Solutions:**
1. Check image URL in database
2. Verify Cloudinary delivery URL is public
3. Check browser network tab for CORS errors
4. Ensure upload preset is set to `public` access mode

### Issue: "Invalid upload preset"

**Solutions:**
1. Verify preset name in Cloudinary dashboard
2. Ensure preset is **unsigned** (not signed)
3. Check for typos in preset name
4. Recreate the upload preset

---

## 📊 Cloudinary Dashboard

### Monitor Usage:
- Go to: https://console.cloudinary.com/console
- View:
  - **Total images**
  - **Storage used**
  - **Bandwidth used**
  - **Transformations**

### Media Library:
- Go to: https://console.cloudinary.com/console/media_library
- View all uploaded images
- Manually delete/organize
- Get image URLs

---

## 🔄 Alternative: Manual URL Input

If you don't want to use Cloudinary, the component has a **fallback**:

When Cloudinary is not configured, users can:
- ✅ Paste image URLs directly
- ✅ Use images hosted elsewhere (Imgur, Google Drive, etc.)
- ✅ Use placeholder images

**Limitations:**
- ❌ No upload functionality
- ❌ No automatic optimization
- ❌ No built-in CDN
- ❌ Depends on external hosting

---

## ✅ Setup Checklist

- [ ] Create Cloudinary account
- [ ] Verify email
- [ ] Create unsigned upload preset
- [ ] Copy cloud name
- [ ] Copy upload preset name
- [ ] Add to local `.env`
- [ ] Add to Vercel environment variables
- [ ] Restart dev server
- [ ] Test image upload in admin panel
- [ ] Verify image displays correctly
- [ ] Test image deletion
- [ ] Commit changes to Git
- [ ] Redeploy to Vercel

---

## 🎓 Resources

- **Cloudinary Dashboard**: https://console.cloudinary.com/
- **Upload Presets**: https://console.cloudinary.com/settings/upload
- **Documentation**: https://cloudinary.com/documentation
- **Upload Widget Docs**: https://cloudinary.com/documentation/upload_widget

---

## 🎉 You're Done!

Once configured, your admin panel will have:
- ✅ Professional image upload experience
- ✅ Automatic image optimization
- ✅ Fast CDN delivery
- ✅ Easy image management

**Just add the 2 environment variables and you're ready to upload images!** 🖼️
