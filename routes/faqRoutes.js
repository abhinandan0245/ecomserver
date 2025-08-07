const express = require('express');
const { createFaq, getFaqs, updateFaq, getFaqById, toggleFaqStatus, deleteFaq } = require('../controllers/faqController');

const router = express.Router();

router.post("/faqs" , createFaq)
router.get("/faqs" , getFaqs)
router.get("/faqs/:id" , getFaqById)
router.put("/faqs/:id" , updateFaq)
router.delete("/faqs/:id" , deleteFaq)
// router.put("/faq/:id" , toggleFaqStatus)


module.exports = router