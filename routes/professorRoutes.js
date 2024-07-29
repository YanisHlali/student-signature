const express = require('express');
const professorController = require('../controllers/professorController');
const router = express.Router();

router.get('/', professorController.getAllProfessors);
router.get('/create', (req, res) => {
    res.render('createProfessor');
});
router.post('/create', professorController.createProfessor);
router.get('/:id/edit', professorController.updateProfessor);
router.put('/:id/edit', professorController.updateProfessor);
router.delete('/:id/delete', professorController.deleteProfessor);

module.exports = router;