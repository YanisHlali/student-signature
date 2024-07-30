const Classe = require('../models/Classe');
const Promotion = require('../models/Promotion');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Course = require('../models/Course');

async function getAllClasses(req, res) {
  Classe.getAllClasses((err, classes) => {
    console.log(classes);
    if (err) res.status(500).json(err);
    else res.render('classes', { classes });
  });
}

async function getClasseById(req, res) {
  Classe.getClasseById(req.params.id, (err, classe) => {
    if (err) res.status(500).json(err);
    else {
      Promotion.getAllPromotions((err, promotions) => {
        if (err) res.status(500).send(err);
        else {
          Course.getAllCourses((err, courses) => {
            if (err) res.status(500).send(err);
            else res.render('editClasse', { classe, promotions, courses });
          });
        }
      });
    }
  });
}

async function createClasse(req, res) {
  if (req.method === 'GET') {
    Promotion.getAllPromotions((err, promotions) => {
      if (err) res.status(500).send(err);
      else {
        Course.getAllCourses((err, courses) => {
          if (err) res.status(500).send(err);
          else res.render('createClasse', { promotions, courses });
        });
      }
    });
  } else if (req.method === 'POST') {
    Classe.createClasse(req.body, (err, classe) => {
      if (err) res.status(500).json(err);
      else res.redirect('/classes');
    });
  } else {
    res.status(405).end();
  }
}

async function updateClasse(req, res) {
  if (req.method === 'GET') {
    Classe.getClasseById(req.params.id, (err, classe) => {
      if (err) res.status(500).json(err);
      else {
        Promotion.getAllPromotions((err, promotions) => {
          if (err) res.status(500).send(err);
          else {
            Course.getAllCourses((err, courses) => {
              if (err) res.status(500).send(err);
              else res.render('editClasse', { classe, promotions, courses });
            });
          }
        });
      }
    });
  } else if (req.method === 'PUT') {
    Classe.updateClasse(req.params.id, req.body, (err, classe) => {
      if (err) res.status(500).json(err);
      else res.redirect('/classes');
    });
  } else {
    res.status(405).end();
  }
}

async function deleteClasse(req, res) {
  Classe.deleteClasse(req.params.id, (err, classe) => {
    if (err) res.status(500).json(err);
    else res.redirect('/classes');
  });
}

async function getClassesByPromotionId(req, res) {
  Classe.getClassesByPromotionId(req.params.id, (err, classes) => {
    if (err) res.status(500).json(err);
    else res.render('classes', { classes });
  });
}

module.exports = {
  getAllClasses,
  getClasseById,
  createClasse,
  updateClasse,
  deleteClasse,
  getClassesByPromotionId
};
