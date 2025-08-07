const Transaction = require("../models/Transaction");
const { Op } = require("sequelize");

exports.getAllTransactions = async (req, res) => {
  try {
    const { paymentMethod, status, startDate, endDate } = req.query;
    const where = {};
    if (paymentMethod) where.paymentMethod = paymentMethod;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.date = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['date', 'DESC']],
    });

    res.status(200).json({ total: transactions.length, transactions });
  } catch (err) {
    res.status(500).json({ message: "Failed to get transactions", error: err.message });
  }
};

exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.status(200).json(transaction);
  } catch (err) {
    res.status(500).json({ message: "Failed to get transaction", error: err.message });
  }
};



