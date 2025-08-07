const TermConditions = require('../models/TermConditions');

// CREATE
exports.createTermConditions = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required!" });
    }

    const newTermConditions = await TermConditions.create({ content });
    res.status(201).json({ message: "Term and Conditions created successfully", data: newTermConditions });
  } catch (error) {
    res.status(500).json({ message: "Error creating Term and Conditions", error: error.message });
  }
};

// UPDATE
exports.updateTermConditions = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required!" });
    }

    const termConditions = await TermConditions.findByPk(id);
    if (!termConditions) {
      return res.status(404).json({ message: "Term and Conditions not found!" });
    }

    termConditions.content = content;
    await termConditions.save();

    res.status(200).json({ message: "Term and Conditions updated successfully!", data: termConditions });
  } catch (error) {
    res.status(500).json({ message: "Error updating Term and Conditions", error: error.message });
  }
};

// GET ALL
exports.getTermConditions = async (req, res) => {
  try {
    const termConditions = await TermConditions.findAll();
    if (!termConditions || termConditions.length === 0) {
      return res.status(404).json({ message: "Term and Conditions not found!" });
    }
    res.status(200).json({ message: "Term and Conditions fetched successfully", data: termConditions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching Term and Conditions", error: error.message });
  }
};

// DELETE
exports.deleteTermConditions = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await TermConditions.destroy({ where: { id } });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Term and Conditions not found!" });
    }

    res.status(200).json({ message: "Term and Conditions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Term and Conditions", error: error.message });
  }
};
