const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const roleMiddleware = require('../middlewares/roleMiddleware');

const professorOrAdmin = roleMiddleware(['ROLE_PROF', 'ROLE_ADMIN']);

router.get('/', professorOrAdmin, courseController.getAllCourses);
router.get('/create', professorOrAdmin, courseController.createCourse);
router.post('/create', professorOrAdmin, courseController.createCourse);
router.get('/:id/edit', professorOrAdmin, courseController.updateCourse);
router.put('/:id/edit', professorOrAdmin, courseController.updateCourse);
router.delete('/:id/delete', professorOrAdmin, courseController.deleteCourse);

module.exports = router;