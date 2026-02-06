# 📧 Automated Email Notification System - Setup Guide

## Overview
Your HerMindmate application now has an **automated email notification system** that sends beautiful, branded emails to customers when they book appointments!

## ✨ Features

### Customer Emails
- ✅ **Booking Confirmation** - Sent immediately after successful booking
- ✅ **Booking Details** - Shows psychologist, date, time, amount, package info
- ✅ **Meeting Link** - Automatically included when admin approves booking
- ✅ **Professional Design** - Beautiful HTML emails with HerMindmate branding
- ✅ **Mobile Responsive** - Looks great on all devices

## 📋 Setup Instructions

### Step 1: Get Gmail App Password

1. **Go to Google Account**:
   - Visit: https://myaccount.google.com/apppasswords
   - Sign in with your Gmail account

2. **Generate App Password**:
   - App name: `HerMindmate`
   - Click "Create"
   - Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)
   - **Important**: Remove spaces when adding to .env

### Step 2: Update`.env` File

Add these variables to your `.env` file:

```bash
# Email Notifications (SMTP Configuration)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcdefghijklmnop

# Application URL
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

**Replace with your actual values:**
- `SMTP_USER`: Your Gmail address (e.g., `hermindmate@gmail.com`)
- `SMTP_PASS`: The 16-character app password (no spaces!)
- `NEXT_PUBLIC_APP_URL`: Your Vercel deployment URL

### Step 3: Add to Vercel Environment Variables

Add the same variables in your Vercel Dashboard:

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add each variable:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `your-email@gmail.com`
   - `SMTP_PASS` = `your-app-password`
   - `NEXT_PUBLIC_APP_URL` = `https://your-site.vercel.app`
3. Select all environments (Production, Preview, Development)
4. Redeploy your app

### Step 4: Test the Email System

1. **Make a Test Booking**:
   - Go to your site
   - Book an appointment
   - Complete payment

2. **Check Email**:
   - Customer should receive a confirmation email
   - Check spam folder if not in inbox

3. **Check Console Logs**:
   - In Vercel logs, you should see:
   ```
   ✅ Booking confirmation email sent to customer@email.com
   ```

## 📧 Email Templates

### Customer Confirmation Email Includes:
- ✅ Beautiful header with HerMindmate branding
- ✅ Success checkmark icon
- ✅ Booking ID
- ✅ Psychologist name
- ✅ Appointment date and time
- ✅ Package details (if applicable)
- ✅ Amount paid
- ✅ Meeting link (when admin approves)
- ✅ Important information & instructions
- ✅ "View My Bookings" button
- ✅ Support contact information

## 🔧 Technical Details

### Email Service Location
- **File**: `app/lib/email/emailService.ts`
- **Functions**:
  - `sendBookingConfirmationEmail()` - Sends to customer
  - `sendPsychologistNotificationEmail()` - Sends to psychologist (future)

### Integration Point
- **File**: `app/lib/actions/bookings.ts`
- **Function**: `createBooking()`
- **When**: Automatically after successful booking creation
- **Non-blocking**: Email failures don't prevent booking

### Email Provider
- **Default**: Gmail SMTP
- **Port**: 587 (TLS)
- **Security**: App-specific password (not regular Gmail password)

## 🎨 Customization

### Change Email Templates
Edit `app/lib/email/emailService.ts`:

```typescript
// Customer email template
function generateBookingConfirmationHTML(data: BookingEmailData) {
    // Modify HTML here
}

// Psychologist email template
function generatePsychologistNotificationHTML(data: BookingEmailData) {
    // Modify HTML here
}
```

### Change Email Provider
To use a different email service (e.g., SendGrid, AWS SES):

1. Update `SMTP_HOST`, `SMTP_PORT` in `.env`
2. Update authentication in `emailService.ts`

## ⚠️ Important Notes

### Security
- ✅ **Never commit** `.env` file to Git
- ✅ **Use App Password** for Gmail (not regular password)
- ✅ **Store secrets** in Vercel environment variables

### Email Delivery
- 📧 Emails sent asynchronously (don't block booking)
- 📧 Check spam folder if emails not received
- 📧 Gmail has sending limits: ~500 emails/day for personal accounts

### Gmail Alternatives
For production with high volume, consider:
- **SendGrid**: 100 emails/day free
- **AWS SES**: $0.10 per 1,000 emails
- **Mailgun**: 5,000 emails/month free
- **Postmark**: 100 emails/month free

## 🐛 Troubleshooting

### Emails Not Sending

**Check 1: Environment Variables**
```bash
# Verify in Vercel logs or local
echo $SMTP_USER
echo $SMTP_HOST
```

**Check 2: App Password**
- Make sure you used App Password, not regular Gmail password
- Remove all spaces from the password
- Regenerate if unsure

**Check 3: Gmail Security**
- Enable "Less secure app access" (if using old Gmail)
- Check Google Account security settings

**Check 4: Console Logs**
- Check Vercel logs for error messages
- Look for email sending errors

### Email Goes to Spam

**Solutions:**
- Add `from` email to contact list
- Request customers to whitelist your email
- For production: Use professional email service (SendGrid, SES)
- Set up SPF, DKIM, DMARC records

## 📊 Monitoring

### Check Email Status
View in Vercel logs:
```
✅ Booking confirmation email sent to customer@email.com
or
❌ Failed to send booking confirmation email: [error details]
```

### Email Analytics
For production, consider:
- SendGrid: Built-in analytics
- Postmark: Open/click tracking
- Mailgun: Delivery statistics

## 🚀 Future Enhancements

Potential additions:
- [ ] Send reminder emails 24 hours before appointment
- [ ] Send psychologist notification emails
- [ ] Send admin notification emails
- [ ] Email when meeting link is added
- [ ] Email when booking is cancelled
- [ ] Email templates in multiple languages
- [ ] Email with calendar (.ics) attachment

## ✅ Current Status

- ✅ Email service created
- ✅ Integration with booking flow complete
- ✅ Beautiful HTML templates ready
- ✅ Non-blocking async email sending
- ✅ Error handling implemented
- ⏳ **Pending**: Email credentials configuration

---

## 🎉 You're All Set!

Once you add the SMTP credentials, your customers will automatically receive beautiful confirmation emails every time they book an appointment!

**Next Steps:**
1. Add Gmail App Password to `.env`
2. Add same credentials to Vercel
3. Redeploy
4. Test with a booking!

---

Need help? Check the console logs or contact support!
