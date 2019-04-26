const router = require('express').Router()
const users = require('./users.js');

const database = require('../database.js')

router.get('/', (req, res) => {
    res.sendStatus(404);
})

router.use('/users', users);


router.get('/dorms', apiQuery(getAllDorms));

router.get('/departments', apiQuery(getAllDepartments));

router.get('/majors', apiQuery(getAllMajors));

function getAllDorms() {
    return database.queryDB('SELECT * FROM admin.dorm', [], database.QUERY.MULTIPLE);
}

function getAllMajors() {
    return database.queryDB('SELECT * FROM admin.major', [], database.QUERY.MULTIPLE);
}

function getAllDepartments() {
    return database.queryDB('SELECT * FROM admin.department', [], database.QUERY.MULTIPLE);
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
