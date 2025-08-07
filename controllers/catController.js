const { Category } = require('../models');
const { Op } = require('sequelize');

// ✅ Create Category
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, status, size } = req.body;
    console.log("Incoming data:", { name, slug, status, size });

    if (!name?.trim() || !slug?.trim()) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const category = await Category.create({ name, slug, status, size });
    return res.status(201).json(category);
  } catch (err) {
    console.error("Category Create Error:", err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// ✅ Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get Category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Search Categories by Name
exports.searchCategoriesByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: 'Name query parameter is required' });
    }

    const categories = await Category.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });

    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, status, size } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.update({ name, slug, status, size });
    res.status(200).json({ message: "Category updated successfully", data: category });
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// In your category controller
// Add this to your existing categoryController.js
exports.getCategorySizes = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Return sizes as an array
    let sizes = [];
    if (category.size) {
      if (Array.isArray(category.size)) {
        sizes = category.size;
      } else if (typeof category.size === 'string') {
        try {
          sizes = JSON.parse(category.size);
        } catch {
          sizes = category.size.split(',').map(s => s.trim());
        }
      }
    }
    
    res.status(200).json(sizes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};