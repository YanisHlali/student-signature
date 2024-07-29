const db = require('../config/db');

class Classe {
  static getAllClasses(callback) {
    const query = `
      SELECT classe.id, classe.promotion_id, classe.course_id, classe.start, classe.end,
             promotion.name as promotion_name, promotion.year as promotion_year,
             course.subject_id, course.user_id,
             subject.name as subject_name,
             user.firstname as user_firstname, user.lastname as user_lastname
      FROM classe
      LEFT JOIN promotion ON classe.promotion_id = promotion.id
      LEFT JOIN course ON classe.course_id = course.id
      LEFT JOIN subject ON course.subject_id = subject.id
      LEFT JOIN user ON course.user_id = user.id
    `;
    db.query(query, callback);
  }

  static createClasse(newClasse, callback) {
    const sql = 'INSERT INTO classe SET ?';
    db.query(sql, newClasse, callback);
  }

  static getClasseById(classeId, callback) {
    const sql = 'SELECT * FROM classe WHERE id = ?';
    db.query(sql, [classeId], callback);
  }

  static getClassesByCourseId(courseId, callback) {
    const sql = 'SELECT * FROM classe WHERE course_id = ?';
    db.query(sql, [courseId], callback);
  }

  static updateClasse(id, updatedClasse, callback) {
    db.query('UPDATE classe SET ? WHERE id = ?', [updatedClasse, id], callback);
  }

  static deleteClasse(id, callback) {
    db.query('DELETE FROM classe WHERE id = ?', [id], callback);
  }

  static checkAvailability(promotionId, start, end, callback) {
    const sql = `
      SELECT * FROM classe
      WHERE promotion_id = ?
      AND (? < end AND ? > start)
    `;
    db.query(sql, [promotionId, start, end], callback);
  }

  static deleteByCourseId(courseId, callback) {
    const sql = 'DELETE FROM classe WHERE course_id = ?';
    db.query(sql, [courseId], callback);
  }

  static getClassesByPromotionId(promotionId, callback) {
    const sql = 'SELECT * FROM classe WHERE promotion_id = ?';
    db.query(sql, [promotionId], callback);
  }

  static getClasseByCourseId(courseId, callback) {
    const sql = 'SELECT * FROM classe WHERE course_id = ?';
    db.query(sql, [courseId], callback);
  }
}

module.exports = Classe;
