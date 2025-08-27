const delhivery = require("../integrations/delhivery.client");

/**
 * Check Pincode Serviceability
 */
async function checkPincodeServiceability(pincode) {
  try {
    const res = await delhivery.get(`/c/api/pin-codes/json/?filter_codes=${pincode}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to check pincode serviceability");
  }
}   

/**
 * Fetch Waybills
 */
async function fetchWaybills(count = 1) {
  try {
    const res = await delhivery.get(`/waybill/api/bulk/json/?count=${count}`);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to fetch waybills");
  }
}

/**
 * Create Shipment
 */
async function createShipment(payload) {
  try {
    const res = await delhivery.post(`/api/cmu/create.json`, payload);
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const data = err.response?.data;
    console.error("Delhivery Error:", { status, data });
    throw new Error(JSON.stringify(data || { msg: "Failed to create shipment" }));
  }
}



/**
 * Update/Edit Shipment
 */
async function updateShipment(payload) {
  try {
    const res = await delhivery.post(`/api/p/edit`, payload);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to update shipment");
  }
}

/**
 * Cancel Shipment
 */
async function cancelShipment(payload) {
  try {
    const res = await delhivery.post(`/api/p/edit`, payload); // same endpoint
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to cancel shipment");
  }
}

/**
 * Update Ewaybill
 */
async function updateEwaybill(waybill, payload) {
  try {
    const res = await delhivery.post(`/api/rest/ewaybill/${waybill}/`, payload);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to update ewaybill");
  }
}

/**
 * Track Shipment
 */
async function trackShipment(waybill, orderId) {
  try {
    const res = await delhivery.get(
      `/api/v1/packages/json/?waybill=${waybill}&ref_ids=${orderId}`
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to track shipment");
  }
}

/**
 * Calculate Shipping Charges
 */
async function calculateShippingCost({ o_pin, d_pin, cgm, pt }) {
  try {
    const res = await delhivery.get(
      `/api/kinko/v1/invoice/charges/.json?md=E&ss=Delivered&d_pin=${d_pin}&o_pin=${o_pin}&cgm=${cgm}&pt=${pt}`
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to calculate shipping cost");
  }
}

/**
 * Generate Shipping Label
 */
async function generateLabel(waybill, pdfSize = "A4") {
  try {
    const res = await delhivery.get(
      `/api/p/packing_slip?wbns=${waybill}&pdf=true&pdf_size=${pdfSize}`
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to generate shipping label");
  }
}

/**
 * Pickup Request Creation
 */
async function createPickupRequest(payload) {
  try {
    const res = await delhivery.post(`/fm/request/new/`, payload);
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Failed to create pickup request");
  }
}

module.exports = {
  checkPincodeServiceability,
  fetchWaybills,
  createShipment,
  updateShipment,
  cancelShipment,
  updateEwaybill,
  trackShipment,
  calculateShippingCost,
  generateLabel,
  createPickupRequest,
};
