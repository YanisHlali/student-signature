const db = require('../config/db');

class Student {
  static getAllStudents(callback) {
    const query = `
        SELECT student.id, student.user_id, user.id as UserId, user.firstname, user.lastname, student.promotion_id, 
               promotion.name as promotion_name, promotion.year
        FROM user
        LEFT JOIN student ON user.id = student.user_id
        LEFT JOIN promotion ON student.promotion_id = promotion.id
        LEFT JOIN user_role ON user.id = user_role.user_id
        WHERE user_role.role_id IS NULL OR user_role.role_id != 3
    `;
    db.query(query, callback);
  }

  static getStudentById(id, callback) {
    const sql = 'SELECT * FROM student WHERE id = ?';
    db.query(sql, [id], callback);
  }

  static createStudent(newStudent, callback) {
    db.query('INSERT INTO student SET ?', newStudent, callback);
  }

  static updateStudent(id, updatedStudent, callback) {
    db.query('UPDATE student SET ? WHERE id = ?', [updatedStudent, id], callback);
  }

  static deleteStudent(studentId, callback) {
    const sql = 'DELETE FROM student WHERE id = ?';
    db.query(sql, [studentId], callback);
  }

  static deleteAttendanceByStudentId(studentId, callback) {
    const sql = 'DELETE FROM attendance WHERE student_id = ?';
    db.query(sql, [studentId], callback);
  }

  static getStudentsByPromotionId(promotionId, callback) {
    const sql = `
      SELECT student.*, user.firstname, user.lastname, user.email
      FROM student
      JOIN user ON student.user_id = user.id
      WHERE student.promotion_id = ?
    `;
    db.query(sql, [promotionId], callback);
  }

  static getStudentIdByUserId(userId, callback) {
    const sql = 'SELECT id FROM student WHERE user_id = ?';
    db.query(sql, [userId], callback);
  }
}

module.exports = Student;