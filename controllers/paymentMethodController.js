const { PaymentMethod } = require('../models');
const { Op } = require('sequelize');

// Create
exports.createPaymentMethod = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await PaymentMethod.findOne({ where: { name } });
    if (existing) return res.status(400).json({ message: 'Payment method already exists' });

    const method = await PaymentMethod.create({ name });
    res.status(201).json({ message: 'Created', method });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create', error: err.message });
  }
};

// Get All
exports.getAllPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ methods });
  } catch (err) {
    res.status(500).json({ message: 'Failed to get', error: err.message });
  }
};

// Edit
exports.updatePaymentMethod = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const method = await PaymentMethod.findByPk(id);
    if (!method) return res.status(404).json({ message: 'Payment method not found' });

    method.name = name;
    await method.save();

    res.json({ message: 'Updated', method });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update', error: err.message });
  }
};

// Toggle Status (Active <-> Disable)
exports.togglePaymentMethodStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const method = await PaymentMethod.findByPk(id);

    if (!method) return res.status(404).json({ message: 'Not found' });

    method.status = method.status === 'Active' ? 'Disable' : 'Active';
    await method.save();

    res.json({ message: 'Status toggled', status: method.status });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle status', error: err.message });
  }
};

// Delete
exports.deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PaymentMethod.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Payment method not found' });

    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};
