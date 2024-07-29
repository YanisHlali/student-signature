const db = require('../config/db');

class Attendance {
  static createAttendanceToken(token, studentId, classeId, expiryTime, callback) {
    const sql = 'INSERT INTO attendance (classe_id, student_id, token, expiry_time) VALUES (?, ?, ?, ?)';
    db.query(sql, [classeId, studentId, token, expiryTime], callback);
  }

  static validateToken(token, callback) {
    const sql = 'SELECT * FROM attendance WHERE token = ? AND expiry_time > NOW()';
    db.query(sql, [token], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0 ? results[0] : null);
    });
  }

  static markAttendance(classeId, studentId, callback) {
    const sql = `
      UPDATE attendance
      SET present = 1
      WHERE classe_id = ? AND student_id = ?
    `;
    db.query(sql, [classeId, studentId], callback);
  }

  static getAttendanceByClasse(classeId, callback) {
    const sql = `
      SELECT attendance.*, user.firstname, user.lastname
      FROM attendance
      JOIN student ON attendance.student_id = student.id
      JOIN user ON student.user_id = user.id
      WHERE attendance.classe_id = ?
    `;
    db.query(sql, [classeId], callback);
  }

  static deleteByClasseId(classeId, callback) {
    const sql = 'DELETE FROM attendance WHERE classe_id = ?';
    db.query(sql, [classeId], callback);
  }

  static getAttendanceByCourse(courseId, callback) {
    const sql = `
      SELECT attendance.*, user.firstname, user.lastname, user.email
      FROM attendance
      JOIN student ON attendance.student_id = student.id
      JOIN user ON student.user_id = user.id
      JOIN classe ON attendance.classe_id = classe.id
      WHERE classe.course_id = ?
    `;
    db.query(sql, [courseId], callback);
  }

  static deleteByStudentId(studentId, callback) {
    const sql = 'DELETE FROM attendance WHERE student_id = ?';
    db.query(sql, [studentId], callback);
  }

  static getAttendanceByClass(classId, callback) {
    const sql = `
      SELECT attendance.*, user.firstname, user.lastname, user.email
      FROM attendance
      JOIN student ON attendance.student_id = student.id
      JOIN user ON student.user_id = user.id
      WHERE attendance.classe_id = ?
    `;
    db.query(sql, [classId], callback);
  }
}

module.exports = Attendance;
