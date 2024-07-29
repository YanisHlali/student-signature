const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

router.get('/', subjectController.getAllSubjects);
router.get('/create', subjectController.createSubject);
router.post('/create', subjectController.createSubject);
router.get('/:id/edit', subjectController.updateSubject);
router.put('/:id/edit', subjectController.updateSubject);
router.delete('/:id/delete', subjectController.deleteSubject);

module.exports = router;
