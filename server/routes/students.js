const router = require('express').Router()
const db = require('../database');
const missingKeys = require('../missingKeys');
const api = require('./api');
const courseFuncs = require('./courses');
const officehours = require('./officehours');

const users = require('./users');


router.get('/:netid', users.authParam(users.ROLES.STUDENT), api.query(getStudentReq));

router.get('/:netid/tas', users.authParam(users.ROLES.STUDENT), api.query(getStudentTasReq));

router.get('/:netid/calendar', users.authParam(users.ROLES.STUDENT), api.query(getStudentCalReq));

/* Optional parameters
 *
 * courses: [bool] do get courses of student
 */
function getStudent({netid, courses=false, tas=false, professor=false}) {
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
    return users.getUserPlus(sqlStudent, sqlCourses, netid, courses, tas, professor, false);
}

function getStudentReq(req) {
    return getStudent({netid: req.params.netid, ...req.query});
}

function getStudentTas(netid) {
    console.log('getting student TAs for ' + netid);
    return users.getUserTas(netid, getStudent);
}

function getStudentTasReq(req) {
    return getStudentTas(req.params.netid);
}

function getStudentCalendar(netid) {
    let timeblocks = [];
    return getStudent({netid: netid, courses: true, tas: true, professor:true}).then ( data => {
        let promises = [];
        for (i in data.COURSES) {
            let course = data.COURSES[i];
            promises.push(courseFuncs.getCourseTimes(course.ID));
            for (j in course.TAS) {
                let ta = course.TAS[j];
                promises.push(officehours.getOfficehours(ta.NETID, course.ID));
            }
            if (course.PROFESSOR) {
                let profnetid = course.PROFESSOR.NETID;
                promises.push(officehours.getOfficehours(profnetid, course.ID));
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

function getStudentCalReq(req) {
    return getStudentCalendar(req.params.netid);
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
    addStudent: addStudent,
    getStudentTas: getStudentTas,
    getStudentCalendar: getStudentCalendar,
};
