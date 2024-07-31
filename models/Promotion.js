const db = require('../config/db');

class Promotion {
  static getAllPromotions(callback) {
    db.query('SELECT * FROM promotion', callback);
  }

  static getPromotionById(id, callback) {
    db.query('SELECT * FROM promotion WHERE id = ?', [id], callback);
  }

  static createPromotion(newPromotion, callback) {
    db.query('INSERT INTO promotion SET ?', newPromotion, callback);
  }

  static updatePromotion(id, updatedPromotion, callback) {
    db.query('UPDATE promotion SET ? WHERE id = ?', [updatedPromotion, id], callback);
  }

  static deletePromotion(id, callback) {
    db.query('DELETE FROM promotion WHERE id = ?', [id], callback);
  }

  static getPromotionById(id, callback) {
    db.query('SELECT * FROM promotion WHERE id = ?', [id], callback);
  }

  static getPromotionsByStudentId(studentId, callback) {
    const sql = `
      SELECT p.* 
      FROM promotion p
      JOIN student s ON p.id = s.promotion_id
      WHERE s.user_id = ?
    `;
    db.query(sql, [studentId], callback);
  }
}

module.exports = Promotion;
