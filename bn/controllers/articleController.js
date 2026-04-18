const Article = require('../models/Article');
const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');

const PAGE_SIZE = 12;

// GET /api/articles
exports.getArticles = async (req, res, next) => {
  try {
    const { category, page = 1, limit = PAGE_SIZE, search, featured, breaking } = req.query;

    const filter = { isPublished: true, isDraft: false };
    if (category && category !== 'ALL') filter.category = category.toUpperCase();
    if (featured === 'true') filter.featured = true;
    if (breaking === 'true') filter.breaking = true;
    if (search) filter.$text = { $search: search };

    const skip = (Number(page) - 1) * Number(limit);

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('author', 'name role avatar')
        .populate('commentsCount')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean({ virtuals: true }),
      Article.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/articles/:id
exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name role avatar bio')
      .lean({ virtuals: true });

    if (!article) return next(new AppError('Article not found', 404));
    if (!article.isPublished && (!req.user || (req.user._id.toString() !== article.author._id.toString() && req.user.role !== 'admin'))) {
      return next(new AppError('Article not found', 404));
    }

    await Article.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    const comments = await Comment.find({ article: req.params.id, parent: null, isDeleted: false })
      .populate('author', 'name role avatar')
      .populate({
        path: 'replies',
        match: { isDeleted: false },
        populate: { path: 'author', select: 'name role avatar' },
        options: { sort: { createdAt: 1 } },
      })
      .sort({ createdAt: -1 })
      .lean({ virtuals: true });

    res.json({ success: true, data: { article, comments } });
  } catch (err) {
    next(err);
  }
};

// POST /api/articles
exports.createArticle = async (req, res, next) => {
  try {
    const { title, excerpt, content, category, isHtml, coverImage, tags, breaking, featured } = req.body;

    const article = await Article.create({
      title,
      excerpt,
      content,
      category: category.toUpperCase(),
      isHtml: isHtml || false,
      coverImage: coverImage || '',
      tags: tags || [],
      breaking: breaking || false,
      featured: featured || false,
      author: req.user._id,
      isDraft: true,
      isPublished: false,
    });

    res.status(201).json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/articles/:id
exports.updateArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next(new AppError('Article not found', 404));

    const isOwner = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return next(new AppError('Not authorized to update this article', 403));

    const allowed = ['title', 'excerpt', 'content', 'category', 'isHtml', 'coverImage', 'tags', 'breaking', 'featured'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) article[field] = req.body[field];
    });
    if (req.body.category) article.category = req.body.category.toUpperCase();

    await article.save();
    res.json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/articles/:id
exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next(new AppError('Article not found', 404));

    const isOwner = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return next(new AppError('Not authorized to delete this article', 403));

    await Comment.deleteMany({ article: article._id });
    await article.deleteOne();

    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/articles/:id/publish
exports.publishArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next(new AppError('Article not found', 404));

    const isOwner = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return next(new AppError('Not authorized', 403));

    article.isDraft = false;
    article.isPublished = true;
    article.publishedAt = article.publishedAt || new Date();
    await article.save();

    res.json({ success: true, data: article, message: 'Article published successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/articles/:id/unpublish
exports.unpublishArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next(new AppError('Article not found', 404));

    const isOwner = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return next(new AppError('Not authorized', 403));

    article.isDraft = true;
    article.isPublished = false;
    await article.save();

    res.json({ success: true, data: article, message: 'Article unpublished' });
  } catch (err) {
    next(err);
  }
};

// POST /api/articles/:id/like
exports.likeArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return next(new AppError('Article not found', 404));

    const userId = req.user._id;
    const alreadyLiked = article.likes.some((id) => id.toString() === userId.toString());

    if (alreadyLiked) {
      article.likes = article.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      article.likes.push(userId);
    }

    await article.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: article.likes.length,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/articles/journalist/:userId  — journalist's own articles
exports.getJournalistArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = { author: req.params.userId };

    if (status === 'published') { filter.isPublished = true; filter.isDraft = false; }
    else if (status === 'draft') { filter.isDraft = true; }

    const skip = (Number(page) - 1) * Number(limit);

    const [articles, total] = await Promise.all([
      Article.find(filter)
        .populate('author', 'name role avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean({ virtuals: true }),
      Article.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    next(err);
  }
};
