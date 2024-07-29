const Course = require('../models/Course');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Promotion = require('../models/Promotion');
const Classe = require('../models/Classe');
const Attendance = require('../models/Attendance');

async function getAllCourses(req, res) {
    try {
        const courses = await new Promise((resolve, reject) => {
            Course.getAllCourses((err, courses) => {
                if (err) return reject(err);
                resolve(courses);
            });
        });

        const professors = await new Promise((resolve, reject) => {
            User.getAllProfessors((err, professors) => {
                if (err) return reject(err);
                resolve(professors);
            });
        });

        const subjects = await new Promise((resolve, reject) => {
            Subject.getAllSubjects((err, subjects) => {
                if (err) return reject(err);
                resolve(subjects);
            });
        });

        const promotions = await new Promise((resolve, reject) => {
            Promotion.getAllPromotions((err, promotions) => {
                if (err) return reject(err);
                resolve(promotions);
            });
        });

        for (let course of courses) {
            course.class_start = new Date(course.class_start).toLocaleString();
            course.class_end = new Date(course.class_end).toLocaleString();
        }

        console.log({ courses, professors, subjects, promotions });

        res.render('courses', { courses, professors, subjects, promotions });
    } catch (err) {
        res.status(500).json(err);
    }
}

async function getCourseById(req, res) {
    Course.getCourseById(req.params.id, (err, course) => {
        if (err) res.status(500).json(err);
        else res.render('editCourse', { course });
    });
};

async function createCourse(req, res) {
    if (req.method === 'GET') {
        // Fetch data for the form
        const professors = await new Promise((resolve, reject) => {
            User.getAllProfessors((err, professors) => {
                if (err) return reject(err);
                resolve(professors);
            });
        });
        const subjects = await new Promise((resolve, reject) => {
            Subject.getAllSubjects((err, subjects) => {
                if (err) return reject(err);
                resolve(subjects);
            });
        });
        const promotions = await new Promise((resolve, reject) => {
            Promotion.getAllPromotions((err, promotions) => {
                if (err) return reject(err);
                resolve(promotions);
            });
        });

        res.render('createCourse', { professors, subjects, promotions });
    } else if (req.method === 'POST') {
        const { user_id, subject_id, promotion_id, start, end } = req.body;

        try {
            const courseResult = await new Promise((resolve, reject) => {
                Course.createCourse({ user_id, subject_id, promotion_id }, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            const courseId = courseResult.insertId;

            await new Promise((resolve, reject) => {
                Classe.createClasse({ course_id: courseId, promotion_id, start, end }, (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            res.redirect('/courses');
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

async function updateCourse(req, res) {
    if (req.method === 'GET') {
        Course.getCourseById(req.params.id, (err, course) => {
            if (err) res.status(500).send(err);
            else {
                User.getAllProfessors((err, professors) => {
                    if (err) res.status(500).send(err);
                    else {
                        Subject.getAllSubjects((err, subjects) => {
                            if (err) res.status(500).send(err);
                            else {
                                Promotion.getAllPromotions((err, promotions) => {
                                    if (err) res.status(500).send(err);
                                    else res.render('editCourse', { course: course[0], professors, subjects, promotions });
                                });
                            }
                        });
                    }
                });
            }
        });
    } else if (req.method === 'PUT') {
        Course.updateCourse(req.params.id, req.body, (err, course) => {
            if (err) res.status(500).json(err);
            else res.redirect('/courses');
        });
    } else {
        res.status(405).end();
    }
};

async function deleteCourse(req, res) {
    const { id } = req.params;
    try {
        const classes = await new Promise((resolve, reject) => {
            Classe.getClassesByCourseId(id, (err, classes) => {
                if (err) return reject(err);
                resolve(classes);
            });
        });

        for (const classe of classes) {
            await new Promise((resolve, reject) => {
                Attendance.deleteByClasseId(classe.id, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }

        await new Promise((resolve, reject) => {
            Classe.deleteByCourseId(id, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            Course.deleteCourse(id, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.redirect('/courses');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};
