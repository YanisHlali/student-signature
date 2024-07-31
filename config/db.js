require('dotenv').config({ path: '.env.local', override: true });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion : ' + err.stack);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

module.exports = connection;
