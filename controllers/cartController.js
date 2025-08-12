const { Cart, Product, ImageVariant } = require('../models'); 

// Helper function to get price for a given product + size
const getPriceForSize = (product, size) => {
  let priceVariants = product.priceVariants ?? [];
  if (typeof priceVariants === 'string') {
    try {
      priceVariants = JSON.parse(priceVariants);
    } catch {
      priceVariants = [];
    }
  }

  let variant =
    priceVariants.find((v) => String(v.size) === String(size)) ||
    priceVariants[0] ||
    {};

  return Number(variant.price ?? 0);
};

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { customerId, productId, quantity = 1, size } = req.body;

    if (!customerId || !productId) {
      return res.status(400).json({ success: false, message: 'Missing customerId or productId' });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const price = getPriceForSize(product, size);
    const qtyPrice = price * quantity;

    let cartItem = await Cart.findOne({
      where: { customerId, productId, size },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.qtyPrice = price * cartItem.quantity; // update qtyPrice
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ customerId, productId, quantity, size, qtyPrice });
    }

    res.status(200).json({ success: true, cart: cartItem });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ success: false, message: 'Add to cart failed' });
  }
};

// UPDATE CART QUANTITY
exports.updateCartQuantity = async (req, res) => {
  try {
    const { customerId, productId, size, quantity } = req.body;

    if (!customerId || !productId || !size) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const cartItem = await Cart.findOne({
      where: { customerId, productId, size },
      include: [{ model: Product }],
    });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      return res.status(200).json({ success: true, message: 'Item removed from cart' });
    }

    const price = getPriceForSize(cartItem.Product, size);
    cartItem.quantity = quantity;
    cartItem.qtyPrice = price * quantity;
    await cartItem.save();

    res.status(200).json({ success: true, cart: cartItem });
  } catch (error) {
    console.error('Update Quantity Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update quantity' });
  }
};

// VIEW CART
exports.viewCart = async (req, res) => {
  try {
    const { customerId } = req.params;

    const cartRows = await Cart.findAll({
      where: { customerId },
      include: [
        {
          model: Product,
          include: [
            {
              model: ImageVariant,
              as: 'imageVariants',
            },
          ],
        },
      ],
    });

    const mapped = cartRows.map((row) => {
      const product = row.Product || {};
      let priceVariants = product.priceVariants ?? [];
      if (typeof priceVariants === 'string') {
        try {
          priceVariants = JSON.parse(priceVariants);
        } catch {
          priceVariants = [];
        }
      }

      const chosenSize = row.size || null;
      let variant =
        priceVariants.find((v) => String(v.size) === String(chosenSize)) ||
        priceVariants[0] ||
        {};

      const price = Number(variant.price ?? 0);
      const originalPrice = Number(variant.originalPrice ?? variant.price ?? 0);
      const discountPercentage = Number(variant.discountPercentage ?? 0);
      const discountAmount =
        Number(variant.discountAmount ?? originalPrice - price);

      const image =
        product.image ||
        (product.imageVariants && product.imageVariants[0] && product.imageVariants[0].imageUrl) ||
        null;

      return {
        id: row.id,
        cartId: row.id,
        customerId: row.customerId,
        productId: row.productId,
        title: product.title || product.name || product.productName || "",
        size: chosenSize,
        quantity: Number(row.quantity || 1),
        price,
        originalPrice,
        discountPercentage,
        discountAmount,
        qtyPrice: Number(row.qtyPrice || price * (row.quantity || 1)), // ensure qtyPrice is included
        image,
        rawProduct: product,
      };
    });

    res.status(200).json({ success: true, cart: mapped, cartCount: mapped.length });
  } catch (error) {
    console.error("viewCart error:", error);
    res.status(500).json({ success: false, message: 'Failed to fetch cart' });
  }
};

// REMOVE FROM CART
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
