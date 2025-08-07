const express = require("express");
const { sendOtp, resendOtp, verifyOtp, resetPassword } = require("../controllers/resetPController");
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/resend-otp", resendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
