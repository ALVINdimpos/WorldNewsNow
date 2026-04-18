const mongoose = require('mongoose');

const journalistProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialty: {
      type: String,
      trim: true,
      maxlength: [100, 'Specialty cannot exceed 100 characters'],
      default: '',
    },
    bio: {
      type: String,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    socialLinks: {
      x: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

journalistProfileSchema.virtual('articleCount', {
  ref: 'Article',
  localField: 'user',
  foreignField: 'author',
  count: true,
});

module.exports = mongoose.model('JournalistProfile', journalistProfileSchema);
