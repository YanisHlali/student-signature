const db = require('../config/db');

class Subject {
  static getAllSubjects(callback) {
    db.query('SELECT * FROM subject', callback);
  }

  static getSubjectById(id, callback) {
    db.query('SELECT * FROM subject WHERE id = ?', [id], callback);
  }

  static createSubject(newSubject, callback) {
    db.query('INSERT INTO subject SET ?', newSubject, callback);
  }

  static updateSubject(id, updatedSubject, callback) {
    db.query('UPDATE subject SET ? WHERE id = ?', [updatedSubject, id], callback);
  }

  static deleteSubject(id, callback) {
    db.query('DELETE FROM subject WHERE id = ?', [id], callback);
  }
}

module.exports = Subject;
