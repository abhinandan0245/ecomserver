const { PrivacyPolicy } = require('../models');

// Create Privacy Policy
exports.createPrivacyPolicy = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required!" });
    }

    const newPrivacyPolicy = await PrivacyPolicy.create({ content });
    res.status(201).json({ message: "Privacy policy created successfully!", data: newPrivacyPolicy });
  } catch (error) {
    res.status(500).json({ message: "Error creating Privacy Policy", error: error.message });
  }
};

// Update Privacy Policy
exports.updatePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required!" });
    }

    const privacyPolicy = await PrivacyPolicy.findByPk(id);
    if (!privacyPolicy) {
      return res.status(404).json({ message: "Privacy policy not found!" });
    }

    privacyPolicy.content = content;
    await privacyPolicy.save();

    res.status(200).json({ message: "Privacy Policy updated successfully!", data: privacyPolicy });
  } catch (error) {
    res.status(500).json({ message: "Error updating Privacy Policy", error: error.message });
  }
};

// Get Privacy Policy (All)
exports.getPrivacyPolicy = async (req, res) => {
  try {
    const policies = await PrivacyPolicy.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json({ message: "Privacy Policy fetched successfully", data: policies });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Privacy Policy", error: error.message });
  }
};

// Delete Privacy Policy
exports.deletePrivacyPolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PrivacyPolicy.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "Privacy policy not found!" });
    }

    res.status(200).json({ message: "Privacy Policy deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Privacy Policy", error: error.message });
  }
};
