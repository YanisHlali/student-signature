const User = require('../models/User');
const bcrypt = require('bcrypt');

async function getAllUsers(req, res) {
    User.getAllUsers((err, users) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(users);
    });
};

async function getUserById(req, res) {
    User.getUserById(req.params.id, (err, user) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(user);
    });
};

async function createUser(req, res) {
    if (req.method === 'GET') {
        res.render('createUser');
    } else if (req.method === 'POST') {
        const { firstname, lastname, email, password } = req.body;

        User.createUser({ firstname, lastname, email, password }, (err, user) => {
            if (err) res.status(500).json(err);
            else res.redirect('/students');
        });
    } else {
        res.status(405).end();
    }
}

async function updateUser(req, res) {
    if (req.method === 'GET') {
        User.getUserById(req.params.id, (err, user) => {
            if (err) res.status(500).json(err);
            else res.render('editUser', { user });
        });
    } else if (req.method === 'PUT') {
        const { firstname, lastname, email } = req.body;
        User.updateUser(req.params.id, { firstname, lastname, email }, (err, user) => {
            if (err) res.status(500).json(err);
            else res.status(200).json({ message: 'User updated successfully' });
        });
    } else {
        res.status(405).end();
    }
};

async function deleteUser(req, res) {
    User.deleteUser(req.params.id, (err, user) => {
        if (err) res.status(500).json(err);
        else if (user.affectedRows === 0) res.status(404).json({ message: 'User not found' })
        else res.redirect('/students');
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};