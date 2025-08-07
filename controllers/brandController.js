const { Brand, Product } = require('../models');

// ✅ Create Brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description, totalProduct , status , categoryId } = req.body;
    // const logoImages = req.files.map(file =>
    //   `${req.protocol}://${req.get('host')}/${file.path.replace(/\\/g, '/')}`
    // );

    const existing = await Brand.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: "Brand already exists." });

    const brand = await Brand.create({
      name,
      description,
      totalProduct,
      status,
      categoryId
      // logo: logoImages
    });

    res.status(201).json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Brands with Product Counts
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll({ raw: true });

    const brandsWithCounts = await Promise.all(
      brands.map(async (brand) => {
        const totalProducts = await Product.count({ where: { brand: brand.name } });
        return { ...brand, totalProducts };
      })
    );

    res.status(200).json(brandsWithCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// In your brand controller
exports.getBrandsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const brands = await Brand.findAll({ where: { categoryId } });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Update Brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, totalProduct , status , categoryId} = req.body;

    const updateData = { name, description, totalProduct , status , categoryId};

    // if (req.files && req.files.length > 0) {
    //   const newLogos = req.files.map(file =>
    //     `${req.protocol}://${req.get('host')}/${file.path.replace(/\\/g, '/')}`
    //   );
    //   updateData.logo = newLogos;
    // }

    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ message: "Brand not found." });

    await brand.update(updateData);

    res.status(200).json(brand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Hard Delete Brand

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findByPk(id);
    if (!brand) return res.status(404).json({ message: "Brand not found." });

    await brand.destroy(); // <-- This line permanently deletes the brand

    res.status(200).json({ message: "Brand deleted permanently!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};