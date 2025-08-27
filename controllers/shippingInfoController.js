const { shippingInfo } = require('../models');

// Create Shipping Info
exports.createShippingInfo = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required!" });
    }

    const newShippingInfo = await shippingInfo.create({ content });
    res.status(201).json({ message: "Shipping info created successfully!", data: newShippingInfo });
  } catch (error) {
    res.status(500).json({ message: "Error creating Shipping Info", error: error.message });
  }
};

// Update Shipping Info
exports.updateShippingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required!" });
    }

    const shippingInfo = await shippingInfo.findByPk(id);
    if (!shippingInfo) {
      return res.status(404).json({ message: "Shipping info not found!" });
    }

    shippingInfo.content = content;
    await shippingInfo.save();

    res.status(200).json({ message: "Shipping Info updated successfully!", data: shippingInfo });
  } catch (error) {
    res.status(500).json({ message: "Error updating Shipping Info", error: error.message });
  }
};

// Get Shipping Info (All)
exports.getShippingInfo = async (req, res) => {
  try {
    const shippingInfos = await shippingInfo.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ message: "Shipping Info fetched successfully", data: shippingInfos });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Shipping Info", error: error.message });
  }
};

// Delete Shipping Info
exports.deleteShippingInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await shippingInfo.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Shipping info not found!" });
    }

    res.status(200).json({ message: "Shipping Info deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Shipping Info", error: error.message });
  }
};
