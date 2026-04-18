const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JournalistProfile = require('../models/JournalistProfile');
const AppError = require('../utils/AppError');
const { sendTokenResponse, signAccessToken, signRefreshToken } = require('../utils/jwtHelpers');

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const allowedRoles = ['reader', 'journalist'];
    const userRole = allowedRoles.includes(role) ? role : 'reader';

    const existing = await User.findOne({ email });
    if (existing) return next(new AppError('Email already registered', 400));

    const user = await User.create({ name, email, password, role: userRole });

    if (userRole === 'journalist') {
      await JournalistProfile.create({ user: user._id });
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Email and password are required', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isActive) {
      return next(new AppError('Invalid credentials', 401));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new AppError('Invalid credentials', 401));

    const refreshToken = signRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new AppError('Refresh token required', 400));

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return next(new AppError('Invalid refresh token', 401));
    }

    const newAccessToken = signAccessToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Refresh token expired, please login again', 401));
    }
    next(err);
  }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    if (user.role === 'journalist') {
      profile = await JournalistProfile.findOne({ user: user._id });
    }
    res.json({ success: true, user, profile });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/update-profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    if (req.user.role === 'journalist') {
      const { specialty, socialLinks } = req.body;
      const profileUpdates = {};
      if (specialty !== undefined) profileUpdates.specialty = specialty;
      if (socialLinks !== undefined) profileUpdates.socialLinks = socialLinks;
      if (Object.keys(profileUpdates).length) {
        await JournalistProfile.findOneAndUpdate({ user: req.user._id }, profileUpdates, {
          new: true,
          runValidators: true,
        });
      }
    }

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return next(new AppError('Current password is incorrect', 400));

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
