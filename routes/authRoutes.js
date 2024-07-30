const express = require('express');
const passport = require('../config/passportConfig');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { messages: req.flash() });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/auth/login',
  failureFlash: true
}));

router.get('/register', (req, res) => {
  res.render('register', { messages: req.flash() });
});

router.post('/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const user = await User.getUserWithEmail(email);
    if (user) {
      req.flash('error', 'Un compte existe déjà avec cette adresse email');
      return res.redirect('/auth/register');
    }

    const newUser = {
      firstname,
      lastname,
      email,
      password
    };

    User.createUser(newUser, (err, result) => {
      if (err) {
        req.flash('error', 'Une erreur est survenue lors de la création de votre compte');
        return res.redirect('/auth/register');
      }
      req.flash('success', 'Votre compte a été créé avec succès');
      res.redirect('/auth/login');
    });

  } catch (err) {
    console.error('Erreur lors de la recherche de l\'utilisateur:', err);
    req.flash('error', 'Une erreur est survenue, veuillez réessayer');
    res.redirect('/auth/register');
  }
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/login');
  });
});

router.get('/test', (req, res) => {
  bcrypt.genSalt(10)
    .then(salt => {
      return bcrypt.hash("toto", salt);
    })
    .then(hash => {
      res.send(hash);
    })
    .catch(err => {
      res.status(500).send(err.message);
    });
});


module.exports = router;
