// const { Product, ImageVariant, Category , Coupon} = require('../models');
// const { Op } = require('sequelize');
// const fs = require('fs');
// const path = require('path');

// const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// // Helper to always return an array from FormData fields
// function parseFormArray(field) {
//   if (Array.isArray(field)) return field;
//   if (typeof field === 'string') return [field];
//   return [];
// }

// // CREATE PRODUCT
// exports.createProduct = async (req, res) => {
//   try {
//     const {
//       productId, title, hsnCode, description, price, stock, discount,
//       categoryId, brand , size  , productStatus
//     } = req.body;

//     if (!productId) return res.status(400).json({ message: 'productId is required' });
//     if (!categoryId) return res.status(400).json({ message: 'categoryId is required' });

//     // const size = parseFormArray(req.body['size[]'] || req.body.size);
//     const color = parseFormArray(req.body['color[]'] || req.body.color);
//     const tags = parseFormArray(req.body['tags[]'] || req.body.tags);

//      const status = Number(stock) > 0 ? 'in-stock' : 'out-of-stock';

//     const product = await Product.create({
//       productId, title, hsnCode, description, price, stock, discount,
//       categoryId, brand,
//       size,
//       color,
//       tags,
//       status,
//       productStatus
//     });

//     // Handle image variants
//     const variants = parseFormArray(req.body.variants);
//     for (let vIndex = 0; vIndex < variants.length; vIndex++) {
//       const variant = typeof variants[vIndex] === 'string' ? JSON.parse(variants[vIndex]) : variants[vIndex];
//       const color = variant.color;
//       const files = (req.files || []).filter(f => f.fieldname === `variants[${vIndex}][images]`);
//       const urls = files.map(f => `${getBaseUrl(req)}/${f.path.replace(/\\/g, '/')}`);

//       await ImageVariant.create({
//         productId: product.id,
//         color,
//         imageUrl: urls
//       });
//     }

//     const fullProduct = await Product.findByPk(product.id, { include: ['imageVariants', { model: Category, as: 'category' }] });
//     res.status(201).json(fullProduct);
//   } catch (err) {
//     console.error('Create Product Error:', err);
//     res.status(500).json({ message: 'Create failed', error: err.message });
//   }
// };

// // UPDATE PRODUCT
// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const existing = await Product.findByPk(id);
//     if (!existing) return res.status(404).json({ message: 'Product not found' });

//     const {
//       productId, title, hsnCode, description, price, stock, discount,
//       categoryId, brand , size , productStatus
//     } = req.body;

//     // const size = parseFormArray(req.body['size[]'] || req.body.size);
//     const color = parseFormArray(req.body['color[]'] || req.body.color);
//     const tags = parseFormArray(req.body['tags[]'] || req.body.tags);

//      const status = Number(stock) > 0 ? 'in-stock' : 'out-of-stock';

//     await Product.update({
//       productId, title, hsnCode, description, price, stock, discount,
//       categoryId, brand,
//       size,
//       color,
//       tags,
//       status,
//        productStatus
//     }, { where: { id } });

//     // Remove old image variants
//     await ImageVariant.destroy({ where: { productId: id } });

//     // Handle image variants (same as create)
//     const variants = parseFormArray(req.body.variants);
//     for (let vIndex = 0; vIndex < variants.length; vIndex++) {
//       const variant = typeof variants[vIndex] === 'string' ? JSON.parse(variants[vIndex]) : variants[vIndex];
//       const color = variant.color;
//       const files = (req.files || []).filter(f => f.fieldname === `variants[${vIndex}][images]`);
//       const urls = files.map(f => `${getBaseUrl(req)}/${f.path.replace(/\\/g, '/')}`);

//       await ImageVariant.create({
//         productId: id,
//         color,
//         imageUrl: urls
//       });
//     }

//     const updated = await Product.findByPk(id, { include: ['imageVariants', { model: Category, as: 'category' }] });
//     res.status(200).json({ message: 'Product Updated Successfully!', data: updated });
//   } catch (err) {
//     console.error('Update Product Error:', err);
//     res.status(500).json({ message: 'Update failed', error: err.message });
//   }
// };

// // GET ALL PRODUCTS
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.findAll({
//       include: ['imageVariants', { model: Category, as: 'category' }],
//       order: [['createdAt', 'DESC']]
//     });
//     res.json(products);
//   } catch (err) {
//     console.error('Fetch all products error:', err);
//     res.status(500).json({ message: 'Fetch failed' });
//   }
// };

// // GET PRODUCT BY ID

// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id, {
//       include: [
//         { model: ImageVariant, as: 'imageVariants' }, // if you're using model directly
//         { model: Category, as: 'category' },
//         { model: Coupon, as: 'Coupons' },
//       ],
//     });

//     if (!product) return res.status(404).json({ message: 'Product not found' });

//     res.json(product);
//   } catch (err) {
//     console.error('Fetch product by ID error:', err.message, err.stack);
//     res.status(500).json({ message: 'Fetch by ID failed', error: err.message });
//   }
// };


// // DELETE PRODUCT
// exports.deleteProduct = async (req, res) => {
//   try {
//     const deleted = await Product.destroy({ where: { id: req.params.id } });
//     if (!deleted) return res.status(404).json({ message: 'Not found' });
//     res.json({ message: 'Deleted successfully' });
//   } catch (err) {
//     console.error('Delete product error:', err);
//     res.status(500).json({ message: 'Delete failed' });
//   }
// };

// // FILTER PRODUCTS
// exports.filterProducts = async (req, res) => {
//   try {
//     const { categoryId, minPrice, maxPrice } = req.query;
//     const filter = {};
//     if (categoryId) filter.categoryId = categoryId;
//     if (minPrice && maxPrice) {
//       filter.price = { [Op.between]: [Number(minPrice), Number(maxPrice)] };
//     }

//     const products = await Product.findAll({
//       where: filter,
//       include: ['imageVariants', { model: Category, as: 'category' }]
//     });
//     res.json(products);
//   } catch (err) {
//     console.error('Filter products error:', err);
//     res.status(500).json({ message: 'Filter failed' });
//   }
// };




const { Product, ImageVariant, Category, Coupon } = require('../models');
const fs = require('fs');
const path = require('path');
const { Op, fn, col, where: sequelizeWhere } = require('sequelize');

const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

// Helper function to parse form arrays
function parseFormArray(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return field.split(',').map(item => item.trim());
    }
  }
  return [];
}

// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
    // Parse basic fields
    const {
      productId, title, hsnCode, description, ingredients, additionalInfo, originalPrice, stock,
      discountPercentage, discountAmount, categoryId, brand, productStatus
    } = req.body;

    // Validate required fields
    if (!productId || !categoryId) {
      return res.status(400).json({ 
        message: 'productId and categoryId are required' 
      });
    }

    // Validate discount values
    if (discountPercentage && (discountPercentage < 0 || discountPercentage > 100)) {
      return res.status(400).json({ 
        message: 'Discount percentage must be between 0 and 100' 
      });
    }

    if (discountAmount && discountAmount < 0) {
      return res.status(400).json({ 
        message: 'Discount amount cannot be negative' 
      });
    }

    // Calculate final price
    const percentageDiscount = parseFloat(originalPrice || 0) * (parseFloat(discountPercentage || 0) / 100);
    const totalDiscount = percentageDiscount + parseFloat(discountAmount || 0);
    const finalPrice = Math.max(0, parseFloat(originalPrice || 0) - totalDiscount);

    // Check category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Parse sizes and price variants
    const sizes = parseFormArray(req.body.sizes);
    const priceVariants = [];

    // Handle price variants - they come as JSON strings in an array
    const priceVariantsInput = parseFormArray(req.body.priceVariants);
    for (const variant of priceVariantsInput) {
      try {
        const parsedVariant = typeof variant === 'string' ? JSON.parse(variant) : variant;
        
        if (parsedVariant.size && parsedVariant.originalPrice) {
          const variantPctDiscount = parseFloat(parsedVariant.originalPrice) * 
            (parseFloat(parsedVariant.discountPercentage || 0) / 100);
          const variantTotalDiscount = variantPctDiscount + parseFloat(parsedVariant.discountAmount || 0);
          const variantFinalPrice = Math.max(0, parseFloat(parsedVariant.originalPrice) - variantTotalDiscount);

          priceVariants.push({
            size: parsedVariant.size,
            originalPrice: parseFloat(parsedVariant.originalPrice),
            discountPercentage: parseFloat(parsedVariant.discountPercentage || 0),
            discountAmount: parseFloat(parsedVariant.discountAmount || 0),
            price: variantFinalPrice
          });
        }
      } catch (err) {
        console.error('Error parsing price variant:', variant, err);
      }
    }

    // Parse tags
    const tags = parseFormArray(req.body.tags);

    // Determine stock status
    const status = Number(stock) > 0 ? 'in-stock' : 'out-of-stock';

    // Create product
    const product = await Product.create({
      productId,
      title,
      hsnCode,
      description,
      ingredients,
      additionalInfo,
      originalPrice: parseFloat(originalPrice || 0),
      price: finalPrice,
      stock: parseInt(stock || 0),
      discountPercentage: parseFloat(discountPercentage || 0),
      discountAmount: parseFloat(discountAmount || 0),
      categoryId,
      brand,
      sizes,
      priceVariants,
      tags,
      status,
      productStatus: productStatus === 'true' || productStatus === true
    });

    // Handle image uploads - updated image handling from old controller
    const imageFiles = (req.files || []).filter(f => f.fieldname === 'images');
    for (const file of imageFiles) {
      const relativePath = file.path.split('uploads')[1];
      const imageUrl = `${getBaseUrl(req)}/uploads${relativePath.replace(/\\/g, '/')}`;
      await ImageVariant.create({
        productId: product.id,
        imageUrl,
        color: null
      });
    }

    // Return full product data
    const fullProduct = await Product.findByPk(product.id, {
      include: [
        { model: ImageVariant, as: 'imageVariants' },
        { model: Category, as: 'category' },
        { model: Coupon, as: 'Coupons' }
      ]
    });

    res.status(201).json(fullProduct);
  } catch (err) {
    console.error('Create Product Error:', err);
    res.status(500).json({ 
      message: 'Create failed', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch existing product
    const existing = await Product.findByPk(id, {
      include: [
        { model: ImageVariant, as: 'imageVariants' },
        { model: Category, as: 'category' },
        { model: Coupon, as: 'Coupons' }
      ]
    });
    
    if (!existing) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Parse basic fields
    const {
      productId, title, hsnCode, description, ingredients, additionalInfo, originalPrice, stock,
      discountPercentage, discountAmount, categoryId, brand, productStatus
    } = req.body;

    // Validate discount values
    if (discountPercentage && (discountPercentage < 0 || discountPercentage > 100)) {
      return res.status(400).json({ 
        message: 'Discount percentage must be between 0 and 100' 
      });
    }

    if (discountAmount && discountAmount < 0) {
      return res.status(400).json({ 
        message: 'Discount amount cannot be negative' 
      });
    }

    // Calculate final price
    const finalOriginalPrice = parseFloat(originalPrice || existing.originalPrice);
    const finalDiscountPercentage = parseFloat(discountPercentage || existing.discountPercentage || 0);
    const finalDiscountAmount = parseFloat(discountAmount || existing.discountAmount || 0);
    
    const percentageDiscount = finalOriginalPrice * (finalDiscountPercentage / 100);
    const totalDiscount = percentageDiscount + finalDiscountAmount;
    const finalPrice = Math.max(0, finalOriginalPrice - totalDiscount);

    const finalCategoryId = categoryId || existing.categoryId;

    // Validate category
    const category = await Category.findByPk(finalCategoryId);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Parse sizes and price variants
    const sizes = parseFormArray(req.body.sizes || existing.sizes);
    const priceVariants = [];

    // Handle price variants
    const priceVariantsInput = parseFormArray(req.body.priceVariants);
    for (const variant of priceVariantsInput.length ? priceVariantsInput : existing.priceVariants) {
      try {
        const parsedVariant = typeof variant === 'string' ? JSON.parse(variant) : variant;
        
        if (parsedVariant.size && parsedVariant.originalPrice) {
          const variantPctDiscount = parseFloat(parsedVariant.originalPrice) * 
            (parseFloat(parsedVariant.discountPercentage || 0) / 100);
          const variantTotalDiscount = variantPctDiscount + parseFloat(parsedVariant.discountAmount || 0);
          const variantFinalPrice = Math.max(0, parseFloat(parsedVariant.originalPrice) - variantTotalDiscount);
           
          priceVariants.push({
            size: parsedVariant.size,
            originalPrice: parseFloat(parsedVariant.originalPrice),
            discountPercentage: parseFloat(parsedVariant.discountPercentage || 0),
            discountAmount: parseFloat(parsedVariant.discountAmount || 0),
            price: variantFinalPrice
          });
        }
      } catch (err) {
        console.error('Error parsing price variant:', variant, err);
      }
    }
   
    // Parse tags
    const tags = parseFormArray(req.body.tags || existing.tags);

    // Determine stock status
    const status = Number(stock || existing.stock) > 0 ? 'in-stock' : 'out-of-stock';

    // Prepare update data
    const updateData = {
      productId: productId || existing.productId,
      title: title || existing.title,
      hsnCode: hsnCode || existing.hsnCode,
      description: description || existing.description,
      ingredients: ingredients || existing.ingredients,
      additionalInfo: additionalInfo || existing.additionalInfo,
      originalPrice: finalOriginalPrice,
      price: finalPrice,
      stock: parseInt(stock || existing.stock),
      discountPercentage: finalDiscountPercentage,
      discountAmount: finalDiscountAmount,
      categoryId: finalCategoryId,
      brand: brand || existing.brand,
      sizes: sizes.length ? sizes : existing.sizes,
      priceVariants: priceVariants.length ? priceVariants : existing.priceVariants,
      tags,
      status,
      productStatus: productStatus === 'true' || productStatus === true
    };

    // Update product
    await Product.update(updateData, { where: { id } });

    // Handle image deletions - updated from old controller
    const imagesToDeleteRaw = req.body['imagesToDelete[]'] || req.body.imagesToDelete || [];
    const imagesToDelete = Array.isArray(imagesToDeleteRaw) 
      ? imagesToDeleteRaw 
      : [imagesToDeleteRaw];

    if (imagesToDelete?.length > 0) {
      await ImageVariant.destroy({ 
        where: { 
          id: imagesToDelete, 
          productId: id 
        } 
      });
    }

    // Handle new image uploads - updated from old controller
    const imageFiles = (req.files || []).filter(f => f.fieldname === 'images');
    for (const file of imageFiles) {
      const relativePath = file.path.split('uploads')[1];
      const imageUrl = `${getBaseUrl(req)}/uploads${relativePath.replace(/\\/g, '/')}`;
      await ImageVariant.create({ 
        productId: id, 
        imageUrl, 
        color: null 
      });
    }

    // Return updated product
    const updated = await Product.findByPk(id, {
      include: [
        { model: ImageVariant, as: 'imageVariants' },
        { model: Category, as: 'category' },
        { model: Coupon, as: 'Coupons' }
      ]
    });

    res.status(200).json({ 
      message: 'Product updated successfully!', 
      data: updated 
    });

  } catch (err) {
    console.error('Update Product Error:', err);
    res.status(500).json({ 
      message: 'Update failed', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// // GET ALL PRODUCTS
// exports.getAllProducts = async (req, res) => {
//   try {
//     const { categoryId, minPrice, maxPrice, size, search } = req.query;
//     const where = {};
    
//     // Filter by category
//     if (categoryId) where.categoryId = categoryId;
    
//     // Price range filter (using final price)
//     if (minPrice && maxPrice) {
//       where.price = { 
//         [Op.between]: [Number(minPrice), Number(maxPrice)] 
//       };
//     } else if (minPrice) {
//       where.price = { [Op.gte]: Number(minPrice) };
//     } else if (maxPrice) {
//       where.price = { [Op.lte]: Number(maxPrice) };
//     }
    
//     // Size filter
//     if (size) {
//       where.sizes = { 
//         [Op.contains]: Array.isArray(size) ? size : [size] 
//       };
//     }
    
//     // Search filter
//     if (search) {
//       where[Op.or] = [
//         { title: { [Op.iLike]: `%${search}%` } },
//         { description: { [Op.iLike]: `%${search}%` } },
//         { productId: { [Op.iLike]: `%${search}%` } }
//       ];
//     }

//     let products = await Product.findAll({
//   where,
//   include: [
//     { model: ImageVariant, as: 'imageVariants' },
//     { model: Category, as: 'category' },
//     { model: Coupon, as: 'Coupons' }
//   ],
//   order: [['createdAt', 'DESC']]
// });

// // Now filter by priceVariants in JS
// if (minPrice || maxPrice) {
//   const min = Number(minPrice) || 0;
//   const max = Number(maxPrice) || Infinity;

//   products = products.filter(product => {
//     return product.priceVariants?.some(variant => {
//       return variant.price >= min && variant.price <= max;
//     });
//   });
// }

    
//     res.json(products);
//   } catch (err) {
//     console.error('Fetch all products error:', err);
//     res.status(500).json({ 
//       message: 'Fetch failed',
//       error: err.message 
//     });
//   }
// };




exports.getAllProducts = async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice, size, search } = req.query;
    const where = {};

    // 🔍 Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // 🔍 Size filter (PostgreSQL: Op.contains | MySQL: consider JSON_CONTAINS later)
    if (size) {
      const sizeArray = Array.isArray(size) ? size : [size];
      where.sizes = {
        [Op.contains]: sizeArray
      };
    }

    // 🔍 Search filter (disambiguated using `Product.` prefix)
    if (search) {
      const lowerSearch = search.toLowerCase();
      where[Op.or] = [
        sequelizeWhere(fn('LOWER', col('Product.title')), {
          [Op.like]: `%${lowerSearch}%`
        }),
        sequelizeWhere(fn('LOWER', col('Product.description')), {
          [Op.like]: `%${lowerSearch}%`
        }),
        sequelizeWhere(fn('LOWER', col('Product.productId')), {
          [Op.like]: `%${lowerSearch}%`
        })
      ];
    }

    // ⚙️ Fetch Products
    let products = await Product.findAll({
      where,
      include: [
        { model: ImageVariant, as: 'imageVariants' },
        { model: Category, as: 'category' },
        { model: Coupon, as: 'Coupons' }
      ],
      order: [['createdAt', 'DESC']]
    });

    // 💸 Filter price from JSON column (after fetching)
    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Infinity;

      products = products.filter((product) => {
        try {
          const priceVariants = JSON.parse(product.priceVariants || '[]');
          return priceVariants.some((variant) => {
            const finalPrice = Number(variant.price);
            return finalPrice >= min && finalPrice <= max;
          });
        } catch (err) {
          console.error(`Error parsing priceVariants for product ${product.id}:`, err.message);
          return false;
        }
      });
    }

    // ✅ Send final response
    res.status(200).json(products);
  } catch (err) {
    console.error('Fetch all products error:', err);
    res.status(500).json({
      message: 'Failed to fetch products',
      error: err.message
    });
  }
};


// GET PRODUCT BY ID
// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findByPk(req.params.id, {
//       include: [
//         { model: ImageVariant, as: 'imageVariants' },
//         { model: Category, as: 'category' },
//         { model: Coupon, as: 'Coupons' },
//       ],
//     });

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Calculate discount information
//     const discountInfo = {
//       originalPrice: product.originalPrice,
//       finalPrice: product.price,
//       discountPercentage: product.discountPercentage,
//       discountAmount: product.discountAmount,
//       totalDiscount: product.originalPrice - product.price
//     };

//     res.json({
//       ...product.toJSON(),
//       discountInfo
//     });
//   } catch (err) {
//     console.error('Fetch product by ID error:', err.message, err.stack);
//     res.status(500).json({ 
//       message: 'Fetch by ID failed', 
//       error: err.message 
//     });
//   }
// };


// GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: ImageVariant, as: 'imageVariants' },
        { model: Category, as: 'category' },
        { model: Coupon, as: 'Coupons' },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Parse stringified arrays if needed
    let priceVariants = product.priceVariants;
    if (typeof priceVariants === 'string') {
      try {
        priceVariants = JSON.parse(priceVariants);
      } catch (e) {
        priceVariants = []; // fallback
      }
    }

    let sizes = product.sizes;
    if (typeof sizes === 'string') {
      try {
        sizes = JSON.parse(sizes);
      } catch (e) {
        sizes = sizes.split(',').map(s => s.trim());
      }
    }

    const response = {
      ...product.toJSON(),
      sizes,
      priceVariants,
    };

    res.json(response);
  } catch (err) {
    console.error('Fetch product by ID error:', err.message, err.stack);
    res.status(500).json({ 
      message: 'Fetch by ID failed', 
      error: err.message 
    });
  }
};



// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({ 
      where: { id: req.params.id } 
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ 
      message: 'Delete failed',
      error: err.message 
    });
  }
};

// GET PRODUCT DISCOUNT DETAILS
exports.getProductDiscountDetails = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: [
        'id',
        'originalPrice',
        'price',
        'discountPercentage',
        'discountAmount'
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      originalPrice: product.originalPrice,
      finalPrice: product.price,
      discountPercentage: product.discountPercentage,
      discountAmount: product.discountAmount,
      totalDiscount: product.originalPrice - product.price
    });
  } catch (err) {
    console.error('Get discount details error:', err);
    res.status(500).json({ 
      message: 'Failed to get discount details',
      error: err.message 
    });
  }
};

// GET PRODUCT SIZE VARIANTS
exports.getProductSizeVariants = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      attributes: ['id', 'priceVariants', 'sizes']
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Return size variants with their pricing
    const sizeVariants = product.priceVariants.map(variant => ({
      size: variant.size,
      originalPrice: variant.originalPrice,
      discountPercentage: variant.discountPercentage,
      discountAmount: variant.discountAmount,
      finalPrice: variant.price
    }));

    res.json(sizeVariants);
  } catch (err) {
    console.error('Get size variants error:', err);
    res.status(500).json({ 
      message: 'Failed to get size variants',
      error: err.message 
    });
  }
};

// FILTER PRODUCTS
exports.filterProducts = async (req, res) => {
  try {
    const { categoryId, minPrice, maxPrice, size } = req.query;
    const filter = {};
    
    if (categoryId) filter.categoryId = categoryId;
    if (minPrice && maxPrice) {
      filter.price = { [Op.between]: [Number(minPrice), Number(maxPrice)] };
    }
    if (size) {
      filter.sizes = { [Op.contains]: Array.isArray(size) ? size : [size] };
    }

    const products = await Product.findAll({
      where: filter,
      include: [
        { model: ImageVariant, as: 'imageVariants' },
        { model: Category, as: 'category' },
        { model: Coupon, as: 'Coupons' }
      ]
    });
    
    res.json(products);
  } catch (err) {
    console.error('Filter products error:', err);
    res.status(500).json({ message: 'Filter failed' });
  }
};