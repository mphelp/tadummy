const router = require('express').Router();

const database = require('../database.js')

router.get('/', (req, res) => {
    res.sendStatus(404);
})

router.use('/users', require('./users.js'));

router.use('/courses', require('./courses.js'));

router.get('/dorms', apiQuery(getAllDorms));

router.get('/departments', apiQuery(getAllDepartments));

router.get('/majors', apiQuery(getAllMajors));

router.get('/semesters', apiQuery(getAllSemesters));

function getAllDorms() {
    return database.queryDB('SELECT * FROM admin.dorm', [], database.QUERY.MULTIPLE);
}

function getAllMajors() {
    return database.queryDB('SELECT * FROM admin.major', [], database.QUERY.MULTIPLE);
}

function getAllDepartments() {
    return database.queryDB('SELECT * FROM admin.department', [], database.QUERY.MULTIPLE);
}

function getAllSemesters() {
    return database.queryDB('SELECT * FROM admin.semester', [], database.QUERY.MULTIPLE);
}

function apiQuery(func) {
    return (req, res) => {
        func().then( data => {
            res.json(data);
        }, err => {
            res.sendStatus(400);
        })
    };
}

module.exports = router;
