const mongoose = require('mongoose');

const viewLogSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true,
  },
  identifier: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // TTL: 24 hours
  },
});

viewLogSchema.index({ article: 1, identifier: 1 }, { unique: true });

module.exports = mongoose.model('ViewLog', viewLogSchema);
