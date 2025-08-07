const { Banner3 } = require('../models');

// ✅ Create Banner
exports.createBanner3 = async (req, res) => {
  try {
    const { title, heading, description, linkUrl, isActive } = req.body;

    const homepageFile = req.files?.homepageImage?.[0];
    const homepageFile2 = req.files?.homepageImage2?.[0];

    if (!homepageFile || !homepageFile2) {
      return res.status(400).json({ message: 'Both homepage images are required.' });
    }

    const folderPath = req.uploadFolder?.replace(/\\/g, '/');

    const homepageImageUrl = `${req.protocol}://${req.get('host')}/${folderPath}/${homepageFile.filename}`;
    const homepageImageUrl2 = `${req.protocol}://${req.get('host')}/${folderPath}/${homepageFile2.filename}`;

    const banner = await Banner3.create({
      title,
      heading,
      description,
      homepageImage: homepageImageUrl,
      homepageImage2: homepageImageUrl2,
      linkUrl,
      isActive,
    });

    res.status(201).json({ message: 'Banner created successfully', banner });
  } catch (error) {
    console.error('Create Banner Error:', error);
    res.status(500).json({ message: 'Error creating banner', error: error.message });
  }
};

// ✅ Get All Banners
exports.getAllBanners3 = async (req, res) => {
  try {
    const banners = await Banner3.findAll();
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error: error.message });
  }
};

// ✅ Get Banner by ID
exports.getBannerById3 = async (req, res) => {
  try {
    const banner = await Banner3.findByPk(req.params.id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.status(200).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banner', error: error.message });
  }
};

// ✅ Update Banner
exports.updateBanner3 = async (req, res) => {
  try {
    const { title, heading, description, linkUrl, isActive } = req.body;
    const banner = await Banner3.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    let homepageImage = banner.homepageImage;
    let homepageImage2 = banner.homepageImage2;

    const homepageFile = req.files?.homepageImage?.[0];
    const homepageFile2 = req.files?.homepageImage2?.[0];
    const folderPath = req.uploadFolder?.replace(/\\/g, '/');

    if (homepageFile) {
      homepageImage = `${req.protocol}://${req.get('host')}/${folderPath}/${homepageFile.filename}`;
    }
    if (homepageFile2) {
      homepageImage2 = `${req.protocol}://${req.get('host')}/${folderPath}/${homepageFile2.filename}`;
    }

    await banner.update({
      title,
      heading,
      description,
      linkUrl,
      homepageImage,
      homepageImage2,
      isActive,
    });

    res.status(200).json({ message: 'Banner updated successfully', banner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error: error.message });
  }
};

// ✅ Delete Banner
exports.deleteBanner3 = async (req, res) => {
  try {
    const banner = await Banner3.findByPk(req.params.id);

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
exports.toggleBannerStatus3 = async (req, res) => {
  try {
    const banner = await Banner3.findByPk(req.params.id);

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
