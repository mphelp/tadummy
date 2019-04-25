const database = require('./database.js')

function getAllDorms() {
    return database.queryDB('SELECT * FROM admin.dorm', []);
}

function getAllMajors() {
    return database.queryDB('SELECT * FROM admin.major', []);
}

function getAllDepartments() {
    return database.queryDB('SELECT * FROM admin.department', []);
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

module.exports = {
    dorms: getAllDorms,
    majors: getAllMajors,
    departments: getAllDepartments,
    apiQuery: apiQuery
}
