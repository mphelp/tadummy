const router = require('express').Router()
const db = require('../database');
const missingKeys = require('../missingKeys');
const api = require('./api');
const courseFuncs = require('./courses');

const users = require('./users');


router.get('/:netid', users.authParam(users.ROLES.PROFESSOR), api.query(getProfessorReq));

/* Optional parameters
 *
 * courses: [bool] do get courses of professor
 */
function getProfessor({netid, courses=false}) {
    let sqlProfessor = `
        select u.netid, u.name, u.datejoined, p.office,
            dep.abbrev as dept, dep.college as college
        from professor p
            JOIN users u ON (p.netid = u.netid)
            JOIN department dep ON (dep.department_id = p.department_id)
        where p.netid = :netid
    `;
    let sqlCourses = `
        select pf.course_id as id
        from proffor pf
        where netid = :netid
    `;
    return users.getUserPlus(sqlProfessor, sqlCourses, netid, courses, false);
}

function getProfessorReq(req) {
    return getProfessor({netid: req.params.netid, ...req.query});
}

function addProfessor (netid, data) {
    let missing = missingKeys(data, ['netid', 'office', 'dept']);
    if (missing.length) {
        return Promise.reject(missing);
    }
    let sql = `
        insert into admin.professor(netid, office, department_id)
        values (:netid, :office, :dept)
    `;
    return Promise.all([
        users.addUser(netid, data.name),
        db.queryDB(sql, [data.netid, data.office, data.dept], db.QUERY.INSERT)
    ]);
}

module.exports = {
    router: router,
    addProfessor: addProfessor
};
