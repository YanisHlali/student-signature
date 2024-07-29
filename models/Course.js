const db = require('../config/db');

class Course {
  static getAllCourses(callback) {
    const query = `
      SELECT 
          course.id, 
          course.user_id, 
          course.subject_id, 
          course.promotion_id, 
          user.firstname as user_firstname, 
          user.lastname as user_lastname, 
          subject.name as subject_name, 
          promotion.name as promotion_name, 
          promotion.year as promotion_year,
          classe.start as class_start,
          classe.end as class_end
      FROM course
      LEFT JOIN user ON course.user_id = user.id
      LEFT JOIN subject ON course.subject_id = subject.id
      LEFT JOIN promotion ON course.promotion_id = promotion.id
      LEFT JOIN classe ON course.id = classe.course_id
    `;
    db.query(query, callback);
  }

  static getCourseById(courseId, callback) {
    const sql = `
      SELECT course.*, subject.name AS subject_name
      FROM course
      JOIN subject ON course.subject_id = subject.id
      WHERE course.id = ?
    `;
    db.query(sql, [courseId], callback);
  }

  static createCourse(newCourse, callback) {
    const sql = 'INSERT INTO course SET ?';
    db.query(sql, newCourse, callback);
  }

  static updateCourse(id, updatedCourse, callback) {
    db.query('UPDATE course SET ? WHERE id = ?', [updatedCourse, id], callback);
  }

  static deleteCourse(id, callback) {
    db.beginTransaction((err) => {
      if (err) return callback(err);

      const deleteClassesSql = 'DELETE FROM classe WHERE course_id = ?';
      db.query(deleteClassesSql, [id], (err) => {
        if (err) {
          return db.rollback(() => {
            callback(err);
          });
        }

        const deleteCourseSql = 'DELETE FROM course WHERE id = ?';
        db.query(deleteCourseSql, [id], (err, result) => {
          if (err) {
            return db.rollback(() => {
              callback(err);
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                callback(err);
              });
            }
            callback(null, result);
          });
        });
      });
    });
  }

  static deleteByProfessorId(professorId, callback) {
    db.query('DELETE FROM course WHERE user_id = ?', [professorId], callback);
  }

  static getCoursesByProfessor(professorId, callback) {
    const sql = `
      SELECT course.*, subject.name as subject_name, promotion.name as promotion_name
      FROM course
      JOIN subject ON course.subject_id = subject.id
      JOIN promotion ON course.promotion_id = promotion.id
      WHERE course.user_id = ?
    `;
    db.query(sql, [professorId], callback);
  }
}

module.exports = Course;
