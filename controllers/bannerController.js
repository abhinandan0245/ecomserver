// ✅ Sequelize Model
const Banner = require('../models/Banner');

// ✅ Create Banner
exports.createBanner = async (req, res) => {
  try {
    const { title, description, linkUrl, order ,isActive} = req.body;
    const homepageImage = req.file?.filename;

    if (!homepageImage) {
      return res.status(400).json({ message: 'Banner image is required' });
    }

    const folderPath = req.uploadFolder?.replace(/\\/g, '/');
    const imageUrl = `${req.protocol}://${req.get('host')}/${folderPath}/${homepageImage}`;

    const banner = await Banner.create({
      title,
      description,
      homepageImage: imageUrl,
      linkUrl,
      order,
      isActive
    });

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
    console.error('Create Banner Error:', error);
    res.status(500).json({ message: 'Error creating banner', error: error.message });
  }
};

// ✅ Get All Banners
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      order: [['order', 'ASC']],
    });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error: error.message });
  }
};

// ✅ Get Banner by ID
exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banner', error: error.message });
  }
};

// ✅ Update Banner
exports.updateBanner = async (req, res) => {
  try {
    const { title, description, linkUrl, order , isActive} = req.body;
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    let homepageImage = banner.homepageImage;

    if (req.file) {
      const folderPath = req.uploadFolder?.replace(/\\/g, '/');
      homepageImage = `${req.protocol}://${req.get('host')}/${folderPath}/${req.file.filename}`;
    }

    await banner.update({
      title,
      description,
      linkUrl,
      order,
      homepageImage,
      isActive
    });

    res.status(200).json({ message: 'Banner updated successfully', banner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error: error.message });
  }
};

// ✅ Delete Banner
exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    await banner.destroy();
    res.status(200).json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error: error.message });
  }
};

// ✅ Toggle Banner Status
exports.toggleBannerStatus = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    const newStatus = !banner.isActive;
    await banner.update({ isActive: newStatus });

    res.status(200).json({ message: 'Banner status updated successfully', banner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner status', error: error.message });
  }
};
