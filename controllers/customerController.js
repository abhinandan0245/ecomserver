const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Register
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await Customer.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = await Customer.create({ name, email, password: hashedPassword, mobile });

    res.status(201).json({ message: 'Customer registered successfully', customerId: newCustomer.id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ where: { email } });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: customer.id, role: 'customer' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login successful',
      token,
      customer: { id: customer.id, name: customer.name, email: customer.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: 'Profile fetched successfully', data: customer });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Profile
// exports.updateProfile = async (req, res) => {
//   try {
//     const updateData = { ...req.body };
//     delete updateData.password;

//     const [updated] = await Customer.update(updateData, {
//       where: { id: req.userId }
//     });

//     if (!updated) return res.status(404).json({ message: 'Customer not found or no changes made' });

//     res.json({ message: 'Profile updated successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };




exports.updateProfile = async (req, res) => {
  try {
    const user = await Customer.findByPk(req.userId);

    if (!user) return res.status(404).json({ message: 'Customer not found' });

    // Password change logic
    const { password, newpassword, confirmPassword, ...otherFields } = req.body;

    if (password || newpassword || confirmPassword) {
      if (!password || !newpassword || !confirmPassword) {
        return res.status(400).json({ message: 'All password fields are required' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      if (newpassword !== confirmPassword) {
        return res.status(400).json({ message: 'New passwords do not match' });
      }

      const hashed = await bcrypt.hash(newpassword, 10);
      user.password = hashed;
    }

    // Update other fields
    Object.assign(user, otherFields);
    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Delete Profile
exports.deleteProfile = async (req, res) => {
  try {
    const deleted = await Customer.destroy({ where: { id: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get One Customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    res.json({ message: 'Customer fetched successfully', customer });
  } catch (err) {
    res.status(500).json({ message: 'Fetch error', error: err.message });
  }
};

// Get All Customers (admin)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    res.json({ message: 'Customers fetched successfully', customers });
  } catch (err) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// UPLOAD PROFILE IMAGE (Customer)
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const customer = await Customer.findByPk(req.userId);
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });

    await customer.update({ profileImage: imagePath });

    res.status(200).json({
      msg: 'Profile image updated successfully',
      imageUrl: imagePath,
    });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to upload image', error: error.message });
  }
};

// Admin deletes a customer by ID
exports.deleteCustomerByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.destroy(); // or soft-delete if you prefer
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete customer', error: error.message });
  }
};





exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Customer.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.upsert({ email, code: otp, expiresAt });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

