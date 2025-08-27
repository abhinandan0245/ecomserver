const express = require("express");
const router = express.Router();
const shipmentController = require("../controllers/shipment.controller");


//  Shipment APIs

router.post("/create", shipmentController.createShipmentFromOrder);
router.put("/update/:waybill", shipmentController.updateShipment);
router.post("/cancel/:waybill", shipmentController.cancelShipment);
router.get("/track/:waybill", shipmentController.trackShipment);


//  Utility APIs

router.get("/pincode/:pin", shipmentController.checkPincode);
router.post("/cost", shipmentController.calculateCost);
router.get("/label/:waybill", shipmentController.generateLabel);
router.post("/pickup", shipmentController.requestPickup);


//  Extra APIs

// Fetch new waybills
router.get("/waybills", shipmentController.fetchWaybills);

// Update e-waybill for GST compliance
router.put("/ewaybill/:waybill", shipmentController.updateEwaybill);

// routes/shipmentRoutes.js
router.get("/:id/order", shipmentController.getShipmentWithOrder);

module.exports = router;
