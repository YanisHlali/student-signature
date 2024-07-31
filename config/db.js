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
 
    return;
  }
<<<<<<< HEAD
  console.log('Connecté à la base de données MySQL');
=======
 
>>>>>>> 3a17ec10589cfbb2a9f7e3e25cf7f2553417ec4c
});

module.exports = connection;
