const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,     // Your email
    pass: process.env.SMTP_PASS,  // App password
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `<p>Your OTP is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
