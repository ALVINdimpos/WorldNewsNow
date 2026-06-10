const router = require('express').Router();
const Article = require('../models/Article');
const { findArticleByIdOrSlug } = require('../utils/findArticle');
const { renderArticleBody, renderHomeBody, renderStaticPage } = require('../utils/prerenderHtml');

function sendHtml(res, html) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.send(html);
}

// GET /prerender/home
router.get('/prerender/home', async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true, isDraft: false })
      .select('title excerpt slug _id category publishedAt')
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();
    sendHtml(res, renderHomeBody(articles));
  } catch {
    res.status(500).send('Error generating page');
  }
});

// GET /prerender/article/:slugOrId
router.get('/prerender/article/:slugOrId', async (req, res) => {
  try {
    const article = await findArticleByIdOrSlug(req.params.slugOrId);
    if (!article || !article.isPublished || article.isDraft) {
      return res.status(404).send('Article not found');
    }
    sendHtml(res, renderArticleBody(article));
  } catch {
    res.status(500).send('Error generating page');
  }
});

// GET /prerender/:page
router.get('/prerender/:page', async (req, res) => {
  const html = renderStaticPage(req.params.page);
  if (!html) return res.status(404).send('Page not found');
  sendHtml(res, html);
});

module.exports = router;
