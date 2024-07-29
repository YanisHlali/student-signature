const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

router.get('/', promotionController.getAllPromotions);
router.get('/create', promotionController.createPromotion);
router.post('/create', promotionController.createPromotion);
router.get('/:id/edit', promotionController.updatePromotion);
router.put('/:id/edit', promotionController.updatePromotion);
router.delete('/:id/delete', promotionController.deletePromotion);
router.get('/:id/schedule', promotionController.getPromotionScheduleById);
router.get('/:id/students', promotionController.getPromotionStudents);

module.exports = router;
