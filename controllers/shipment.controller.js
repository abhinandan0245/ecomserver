// // controllers/shipment.controller.js
// const Shipment = require("../models/shipment");
// const delhiveryService = require("../integrations/delhivery.service");

// //
// // 🔹 1. Create Shipment
// //
// exports.createShipment = async (req, res) => {
//   try {
//     const payload = req.body;

//     // Call Delhivery API
//     const response = await delhiveryService.createShipment(payload);

//     // Save shipment in DB
//     const shipment = await Shipment.create({
//       orderId: payload.orderId,
//       customerId: payload.customerId,
//       paymentId: payload.paymentId,
//       courier: "Delhivery",
//       waybill: response?.packages?.[0]?.waybill || null,
//       shipmentRef: response?.packages?.[0]?.refnum || null,
//       status: "Created",
//       total: payload.total,
//       subtotal: payload.subtotal,
//       tax: payload.tax,
//       deliveryCharge: payload.deliveryCharge,
//       shippingCharge: payload.shippingCharge,
//       couponCode: payload.couponCode,
//       appliedDiscount: payload.appliedDiscount,
//       customerAddress: payload.customerAddress,
//       packageDetails: payload.packageDetails,
//       payloadSnapshot: response,
//     });

//     res.json({ success: true, shipment });
//   } catch (err) {
//     console.error(" createShipment Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// //
// // 🔹 2. Update Shipment
// //
// exports.updateShipment = async (req, res) => {
//   try {
//     const { waybill } = req.params;
//     const payload = req.body;

//     const response = await delhiveryService.updateShipment(waybill, payload);

//     await Shipment.update(
//       { payloadSnapshot: response, status: "Updated" },
//       { where: { waybill } }
//     );

//     res.json({ success: true, response });
//   } catch (err) {
//     console.error("❌ updateShipment Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// //
// // 🔹 3. Cancel Shipment
// //
// exports.cancelShipment = async (req, res) => {
//   try {
//     const { waybill } = req.params;

//     const response = await delhiveryService.cancelShipment(waybill);

//     await Shipment.update(
//       { status: "Cancelled", payloadSnapshot: response },
//       { where: { waybill } }
//     );

//     res.json({ success: true, message: "Shipment cancelled", response });
//   } catch (err) {
//     console.error("❌ cancelShipment Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// //
// // 🔹 4. Track Shipment
// //
// exports.trackShipment = async (req, res) => {
//   try {
//     const { waybill } = req.params;

//     const trackingData = await delhiveryService.trackShipment(waybill);

//     await Shipment.update(
//       { status: trackingData?.Status || "In Transit", lastTracking: trackingData },
//       { where: { waybill } }
//     );

//     res.json({ success: true, trackingData });
//   } catch (err) {
//     console.error("❌ trackShipment Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// //
// // 🔹 5. Check Pincode Serviceability
// //
// exports.checkPincode = async (req, res) => {
//   try {
//     const { pin } = req.params;
//     const response = await delhiveryService.checkPincode(pin);
//     res.json({ success: true, response });
//   } catch (err) {
//     console.error("❌ checkPincode Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// //
// // 🔹 6. Calculate Shipping Cost
// //
// exports.calculateCost = async (req, res) => {
//   try {
//     const { fromPin, toPin, weight, mode = "E", paymentType = "Pre-paid" } = req.body;

//     const response = await delhiveryService.calculateCost({
//       fromPin,
//       toPin,
//       weight,
//       mode,
//       paymentType,
//     });

//     res.json({ success: true, response });
//   } catch (err) {
//     console.error("❌ calculateCost Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// //
// // 🔹 7. Generate Shipping Label
// //
// exports.generateLabel = async (req, res) => {
//   try {
//     const { waybill } = req.params;

//     const response = await delhiveryService.generateLabel(waybill);

//     res.json({ success: true, response });
//   } catch (err) {
//     console.error("❌ generateLabel Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };

// //
// // 🔹 8. Pickup Request
// //
// exports.requestPickup = async (req, res) => {
//   try {
//     const payload = req.body;

//     const response = await delhiveryService.requestPickup(payload);

//     res.json({ success: true, response });
//   } catch (err) {
//     console.error("❌ requestPickup Error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// };


// controllers/shipment.controller.js
const { Op } = require("sequelize");
const Shipment = require("../models/shipment");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Customer = require("../models/Customer");
const delhiveryService = require("../integrations/delhivery.service");
const { checkPincodeServiceability } = require("../integrations/delhivery.service"); // <-- import your helper



// helper to split "14:00-18:00" safely
function splitSlot(slot = "14:00-18:00") {
  const [start, end] = String(slot).split("-");
  return {
    start: (start || "14:00").trim(),
    end: (end || "18:00").trim(),
  };
}



exports.createShipmentFromOrder = async (req, res) => {
  try {
    const {
      orderId,
      weight = 0.5,
      length,
      width,
      height,
      pieces = 1,
      pickupLocationName,
      pickupDate,
    } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    const order = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem, as: "orderItems" },
        { model: Customer, as: "Customer", required: false },
      ],
    });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const existing = await Shipment.findOne({
      where: { orderId: order.id, status: { [Op.ne]: "Cancelled" } },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: "Shipment already exists for this order" });
    }

    const requiredShip = [
      "shippingAddress",
      "shippingCity",
      "shippingState",
      "shippingPostalCode",
      "shippingName",
      "shippingPhone",
    ];
    for (const f of requiredShip) {
      if (!order[f]) {
        return res.status(400).json({ success: false, message: `Missing ${f} on order` });
      }
    }

    // 🔹 Serviceability check before shipment creation
    const pin = order.shippingPostalCode;
    try {
      const svc = await checkPincodeServiceability(pin);
      const isServiceable = svc?.delivery_codes?.some(dc => dc.postal_code?.pin === String(pin));
      if (!isServiceable) {
        return res.status(400).json({
          success: false,
          message: `Pincode ${pin} is not serviceable by Delhivery`,
          data: svc,
        });
      }
    } catch (svcErr) {
      console.error("⚠️ Serviceability check failed:", svcErr.message);
      return res.status(502).json({
        success: false,
        message: "Failed to check pincode serviceability",
        error: svcErr.message,
      });
    }

    const pickupLocation = {
      name: pickupLocationName || process.env.DELHIVERY_PICKUP_NAME,
      add: process.env.DELHIVERY_PICKUP_ADDRESS,
      city: process.env.DELHIVERY_PICKUP_CITY,
      state: process.env.DELHIVERY_PICKUP_STATE,
      country: "India",
      pin: process.env.DELHIVERY_PICKUP_PIN,
      phone: process.env.DELHIVERY_PICKUP_PHONE,
    };

    const paymentMode = (order.paymentMethod || "").toUpperCase() === "COD" ? "COD" : "Prepaid";
    const codAmount = paymentMode === "COD" ? Number(order.grandTotal || 0) : 0;

    const productSummary = (order.orderItems || [])
      .map((i) => `${i.title || "Item"} x${i.quantity}`)
      .join(", ")
      .slice(0, 250);

    const today = new Date().toISOString().slice(0, 10);
    const date = (pickupDate || today).slice(0, 10);
    const slot = splitSlot(process.env.DELHIVERY_DEFAULT_SLOT || "14:00-18:00");

    // Important: use code if present, else use name
    const pickupLocationId = process.env.DELHIVERY_PICKUP_CODE?.trim()
      ? process.env.DELHIVERY_PICKUP_CODE.trim()
      : (pickupLocationName || process.env.DELHIVERY_PICKUP_NAME);

    const shipmentBody = {
      pickup_location: pickupLocationId,
      pickup_date: date,
      end_date: date,
      pickup_time: `${slot.start}-${slot.end}`,
      pickup_start_time: slot.start,
      pickup_end_time: slot.end,
      shipments: [
        {
          add: order.shippingAddress || order.address,
          city: order.shippingCity,
          state: order.shippingState,
          pin: order.shippingPostalCode,
          country: order.shippingCountry || "India",
          name: order.shippingName,
          phone: order.shippingPhone,

          order: String(order.id),
          refnum: String(order.id),

          payment_mode: paymentMode,
          total_amount: Number(order.grandTotal || 0),
          cod_amount: codAmount,

          weight: Number(weight),
          quantity: pieces,
          ...(length && width && height ? { length, breadth: width, height } : {}),

          product_details: productSummary || "General Items",
        },
      ],
    };

    console.log("📦 Final Payload >>>", JSON.stringify(shipmentBody, null, 2));

    const dlvResponse = await delhiveryService.createShipment(shipmentBody);
    console.log("📬 Delhivery Response:", JSON.stringify(dlvResponse, null, 2));

    const waybill = dlvResponse?.packages?.[0]?.waybill || dlvResponse?.waybill || null;
    if (!waybill) {
      return res.status(400).json({
        success: false,
        message: dlvResponse?.rmk || dlvResponse?.error || "Delhivery did not return a waybill",
        data: dlvResponse,
      });
    }

    const shipment = await Shipment.create({
      orderId: order.id,
      customerId: order.customerId,
      courier: "Delhivery",
      waybill,
      shipmentRef: dlvResponse?.packages?.[0]?.refnum || order.orderId,
      status: "Created",
      paymentMode,
      codAmount,
      subtotal: Number(order.subtotal || 0),
      tax: Number(order.tax || 0),
      deliveryCharge: Number(order.shippingRate || 0),
      shippingCharge: Number(order.shippingRate || 0),
      total: Number(order.grandTotal || 0),
      pickupLocation,
      customerAddress: {
        name: order.shippingName,
        phone: order.shippingPhone,
        email: order.shippingEmail,
        add: order.shippingAddress,
        city: order.shippingCity,
        state: order.shippingState,
        pin: order.shippingPostalCode,
        country: order.shippingCountry || "India",
      },
      packageDetails: { weight, length, width, height, pieces, productSummary },
      payloadSnapshot: dlvResponse,
    });

    await order.update({ orderStatus: "Processing" });

    return res.json({
      success: true,
      message: "Shipment created successfully",
      data: { waybill, shipment },
    });
  } catch (err) {
    console.error("❌ createShipmentFromOrder error:", err?.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create shipment",
      error: err?.response?.data || err.message,
    });
  }
};




//
// 2. Update Shipment
//
exports.updateShipment = async (req, res) => {
  try {
    const { waybill } = req.params;
    const updateData = req.body;

    // 1️ Find shipment in DB
    const shipment = await Shipment.findOne({ where: { waybill } });
    if (!shipment) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    // 2️ Restrict updates after pickup
    if (!["Pending", "Created"].includes(shipment.status)) {
      return res.status(400).json({
        success: false,
        message: `Shipment cannot be updated. Current status: ${shipment.status}`,
      });
    }

    // 3️ Update with Delhivery API
    const apiResponse = await delhiveryService.updateShipment(waybill, updateData);

    // 4️ Update local DB
    await shipment.update(updateData);

    res.json({ success: true, data: apiResponse, updatedShipment: shipment });
  } catch (error) {
    console.error(" Error updating shipment:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};

//
// 🔹 3. Cancel Shipment
//
exports.cancelShipment = async (req, res) => {
  try {
    const { waybill } = req.params;

    const response = await delhiveryService.cancelShipment({ waybill });

    await Shipment.update(
      { status: "Cancelled", payloadSnapshot: response },
      { where: { waybill } }
    );

    res.json({ success: true, message: "Shipment cancelled", response });
  } catch (err) {
    console.error("cancelShipment Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

//
//  4. Track Shipment
//
exports.trackShipment = async (req, res) => {
  try {
    const { waybill } = req.params;

    const trackingData = await delhiveryService.trackShipment(waybill);

    await Shipment.update(
      { status: trackingData?.Status || "In Transit", lastTracking: trackingData },
      { where: { waybill } }
    );

    res.json({ success: true, trackingData });
  } catch (err) {
    console.error("trackShipment Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

//
//  5. Check Pincode Serviceability
//
exports.checkPincode = async (req, res) => {
  try {
    const { pin } = req.params;
    const response = await delhiveryService.checkPincodeServiceability(pin);
    res.json({ success: true, response });
  } catch (err) {
    console.error(" checkPincode Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

//
// 6. Calculate Shipping Cost
//
exports.calculateCost = async (req, res) => {
  try {
    const { fromPin, toPin, weight, mode = "E", paymentType = "Pre-paid" } = req.body;

    const response = await delhiveryService.calculateShippingCost({
      o_pin: fromPin,
      d_pin: toPin,
      cgm: weight,
      pt: paymentType,
    });

    res.json({ success: true, response });
  } catch (err) {
    console.error(" calculateCost Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

//
//  7. Generate Shipping Label
//
exports.generateLabel = async (req, res) => {
  try {
    const { waybill } = req.params;
    const response = await delhiveryService.generateLabel(waybill);
    res.json({ success: true, response });
  } catch (err) {
    console.error(" generateLabel Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

//
//  8. Pickup Request
//
exports.requestPickup = async (req, res) => {
  try {
    const payload = req.body;
    const response = await delhiveryService.createPickupRequest(payload);
    res.json({ success: true, response });
  } catch (err) {
    console.error(" requestPickup Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

//
//  9. Fetch Waybills
//
exports.fetchWaybills = async (req, res) => {
  try {
    const { count } = req.query;
    const response = await delhiveryService.fetchWaybills(count || 1);
    res.json({ success: true, response });
  } catch (err) {
    console.error("fetchWaybills Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

//
//  10. Update Ewaybill
//
exports.updateEwaybill = async (req, res) => {
  try {
    const { waybill } = req.params;
    const payload = req.body;

    const response = await delhiveryService.updateEwaybill(waybill, payload);

    res.json({ success: true, response });
  } catch (err) {
    console.error("updateEwaybill Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


// get 
exports.getShipmentWithOrder = async (req, res) => {
  try {
    const shipment = await Shipment.findByPk(req.params.id, {
      include: [
        {
          model: Order,
          as: "order",
          include: [
            { model: OrderItem, as: "orderItems" },
            { model: Customer, as: "customer" },
          ],
        },
      ],
    });

    if (!shipment) {
      return res.status(404).json({ success: false, msg: "Shipment not found" });
    }

    res.json({ success: true, shipment });
  } catch (err) {
    console.error("getShipmentWithOrder error:", err);
    res.status(500).json({ success: false, msg: "Failed to fetch shipment", error: err.message });
  }
};

