// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

exports.addToWishlist = async (req, res) => {
  try {
    const { customerId, productId } = req.body;

    const exists = await Wishlist.findOne({ where: { customerId, productId } });

    if (exists) {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }

    const item = await Wishlist.create({ customerId, productId });

    res.status(201).json({ success: true, wishlist: item });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Add to wishlist failed' });
  }
};

exports.viewWishlist = async (req, res) => {
  try {
    const { customerId } = req.params;
    const wishlist = await Wishlist.findAll({
      where: { customerId },
      include: [{ model: Product }],
    });

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Fetch wishlist failed' });
  }
};

exports.deleteFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    await Wishlist.destroy({ where: { id } });

    res.status(200).json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Delete from wishlist failed' });
  }
};
