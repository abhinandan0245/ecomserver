const Shipping = require("../models/Shipping");
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

// Get Shipping Info with filters
exports.getShippingInfo = async (req, res) => {
  try {
    const { status, from, to } = req.query;
    const filter = {};

    if (status) {
      filter.shippingStatus = status;
    }
    if (from && to) {
      filter.shippedDate = {
        [Op.gte]: new Date(from),
        [Op.lte]: new Date(to),
      };
    }

    const shipping = await Shipping.findAll({
      where: filter,
      include: ['Order'], // Assuming association alias is 'Order'
      order: [['shippedDate', 'DESC']],
    });

    res.status(200).json({ data: shipping });
  } catch (error) {
    res.status(500).json({ message: "Failed to get shipping info", error: error.message });
  }
};

// Update Shipping Status
exports.updateShippingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { shippingStatus, actualDeliveryDate } = req.body;

    const updateData = { shippingStatus };

    if (shippingStatus === 'Delivered' && actualDeliveryDate) {
      updateData.actualDeliveryDate = actualDeliveryDate;
    }

    const [updatedCount, updatedRows] = await Shipping.update(updateData, {
      where: { id },
      returning: true,
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Shipping record not found" });
    }

    res.status(200).json({ message: "Shipping status updated", data: updatedRows[0] });
  } catch (error) {
    res.status(500).json({ message: "Failed to update shipping status", error: error.message });
  }
};
