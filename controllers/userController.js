// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { Op } = require('sequelize');

// // SIGNUP
// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const userExists = await User.findOne({ where: { email } });
//     if (userExists) return res.status(400).json({ msg: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'user'
//     });

//     const token = jwt.sign(
//       { id: newUser.id, role: newUser.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' }
//     );

//     res.status(201).json({ msg: "User registered successfully", user: newUser, token });
//   } catch (error) {
//     res.status(500).json({ msg: "Signup failed", error: error.message });
//   }
// };

// // LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) return res.status(400).json({ msg: "Email and password are required" });

//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(404).json({ msg: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

//    const token = jwt.sign(
//   { id: user.id, role: user.role }, // 🔥 Use actual role from DB
//   process.env.JWT_SECRET,
//   { expiresIn: '7d' }
// );


//     res.status(200).json({ msg: "Login successful", token, user });
//   } catch (error) {
//     res.status(500).json({ msg: "Login failed", error: error.message });
//   }
// };

// // GET PROFILE
// exports.getProfile = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.userId, {
//       attributes: { exclude: ['password'] }
//     });

//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     res.json({ user });
//   } catch (error) {
//     res.status(500).json({ msg: 'Failed to get profile', error: error.message });
//   }
// };

// // UPDATE PROFILE
// exports.updateProfile = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const allowedFields = [
//       'name', 'email', 'profileImage', 'mobile',
//       'billingAddress', 'shippingAddress', 'city', 'state',
//       'country', 'pinCode', 'companyName', 'businessEmail',
//       'businessType', 'taxId', 'pushNotification'
//     ];

//     const updates = {};
//     allowedFields.forEach(field => {
//       if (req.body[field] !== undefined) {
//         updates[field] = req.body[field];
//       }
//     });

//     await user.update(updates);

//     const updatedUser = await User.findByPk(req.userId, {
//       attributes: { exclude: ['password'] }
//     });

//     res.status(200).json({ user: updatedUser, message: 'Profile updated successfully' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Failed to update profile', error: error.message });
//   }
// };

// // CHANGE PASSWORD
// exports.changePassword = async (req, res) => {
//   const { currentPassword, newPassword, confirmPassword } = req.body;

//   try {
//     if (!currentPassword || !newPassword || !confirmPassword) {
//       return res.status(400).json({ msg: 'All password fields are required' });
//     }

//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ msg: 'New password and confirm password do not match' });
//     }

//     const user = await User.findByPk(req.userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) return res.status(400).json({ msg: 'Invalid current password' });

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;

//     await user.save();

//     res.json({ msg: 'Password updated successfully' });
//   } catch (err) {
//     res.status(500).json({ msg: 'Failed to change password', error: err.message });
//   }
// };

// // UPLOAD PROFILE IMAGE
// exports.uploadProfileImage = async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

//     const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

//     const user = await User.findByPk(req.userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     await user.update({ profileImage: imagePath });

//     const updatedUser = await User.findByPk(req.userId, {
//       attributes: { exclude: ['password'] }
//     });

//     res.json({ user: updatedUser });
//   } catch (error) {
//     res.status(500).json({ msg: 'Server error', error: error.message });
//   }
// };

// // DELETE ACCOUNT
// exports.deleteAccount = async (req, res) => {
//   try {
//     const user = await User.findByPk(req.userId);
//     if (!user) return res.status(404).json({ msg: 'User not found' });

//     await user.destroy();
//     res.json({ msg: 'Account deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ msg: 'Failed to delete account', error: error.message });
//   }
// };


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP (For single admin only – call once or disable after first use)
exports.signup = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ msg: 'Admin already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
    });

   const token = jwt.sign(
  { id: newUser.id, role: 'admin' }, // hardcoded
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);


    res.status(201).json({ msg: 'Admin registered successfully', token, user: newUser });
  } catch (error) {
    res.status(500).json({ msg: 'Signup failed', error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ msg: 'Email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ msg: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id , role: 'admin'},
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ msg: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ msg: 'Login failed', error: error.message });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) return res.status(404).json({ msg: 'Admin not found' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to get profile', error: error.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: 'Admin not found' });

    const allowedFields = ['name', 'email', 'mobile', 'profileImage'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    await user.update(updates);

    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });

    res.status(200).json({ user: updatedUser, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to update profile', error: error.message });
  }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'All password fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'New password and confirm password do not match' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: 'Admin not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid current password' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to change password', error: err.message });
  }
};

// UPLOAD PROFILE IMAGE (Make sure multer is configured)
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: 'Admin not found' });

    await user.update({ profileImage: imagePath });

    const updatedUser = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// DELETE ACCOUNT
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ msg: 'Admin not found' });

    await user.destroy();
    res.json({ msg: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Failed to delete account', error: error.message });
  }
};
