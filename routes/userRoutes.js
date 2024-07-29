const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// router.get('/', userController.getAllUsers);
router.get('/create', userController.createUser);
router.post('/create', userController.createUser);
router.get('/:id/edit', userController.updateUser);
router.put('/:id/Edit', userController.updateUser);
router.delete('/:id/delete', userController.deleteUser);

module.exports = router;
