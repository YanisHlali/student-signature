const School = require('../models/School');

async function getAllSchools(req, res) {
    School.getAllSchools((err, schools) => {
        if (err) res.status(500).json(err);
        else res.render('schools', { schools });
    });
};

async function getSchoolById(req, res) {
    School.getSchoolById(req.params.id, (err, school) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(school);
    });
};

async function createSchool(req, res) {
    if (req.method === 'GET') {
        res.render('createSchool');
    } else if (req.method === 'POST') {
        School.createSchool(req.body, (err, school) => {
            if (err) res.status(500).json(err);
            else res.redirect('/schools');
        });
    } else {
        res.status(405).end();
    }
};

async function updateSchool(req, res) {
    if (req.method === 'GET') {
        School.getSchoolById(req.params.id, (err, school) => {
            if (err) res.status(500).json(err);
            else res.render('editSchool', { school });
        });
    } else if (req.method === 'PUT') {
        School.updateSchool(req.params.id, req.body, (err, school) => {
            if (err) res.status(500).json(err);
            else res.redirect('/schools');
        });
    } else {
        res.status(405).end();
    }
};

async function deleteSchool(req, res) {
    School.deleteSchool(req.params.id, (err, school) => {
        if (err) res.status(500).json(err);
        else res.redirect('/schools');
    });
};

module.exports = {
    getAllSchools,
    getSchoolById,
    createSchool,
    updateSchool,
    deleteSchool
};