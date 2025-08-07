const express = require('express');
const {  updatePrivacyPolicy, getPrivacyPolicy, deletePrivacyPolicy, createPrivacyPolicy } = require('../controllers/privacyPolicyController');

const router = express.Router();

router.post('/privacy-policy' , createPrivacyPolicy)
router.put('/privacy-policy/:id' , updatePrivacyPolicy)
router.get('/privacy-policy' , getPrivacyPolicy)
router.delete('/privacy-policy/:id' , deletePrivacyPolicy)


module.exports = router;