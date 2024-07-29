const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.get('/create', studentController.createStudent);
router.post('/create', studentController.createStudent);
router.get('/:id/edit', studentController.updateStudent);
router.put('/:id/edit', studentController.updateStudent);
router.delete('/:id/delete', studentController.deleteStudent);
router.post('/assign-promotion/:id', studentController.assignPromotion);
router.post('/unassign-promotion/:id', studentController.unassignPromotion);

module.exports = router;
