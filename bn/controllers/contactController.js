const Subscriber = require('../models/Subscriber');
const AppError = require('../utils/AppError');

// POST /api/contact/subscribe
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError('Email is required', 400));

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      if (existing.isActive) return next(new AppError('Email already subscribed', 400));
      existing.isActive = true;
      await existing.save();
      return res.json({ success: true, message: 'Successfully re-subscribed!' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter!' });
  } catch (err) {
    next(err);
  }
};

// POST /api/contact/unsubscribe
exports.unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(new AppError('Email is required', 400));

    const subscriber = await Subscriber.findOne({ email });
    if (!subscriber || !subscriber.isActive) {
      return next(new AppError('Email not found in subscriber list', 404));
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.json({ success: true, message: 'Successfully unsubscribed' });
  } catch (err) {
    next(err);
  }
};

// POST /api/contact/advertise
exports.advertiseInquiry = async (req, res, next) => {
  try {
    const { name, company, email, message, budget } = req.body;

    if (!name || !email || !message) {
      return next(new AppError('Name, email, and message are required', 400));
    }

    // In production: send email via nodemailer / SendGrid
    console.log('Advertise inquiry received:', { name, company, email, message, budget });

    res.status(201).json({
      success: true,
      message: 'Your advertising inquiry has been received. We will contact you within 24 hours.',
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/contact/careers
exports.careersNotify = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    if (!email) return next(new AppError('Email is required', 400));

    // Reuse subscriber model with a tag in production
    console.log('Career notification signup:', { email, name });

    res.status(201).json({
      success: true,
      message: "You'll be notified about new job openings at WorldNewsNow!",
    });
  } catch (err) {
    next(err);
  }
};
