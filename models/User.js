const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  static getAllUsers(callback) {
    db.query('SELECT * FROM user', callback);
  }

  static getUserById(id, callback) {
    db.query('SELECT * FROM user WHERE id = ?', [id], callback);
  }

  static getUserByEmail(email, callback) {
    db.query('SELECT * FROM user WHERE email = ?', [email], callback);
  }

  static async createUser(newUser, callback) {
    try {
      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(newUser.password, salt);
      newUser.created_at = new Date();
      newUser.updated_at = new Date();
      newUser.is_banned = 0;
      newUser.is_verified = 0;
  
      newUser.username = User.generateUsername(newUser.firstname, newUser.lastname);
    
      db.query('INSERT INTO user SET ?', newUser, (err, results) => {
        if (err) {
          return callback(err, null);
        }
        return callback(null, results);
      });
    } catch (error) {
      callback(error, null);
    }
  }
  

  static generateUsername(firstname, lastname) {
    return `${firstname.charAt(0).toLowerCase()}${lastname.toLowerCase()}`;
  }

  static updateUser(id, updatedUser, callback) {
    db.query('UPDATE user SET ? WHERE id = ?', [updatedUser, id], callback);
  }

  static deleteUser(id, callback) {
    db.query('DELETE FROM user WHERE id = ?', [id], callback);
  }

  static getAllProfessors(callback) {
    db.query(`
      SELECT user.*
      FROM user
      INNER JOIN user_role ON user.id = user_role.user_id
      INNER JOIN role ON user_role.role_id = role.id
      WHERE role.id = 3
    `, callback);
  }

  static getUserWithEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM user WHERE email = ?';
      db.query(sql, [email], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });
  }

  static assignRole(userId, roleId, callback) {
    db.query('INSERT INTO user_role (user_id, role_id) VALUES (?, ?)', [userId, roleId], callback);
  }

  static unassignRole(userId, roleId, callback) {
    db.query('DELETE FROM user_role WHERE user_id = ? AND role_id = ?', [userId, roleId], callback);
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static getUserRoles(userId, callback) {
    const sql = `
      SELECT role.name
      FROM role
      JOIN user_role ON role.id = user_role.role_id
      WHERE user_role.user_id = ?
    `;
    console.log(`
      SELECT role.name
      FROM role
      JOIN user_role ON role.id = user_role.role_id
      WHERE user_role.user_id = ${userId}
    `)
    db.query(sql, [userId], callback);
  }
}

module.exports = User;
