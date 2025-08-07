// routes/slugRoutes.js
const express = require('express');
const { getSlugSuggestions, addNewSlug } = require('../controllers/slugController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/slug-suggestions',   getSlugSuggestions);
router.post('/',  addNewSlug);

module.exports = router;
