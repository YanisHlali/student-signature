const db = require('../config/db');

class School {
  static getAllSchools(callback) {
    db.query('SELECT * FROM school', callback);
  }

  static getSchoolById(id, callback) {
    db.query('SELECT * FROM school WHERE id = ?', [id], callback);
  }

  static createSchool(newSchool, callback) {
    db.query('INSERT INTO school SET ?', newSchool, callback);
  }

  static updateSchool(id, updatedSchool, callback) {
    db.query('UPDATE school SET ? WHERE id = ?', [updatedSchool, id], callback);
  }

  static deleteSchool(id, callback) {
    db.query('DELETE FROM school WHERE id = ?', [id], callback);
  }
}

module.exports = School;
