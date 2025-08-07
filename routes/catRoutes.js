
const express = require('express');
const { createCategory, getAllCategories, updateCategory, deleteCategory, getCategoryById, searchCategoriesByName, getCategorySizes } = require('../controllers/catController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getSlugSuggestions, addNewSlug } = require('../controllers/slugController');


const router = express.Router();

router.post('/category',  createCategory);
router.get('/categories',  getAllCategories);
router.get('/categories/:id',   getCategoryById);
router.get('/categories/search/name',   searchCategoriesByName);
router.put('/category/:id',   updateCategory);
router.delete('/category/:id',   deleteCategory);
router.get('/category/:id/sizes', getCategorySizes);

// router.get('/slug-suggestions', authMiddleware, roleMiddleware('admin'), getSlugSuggestions);
// router.post('/slug', authMiddleware, roleMiddleware('admin'), addNewSlug);

module.exports = router;

