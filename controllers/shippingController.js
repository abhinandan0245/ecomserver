const Shipping = require("../models/Shipping");
const Order = require("../models/Order");
const DelhiveryService = require("../services/DelhiveryService");
const { Op } = require("sequelize");

// Add Shipping Info
exports.addShippingInfo = async (req, res) => {
  try {
    const shipping = await Shipping.create(req.body);
    res.status(201).json({ message: "Shipping info added", data: shipping });
  } catch (error) {
    res.status(500).json({ message: "Error adding shipping info", error: error.message });
  }
};

// Get Shipping Info
exports.getShippingInfo = async (req, res) => {
  try {
    const { id } = req.query;
    let shipping;
    
    if (id) {
      shipping = await Shipping.findByPk(id);
    } else {
      shipping = await Shipping.findAll();
    }
    
    if (!shipping) {
      return res.status(404).json({ message: "Shipping not found" });
    }
    
    res.status(200).json({ data: shipping });
  } catch (error) {
    res.status(500).json({ message: "Error getting shipping info", error: error.message });
  }
};

// Update Shipping Info
exports.updateShippingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Shipping.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: "Shipping not found" });
    }
    
    const updatedShipping = await Shipping.findByPk(id);
    res.status(200).json({ message: "Shipping updated", data: updatedShipping });
  } catch (error) {
    res.status(500).json({ message: "Error updating shipping info", error: error.message });
  }
};

// Delete Shipping Info
exports.deleteShippingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Shipping.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return res.status(404).json({ message: "Shipping not found" });
    }
    
    res.status(200).json({ message: "Shipping deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shipping info", error: error.message });
  }
};

// Update Shipping Status
exports.updateShippingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const [updated] = await Shipping.update(
      { shippingStatus: status },
      { where: { id } }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Shipping not found" });
    }
    
    const updatedShipping = await Shipping.findByPk(id);
    res.status(200).json({ message: "Shipping status updated", data: updatedShipping });
  } catch (error) {
    res.status(500).json({ message: "Error updating shipping status", error: error.message });
  }
};

// Get Delhivery shipping rates
exports.getDelhiveryRates = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const delhivery = new DelhiveryService();
    const rates = await delhivery.getShippingRates({
      pickupPincode: "110001", // Your warehouse pincode
      deliveryPincode: order.shippingAddress.pincode,
      weight: order.totalWeight || 500,
      paymentType: order.paymentMethod === 'COD' ? 'COD' : 'Pre-paid'
    });

    res.status(200).json({ data: rates });
  } catch (error) {
    res.status(500).json({ message: "Error getting Delhivery rates", error: error.message });
  }
};

// Create Delhivery shipment
exports.createDelhiveryShipment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findByPk(orderId, {
      include: ['OrderItems', 'User']
    });
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const delhivery = new DelhiveryService();
    
    // Generate AWB first
    const awbResponse = await delhivery.generateAWB(1);
    const waybillNumber = awbResponse[0];

    // Create shipment
    const shipmentData = {
      customerName: `${order.User.firstName} ${order.User.lastName || ''}`,
      address: order.shippingAddress.address,
      city: order.shippingAddress.city,
      pincode: order.shippingAddress.pincode,
      state: order.shippingAddress.state,
      country: 'India',
      phone: order.User.phone,
      orderId: `ORD-${order.id}`,
      paymentMode: order.paymentMethod === 'COD' ? 'COD' : 'Pre-paid',
      codAmount: order.paymentMethod === 'COD' ? order.totalAmount : 0,
      orderDate: order.createdAt.toISOString().split('T')[0],
      totalAmount: order.totalAmount,
      productDescription: order.OrderItems.map(item => item.name).join(', '),
      quantity: order.OrderItems.reduce((sum, item) => sum + item.quantity, 0),
      waybillNumber: waybillNumber,
      invoiceNumber: `INV-${order.id}`,
      sellerName: "Your Store Name",
      sellerAddress: "Your warehouse address"
    };

    const shipment = await delhivery.createShipment(shipmentData);
    
    // Create shipping record
    const shippingRecord = await Shipping.create({
      orderId: order.id,
      shippingProvider: 'delhivery',
      providerOrderId: waybillNumber,
      trackingNumber: waybillNumber,
      courierName: 'Delhivery',
      shippingCost: shipment.chargeable_weight,
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      shippingStatus: 'Shipped',
      packageDimensions: {
        weight: order.totalWeight || 500
      },
      deliveryAddress: order.shippingAddress
    });

    res.status(201).json({ 
      message: "Delhivery shipment created successfully", 
      data: shippingRecord,
      waybill: waybillNumber
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating Delhivery shipment", error: error.message });
  }
};

// Track Delhivery shipment
exports.trackDelhiveryShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const shipping = await Shipping.findByPk(id);
    
    if (!shipping) {
      return res.status(404).json({ message: "Shipping record not found" });
    }

    const delhivery = new DelhiveryService();
    const trackingData = await delhivery.trackShipment(shipping.trackingNumber);
    
    // Update tracking history
    await shipping.update({
      trackingHistory: trackingData,
      shippingStatus: trackingData.ScanDetail?.[0]?.Status || 'In Transit'
    });

    res.status(200).json({ data: trackingData });
  } catch (error) {
    res.status(500).json({ message: "Error tracking Delhivery shipment", error: error.message });
  }
};

// Cancel Delhivery shipment
exports.cancelDelhiveryShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const shipping = await Shipping.findByPk(id);
    
    if (!shipping) {
      return res.status(404).json({ message: "Shipping record not found" });
    }

    const delhivery = new DelhiveryService();
    const result = await delhivery.cancelShipment(shipping.trackingNumber);
    
    await shipping.update({ shippingStatus: 'Cancelled' });

    res.status(200).json({ 
      message: "Delhivery shipment cancelled successfully", 
      data: result 
    });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling Delhivery shipment", error: error.message });
  }
};

