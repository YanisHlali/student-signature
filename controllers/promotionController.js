const Promotion = require('../models/Promotion');
const School = require('../models/School');
const Classe = require('../models/Classe');
const Course = require('../models/Course');
const Subject = require('../models/Subject');
const Student = require('../models/Student');
const User = require('../models/User');

async function getAllPromotions(req, res) {
    const userId = req.user.id;
    const userRoles = req.user.roles;

    try {
        let promotions;

        if (userRoles.includes('ROLE_USER')) {
            promotions = await new Promise((resolve, reject) => {
                Promotion.getPromotionsByStudentId(userId, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        } else if (userRoles.includes('ROLE_PROF') || userRoles.includes('ROLE_ADMIN')) {  // Assuming 'ROLE_PROF' is for professors and 'ROLE_ADMIN' is for admins
            promotions = await new Promise((resolve, reject) => {
                Promotion.getAllPromotions((err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        } else {
            return res.status(403).send('Forbidden');
        }

        const schools = await new Promise((resolve, reject) => {
            School.getAllSchools((err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        promotions = promotions.map(promotion => {
            promotion.school = schools.find(school => school.id === promotion.school_id);
            return promotion;
        });

        res.render('promotions', { promotions, user: req.user });
    } catch (err) {
        res.status(500).send(err);
    }
}

async function getPromotionById(req, res) {
    Promotion.getPromotionById(req.params.id, (err, promotion) => {
        if (err) res.status(500).send(err);
        else res.status(200).send(promotion);
    });
};

async function createPromotion(req, res) {
    if (req.method === 'GET') {
        School.getAllSchools((err, schools) => {
            if (err) res.status(500).send(err);
            else res.render('createPromotion', { schools });
        });
    } else if (req.method === 'POST') {
        Promotion.createPromotion(req.body, (err, promotion) => {
            if (err) res.status(500).json(err);
            else res.redirect('/promotions');
        });
    } else {
        res.status(405).end();
    }
};

async function updatePromotion(req, res) {
    if (req.method === 'GET') {
        Promotion.getPromotionById(req.params.id, (err, promotion) => {
            if (err) res.status(500).send(err);
            else {
                School.getAllSchools((err, schools) => {
                    if (err) res.status(500).send(err);
                    else res.render('editPromotion', { promotion: promotion[0], schools });
                });
            }
        });
    } else if (req.method === 'PUT') {
        const { name, year, school_id } = req.body;
        Promotion.updatePromotion(req.params.id, { name, year, school_id }, (err, promotion) => {
            if (err) res.status(500).json(err);
            else res.redirect('/promotions');
        });
    } else {
        res.status(405).end();
    }
};

async function deletePromotion(req, res) {
    Promotion.deletePromotion(req.params.id, (err, promotion) => {
        if (err) res.status(500).json(err);
        else res.redirect('/promotions');
    });
}

async function getPromotionScheduleById(req, res) {
    try {
        const promotionId = req.params.id;

        const promotion = await new Promise((resolve, reject) => {
            Promotion.getPromotionById(promotionId, (err, promotion) => {
                if (err) return reject(err);
                resolve(promotion[0]);
            });
        });

        if (!promotion) {
            return res.status(404).send('Promotion not found');
        }

        const classes = await new Promise((resolve, reject) => {
            Classe.getClassesByPromotionId(promotionId, (err, classes) => {
                if (err) return reject(err);
                resolve(classes);
            });
        });

        const classesWithDetails = await Promise.all(classes.map(async (classe) => {
            const course = await new Promise((resolve, reject) => {
                Course.getCourseById(classe.course_id, (err, course) => {
                    if (err) return reject(err);
                    resolve(course[0]);
                });
            });

            const subject = await new Promise((resolve, reject) => {
                Subject.getSubjectById(course.subject_id, (err, subject) => {
                    if (err) return reject(err);
                    resolve(subject[0]);
                });
            });

            const teacher = await new Promise((resolve, reject) => {
                User.getUserById(course.user_id, (err, user) => {
                    if (err) return reject(err);
                    resolve(user[0]);
                });
            });

            return {
                ...classe,
                subject_name: subject ? subject.name : 'Unknown',
                teacher_name: teacher ? `${teacher.firstname} ${teacher.lastname}` : 'Unknown',
                start: new Date(classe.start),
                end: new Date(classe.end)
            };
        }));

        res.render('promotionSchedule', { promotion, classes: classesWithDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getPromotionStudents(req, res) {
    const promotionId = req.params.id;
    try {
        const promotion = await new Promise((resolve, reject) => {
            Promotion.getPromotionById(promotionId, (err, promotion) => {
                if (err) return reject(err);
                resolve(promotion[0]);
            });
        });

        if (!promotion) {
            return res.status(404).send('Promotion not found');
        }

        Student.getStudentsByPromotionId(promotionId, (err, students) => {
            if (err) {
                return res.status(500).json(err);
            }
            res.render('promotionStudents', { promotion, students, user: req.user });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



module.exports = {
    getAllPromotions,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion,
    getPromotionScheduleById,
    getPromotionStudents
};
