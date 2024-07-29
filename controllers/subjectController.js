const Subject = require('../models/Subject');

async function getAllSubjects(req, res) {
    Subject.getAllSubjects((err, subjects) => {
        if (err) res.status(500).json(err);
        else res.render('subjects', { subjects });
    });
}

async function getSubjectById(req, res) {
    Subject.getSubjectById(req.params.id, (err, subject) => {
        if (err) res.status(500).json(err);
        else res.render('editSubject', { subject });
    });
}

async function createSubject(req, res) {
    if (req.method === 'GET') {
        res.render('createSubject');
    } else if (req.method === 'POST') {
        Subject.createSubject(req.body, (err, subject) => {
            if (err) res.status(500).json(err);
            else res.redirect('/subjects');
        });
    } else {
        res.status(405).end();
    }
}

async function updateSubject(req, res) {
    if (req.method === 'GET') {
        Subject.getSubjectById(req.params.id, (err, subject) => {
            if (err) res.status(500).json(err);
            else res.render('editSubject', { subject });
        });
    } else if (req.method === 'POST' || req.method === 'PUT') {
        Subject.updateSubject(req.params.id, req.body, (err, subject) => {
            if (err) res.status(500).json(err);
            else res.redirect('/subjects');
        });
    } else {
        res.status(405).end();
    }
}

async function deleteSubject(req, res) {
    Subject.deleteSubject(req.params.id, (err, subject) => {
        if (err) res.status(500).json(err);
        else res.redirect('/subjects');
    });
}

module.exports = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};
