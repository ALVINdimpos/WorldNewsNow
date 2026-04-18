const mongoose = require('mongoose');

const CATEGORIES = ['WORLD', 'POLITICS', 'TECH', 'BUSINESS', 'SPORTS', 'SCIENCE', 'ENTERTAINMENT'];

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt is required'],
      trim: true,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    isHtml: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: CATEGORIES,
      uppercase: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    viewCount: {
      type: Number,
      default: 0,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    breaking: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

articleSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

articleSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  count: true,
});

articleSchema.index({ category: 1, isPublished: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

module.exports = mongoose.model('Article', articleSchema);
