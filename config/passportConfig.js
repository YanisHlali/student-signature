const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    User.getUserByEmail(email, async (err, userResults) => {
      if (err) {
        return done(err);
      }
      if (userResults.length === 0) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      const user = userResults[0];
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, async (err, userResults) => {
    if (err) {
      return done(err);
    }
    const user = userResults[0];
    if (!user) {
      return done(null, false);
    }

    try {
      const roles = await new Promise((resolve, reject) => {
        User.getUserRoles(id, (err, roleResults) => {
          if (err) return reject(err);
          resolve(roleResults);
        });
      });
      user.roles = roles.map(role => role.name);
      console.log("User roles:", user.roles);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
});


module.exports = passport;
