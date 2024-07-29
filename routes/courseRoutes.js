const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

router.get('/', courseController.getAllCourses);
router.get('/create', courseController.createCourse);
router.post('/create', courseController.createCourse);
router.get('/:id/edit', courseController.updateCourse);
router.put('/:id/edit', courseController.updateCourse);
router.delete('/:id/delete', courseController.deleteCourse);

module.exports = router;
