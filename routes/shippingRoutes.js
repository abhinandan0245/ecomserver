const express = require("express");

const router = express.Router();

const {
  addShippingInfo,
  getShippingInfo,
  updateShippingInfo,
  deleteShippingInfo,
  updateShippingStatus,
} = require("../controllers/shippingController");
// const router = require("./userRoutes");

router.post("/shipping", addShippingInfo); // Add shipping info
router.get("/shipping", getShippingInfo); // Get shipping info by ID
router.patch("/shipping/:id/status", updateShippingStatus); // Update shipping info by ID


module.exports = router;