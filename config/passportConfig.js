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
  User.getUserById(id, (err, userResults) => {
    if (err) {
      return done(err);
    }
    const user = userResults[0];
    done(null, user);
  });
});

module.exports = passport;
