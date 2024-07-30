require('dotenv').config({ path: '.env', override: true });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

console.log(process.env.DB_HOST);
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion : ' + err.stack);
    return;
  }
  console.log('Connecté en tant que id ' + connection.threadId);
});

module.exports = connection;
