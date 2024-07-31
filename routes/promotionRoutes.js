const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const ensureAuthenticated = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', ensureAuthenticated, promotionController.getAllPromotions);
router.get('/create', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), promotionController.createPromotion);
router.post('/create', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), promotionController.createPromotion);
router.get('/:id/edit', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), promotionController.updatePromotion);
router.put('/:id/edit', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), promotionController.updatePromotion);
router.delete('/:id/delete', ensureAuthenticated, roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), promotionController.deletePromotion);
router.get('/:id/schedule', ensureAuthenticated, promotionController.getPromotionScheduleById);
router.get('/:id/students', ensureAuthenticated, promotionController.getPromotionStudents);

module.exports = router;
