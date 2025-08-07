const express = require("express");
const { createRefundPolicy, updateRefundPolicy, getRefundPolicy, deleteRefundPolicy } = require("../controllers/refundPolicyController");

const router =  express.Router();

router.post("/refund-policy" , createRefundPolicy)
router.put("/refund-policy/:id" , updateRefundPolicy)
router.get("/refund-policy" , getRefundPolicy)
router.delete("/refund-policy/:id" , deleteRefundPolicy)

module.exports = router