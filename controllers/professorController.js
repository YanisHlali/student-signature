const User = require('../models/User');
const Course = require('../models/Course');

async function getAllProfessors(req, res) {
  User.getAllProfessors((err, professors) => {
    if (err) res.status(500).json(err);
    else res.render('professors', { professors });
  });
}

async function createProfessor(req, res) {
  if (req.method === 'GET') {
    res.render('createProfessor');
  } else if (req.method === 'POST') {
    const { firstname, lastname, email, password } = req.body;
    try {
      const newUser = {
        firstname,
        lastname,
        email,
        password,
      };
      User.createUser(newUser, (err, user) => {
        if (err) res.status(500).json(err);
        else {
          // get id of the newly created user
          const userId = user.insertId;
          User.assignRole(userId, 3, (err, result) => {
            if (err) res.status(500).json(err);
            else res.redirect('/professors');
          });
        }
      });
    } catch (error) {
      res.status(500).send('Erreur lors de la création du professeur');
    }
  } else {
    res.status(405).end();
  }
}

async function updateProfessor(req, res) {
  if (req.method === 'GET') {
    User.getUserById(req.params.id, (err, professor) => {
      if (err) res.status(500).send(err);
      else res.render('editProfessor', { professor: professor[0] });
    });
  } else if (req.method === 'PUT') {
    const { firstname, lastname, email } = req.body;
    const updatedUser = { firstname, lastname, email, updated_at: new Date() };
    User.updateUser(req.params.id, updatedUser, (err, user) => {
      if (err) res.status(500).json(err);
      else res.redirect('/professors');
    });
  } else {
    res.status(405).end();
  }
}

async function deleteProfessor(req, res) {
    const professorId = req.params.id;

    try {
        // Supprimer les cours associés au professeur
        await new Promise((resolve, reject) => {
            Course.deleteByProfessorId(professorId, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        // Supprimer le professeur
        await new Promise((resolve, reject) => {
            User.deleteUser(professorId, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        res.redirect('/professors');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
  getAllProfessors,
  createProfessor,
  updateProfessor,
  deleteProfessor,
};