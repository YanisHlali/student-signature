const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentController.getAllStudents);
router.get('/create', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentController.createStudent);
router.post('/create', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentController.createStudent);
router.get('/:id/edit', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentController.updateStudent);
router.put('/:id/edit', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentController.updateStudent);
router.delete('/:id/delete', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentController.deleteStudent);
router.post('/assign-promotion/:id', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentController.assignPromotion);
router.post('/unassign-promotion/:id', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), studentController.unassignPromotion);

module.exports = router;
