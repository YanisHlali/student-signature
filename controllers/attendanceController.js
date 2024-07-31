const Attendance = require('../models/Attendance');
const Course = require('../models/Course');
const Classe = require('../models/Classe');
const Student = require('../models/Student');
const Promotion = require('../models/Promotion');
const User = require('../models/User');
const crypto = require('crypto');
const { DateTime } = require('luxon'); 
const { promisify } = require('util');

const randomBytesAsync = promisify(crypto.randomBytes);

async function generateAttendanceLinks(req, res) {
  try {
    const { classeId } = req.params;
    const userId = req.user.id;

    const classe = await new Promise((resolve, reject) => {
      Classe.getClasseById(classeId, (err, classe) => {
        if (err) return reject(err);
        resolve(classe[0]);
      });
    });

    if (!classe) {
      return res.status(404).send('Class not found');
    }

    const course = await new Promise((resolve, reject) => {
      Course.getCourseById(classe.course_id, (err, course) => {
        if (err) return reject(err);
        resolve(course[0]);
      });
    });

    if (!course) {
      return res.status(404).send('Course not found');
    }

    const promotion = await new Promise((resolve, reject) => {
      Promotion.getPromotionById(classe.promotion_id, (err, promotion) => {
        if (err) return reject(err);
        resolve(promotion[0]);
      });
    });

    if (!promotion) {
      return res.status(404).send('Promotion not found');
    }

    const students = await new Promise((resolve, reject) => {
      Student.getStudentsByPromotionId(classe.promotion_id, (err, students) => {
        if (err) return reject(err);
        resolve(students);
      });
    });

    if (!students || students.length === 0) {
      return res.status(404).send('No students found for this promotion');
    }

    const links = await Promise.all(students.map(async (student) => {
      const token = (await randomBytesAsync(16)).toString('hex');
      const expiryTime = DateTime.now().plus({ hours: 24 }).toJSDate();

      const studentIdResult = await new Promise((resolve, reject) => {
        Student.getStudentIdByUserId(student.user_id, (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
        });
      });

      const studentId = studentIdResult ? studentIdResult.id : null;

      if (!studentId) {
        throw new Error('Student ID not found');
      }

      const hasSigned = await new Promise((resolve, reject) => {
        Attendance.checkAttendance(studentId, classeId, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      await new Promise((resolve, reject) => {
        Attendance.createAttendanceToken(token, studentId, classeId, expiryTime, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      return {
        student,
        link: `${req.protocol}://${req.get('host')}/attendances/sign?token=${token}`,
        hasSigned
      };
    }));

    const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isPastCourse = new Date(classe.end) < new Date();

    classe.day = new Date(classe.start).toLocaleDateString();
    classe.start = formatTime(classe.start);
    classe.end = formatTime(classe.end);

    let filteredLinks = links.filter(link => link.student.user_id === userId);

    res.render('attendanceLinks', { links: filteredLinks, classe, course, promotion, user: req.user, isPastCourse });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function redirectAttendance(req, res) {
  try {
    const { classId } = req.params;

    const userRoles = req.user.roles;

    if (userRoles.includes('ROLE_PROF') || userRoles.includes('ROLE_ADMIN')) {
      const classe = await new Promise((resolve, reject) => {
        Classe.getClasseById(classId, (err, classe) => {
          if (err) return reject(err);
          resolve(classe[0]);
        });
      });

      if (!classe) {
        return res.status(404).send('Class not found');
      }

      return res.redirect(`/attendances/${classe.course_id}`);
    } else {
      return res.redirect(`/attendances/generate/${classId}`);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function signAttendance(req, res) {
  try {
    const { token } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    const tokenData = await new Promise((resolve, reject) => {
      Attendance.validateToken(token, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    if (!tokenData) {
      return res.status(400).send('Invalid or expired token');
    }

    if (new Date(tokenData.expiryTime) < new Date()) {
      return res.status(400).send('Token has expired');
    }

    if (userRole === 'student') {
      const studentIdResult = await new Promise((resolve, reject) => {
        Student.getStudentIdByUserId(userId, (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
        });
      });

      if (tokenData.student_id !== studentIdResult.id) {
        return res.status(403).send('Forbidden');
      }
    }

    await new Promise((resolve, reject) => {
      Attendance.markAttendance(tokenData.classe_id, tokenData.student_id, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    res.redirect(`/attendances/generate/${tokenData.classe_id}`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAttendanceByCourse(req, res) {
  const { courseId } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const classe = await new Promise((resolve, reject) => {
      Classe.getClasseByCourseId(courseId, (err, classe) => {
        if (err) return reject(err);
        resolve(classe[0]);
      });
    });

    if (!classe) {
      return res.status(404).send('Class not found');
    }

    if (userRole === 'student') {
      const studentInClass = await new Promise((resolve, reject) => {
        Student.getStudentIdByUserId(userId, (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
        });
      });

      if (!studentInClass || studentInClass.promotion_id !== classe.promotion_id) {
        return res.status(403).send('Forbidden');
      }
    } else if (userRole === 'professor') {
      if (classe.user_id !== userId) {
        return res.status(403).send('Forbidden');
      }
    }

    const attendance = await new Promise((resolve, reject) => {
      Attendance.getAttendanceByCourse(classe.id, (err, attendance) => {
        if (err) return reject(err);
        resolve(attendance);
      });
    });

    const uniqueAttendance = [];
    const seenStudents = new Set();

    attendance.forEach(record => {
      if (!seenStudents.has(record.student_id)) {
        seenStudents.add(record.student_id);
        uniqueAttendance.push(record);
      }
    });

    res.render('attendanceByCourse', { attendance: uniqueAttendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAttendanceByClass(req, res) {
  const { classId } = req.params;
  try {
    const attendance = await new Promise((resolve, reject) => {
      Attendance.getAttendanceByClass(classId, (err, attendance) => {
        if (err) return reject(err);
        resolve(attendance);
      });
    });

    const uniqueAttendance = [];
    const seenStudents = new Set();

    attendance.forEach(record => {
      if (!seenStudents.has(record.student_id)) {
        seenStudents.add(record.student_id);
        uniqueAttendance.push(record);
      }
    });

    res.render('attendanceByClass', { attendance: uniqueAttendance, user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function generateAttendanceLinksForClass(req, res) {
  try {
    const { classId } = req.params;
    const userId = req.user.id;
    const role = req.user.roles;

    const classe = await new Promise((resolve, reject) => {
      Classe.getClasseById(classId, (err, classe) => {
        if (err) return reject(err);
        resolve(classe[0]);
      });
    });

    if (!classe) {
      return res.status(404).send('Class not found');
    }

    const students = await new Promise((resolve, reject) => {
      Student.getStudentsByPromotionId(classe.promotion_id, (err, students) => {
        if (err) return reject(err);
        resolve(students);
      });
    });

    if (!students || students.length === 0) {
      return res.status(404).send('No students found for this promotion');
    }

    const links = await Promise.all(students.map(async (student) => {
      const token = crypto.randomBytes(16).toString('hex');
      const expiryTime = new Date(classe.end);

      const studentIdResult = await new Promise((resolve, reject) => {
        Student.getStudentIdByUserId(student.user_id, (err, result) => {
          if (err) return reject(err);
          resolve(result[0]);
        });
      });

      const studentId = studentIdResult ? studentIdResult.id : null;

      if (!studentId) {
        throw new Error('Student ID not found');
      }

      await new Promise((resolve, reject) => {
        Attendance.createAttendanceToken(token, studentId, classId, expiryTime, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

      return {
        student,
        link: `${req.protocol}://${req.get('host')}/attendances/sign?token=${token}`
      };
    }));

    res.render('attendanceByClass', { links, user: req.user, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  generateAttendanceLinks,
  signAttendance,
  getAttendanceByCourse,
  getAttendanceByClass,
  generateAttendanceLinksForClass,
  redirectAttendance
};
