const router = require('express').Router()
const db = require('../database');
const missingKeys = require('../missingKeys');
const api = require('./api');
const courseFuncs = require('./courses');

const users = require('./users');


router.get('/:netid', users.auth(users.ROLES.STUDENT), api.query(getStudentReq));

/* Optional parameters
 *
 * courses: [bool] do get courses of student
 */
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
        select sf.course_id as id
        from studentfor sf
        where netid = :netid
    `;
    return users.getUserPlus(sqlStudent, sqlCourses, netid, courses);
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
