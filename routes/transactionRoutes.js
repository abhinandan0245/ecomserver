const express = require('express');
const router = express.Router();
const { getAllTransactions, getTransactionById, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const { authAdmin } = require('../middleware/authMiddleware');


// Create a new transaction
router.get('/transactions', authAdmin, getAllTransactions); // Get all transactions
router.get('/transactions/:id', authAdmin, getTransactionById); // Get transaction by ID


module.exports = router;
