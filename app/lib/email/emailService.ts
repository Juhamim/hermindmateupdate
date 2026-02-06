"use server";

import nodemailer from "nodemailer";

// Email Configuration
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export interface BookingEmailData {
    customerName: string;
    customerEmail: string;
    psychologistName: string;
    appointmentDate: string;
    appointmentTime: string;
    bookingId: string;
    amount: number;
    packageName?: string;
    meetingLink?: string;
}

/**
 * Send booking confirmation email to customer
 */
export async function sendBookingConfirmationEmail(data: BookingEmailData) {
    try {
        const emailHtml = generateBookingConfirmationHTML(data);

        const mailOptions = {
            from: `"Her MindMate" <${process.env.SMTP_USER}>`,
            to: data.customerEmail,
            subject: `Booking Confirmed - Appointment with ${data.psychologistName}`,
            html: emailHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Booking confirmation email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending booking confirmation email:", error);
        return { success: false, error: String(error) };
    }
}

/**
 * Send booking notification to psychologist
 */
export async function sendPsychologistNotificationEmail(
    psychologistEmail: string,
    data: BookingEmailData
) {
    try {
        const emailHtml = generatePsychologistNotificationHTML(data);

        const mailOptions = {
            from: `"Her MindMate" <${process.env.SMTP_USER}>`,
            to: psychologistEmail,
            subject: `New Booking - ${data.customerName}`,
            html: emailHtml,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Psychologist notification email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending psychologist notification email:", error);
        return { success: false, error: String(error) };
    }
}

/**
 * Generate HTML template for customer booking confirmation
 */
function generateBookingConfirmationHTML(data: BookingEmailData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Her MindMate</h1>
                            <p style="color: #f0fdfa; margin: 10px 0 0 0; font-size: 16px;">Your Safe Haven for Mental Wellness</p>
                        </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <div style="width: 80px; height: 80px; background-color: #d1fae5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                <span style="font-size: 40px;">✓</span>
                            </div>
                            <h2 style="color: #0f172a; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Booking Confirmed!</h2>
                            <p style="color: #64748b; margin: 0; font-size: 16px;">Hi ${data.customerName}, your appointment has been successfully booked.</p>
                        </td>
                    </tr>
                    
                    <!-- Booking Details -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                                <tr>
                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Booking ID</p>
                                        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">#${data.bookingId.slice(0, 8).toUpperCase()}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Psychologist</p>
                                        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">${data.psychologistName}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Date & Time</p>
                                        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">${data.appointmentDate} at ${data.appointmentTime}</p>
                                    </td>
                                </tr>
                                ${data.packageName ? `
                                <tr>
                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Package</p>
                                        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">${data.packageName}</p>
                                    </td>
                                </tr>
                                ` : ''}
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Amount Paid</p>
                                        <p style="margin: 5px 0 0 0; color: #0d9488; font-size: 20px; font-weight: 700;">₹${data.amount}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    ${data.meetingLink ? `
                    <!-- Meeting Link -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 6px;">
                                <p style="margin: 0 0 10px 0; color: #1e40af; font-weight: 600; font-size: 14px;">🔗 Meeting Link</p>
                                <a href="${data.meetingLink}" style="color: #3b82f6; text-decoration: none; word-break: break-all;">${data.meetingLink}</a>
                            </div>
                        </td>
                    </tr>
                    ` : `
                    <!-- Pending Approval -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>⏳ Pending Approval</strong></p>
                                <p style="margin: 10px 0 0 0; color: #92400e; font-size: 14px;">Your booking is pending admin approval. You'll receive the meeting link via email once confirmed.</p>
                            </div>
                        </td>
                    </tr>
                    `}
                    
                    <!-- Important Information -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <h3 style="color: #0f172a; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Important Information</h3>
                            <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 14px; line-height: 1.8;">
                                <li>Please join the session 5 minutes before the scheduled time.</li>
                                <li>Ensure you're in a quiet, private space for the session.</li>
                                <li>Test your internet connection and audio/video beforehand.</li>
                                <li>Cancellations must be made at least 24 hours in advance.</li>
                            </ul>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://hermindmate.com'}/patient/timeline" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">View My Bookings</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">Need help? Contact us at</p>
                            <p style="margin: 0; color: #0d9488; font-size: 14px; font-weight: 600;">support@hermindmate.com</p>
                            <p style="margin: 20px 0 0 0; color: #94a3b8; font-size: 12px;">© 2026 Her MindMate. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

/**
 * Generate HTML template for psychologist notification
 */
function generatePsychologistNotificationHTML(data: BookingEmailData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">🔔 New Booking Alert</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 20px 0; color: #0f172a; font-size: 16px;">Hello Dr. ${data.psychologistName},</p>
                            <p style="margin: 0 0 30px 0; color: #64748b; font-size: 16px;">You have a new booking from <strong>${data.customerName}</strong>.</p>
                            
                            <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-radius: 8px; padding: 20px;">
                                <tr>
                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Patient Name</p>
                                        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">${data.customerName}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Contact Email</p>
                                        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">${data.customerEmail}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px; border-bottom: 1px solid #e2e8f0;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Appointment Date & Time</p>
                                        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">${data.appointmentDate} at ${data.appointmentTime}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; color: #64748b; font-size: 14px;">Booking ID</p>
                                        <p style="margin: 5px 0 0 0; color: #0f172a; font-size: 16px; font-weight: 600;">#${data.bookingId.slice(0, 8).toUpperCase()}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://hermindmate.com'}/psychologist" style="display: inline-block; background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">View Dashboard</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">© 2026 Her MindMate. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}
