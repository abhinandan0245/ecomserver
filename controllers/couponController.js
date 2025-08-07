// const Coupon = require('../models/Coupon');
const { Op } = require('sequelize');

// Create Coupon
const { Coupon, Product } = require('../models'); // adjust path

// Create Coupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      couponCode,
      description,
      usageLimit,
      minOrderValue,
      combineWithOtherCoupons,
      customerSegment,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
      productIds = [], // 👈 input like [1, 2, 3]
    } = req.body;

    // ✅ Step 1: Validate all productIds exist
    const products = await Product.findAll({
      where: { id: productIds },
    });

    if (productIds.length && products.length !== productIds.length) {
      return res.status(400).json({
        message: 'Some productIds are invalid or not found',
      });
    }

    // ✅ Step 2: Create the coupon
    const coupon = await Coupon.create({
      couponCode,
      description,
      usageLimit,
      minOrderValue,
      combineWithOtherCoupons,
      customerSegment,
      discountType,
      discountValue,
      startDate,
      endDate,
      isActive,
    });

    // ✅ Step 3: Associate products if any
    if (products.length > 0) {
      await coupon.setProducts(productIds); // Will only work with valid products
    }

    res.status(201).json({ message: 'Coupon created', data: coupon });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ message: 'Failed to create coupon', error: error.message });
  }
};



// Get All Coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      include: {
        model: Product,
        as: 'products', // ✅ REQUIRED
        attributes: ['id', 'title'], // You can include other fields if needed
        through: { attributes: [] }, // Hide the join table info
      },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      message: 'Coupons fetched successfully',
      data: coupons,
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get Coupon by ID
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id, {
      include: [{ model: Product , as: 'products'}],
    });

    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    res.status(200).json({ message: 'Coupon found', data: coupon });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coupon', error: error.message });
  }
};


// Update Coupon
exports.updateCoupon = async (req, res) => {
  try {
    const {
      productIds, // optional update of products
      ...couponData
    } = req.body;

    const [updated] = await Coupon.update(couponData, {
      where: { id: req.params.id },
    });

    if (!updated) return res.status(404).json({ message: 'Coupon not found' });

    const coupon = await Coupon.findByPk(req.params.id);
    
    if (productIds && Array.isArray(productIds)) {
      await coupon.setProducts(productIds); // ✅ re-associate
    }

    res.status(200).json({ message: 'Coupon updated', data: coupon });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};


// Delete Coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error: error.message });
  }
};

// Apply Coupon
exports.applyCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    const coupon = await Coupon.findOne({ where: { couponCode: code } });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    const currentDate = new Date();

    if (coupon.startDate > currentDate || coupon.endDate < currentDate) {
      return res.status(400).json({ message: "Coupon is not valid at this time" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Coupon is not active" });
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: "Coupon usage limit reached" });
    }

    if (orderValue < parseFloat(coupon.minOrderValue)) {
      return res.status(400).json({ message: `Order value must be at least ₹${coupon.minOrderValue}` });
    }

    // Mark as used (if usageLimit defined, increase counter instead of isUsed flag)
    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({ message: "Coupon applied successfully", data: coupon });
  } catch (error) {
    res.status(500).json({ message: "Error applying coupon", error: error.message });
  }
};

// Search Coupons
exports.searchCoupons = async (req, res) => {
  try {
    const { code, discountType, minDiscount, maxDiscount } = req.query;

    const where = {};

    if (code) {
      where.couponCode = { [Op.like]: `%${code}%` };
    }

    if (discountType) {
      where.discountType = discountType;
    }

    if (minDiscount || maxDiscount) {
      where.discountValue = {};
      if (minDiscount) where.discountValue[Op.gte] = parseFloat(minDiscount);
      if (maxDiscount) where.discountValue[Op.lte] = parseFloat(maxDiscount);
    }

    const coupons = await Coupon.findAll({ where });
    res.status(200).json({ message: "Coupons retrieved", data: coupons });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
};

// Get Active Coupons
exports.getActiveCoupons = async (req, res) => {
  try {
    const now = new Date();

    const coupons = await Coupon.findAll({
      where: {
        isActive: true,
        startDate: { [Op.lte]: now },
        endDate: { [Op.gte]: now },
      },
    });

    res.status(200).json({ message: "Active coupons retrieved", data: coupons });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active coupons", error: error.message });
  }
};

// PUT /api/coupons/:id/status
exports.toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    coupon.isActive = !coupon.isActive; // Toggle status
    await coupon.save();

    res.status(200).json({ message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}`, data: coupon });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle status', error: error.message });
  }
};

