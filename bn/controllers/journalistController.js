const User = require('../models/User');
const JournalistProfile = require('../models/JournalistProfile');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');

// GET /api/journalists
exports.getJournalists = async (req, res, next) => {
  try {
    const profiles = await JournalistProfile.find({ isActive: true })
      .populate('user', 'name email avatar bio role')
      .populate('articleCount')
      .lean({ virtuals: true });

    res.json({ success: true, data: profiles, total: profiles.length });
  } catch (err) {
    next(err);
  }
};

// GET /api/journalists/:id
exports.getJournalist = async (req, res, next) => {
  try {
    const profile = await JournalistProfile.findOne({ user: req.params.id, isActive: true })
      .populate('user', 'name email avatar bio role')
      .populate('articleCount')
      .lean({ virtuals: true });

    if (!profile) return next(new AppError('Journalist not found', 404));

    const articles = await Article.find({ author: req.params.id, isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean({ virtuals: true });

    res.json({ success: true, data: { profile, articles } });
  } catch (err) {
    next(err);
  }
};

// GET /api/journalists/dashboard — journalist's own dashboard stats
exports.getDashboard = async (req, res, next) => {
  try {
    if (!['journalist', 'admin'].includes(req.user.role)) {
      return next(new AppError('Access denied', 403));
    }

    const [publishedCount, draftCount, allArticles] = await Promise.all([
      Article.countDocuments({ author: req.user._id, isPublished: true }),
      Article.countDocuments({ author: req.user._id, isDraft: true }),
      Article.find({ author: req.user._id })
        .sort({ createdAt: -1 })
        .lean({ virtuals: true }),
    ]);

    const articleIds = allArticles.map((a) => a._id);
    const totalLikes = allArticles.reduce((sum, a) => sum + (a.likes ? a.likes.length : 0), 0);
    const totalViews = allArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0);
    const totalComments = await Comment.countDocuments({ article: { $in: articleIds } });

    const profile = await JournalistProfile.findOne({ user: req.user._id });

    res.json({
      success: true,
      data: {
        stats: { publishedCount, draftCount, totalLikes, totalViews, totalComments },
        articles: allArticles,
        profile,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/journalists/profile — update own journalist profile
exports.updateJournalistProfile = async (req, res, next) => {
  try {
    const { specialty, bio, socialLinks } = req.body;
    const updates = {};
    if (specialty !== undefined) updates.specialty = specialty;
    if (bio !== undefined) updates.bio = bio;
    if (socialLinks !== undefined) updates.socialLinks = socialLinks;

    const profile = await JournalistProfile.findOneAndUpdate(
      { user: req.user._id },
      updates,
      { new: true, runValidators: true, upsert: true }
    ).populate('user', 'name role avatar');

    res.json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};
