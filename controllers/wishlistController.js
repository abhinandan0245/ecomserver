// // controllers/wishlistController.js
// const Wishlist = require('../models/Wishlist');
// const Product = require('../models/Product');

// exports.addToWishlist = async (req, res) => {
//   try {
//     const { customerId, productId } = req.body;

//     const exists = await Wishlist.findOne({ where: { customerId, productId } });

//     if (exists) {
//       return res.status(400).json({ success: false, message: 'Already in wishlist' });
//     }

//     const item = await Wishlist.create({ customerId, productId });

//     res.status(201).json({ success: true, wishlist: item });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Add to wishlist failed' });
//   }
// };

// exports.viewWishlist = async (req, res) => {
//   try {
//     const { customerId } = req.params;
//     const wishlist = await Wishlist.findAll({
//       where: { customerId },
//       include: [{ model: Product }],
//     });

//     res.status(200).json({ success: true, wishlist });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Fetch wishlist failed' });
//   }
// };

// exports.deleteFromWishlist = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Wishlist.destroy({ where: { id } });

//     res.status(200).json({ success: true, message: 'Removed from wishlist' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Delete from wishlist failed' });
//   }
// };




const Wishlist = require("../models/Wishlist");
const { Product, ImageVariant } = require("../models");
const { Op } = require("sequelize");

exports.addToWishlist = async (req, res) => {
  try {
    const { customerId, productId } = req.body;

    // Check if already exists
    const exists = await Wishlist.findOne({
      where: { customerId, productId },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Already in wishlist",
        wishlist: exists,
      });
    }

    // Create new wishlist item
    const item = await Wishlist.create({ customerId, productId });

    // Fetch complete product details
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: ImageVariant,
          as: "imageVariants",
          attributes: ["id", "imageUrl"],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Prepare response with full product details
    const response = {
      ...item.get({ plain: true }),
      product: {
        ...product.get({ plain: true }),
        priceVariants: product.priceVariants
          ? JSON.parse(product.priceVariants)
          : [],
      },
    };

    res.status(201).json({
      success: true,
      wishlist: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Add to wishlist failed",
      error: error.message,
    });
  }
};

exports.viewWishlist = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Get total count for pagination
    const total = await Wishlist.count({
      where: { customerId },
    });

    // Fetch paginated wishlist with product details
    const wishlist = await Wishlist.findAll({
      where: { customerId },
      include: [
        {
          model: Product,
          include: [
            {
              model: ImageVariant,
              as: "imageVariants",
              attributes: ["id", "imageUrl"],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    // Parse price variants and prepare response
    const formattedWishlist = wishlist.map((item) => {
      const product = item.Product.get({ plain: true });

      // Parse price variants safely
      let priceVariants = [];
      try {
        priceVariants = product.priceVariants
          ? JSON.parse(product.priceVariants)
          : [];
      } catch (error) {
        console.error("Error parsing price variants:", error);
        priceVariants = [];
      }

      // Get default price (first variant or product-level price)
      const defaultPrice = priceVariants[0] || {
        price: product.price,
        originalPrice: product.originalPrice,
        size: "",
      };

      return {
        id: item.id,
        createdAt: item.createdAt,
        product: {
          ...product,
          price: defaultPrice.price,
          originalPrice: defaultPrice.originalPrice,
          priceVariants, // Keep the full array if needed
          imageVariants: product.imageVariants || [],
          mainImage: product.imageVariants?.[0]?.imageUrl || null,
        },
      };
    });

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      wishlist: formattedWishlist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Fetch wishlist failed",
      error: error.message,
    });
  }
};

exports.deleteFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Wishlist.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Delete from wishlist failed",
      error: error.message,
    });
  }
};

// Additional endpoint to check if product is in wishlist
exports.checkWishlist = async (req, res) => {
  try {
    const { customerId, productId } = req.query;

    const item = await Wishlist.findOne({
      where: { customerId, productId },
      attributes: ["id"],
    });

    res.status(200).json({
      success: true,
      inWishlist: !!item,
      wishlistId: item?.id || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Check wishlist failed",
      error: error.message,
    });
  }
};