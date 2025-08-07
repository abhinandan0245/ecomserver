const { Op } = require('sequelize'); // Only Op is needed now
const Slug = require('../models/slugModel'); // Ensure this path is correct

// Utility to normalize slug for consistency
const normalizeSlug = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
};

exports.getSlugSuggestions = async (req, res) => {
  try {
    const searchQuery = req.query.q?.trim();

    if (!searchQuery) {
      // Return empty array for empty query
      return res.json([]);
    }

    const slugs = await Slug.findAll({
      where: {
        slug: {
          [Op.like]: `%${normalizeSlug(searchQuery)}%`
        }
      },
      attributes: ['slug'],
      limit: 10,
    });

    const results = slugs.map(item => item.slug);
    res.json(results);
  } catch (err) {
    console.error('Slug Search Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// ✅ POST new slug (if not exists)
exports.addNewSlug = async (req, res) => {
  try {
    const { name } = req.body;

    const newSlugValue = normalizeSlug(name);

    if (!newSlugValue) {
      return res.status(400).json({ error: 'Slug name is required' });
    }
    if (newSlugValue.length > 255) {
      return res.status(400).json({ error: 'Slug must be between 1 and 255 characters' });
    }

    const exists = await Slug.findOne({ where: { slug: newSlugValue } });
    if (exists) {
      return res.status(400).json({ error: 'Slug already exists' });
    }

    const newSlug = await Slug.create({ slug: newSlugValue });
    res.status(201).json(newSlug);
  } catch (err) {
    console.error('Slug Add Error:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Slug already exists (unique constraint violation)' });
    }
    res.status(500).json({ error: 'Failed to add slug' });
  }
};