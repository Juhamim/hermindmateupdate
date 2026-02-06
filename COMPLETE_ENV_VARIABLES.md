# 🚀 HerMindmate - Complete Vercel Environment Variables

## Quick Copy-Paste Guide for Vercel Dashboard

**Go to**: https://vercel.com/your-project/settings/environment-variables

---

## 📋 All Environment Variables (Complete List)

### 1. Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL
your-supabase-project-url

NEXT_PUBLIC_SUPABASE_ANON_KEY
your-supabase-anon-key
```

### 2. Razorpay Payment (Required)
```
NEXT_PUBLIC_RAZORPAY_KEY_ID
your-razorpay-key-id

RAZORPAY_KEY_SECRET
your-razorpay-secret-key
```

### 3. Google Calendar (Optional - for meeting links)
```
GOOGLE_CLIENT_EMAIL
your-service-account-email@project.iam.gserviceaccount.com

GOOGLE_PRIVATE_KEY
-----BEGIN PRIVATE KEY-----
your-private-key-content-here
-----END PRIVATE KEY-----

GOOGLE_CALENDAR_ID
primary
```

### 4. Email Notifications (Required for booking emails)
```
SMTP_HOST
smtp.gmail.com

SMTP_PORT
587

SMTP_USER
your-email@gmail.com

SMTP_PASS
your-gmail-app-password

NEXT_PUBLIC_APP_URL
https://your-site.vercel.app
```

### 5. Cloudinary Image Upload (Required for admin)
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
your-cloudinary-cloud-name

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
your-upload-preset-name
```

---

## ✅ Quick Setup Checklist

### Supabase Setup
- [ ] Go to Supabase project dashboard
- [ ] Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy Anon Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Razorpay Setup
- [ ] Go to Razorpay dashboard
- [ ] Copy Key ID → `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- [ ] Copy Secret → `RAZORPAY_KEY_SECRET`

### Email Setup
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Create app password for "HerMindmate"
- [ ] Copy 16-char password → `SMTP_PASS`
- [ ] Use your Gmail → `SMTP_USER`
- [ ] Use your Vercel URL → `NEXT_PUBLIC_APP_URL`

### Cloudinary Setup
- [ ] Go to https://cloudinary.com/users/register_free
- [ ] Create account & verify email
- [ ] Copy Cloud Name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- [ ] Create unsigned upload preset
- [ ] Copy preset name → `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

### Google Calendar (Optional)
- [ ] Create Google Cloud service account
- [ ] Download JSON credentials
- [ ] Extract email → `GOOGLE_CLIENT_EMAIL`
- [ ] Extract private key → `GOOGLE_PRIVATE_KEY`

---

## 🎯 Priority Order

### Must Have (Critical):
1. ✅ **Supabase** - Database & auth
2. ✅ **Razorpay** - Payments
3. ✅ **Email** - Booking confirmations
4. ✅ **Cloudinary** - Image uploads
5. ✅ **App URL** - For email links

### Optional (Can add later):
- ⏳ **Google Calendar** - Meeting link automation

---

## 📝 Vercel Setup Steps

1. **Log in to Vercel**:  https://vercel.com

2. **Select your project**: `hermindmate` or similar

3. **Go to Settings** → **Environment Variables**

4. **Add each variable**:
   - Click "Add New"
   - Enter Name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Enter Value (paste your actual value)
   - Select environments: ✅ Production ✅ Preview ✅ Development
   - Click "Save"

5. **Repeat for all variables** (total: 12 variables)

6. **Redeploy**:
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Or push new commit to trigger automatic deployment

---

## 🔐 Security Tips

### Sensitive Variables (Mark as Sensitive):
- ✅ `RAZORPAY_KEY_SECRET`
- ✅ `SMTP_PASS`
- ✅ `GOOGLE_PRIVATE_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Public Variables (Safe in client):
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- ✅ `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- ✅ `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`
- ✅ `NEXT_PUBLIC_APP_URL`

**Note**: Variables with `NEXT_PUBLIC_` prefix are exposed to the browser. Don't use this prefix for secrets!

---

## 🧪 Testing

After adding all variables:

1. **Redeploy to Vercel**
2. **Test Booking Flow**:
   - Make test appointment
   - Complete payment
   - Check email received
3. **Test Admin Panel**:
   - Upload psychologist image
   - Verify image saves correctly
4. **Check Vercel Logs**:
   - Look for any missing variable errors
   - Verify email sent confirmation

---

## ⚠️ Common Issues

### Issue: "Environment variable not found"

**Solution:**
- Check variable name spelling (exact match required)
- Ensure you selected all 3 environments
- Redeploy after adding variables

### Issue: Email not sending

**Solution:**
- Verify `SMTP_PASS` has no spaces
- Use Gmail app password (not regular password)
- Check `NEXT_PUBLIC_APP_URL` is your actual Vercel URL

### Issue: Images won't upload

**Solution:**
- Verify Cloudinary preset is **unsigned**
- Check cloud name is correct
- Ensure preset name matches exactly

### Issue: Payment not working

**Solution:**
- Use Razorpay TEST mode keys for testing
- Use LIVE mode keys for production
- Don't mix test and live keys

---

## 📊 Variable Count Summary

**Total**: 12 environment variables

- Supabase: 2
- Razorpay: 2
- Email: 5 (including SMTP + App URL)
- Cloudinary: 2
- Google Calendar: 3 (optional)

---

## 🎉 All Set!

Once all variables are added:

✅ Database works  
✅ Payments process  
✅ Emails send  
✅ Images upload  
✅ Everything automated!  

**Your HerMindmate app is production-ready!** 🚀

---

## 📞 Need Help?

Check these guides:
- `CLOUDINARY_SETUP_GUIDE.md` - Cloudinary setup
- `EMAIL_SETUP_GUIDE.md` - Email configuration
- `VERCEL_ENV_SETUP.md` - Vercel guide
- `VERCEL_DEPLOYMENT.md` - Deployment instructions
