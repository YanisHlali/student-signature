const express = require('express');
const router = express.Router();
const classeController = require('../controllers/classeController');

router.get('/', classeController.getAllClasses);
router.get('/create', classeController.createClasse);
router.post('/create', classeController.createClasse);
router.get('/:id/edit', classeController.updateClasse);
router.put('/:id/edit', classeController.updateClasse);
router.delete('/:id/delete', classeController.deleteClasse);

module.exports = router;
