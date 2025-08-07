const { Inventory, Product } = require('../models');
const { Op } = require('sequelize');

// Create Inventory
exports.createInventory = async (req, res) => {
  try {
    const { productId, productStatus } = req.body;

    // Find product by PK
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found with productId' });
    }

    // Check if inventory exists for this product
    const inventoryExists = await Inventory.findOne({ where: { productId: product.id } });
    if (inventoryExists) {
      return res.status(400).json({ message: 'Inventory already exists for this product' });
    }

    // Create inventory entry
    const inventory = await Inventory.create({
      productId: product.id,
      productName: product.title,
      stockAvailable: product.stock,
      status: Number(product.stock) > 0 ? 'in-stock' : 'out-of-stock',
      productStatus: productStatus !== undefined ? productStatus : true,
    });

    res.status(201).json({ message: "Inventory created successfully!", data: inventory });
  } catch (err) {
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

// Update Inventory
exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockAvailable, productName, productStatus } = req.body;

    const inventory = await Inventory.findByPk(id);
    if (!inventory) return res.status(404).json({ message: 'Inventory item not found' });

    if (stockAvailable !== undefined) inventory.stockAvailable = stockAvailable;
    if (productName !== undefined) inventory.productName = productName;
    if (productStatus !== undefined) inventory.productStatus = productStatus;

    // Update status based on stockAvailable
    inventory.status = Number(inventory.stockAvailable) > 0 ? 'in-stock' : 'out-of-stock';

    await inventory.save();
    res.json({ message: "Inventory updated successfully!", data: inventory });
  } catch (err) {
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Get All Inventory with Optional Filters and Search
// exports.getAllInventory = async (req, res) => {
//   try {
//     const { status, search, productStatus } = req.query;
//     const filter = {};

//     if (status && ['in-stock', 'out-of-stock'].includes(status)) {
//       filter.status = status;
//     }
//     if (productStatus !== undefined) {
//       filter.productStatus = productStatus === 'true' || productStatus === true;
//     }
//     if (search) {
//       filter.productName = { [Op.like]: `%${search}%` }; // Use Op.iLike for Postgres
//     }

//     const inventory = await Inventory.findAll({
//       where: filter,
//       order: [['createdAt', 'DESC']],
//       include: [
//         {
//           model: Product,
//           as: 'product',
//           attributes: ['id', 'title', 'stock', 'price'],
//         },
//       ],
//     });

//     res.json(inventory);
//   } catch (err) {
//     res.status(500).json({ message: 'Fetch failed', error: err.message });
//   }
// };


// controllers/inventoryController.js
exports.getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(inventory);
  } catch (err) {
    console.error('Fetch failed:', err); // Check your backend logs for this!
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// Get Inventory by ID
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'title', 'stock', 'price'],
        },
      ],
    });
    if (!inventory) return res.status(404).json({ message: 'Inventory item not found' });
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Fetch by ID failed', error: err.message });
  }
};

// Delete Inventory
exports.deleteInventory = async (req, res) => {
  try {
    const deleted = await Inventory.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Inventory item not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};