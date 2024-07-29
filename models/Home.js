const db = require('../config/db');

class Home {
  static getHome(callback) {
    db.query('SELECT * FROM course', callback);
  }

}

module.exports = Home;
