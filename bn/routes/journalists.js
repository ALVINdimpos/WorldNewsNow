const router = require('express').Router();
const { protect, requireRole } = require('../middleware/auth');
const ctrl = require('../controllers/journalistController');

router.get('/', ctrl.getJournalists);
router.get('/dashboard', protect, requireRole('journalist', 'admin'), ctrl.getDashboard);
router.patch('/profile', protect, requireRole('journalist', 'admin'), ctrl.updateJournalistProfile);
router.get('/:id', ctrl.getJournalist);

module.exports = router;
