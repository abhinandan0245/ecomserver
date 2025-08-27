const express = require("express");

const router = express.Router();

const {
  addShippingInfo,
  getShippingInfo,
  updateShippingInfo,
  deleteShippingInfo,
  updateShippingStatus,
  getDelhiveryRates,
  createDelhiveryShipment,
  trackDelhiveryShipment,
  cancelDelhiveryShipment
} = require("../controllers/shippingController");

// Basic shipping routes
router.post("/shipping", addShippingInfo); // Add shipping info
router.get("/shipping", getShippingInfo); // Get shipping info by ID
router.put("/shipping/:id", updateShippingInfo); // Update shipping info
router.delete("/shipping/:id", deleteShippingInfo); // Delete shipping info
router.patch("/shipping/:id/status", updateShippingStatus); // Update shipping status

// Delhivery integration routes
router.get("/delhivery/rates/:orderId", getDelhiveryRates); // Get Delhivery shipping rates
router.post("/delhivery/shipment", createDelhiveryShipment); // Create Delhivery shipment
router.get("/delhivery/track/:id", trackDelhiveryShipment); // Track Delhivery shipment
router.delete("/delhivery/shipment/:id", cancelDelhiveryShipment); // Cancel Delhivery shipment

module.exports = router;
