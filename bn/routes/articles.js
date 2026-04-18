const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, optionalAuth, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/articleController');

const CATEGORIES = ['WORLD', 'POLITICS', 'TECH', 'BUSINESS', 'SPORTS', 'SCIENCE', 'ENTERTAINMENT'];

const articleBodyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 300 }).withMessage('Title too long'),
  body('excerpt').trim().notEmpty().withMessage('Excerpt is required').isLength({ max: 500 }).withMessage('Excerpt too long'),
  body('content').notEmpty().withMessage('Content is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .toUpperCase()
    .isIn(CATEGORIES)
    .withMessage(`Category must be one of: ${CATEGORIES.join(', ')}`),
];

router.get('/bookmarks', protect, ctrl.getBookmarks);
router.get('/journalist/:userId', ctrl.getJournalistArticles);
router.get('/', optionalAuth, ctrl.getArticles);
router.get('/:id', optionalAuth, ctrl.getArticle);

router.post('/', protect, requireRole('journalist', 'admin'), articleBodyValidation, validate, ctrl.createArticle);
router.patch('/:id', protect, requireRole('journalist', 'admin'), validate, ctrl.updateArticle);
router.delete('/:id', protect, requireRole('journalist', 'admin'), ctrl.deleteArticle);
router.post('/:id/publish', protect, requireRole('journalist', 'admin'), ctrl.publishArticle);
router.post('/:id/unpublish', protect, requireRole('journalist', 'admin'), ctrl.unpublishArticle);
router.post('/:id/like', optionalAuth, ctrl.likeArticle);
router.post('/:id/bookmark', protect, ctrl.bookmarkArticle);

module.exports = router;
