const router = require('express').Router()
const db = require('../database');
const missingKeys = require('../missingKeys');
const api = require('./api');
const courseFuncs = require('./courses');
const officehours = require('./officehours');

const users = require('./users');


router.get('/:netid', users.authParam(users.ROLES.PROFESSOR), api.query(getProfessorReq));

router.get('/:netid/calendar', users.authParam(users.ROLES.PROFESSOR), api.query(getProfessorCalReq));

/* Optional parameters
 *
 * courses: [bool] do get courses of professor
 */
function getProfessor({netid, courses=false, tas=false, students=false}) {
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
    return users.getUserPlus(sqlProfessor, sqlCourses, netid, courses, tas, false, students);
}

function getProfessorReq(req) {
    return getProfessor({netid: req.params.netid, ...req.query});
}

function getProfessorTas(netid) {
    return users.getUserTas(netid, getProfessor);
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

function getProfessorCalendar(netid) {
    let timeblocks = [];
    return getProfessor({netid: netid, courses: true, tas: true}).then ( data => {
        let promises = [];
        for (i in data.COURSES) {
            let course = data.COURSES[i];
            promises.push(courseFuncs.getCourseTimes(course.ID));
            for (j in course.TAS) {
                let ta = course.TAS[j];
                promises.push(officehours.getOfficehours(ta.NETID, course.ID));
            }
        }
        return Promise.all(promises);
    }).then ( data => {
        timeblocks = data.flat();
        return officehours.getOfficehours(netid);
    }).then ( data => {
        return timeblocks.concat(data);
    });
}

function getProfessorCalReq(req) {
    return getProfessorCalendar(req.params.netid);
}

module.exports = {
    router: router,
    addProfessor: addProfessor,
    getProfessorTas: getProfessorTas,
};
