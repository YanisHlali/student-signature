require('dotenv').config({ path: '.env.local', override: true });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Root@123",
  database: "yanishlali_student"
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion : ' + err.stack);
    return;
  }
  console.log('Connecté en tant que id ' + connection.threadId);
});

module.exports = connection;
