const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

router.get('/', schoolController.getAllSchools);
router.get('/create', schoolController.createSchool);
router.post('/create', schoolController.createSchool);
router.get('/:id/edit', schoolController.updateSchool);
router.put('/:id/edit', schoolController.updateSchool);
router.delete('/:id/delete', schoolController.deleteSchool);

module.exports = router;
