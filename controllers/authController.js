const User = require('../models/User');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    User.createUser(req.body, (err, user) => {
        if (err) res.status(500).json(err);
        else res.status(201).json(user);
    });
};

async function login(req, res) {
    User.getUserByEmail(req.body.email, async (err, user) => {
        if (err) res.status(500).json(err);
        else if (!user) res.status(404).json({ message: 'User not found' });
        else {
            const validPassword = await User.comparePassword(req.body.password, user[0].password);
            if (!validPassword) res.status(401).json({ message: 'Invalid password' });
            else {
                const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 86400 });
                res.status(200).json({ token });
            }
        }
    });
};

module.exports = {
    register,
    login
};