const ReturnRequest = require('../models/return'); // Sequelize model

// Get all return/refund requests
exports.getAllReturns = async (req, res) => {
  try {
    const { status, from, to } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (from && to) {
      filter.requestedDate = {
        [Op.between]: [new Date(from), new Date(to)],
      };
    }

    const returns = await ReturnRequest.findAll({
      where: filter,
      order: [['requestedDate', 'DESC']],
    });

    res.status(200).json({ success: true, data: returns });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch return requests',
      error: error.message,
    });
  }
};

// Create a new return request
exports.createReturnRequest = async (req, res) => {
  try {
    const newRequest = await ReturnRequest.create(req.body);
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Return request creation failed', error: error.message });
  }
};

// Update return status (approve/reject/refund)
exports.updateReturnStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const [updatedCount, updatedRows] = await ReturnRequest.update(
      { status },
      {
        where: { id },
        returning: true,
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ success: false, message: 'Return request not found' });
    }

    res.status(200).json({ success: true, data: updatedRows[0] });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Failed to update status', error: error.message });
  }
};

// Approve return
exports.approveReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const returnRequest = await ReturnRequest.findByPk(id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    returnRequest.status = 'Approved';
    await returnRequest.save();

    res.status(200).json({ message: 'Return request approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve return', error: error.message });
  }
};

// Reject return
exports.rejectReturn = async (req, res) => {
  try {
    const { id } = req.params;

    const returnRequest = await ReturnRequest.findByPk(id);
    if (!returnRequest) {
      return res.status(404).json({ message: 'Return request not found' });
    }

    returnRequest.status = 'Rejected';
    await returnRequest.save();

    res.status(200).json({ message: 'Return request rejected successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject return', error: error.message });
  }
};
