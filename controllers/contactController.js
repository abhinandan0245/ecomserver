// controllers/contactController.js
const ContactMessage = require("../models/ContactMessage");

exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = await ContactMessage.create({ name, email, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ContactMessage.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
