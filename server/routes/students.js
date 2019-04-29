const router = require('express').Router()
const db = require('../database');
const missingKeys = require('../missingKeys');
const api = require('./api');

const users = require('./users');


router.get('/:netid', api.query(getStudentReq));


function getStudent({netid, courses=false}) {
    let sqlStudent = `
        select s.netid, u.name, u.datejoined, m.major_name, d.dorm_name,
            dep.abbrev as dept, dep.college as college
        from admin.student s
            JOIN admin.users u ON (s.netid = u.netid)
            JOIN admin.dorm d ON (d.dorm_id = s.dorm)
            JOIN admin.major m ON (m.major_id = s.major)
            JOIN admin.department dep ON (dep.department_id = m.department_id)
        where s.netid = :netid
    `;
    let sqlCourses = `
        select c.course_id as id
        from studentfor sf
        where netid = :netid
    `;
    let studentPromise = db.queryDB(sqlStudent, [netid], db.QUERY.SINGLE);
    let coursePromise;
    if (courses) {
        coursePromise = db.queryDB(sqlCourses, [netid], db.QUERY.MULTIPLE);
    } else {
        coursePromise = Promise.resolve(null);
    }
    return Promise.all([studentPromise, coursePromise]).then( data => {
        let studentData = data[0];
        let courseIds = data[1];
        for (i in courseIds) { // get actual id of course
            let cid = data[i].ID;
            courseIds[i] = cid;
        }
        return studentData;
    });
}

function getStudentReq(req) {
    return getStudent({netid: req.params.netid, ...req.query});
}

function addStudent (netid, data) {
    let missing = missingKeys(data, ['netid', 'major', 'dorm']);
    if (missing.length) {
        return Promise.reject(missing);
    }
    let sql = `
        insert into admin.student(netid, major, dorm)
        values (:netid, :major, :dorm)
    `;
    return Promise.all([
        users.addUser(netid, data.name),
        db.queryDB(sql, [netid, data.major, data.dorm], db.QUERY.INSERT)
    ]);
}

module.exports = {
    router: router,
    addStudent: addStudent
};
