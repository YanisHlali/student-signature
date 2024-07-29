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
}

module.exports = Promotion;
