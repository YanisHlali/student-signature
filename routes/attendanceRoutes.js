const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/generate/:classeId', attendanceController.generateAttendanceLinks);
router.get('/sign', attendanceController.signAttendance);
router.get('/:courseId', attendanceController.getAttendanceByCourse);
router.get('/class/:classId', attendanceController.generateAttendanceLinksForClass);
router.get('/redirect/:classId', attendanceController.redirectAttendance);

module.exports = router;
