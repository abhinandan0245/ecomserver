const { Refund, Transaction } = require('../models');
const { Op } = require('sequelize');

// Create refund
exports.createRefund = async (req, res) => {
  try {
    const refund = await Refund.create(req.body);
    res.status(201).json({ message: "Refund created", data: refund });
  } catch (error) {
    res.status(500).json({ message: "Failed to create refund", error: error.message });
  }
};

// Get all refunds with filters
exports.getAllRefunds = async (req, res) => {
  try {
    const { reason, status, startDate, endDate } = req.query;
    const where = {};

    if (reason) {
      where.reason = { [Op.iLike]: `%${reason}%` }; // PostgreSQL iLike for case-insensitive search
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) where.date[Op.lte] = new Date(endDate);
    }

    const refunds = await Refund.findAll({
      where,
      include: {
        model: Transaction,
        as: 'transaction',
        attributes: ['id', 'orderId', 'customerName', 'paymentMethod', 'date', 'amount', 'status'],
      },
      order: [['createdAt', 'DESC']],
    });

    const formatted = refunds.map((refund) => ({
      refundId: refund.id,
      customerName: refund.transaction?.customerName || "Unknown",
      transactionId: refund.transaction?.id || null,
      orderId: refund.transaction?.orderId || "N/A",
      reason: refund.reason,
      date: refund.date,
      amount: refund.amount,
      status: refund.status,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching refunds", error: error.message });
  }
};

// Get refund by ID
exports.getRefundById = async (req, res) => {
  try {
    const refund = await Refund.findByPk(req.params.id, {
      include: {
        model: Transaction,
        as: 'transaction',
        attributes: ['id', 'orderId', 'customerName', 'paymentMethod', 'date', 'amount', 'status'],
      }
    });

    if (!refund) return res.status(404).json({ message: "Refund not found" });

    const response = {
      refundId: refund.id,
      customerName: refund.transaction?.customerName || "Unknown",
      transactionId: refund.transaction?.id || null,
      orderId: refund.transaction?.orderId || "N/A",
      reason: refund.reason,
      date: refund.date,
      amount: refund.amount,
      status: refund.status,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching refund", error: error.message });
  }
};

// Update refund
exports.updateRefund = async (req, res) => {
  try {
    const [updatedCount, updatedRows] = await Refund.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    if (updatedCount === 0) return res.status(404).json({ message: "Refund not found" });

    res.status(200).json({ message: "Refund updated", data: updatedRows[0] });
  } catch (error) {
    res.status(500).json({ message: "Failed to update refund", error: error.message });
  }
};

// Delete refund
exports.deleteRefund = async (req, res) => {
  try {
    const deleted = await Refund.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: "Refund not found" });

    res.status(200).json({ message: "Refund deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete refund", error: error.message });
  }
};
