const crypto = require("crypto");
const Otp = require("../models/Otp");
const Customer = require("../models/Customer");
const sendOtpEmail = require("../utils/mailer");
const bcrypt = require('bcryptjs');



exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Customer.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.upsert({ email, code: otp, expiresAt });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
   console.error("sendOtp error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.resendOtp = exports.sendOtp;


exports.verifyOtp = async (req, res) => {
  const { email, code } = req.body;

  try {
    const otpEntry = await Otp.findOne({ where: { email, code } });

    if (!otpEntry || new Date() > otpEntry.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed", error: err.message });
  }
};





exports.resetPassword = async (req, res) => {
  const { email, code, newPassword, confirmPassword } = req.body;

  try {
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const otpEntry = await Otp.findOne({ where: { email, code } });

    if (!otpEntry || new Date() > otpEntry.expiresAt) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await Customer.update({ password: hashed }, { where: { email } });

    await Otp.destroy({ where: { email } });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset password", error: err.message });
  }
};

