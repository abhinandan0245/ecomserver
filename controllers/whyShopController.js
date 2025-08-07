// controllers/whyShopController.js
const {WhyShop} = require('../models');

// Create
// ✅ CREATE
exports.createWhyShop = async (req, res) => {
  try {
    const { title, subtitle, isActive } = req.body;
    // const icon = req.file?.filename;

    // if (!icon) {
    //   return res.status(400).json({ message: 'Icon image is required' });
    // }

    // const iconUrl = `${req.protocol}://${req.get('host')}/uploads/icons/${icon}`;

    const item = await WhyShop.create({ title, subtitle,  isActive });
    res.status(201).json({ message: 'Created successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error creating', error: error.message });
  }
};

// ✅ UPDATE
exports.updateWhyShop = async (req, res) => {
  try {
    const item = await WhyShop.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { title, subtitle, isActive } = req.body;
    // let icon = item.icon;

    // if (req.file) {
    //   icon = `${req.protocol}://${req.get('host')}/uploads/icons/${req.file.filename}`;
    // }

    await item.update({ title, subtitle, isActive });
    res.status(200).json({ message: 'Updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error updating', error: error.message });
  }
};


// Get All
exports.getAllWhyShop = async (req, res) => {
  try {
    const items = await WhyShop.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

// Get by ID
exports.getWhyShopById = async (req, res) => {
  try {
    const item = await WhyShop.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};



// Delete
exports.deleteWhyShop = async (req, res) => {
  try {
    const item = await WhyShop.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.destroy();
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting', error: error.message });
  }
};
