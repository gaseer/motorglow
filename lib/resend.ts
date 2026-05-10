import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingEmailData {
  to: string;
  bookingId: string;
  packageName: string;
  date: string;
  timeSlot: string;
  location: string;
  vehicle: string;
  price: number;
}

export async function sendConfirmationEmail(data: BookingEmailData) {
  const formattedPrice = `₹${data.price.toLocaleString("en-IN")}`;
  const formattedDate = new Date(data.date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const { error } = await resend.emails.send({
      from: "MotorGlow <bookings@motorglow.in>",
      to: [data.to],
      subject: `Booking Confirmed — ${data.packageName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #0D0D0D;">
          <div style="background: #0D0D0D; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
            <h1 style="color: #C8F135; margin: 0; font-size: 24px;">MotorGlow</h1>
            <p style="color: #999; margin: 4px 0 0;">We come to your car.</p>
          </div>
          <h2 style="font-size: 20px;">Your booking is confirmed! 🎉</h2>
          <p style="color: #6B6B6B;">Booking ID: <strong style="color: #0D0D0D;">${data.bookingId}</strong></p>
          <div style="background: #F5F5F5; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #6B6B6B; width: 40%;">Package</td><td style="font-weight: 500;">${data.packageName}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B6B6B;">Price</td><td style="font-weight: 500;">${formattedPrice}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B6B6B;">Date</td><td style="font-weight: 500;">${formattedDate}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B6B6B;">Time</td><td style="font-weight: 500;">${data.timeSlot}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B6B6B;">Location</td><td style="font-weight: 500;">${data.location}</td></tr>
              <tr><td style="padding: 8px 0; color: #6B6B6B;">Vehicle</td><td style="font-weight: 500;">${data.vehicle}</td></tr>
            </table>
          </div>
          <p style="color: #6B6B6B; font-size: 14px;">Our team will arrive at your location during the booked time slot. You'll receive a notification when we're on our way.</p>
          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #E5E5E5;">
            <p style="color: #6B6B6B; font-size: 12px; margin: 0;">© 2025 MotorGlow. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend email error:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
    return { success: false, error: err };
  }
}
