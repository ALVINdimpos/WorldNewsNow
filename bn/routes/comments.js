const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, optionalAuth } = require('../middleware/auth');
const ctrl = require('../controllers/commentController');

router.get('/', ctrl.getComments);

router.post(
  '/',
  optionalAuth,
  [
    body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 2000 }).withMessage('Comment too long'),
    body('articleId').notEmpty().withMessage('articleId is required').isMongoId().withMessage('Invalid articleId'),
    body('parentId').optional().isMongoId().withMessage('Invalid parentId'),
  ],
  validate,
  ctrl.createComment
);

router.patch(
  '/:id',
  protect,
  [body('text').trim().notEmpty().withMessage('Comment text is required').isLength({ max: 2000 })],
  validate,
  ctrl.updateComment
);

router.delete('/:id', protect, ctrl.deleteComment);
router.post('/:id/like', protect, ctrl.likeComment);
router.post('/:id/report', optionalAuth, ctrl.reportComment);
router.patch('/:id/hide', protect, ctrl.hideComment);

module.exports = router;
