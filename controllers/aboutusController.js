const { AboutUs } = require('../models');
const sqlconnection = require('../config/mysqlconnection')

// ✅ Create or Update AboutUs (Singleton)
exports.createOrUpdateAboutUs = async (req, res) => {
  try {
    const { content, title } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const image = req.file?.filename
      ? `${req.protocol}://${req.get('host')}/uploads/about/${req.file.filename}`
      : undefined;

    let about = await AboutUs.findOne();

    if (about) {
      // Update only the fields provided
      await about.update({
        content,
        ...(title && { title }),
        ...(image && { image }),
      });
    } else {
      // Create new
      about = await AboutUs.create({
        content,
        ...(title && { title }),
        ...(image && { image }),
      });
    }

    res.status(200).json({ message: 'About Us saved successfully', about });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// ✅ Get AboutUs (Singleton)
exports.getAboutUs = async (req, res) => {
  try {
    const about = await AboutUs.findOne();
    res.status(200).json({ about });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch data', error: err.message });
  }
};

// ✅ Delete AboutUs (Singleton)
exports.deleteAboutUs = async (req, res) => {
  try {
    const about = await AboutUs.findOne();
    if (!about) {
      return res.status(404).json({ message: 'About Us not found' });
    }

    await about.destroy();
    res.status(200).json({ message: 'About Us deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete About Us', error: err.message });
  }
};

// ✅ Toggle Active Status
exports.toggleAboutUsStatus = async (req, res) => {
  try {
    const about = await AboutUs.findOne();
    if (!about) {
      return res.status(404).json({ message: 'About Us not found' });
    }

    about.isActive = !about.isActive;
    await about.save();

    res.status(200).json({ message: 'About Us status updated', about });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// ✅ Get All (in case of future multiple records)
exports.getAllAboutUs = async (req, res) => {
  try {
    const abouts = await AboutUs.findAll();
    res.status(200).json({ abouts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch entries', error: err.message });
  }
};
