const { Product, Inventory } = require('../models'); // Adjust path if needed

async function createInventoryForAllProducts() {
  const products = await Product.findAll();
  for (const product of products) {
    const exists = await Inventory.findOne({ where: { productId: product.id } });
    if (!exists) {
      await Inventory.create({
        productId: product.id,
        productName: product.title,
        stockAvailable: product.stock,
        status: product.stock > 0 ? 'in-stock' : 'out-of-stock',
        productStatus: true,
      });
    }
  }
  console.log('Inventory created for all products!');
  process.exit(); // Exit after script runs
}

createInventoryForAllProducts();