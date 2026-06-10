const mongoose = require('mongoose');
const Article = require('../models/Article');

function isObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value) && String(new mongoose.Types.ObjectId(value)) === String(value);
}

async function findArticleByIdOrSlug(idOrSlug, populate = 'author') {
  const authorFields = 'name role avatar bio';
  let query;

  if (isObjectId(idOrSlug)) {
    query = Article.findById(idOrSlug);
  } else {
    query = Article.findOne({ slug: idOrSlug });
  }

  if (populate) {
    query = query.populate(populate, populate === 'author' ? authorFields : undefined);
  }

  return query.lean({ virtuals: true });
}

module.exports = { findArticleByIdOrSlug, isObjectId };
