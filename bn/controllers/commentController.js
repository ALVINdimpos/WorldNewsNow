const Comment = require('../models/Comment');
const Article = require('../models/Article');
const AppError = require('../utils/AppError');

// GET /api/comments?articleId=xxx
exports.getComments = async (req, res, next) => {
  try {
    const { articleId } = req.query;
    if (!articleId) return next(new AppError('articleId is required', 400));

    const comments = await Comment.find({ article: articleId, parent: null, isDeleted: false })
      .populate('author', 'name role avatar')
      .populate({
        path: 'replies',
        match: { isDeleted: false },
        populate: { path: 'author', select: 'name role avatar' },
        options: { sort: { createdAt: 1 } },
      })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    res.json({ success: true, data: comments, total: comments.length });
  } catch (err) {
    next(err);
  }
};

// POST /api/comments
exports.createComment = async (req, res, next) => {
  try {
    const { text, articleId, parentId } = req.body;

    const article = await Article.findById(articleId);
    if (!article || !article.isPublished) return next(new AppError('Article not found', 404));

    if (parentId) {
      const parent = await Comment.findById(parentId);
      if (!parent || parent.isDeleted) return next(new AppError('Parent comment not found', 404));
    }

    const comment = await Comment.create({
      text,
      author: req.user._id,
      article: articleId,
      parent: parentId || null,
    });

    await comment.populate('author', 'name role avatar');

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

    const isOwner = comment.author.toString() === req.user._id.toString();
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

    const isOwner = comment.author.toString() === req.user._id.toString();
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
