const nodemailer = require("nodemailer");

async function sendGeneralOrderEmail(to, customerName, orderNumber) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: Number(process.env.SMTP_PORT) === 465, // SSL for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Your Store" <${process.env.SMTP_USER}>`,
      to,
      subject: "✅ Your Order Has Been Placed Successfully!",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f4f4; padding:40px;">
          <div style="max-width:600px; margin:0 auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background:#4CAF50; color:#fff; padding:20px; text-align:center;">
              <h1 style="margin:0; font-size:24px;">Your Store</h1>
            </div>
            
            <!-- Body -->
            <div style="padding:30px; color:#333; line-height:1.6;">
              <h2 style="margin-top:0;">Hi ${customerName},</h2>
              <p>🎉 We’re excited to let you know that your order has been placed successfully!</p>
              
              <div style="background:#f9f9f9; padding:15px; border:1px solid #eee; border-radius:6px; margin:20px 0;">
                <p style="margin:0; font-size:16px;">Your Order Number:</p>
                <h3 style="margin:5px 0; color:#4CAF50;">#${orderNumber}</h3>
              </div>

              <p>You’ll receive another email once your order is processed and shipped.</p>
              
              <!-- CTA Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="#" style="background:#4CAF50; color:#fff; text-decoration:none; padding:12px 25px; border-radius:6px; font-size:16px; display:inline-block;">View My Order</a>
              </div>

              <p>Thank you for shopping with us 🛍️</p>
            </div>
            
            <!-- Footer -->
            <div style="background:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#777;">
              <p>This is an automated email, please do not reply.</p>
              <p>&copy; ${new Date().getFullYear()} Your Store. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 General order email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("❌ Failed to send general order email:", err);
    return null;
  }
}

module.exports = { sendGeneralOrderEmail };
