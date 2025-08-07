const express = require('express');
const { getAllReturns, createReturnRequest, updateReturnStatus, approveReturn, rejectReturn } = require('../controllers/returnController');
const router = express.Router();

//  Get All
router.get('/returns', getAllReturns);
//  Filter by Status
// router.get('/returns?status=Approved', getAllReturns);
//  Filter by Date Range
// router.get('/returns?from=2025-06-01&to=2025-06-10', getAllReturns);
//  Filter by Status + Date Range
// router.get('/returns?status=Pending&from=2025-06-01&to=2025-06-10', getAllReturns);
router.post('/returns', createReturnRequest);
router.put('/returns/:id/status', updateReturnStatus);

// Approve
router.patch('/returns/:id/approve', approveReturn);

// Reject
router.patch('/returns/:id/reject', rejectReturn);

module.exports = router;
