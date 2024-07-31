const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', roleMiddleware(['ROLE_PROF', 'ROLE_ADMIN']), schoolController.getAllSchools);
router.get('/create', roleMiddleware(['ROLE_PROF', 'ROLE_ADMIN']), schoolController.createSchool);
router.post('/create', roleMiddleware(['ROLE_PROF', 'ROLE_ADMIN']), schoolController.createSchool);
router.get('/:id/edit', roleMiddleware(['ROLE_PROF', 'ROLE_ADMIN']), schoolController.updateSchool);
router.put('/:id/edit', roleMiddleware(['ROLE_PROF', 'ROLE_ADMIN']), schoolController.updateSchool);
router.delete('/:id/delete', roleMiddleware(['ROLE_PROF', 'ROLE_ADMIN']), schoolController.deleteSchool);

module.exports = router;
