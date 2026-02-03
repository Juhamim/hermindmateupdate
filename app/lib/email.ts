import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    if (!process.env.SMTP_USER) {
        console.log("SMTP_USER not set, skipping email sending");
        console.log({ to, subject, html });
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Her MindMate" <noreply@hermindmate.com>',
            to,
            subject,
            html,
        });
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export async function sendBookingApprovedEmail(
    userEmail: string,
    bookingDetails: {
        userName: string;
        psychologistName: string;
        date: string;
        time: string;
        meetingLink: string;
    }
) {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Your Session is Confirmed!</h2>
            <p>Dear ${bookingDetails.userName},</p>
            <p>We are pleased to inform you that your session with <strong>${bookingDetails.psychologistName}</strong> has been confirmed.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Date:</strong> ${bookingDetails.date}</p>
                <p><strong>Time:</strong> ${bookingDetails.time}</p>
                <p><strong>Meeting Link:</strong> <a href="${bookingDetails.meetingLink}">${bookingDetails.meetingLink}</a></p>
            </div>
            
            <p>Please join 5 minutes before the scheduled time.</p>
            <p>Warm regards,<br/>Team Her MindMate</p>
        </div>
    `;

    return sendEmail({
        to: userEmail,
        subject: "Appointment Confirmed - Her MindMate",
        html,
    });
}

export async function sendBookingRejectedEmail(userEmail: string, userName: string) {
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Appointment Update</h2>
            <p>Dear ${userName},</p>
            <p>We regret to inform you that we could not confirm your requested appointment slot at this time.</p>
            <p>Our team will contact you shortly to reschedule or process a full refund.</p>
            <p>Warm regards,<br/>Team Her MindMate</p>
        </div>
    `;

    return sendEmail({
        to: userEmail,
        subject: "Update Regarding Your Appointment - Her MindMate",
        html,
    });
}
