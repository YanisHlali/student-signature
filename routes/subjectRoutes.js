const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), subjectController.getAllSubjects);
router.get('/create', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), subjectController.createSubject);
router.post('/create', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), subjectController.createSubject);
router.get('/:id/edit', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), subjectController.updateSubject);
router.put('/:id/edit', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), subjectController.updateSubject);
router.delete('/:id/delete', roleMiddleware(['ROLE_ADMIN', 'ROLE_PROF']), subjectController.deleteSubject);

module.exports = router;
