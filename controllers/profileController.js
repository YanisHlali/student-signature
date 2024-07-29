const User = require('../models/User');

async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const user = await new Promise((resolve, reject) => {
      User.getUserById(userId, (err, userResults) => {
        if (err) return reject(err);
        resolve(userResults[0]);
      });
    });
    res.render('profile', { user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getProfile };
