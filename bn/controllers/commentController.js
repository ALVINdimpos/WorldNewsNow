const Comment = require('../models/Comment');
const Article = require('../models/Article');
const Notification = require('../models/Notification');
const Report = require('../models/Report');
const AppError = require('../utils/AppError');

const COMMENT_PAGE_SIZE = 10;

// GET /api/comments?articleId=xxx&page=1&limit=10
exports.getComments = async (req, res, next) => {
  try {
    const { articleId, page = 1, limit = COMMENT_PAGE_SIZE } = req.query;
    if (!articleId) return next(new AppError('articleId is required', 400));

    const skip = (Number(page) - 1) * Number(limit);

    const [comments, total] = await Promise.all([
      Comment.find({ article: articleId, parent: null, isDeleted: false, isHidden: false })
        .populate('author', 'name role avatar')
        .populate({
          path: 'replies',
          match: { isDeleted: false, isHidden: false },
          populate: { path: 'author', select: 'name role avatar' },
          options: { sort: { createdAt: 1 } },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean({ virtuals: true }),
      Comment.countDocuments({ article: articleId, parent: null, isDeleted: false, isHidden: false }),
    ]);

    res.json({
      success: true,
      data: comments,
      total,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        hasMore: skip + comments.length < total,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/comments
exports.createComment = async (req, res, next) => {
  try {
    const { text, articleId, parentId, anonymous } = req.body;

    const article = await Article.findById(articleId);
    if (!article || !article.isPublished) return next(new AppError('Article not found', 404));

    let parentComment = null;
    if (parentId) {
      parentComment = await Comment.findById(parentId).populate('author', '_id');
      if (!parentComment || parentComment.isDeleted) return next(new AppError('Parent comment not found', 404));
    }

    const isAnonymous = anonymous === true || anonymous === 'true';
    if (!req.user && !isAnonymous) {
      return next(new AppError('Login required to post as a user', 401));
    }

    const comment = await Comment.create({
      text,
      author: isAnonymous ? null : req.user._id,
      isAnonymous: Boolean(isAnonymous),
      article: articleId,
      parent: parentId || null,
    });

    if (comment.author) {
      await comment.populate('author', 'name role avatar');
    }

    // Notify parent comment author on reply
    if (parentComment && parentComment.author && req.user) {
      const parentAuthorId = parentComment.author._id.toString();
      if (parentAuthorId !== req.user._id.toString()) {
        await Notification.create({
          user: parentAuthorId,
          type: 'comment_reply',
          title: 'New reply to your comment',
          message: `${req.user.name} replied: "${text.slice(0, 80)}${text.length > 80 ? '…' : ''}"`,
          relatedArticle: articleId,
          relatedComment: comment._id,
          actor: req.user._id,
        });
      }
    }

    res.status(201).json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/comments/:id
exports.updateComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.isDeleted) return next(new AppError('Comment not found', 404));

    const isOwner = comment.author && comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return next(new AppError('Not authorized', 403));

    comment.text = req.body.text || comment.text;
    await comment.save();

    await comment.populate('author', 'name role avatar');
    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.isDeleted) return next(new AppError('Comment not found', 404));

    const isOwner = comment.author && comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return next(new AppError('Not authorized', 403));

    comment.isDeleted = true;
    comment.text = '[deleted]';
    await comment.save();

    res.json({ success: true, message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/comments/:id/like
exports.likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.isDeleted) return next(new AppError('Comment not found', 404));

    const userId = req.user._id;
    const alreadyLiked = comment.likes.some((id) => id.toString() === userId.toString());

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({ success: true, liked: !alreadyLiked, likesCount: comment.likes.length });
  } catch (err) {
    next(err);
  }
};

// POST /api/comments/:id/report
exports.reportComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.isDeleted) return next(new AppError('Comment not found', 404));

    const { reason, details } = req.body;
    const validReasons = ['spam', 'harassment', 'misinformation', 'hate_speech', 'other'];
    if (!validReasons.includes(reason)) {
      return next(new AppError('Invalid reason', 400));
    }

    await Report.create({
      targetType: 'comment',
      targetId: comment._id,
      reportedBy: req.user?._id || null,
      reason,
      details: details || '',
    });

    await Comment.findByIdAndUpdate(req.params.id, { $inc: { reportCount: 1 } });

    res.json({ success: true, message: 'Report submitted. Our team will review it.' });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/comments/:id/hide  — admin only
exports.hideComment = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') return next(new AppError('Admin only', 403));

    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { isHidden: req.body.hide !== false },
      { new: true }
    );
    if (!comment) return next(new AppError('Comment not found', 404));

    res.json({ success: true, data: comment });
  } catch (err) {
    next(err);
  }
};
