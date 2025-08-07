const RefundPolicy = require('../models/RefundPolicy');

// CREATE refund policy
exports.createRefundPolicy = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is Required!" });
    }

    const newRefundPolicy = await RefundPolicy.create({ content });

    res.status(201).json({ message: "Refund policy created successfully!", data: newRefundPolicy });
  } catch (error) {
    res.status(500).json({ message: "Error creating Refund policy!", error: error.message });
  }
};

// UPDATE refund policy
exports.updateRefundPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required!" });
    }

    const refundPolicy = await RefundPolicy.findByPk(id);
    if (!refundPolicy) {
      return res.status(404).json({ message: "Refund policy not found!" });
    }

    refundPolicy.content = content;
    await refundPolicy.save();

    res.status(200).json({ message: "Refund Policy updated successfully!", data: refundPolicy });
  } catch (error) {
    res.status(500).json({ message: "Error updating Refund Policy!", error: error.message });
  }
};

// GET all refund policies
exports.getRefundPolicy = async (req, res) => {
  try {
    const refundPolicies = await RefundPolicy.findAll();
    if (!refundPolicies.length) {
      return res.status(404).json({ message: "Refund Policy not found!" });
    }

    res.status(200).json({ message: "Refund policy fetched successfully!", data: refundPolicies });
  } catch (error) {
    res.status(500).json({ message: "Error fetching refund policy", error: error.message });
  }
};

// DELETE refund policy
exports.deleteRefundPolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const refundPolicy = await RefundPolicy.findByPk(id);
    if (!refundPolicy) {
      return res.status(404).json({ message: "Refund Policy not found!" });
    }

    await refundPolicy.destroy();

    res.status(200).json({ message: "Refund Policy deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting refund policy!", error: error.message });
  }
};
