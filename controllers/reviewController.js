const Review = require('../models/Reviev');
const Product = require('../models/Product');
const { Op } = require('sequelize');

// Create Review
exports.createReview = async (req, res) => {
  try {
    const { productId, reviewerEmail, rating, content } = req.body;

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Invalid productId' });
    }

    const review = await Review.create({
      productId,
      reviewerEmail: reviewerEmail.toLowerCase(),
      rating,
      content,
      status: 'pending', // default status if not passed
      date: new Date()
    });

    // Include product title
    const populatedReview = await Review.findByPk(review.id, {
      include: [{ model: Product, attributes: ['title'] }]
    });

    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

// Get All Reviews (with Filters)
exports.getAllReviews = async (req, res) => {
  try {
    const { rating, status, search } = req.query;

    const where = {};
    if (rating) where.rating = Number(rating);
    if (status) where.status = status;
    if (search) {
      // For filtering on Review.content or Product.title
      where[Op.or] = [
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const reviews = await Review.findAll({
      where,
      include: [{
        model: Product,
        attributes: ['title'],
        where: search ? { title: { [Op.iLike]: `%${search}%` } } : undefined,
        required: false
      }],
      order: [['date', 'DESC']]
    });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// Update Review Status
exports.updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.status = status;
    await review.save();

    const updatedReview = await Review.findByPk(id, {
      include: [{ model: Product, attributes: ['title'] }]
    });

    res.json({ message: 'Status updated', review: updatedReview });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete Review
exports.deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Review.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
