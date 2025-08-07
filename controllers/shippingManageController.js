const ShippingModel = require('../models/ShippingModel');
const { Op } = require('sequelize');

// Create Shipping Zone
exports.createZone = async (req, res) => {
  try {
    const { zoneName, country, state, type, methodName, estimatedDate, price } = req.body;

    if (!zoneName || !country || !state || !type || !methodName || !estimatedDate || price === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newZone = await ShippingModel.create({
      zoneName,
      country,
      state,
      type,
      methodName,
      estimatedDate,
      price
    });

    res.status(201).json({ message: "Shipping zone created successfully", data: newZone });
  } catch (error) {
    res.status(500).json({ message: "Error creating shipping zone", error: error.message });
  }
};

// Get All Shipping Zones
exports.getAllZones = async (req, res) => {
  try {
    const zones = await ShippingModel.findAll();
    res.status(200).json({ message: "Shipping zones retrieved successfully", data: zones });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zones", error: error.message });
  }
};

// Update Shipping Zone By ID
exports.updateZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { zoneName, country, state, type, methodName, estimatedDate, price } = req.body;

    if (!zoneName || !country || !state || !type || !methodName || !estimatedDate || price === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [updatedRowsCount, updatedRows] = await ShippingModel.update({
      zoneName,
      country,
      state,
      type,
      methodName,
      estimatedDate,
      price
    }, {
      where: { id },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Shipping zone not found" });
    }

    res.status(200).json({ message: "Shipping zone updated successfully", data: updatedRows[0] });
  } catch (error) {
    res.status(500).json({ message: "Error updating shipping zone", error: error.message });
  }
};

// Delete Shipping Zone By ID
exports.deleteZone = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRowsCount = await ShippingModel.destroy({ where: { id } });

    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: "Shipping zone not found" });
    }

    res.status(200).json({ message: "Shipping zone deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting shipping zone", error: error.message });
  }
};

// Get Shipping Zone By ID
exports.getZoneById = async (req, res) => {
  try {
    const { id } = req.params;
    const zone = await ShippingModel.findByPk(id);

    if (!zone) {
      return res.status(404).json({ message: "Shipping zone not found" });
    }

    res.status(200).json({ message: "Shipping zone retrieved successfully", data: zone });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zone", error: error.message });
  }
};

// Get Zones By Country
exports.getZonesByCountry = async (req, res) => {
  try {
    const { country } = req.query;
    if (!country) return res.status(400).json({ message: "Country is required" });

    const zones = await ShippingModel.findAll({ where: { country } });

    if (zones.length === 0) return res.status(404).json({ message: "No shipping zones found for this country" });

    res.status(200).json({ message: "Shipping zones retrieved successfully", data: zones });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zones", error: error.message });
  }
};

// Get Zones By State
exports.getZonesByState = async (req, res) => {
  try {
    const { state } = req.query;
    if (!state) return res.status(400).json({ message: "State is required" });

    const zones = await ShippingModel.findAll({ where: { state } });

    if (zones.length === 0) return res.status(404).json({ message: "No shipping zones found for this state" });

    res.status(200).json({ message: "Shipping zones retrieved successfully", data: zones });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zones", error: error.message });
  }
};

// Get Zones By Type
exports.getZonesByType = async (req, res) => {
  try {
    const { type } = req.query;
    if (!type) return res.status(400).json({ message: "Type is required" });

    const zones = await ShippingModel.findAll({ where: { type } });

    if (zones.length === 0) return res.status(404).json({ message: "No shipping zones found for this type" });

    res.status(200).json({ message: "Shipping zones retrieved successfully", data: zones });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zones", error: error.message });
  }
};

// Get Zones By Method Name
exports.getZonesByMethodName = async (req, res) => {
  try {
    const { methodName } = req.query;
    if (!methodName) return res.status(400).json({ message: "Method name is required" });

    const zones = await ShippingModel.findAll({ where: { methodName } });

    if (zones.length === 0) return res.status(404).json({ message: "No shipping zones found for this method name" });

    res.status(200).json({ message: "Shipping zones retrieved successfully", data: zones });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zones", error: error.message });
  }
};

// Get Zones By Estimated Date
exports.getZonesByEstimatedDate = async (req, res) => {
  try {
    const { estimatedDate } = req.query;
    if (!estimatedDate) return res.status(400).json({ message: "Estimated date is required" });

    const date = new Date(estimatedDate);

    const zones = await ShippingModel.findAll({ where: { estimatedDate: date } });

    if (zones.length === 0) return res.status(404).json({ message: "No shipping zones found for this estimated date" });

    res.status(200).json({ message: "Shipping zones retrieved successfully", data: zones });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zones", error: error.message });
  }
};

// Get Zones By Price (less than or equal to)
exports.getZonesByPrice = async (req, res) => {
  try {
    const { price } = req.query;
    if (price === undefined) return res.status(400).json({ message: "Price is required" });

    const zones = await ShippingModel.findAll({
      where: {
        price: {
          [Op.lte]: parseFloat(price)
        }
      }
    });

    if (zones.length === 0) return res.status(404).json({ message: "No shipping zones found for this price" });

    res.status(200).json({ message: "Shipping zones retrieved successfully", data: zones });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zones", error: error.message });
  }
};

// Get Zone By ZoneName (exact match)
exports.getZoneByZoneName = async (req, res) => {
  try {
    const { zoneName } = req.query;
    if (!zoneName) return res.status(400).json({ message: "Zone name is required" });

    const zone = await ShippingModel.findOne({ where: { zoneName } });

    if (!zone) return res.status(404).json({ message: "Shipping zone not found" });

    res.status(200).json({ message: "Shipping zone retrieved successfully", data: zone });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving shipping zone", error: error.message });
  }
};

// Search Shipping Zones (partial, case-insensitive)
exports.searchShippingZones = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const regex = { [Op.iLike]: `%${query}%` }; // for PostgreSQL. For MySQL, use Op.like and LOWER()

    const zones = await ShippingModel.findAll({
      where: {
        [Op.or]: [
          { zoneName: regex },
          { country: regex },
          { state: regex },
          { type: regex },
          { methodName: regex },
        ],
      },
    });

    if (zones.length === 0) return res.status(404).json({ message: "No shipping zones found matching the search criteria" });

    res.status(200).json({ message: "Shipping zones retrieved successfully", data: zones });
  } catch (error) {
    res.status(500).json({ message: "Error searching shipping zones", error: error.message });
  }
};
