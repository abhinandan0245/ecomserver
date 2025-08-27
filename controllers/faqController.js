const Faq = require("../models/Faq");

// Create FAQ
exports.createFaq = async (req, res) => {
  try {
    const { title, question, answer } = req.body;

    if (!title || !question || !answer) {
      return res.status(400).json({ message: "Title, question and answer are required" });
    }

    const newFaq = await Faq.create({ title, question, answer });
    res.status(201).json({ message: "FAQ created successfully", faq: newFaq });
  } catch (error) {
    res.status(500).json({ message: "Error creating FAQ", error: error.message });
  }
};

// Get all active FAQs sorted by creation date (descending)
exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ message: "FAQs fetched successfully", data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error); // <-- Add this line
    res.status(500).json({ message: "Error fetching FAQs", error: error.message });
  }
};

// Update FAQ
exports.updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, question, answer } = req.body;

    if (!title || !question || !answer) {
      return res.status(400).json({ message: "Title, question and answer are required!" });
    }

    const faq = await Faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found!" });
    }

    faq.title = title;
    faq.question = question;
    faq.answer = answer;
    await faq.save();

    res.status(200).json({ message: "FAQ updated successfully!", data: faq });
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ", error: error.message });
  }
};

// Delete FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Faq.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: "FAQ not found!" });
    }

    res.status(200).json({ message: "FAQ deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting FAQ", error: error.message });
  }
};

// Toggle FAQ status
exports.toggleFaqStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByPk(id);
    if (!faq) {
      return res.status(404).json({ message: "FAQ not found" });
    }

    faq.isActive = !faq.isActive;
    await faq.save();

    res.status(200).json({ message: "FAQ status updated successfully", data: faq });
  } catch (error) {
    res.status(500).json({ message: "Error updating FAQ status", error: error.message });
  }
};

// Get FAQ by ID
exports.getFaqById = async (req, res) => {
  try {
    const { id } = req.params;
    const faq = await Faq.findByPk(id);

    if (!faq) {
      return res.status(404).json({ message: "FAQ not found!" });
    }

    res.status(200).json({ message: "FAQ fetched successfully", data: faq });
  } catch (error) {
    res.status(500).json({ message: "Error fetching FAQ", error: error.message });
  }
};