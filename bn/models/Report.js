const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ['comment', 'article'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reason: {
      type: String,
      enum: ['spam', 'harassment', 'misinformation', 'hate_speech', 'other'],
      required: true,
    },
    details: {
      type: String,
      maxlength: 500,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

reportSchema.index({ targetType: 1, targetId: 1 });
reportSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
