// controllers/cartController.js
const {Cart} = require('../models');
const {Product} = require('../models');

exports.addToCart = async (req, res) => {
  try {
    const { customerId, productId, quantity = 1, size } = req.body;

    if (!customerId || !productId) {
      return res.status(400).json({ success: false, message: 'Missing customerId or productId' });
    }

    let cartItem = await Cart.findOne({
      where: { customerId, productId, size },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ customerId, productId, quantity, size });
      console.log('Cart item created:', cartItem.toJSON());
    }

    res.status(200).json({ success: true, cart: cartItem });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ success: false, message: 'Add to cart failed' });
  }
};

exports.updateCartQuantity = async (req, res) => {
  try {
    const { customerId, productId, size, quantity } = req.body;

    if (!customerId || !productId || !size) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const cartItem = await Cart.findOne({
      where: { customerId, productId, size },
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      return res.status(200).json({ success: true, message: 'Item removed from cart' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ success: true, cart: cartItem });
  } catch (error) {
    console.error('Update Quantity Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update quantity' });
  }
};


exports.viewCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    const cart = await Cart.findAll({
      where: { customerId },
      include: [Product],
    });

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { customerId, productId, size } = req.body;

    const deleted = await Cart.destroy({
      where: { customerId, productId, size },
    });

    if (deleted === 0) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    res.status(200).json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Remove From Cart Error:', error);
    res.status(500).json({ success: false, message: 'Failed to remove item' });
  }
};
