const Student = require('../models/Student');
const School = require('../models/School');
const Promotion = require('../models/Promotion');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const bcrypt = require('bcrypt');

async function getAllStudents(req, res) {
    User.getAllUsers((err, users) => {
        if (err) res.status(500).json(err);
        else {
            Student.getAllStudents((err, students) => {
                if (err) res.status(500).json(err);
                else {
                    Promotion.getAllPromotions((err, promotions) => {
                        if (err) res.status(500).json(err);
                        else {
                            School.getAllSchools((err, schools) => {
                                if (err) res.status(500).json(err);
                                else {
                                    User.getAllProfessors((err, professors) => {
                                        if (err) res.status(500).json(err);
                                        else {
                                            const nonProfessors = users.filter(user => !professors.some(prof => prof.id === user.id));

                                            students = students.map(student => {
                                                student.user = nonProfessors.find(user => user.id === student.user_id);
                                                student.promotion = promotions.find(promotion => promotion.id === student.promotion_id);
                                                return student;
                                            });

                                            const studentsWithPromotion = students.filter(student => student.promotion_id !== null);
                                            const studentsWithoutPromotion = nonProfessors.filter(user => !students.some(student => student.user_id === user.id));

                                            studentsWithPromotion.forEach(student => {
                                                student.schoolId = schools.find(school => school.id === student.promotion.school_id).id;
                                                student.schoolName = schools.find(school => school.id === student.promotion.school_id).name;
                                                student.schoolCity = schools.find(school => school.id === student.promotion.school_id).city;
                                            });

                                            res.render('students', { studentsWithPromotion, studentsWithoutPromotion, promotions, schools });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

async function getStudentById(req, res) {
    Student.getStudentById(req.params.id, (err, student) => {
        if (err) res.status(500).json(err);
        else res.status(200).json(student);
    });
};

async function createStudent(req, res) {
    if (req.method === 'GET') {
      Promotion.getAllPromotions((err, promotions) => {
        if (err) res.status(500).send(err);
        else res.render('createStudent', { promotions });
      });
    } else if (req.method === 'POST') {
      const { firstname, lastname, email, password, promotion_id } = req.body;
  
      try {
        const user = await new Promise((resolve, reject) => {
          User.createUser({ firstname, lastname, email, password }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
  
        const student = await new Promise((resolve, reject) => {
          Student.createStudent({ user_id: user.insertId, promotion_id }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
  
        const role = await new Promise((resolve, reject) => {
          User.assignRole(user.insertId, 2, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
        });
  
        res.redirect('/students');
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(400).json({
            error: 'Duplicate entry',
            message: 'An account with this email already exists.',
            details: err.sqlMessage
          });
        } else {
          res.status(500).json({ error: err.message });
        }
      }
    } else {
      res.status(405).end();
    }
  }
  

async function updateStudent(req, res) {
    if (req.method === 'GET') {
        Student.getStudentById(req.params.id, (err, student) => {
            if (err) {
                res.status(500).send(err);
            } else if (!student || student.length === 0) {
                res.status(404).send('Student not found');
            } else {
                User.getUserById(student[0].user_id, (err, user) => {
                    if (err) res.status(500).send(err);
                    else {
                        Promotion.getAllPromotions((err, promotions) => {
                            if (err) res.status(500).send(err);
                            else res.render('editStudent', { student: student[0], user: user[0], promotions });
                        });
                    }
                });
            }
        });
    } else if (req.method === 'PUT') {
        const { firstname, lastname, email, promotion_id } = req.body;
        Student.getStudentById(req.params.id, (err, student) => {
            if (err) {
                res.status(500).send(err);
            } else if (!student || student.length === 0) {
                res.status(404).send('Student not found');
            } else {
                User.updateUser(student[0].user_id, { firstname, lastname, email }, (err, user) => {
                    if (err) res.status(500).json(err);
                    else {
                        Student.updateStudent(req.params.id, { promotion_id }, (err, student) => {
                            if (err) res.status(500).json(err);
                            else res.redirect('/students');
                        });
                    }
                });
            }
        });
    } else {
        res.status(405).end();
    }
};

async function deleteStudent(req, res) {
    const { id } = req.params;
    try {
        await new Promise((resolve, reject) => {
            Attendance.deleteByStudentId(id, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            Student.deleteStudent(id, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        res.redirect('/students');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function assignPromotion(req, res) {
    const { id } = req.params;
    const { promotion_id } = req.body;
    Student.createStudent({ user_id: id, promotion_id }, (err, student) => {
        if (err) {
            if (err.sqlMessage === "Un professeur ne peut pas être ajouté comme étudiant") {
                res.status(400).send("Un professeur ne peut pas être ajouté comme étudiant");
            }
        }
        else res.redirect('/students');
    });
}

async function unassignPromotion(req, res) {
    const { id } = req.params;

    try {
        const student = await new Promise((resolve, reject) => {
            Student.getStudentById(id, (err, student) => {
                if (err) return reject(err);
                resolve(student[0]);
            });
        });

        if (!student) {
            return res.status(404).send('Étudiant non trouvé');
        }

        const promotionId = student.promotion_id;

        await new Promise((resolve, reject) => {
            Student.deleteAttendanceByStudentId(id, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        Student.deleteStudent(id, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur lors de la suppression de l\'étudiant' });
            }

            res.redirect(`/promotions/${promotionId}/students`);
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    assignPromotion,
    unassignPromotion
};
