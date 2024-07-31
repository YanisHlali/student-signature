require('dotenv').config({ path: '.env.local', override: true });
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  secret: process.env.SECRET,
});

connection.connect((err) => {
  if (err) {
 
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

module.exports = connection;
