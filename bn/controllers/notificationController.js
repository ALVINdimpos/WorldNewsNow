const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

// GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [notifications, total, unread] = await Promise.all([
      Notification.find({ user: req.user._id })
        .populate('actor', 'name role avatar')
        .populate('relatedArticle', 'title slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Notification.countDocuments({ user: req.user._id }),
      Notification.countDocuments({ user: req.user._id, read: false }),
    ]);

    res.json({
      success: true,
      data: notifications,
      unread,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/:id/read
exports.markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notification) return next(new AppError('Notification not found', 404));

    notification.read = true;
    await notification.save();

    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/notifications/read-all
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notifications/:id
exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};
