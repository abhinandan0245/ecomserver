const ContactPage = require("../models/contactpage"); // Sequelize model

// Create or Update Contact Page (Singleton style)
exports.saveContactPage = async (req, res) => {
  try {
    const { content } = req.body;

    // Sequelize find one (no filter means first record)
    let page = await ContactPage.findOne();

    if (page) {
      // Update existing
      page.content = content;
      await page.save();
      return res.status(200).json({ message: "Contact page updated", data: page });
    }

    // Create new record
    page = await ContactPage.create({ content });
    res.status(201).json({ message: "Contact page created", data: page });
  } catch (err) {
    res.status(500).json({ message: "Error saving contact page", error: err.message });
  }
};

// Get Contact Page
exports.getContactPage = async (req, res) => {
  try {
    const page = await ContactPage.findOne();

    if (!page) {
      return res.status(404).json({ message: "Contact page not found" });
    }

    res.status(200).json({ data: page });
  } catch (err) {
    res.status(500).json({ message: "Error fetching contact page", error: err.message });
  }
};

// Delete Contact Page
exports.deleteContactPage = async (req, res) => {
  try {
    const page = await ContactPage.findOne();

    if (!page) {
      return res.status(404).json({ message: "Contact page not found" });
    }

    // Delete the found record
    await page.destroy();

    res.status(200).json({ message: "Contact page deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting contact page", error: err.message });
  }
};
