const router = require('express').Router()
const db = require('../database');
const missingKeys = require('../missingKeys');

const users = require('./users');


router.get('/:netid', (req, res) => {
    let netid = req.params.netid;
    getStudent(netid).then( data => {
        res.json(data);
    }).catch( err => {
        res.send(err);
    });
});


function getStudent(netid) {
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
        select c.course_id as cid, c.course_name as name, s.name as semester
        from studentfor sf
            JOIN course c ON (sf.course_id = c.course_id)
            JOIN semesterinfo s ON (c.semester_id = s.sid)
        where netid = :netid
    `;
    return Promise.all([
        db.queryDB(sqlStudent, [netid], db.QUERY.SINGLE),
        db.queryDB(sqlCourses, [netid], db.QUERY.MULTIPLE)
    ]).then( data => {
        let userData = data[0];
        let courses = data[1];
        userData['courses'] = courses;
        return userData;
    });
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
