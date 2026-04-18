const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const ctrl = require('../controllers/contactController');

router.post(
  '/subscribe',
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail()],
  validate,
  ctrl.subscribe
);

router.post(
  '/unsubscribe',
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail()],
  validate,
  ctrl.unsubscribe
);

router.post(
  '/advertise',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  ctrl.advertiseInquiry
);

router.post(
  '/careers',
  [body('email').isEmail().withMessage('Valid email is required').normalizeEmail()],
  validate,
  ctrl.careersNotify
);

module.exports = router;
