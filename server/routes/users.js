const router = require('express').Router()
const db = require('../database');
const ldap = require('../ldap');
const missingKeys = require('../missingKeys');
const api = require('./api');

const ROLES = {
    ADMIN:      'ADMIN',
    STUDENT:    'STUDENT',
    PROFESSOR:  'PROFESSOR',
    TA:         'TA',
};

module.exports = {
    router: router,
    addUser: addUser,
    getRoles: getRoles,
    authParam: authParam,
    authBody: authBody,
    ROLES: ROLES,
    getUserPlus: getUserPlus,
    getUserTas: getUserTas,
};

const courseFuncs = require('./courses');
const students = require('./students');
const professors = require('./professors');
const officehours = require('./officehours');


/* Required fields:
 * ALL USERS
 *      netid (string)
 *      name (string)
 *      affiliation (STUDENT/PROFESSOR)
 *
 * STUDENT
 *      dorm (id)
 *      major (id)
 *
 * PROFESSOR
 *      office (string)
 *      dept (id)
 */
router.post('/', (req, res) => {
    if (missingKeys(req.body, ['netid', 'affiliation'], req, res).length) {
        return;
    }
    let netid = req.body.netid;
    let affiliation = req.body.affiliation;
    let func;
    if (affiliation === ROLES.STUDENT) {
        func = students.addStudent;
    } else if (affiliation === ROLES.PROFESSOR) {
        func = professors.addProfessor;
    } else {
        res.status(400).send('invalid affiliation: ' + affiliation);
    }
    func(netid, req.body).then( result => {
        console.log(result);
        res.sendStatus(201);
    }, err => {
        res.status(400).send('Missing keys: '+err);
    });
});

router.get('/:netid', (req, res) => {
    let netid = req.params.netid;
    let validRoles;
    try {
        validRoles = JSON.parse(req.query.roles);
    } catch (err) {
        validRoles = [];
    }
    let doLdap = false;
    let authorize = false;
    try {
        doLdap = JSON.parse(req.query.ldap);
    } catch (err) {}
    try {
        authorize = JSON.parse(req.query.authorize);
    } catch (err) {}
    let promises = [getUser(netid)];
    promises.push(authorize ? authorizeUser(netid, validRoles) : Promise.resolve(undefined));
    promises.push(doLdap ? ldap.getInfo(netid) : Promise.resolve(undefined));
    Promise.all(promises).then( data => {
        let userData = {...data[0], ...data[1]};
        let authData = data[1];
        let ldapData = data[2];
        userData['ldap'] = ldapData;
        res.json(userData);
    }).catch( err => {
        res.json({});
    });
});

router.get('/:netid/tas', api.query(getUserTasReq));

router.get('/:netid/calendar', api.query(getUserCalendarReq));

function getRoles(netid) {
    //let sql = `select netid, admin, student, professor, ta from admin.userroles where netid = :id`;
    let sql = `select * from userroles where netid = :id`;
    return db.queryDB(sql, [netid], db.QUERY.SINGLE);
}

function getUser(netid) {
    let sql = `select netid, name, dateJoined from admin.users where netid = :id`;
    return db.queryDB(sql, [netid], db.QUERY.SINGLE);
}

// This tutorial came in CLUTCH with authorization:
// http://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api
function authorizeUser(netid, validRoles = []) {
    if (typeof validRoles === 'string') {
        validRoles = [validRoles];
    }
    if (!netid) {
        return {authorized: false};
    }
    return getRoles(netid).then(userRoles => {
        if (Object.keys(userRoles).length === 0) {
            return {authorized: false};
        }
        userRoles['authorized'] = !validRoles.length;
        for (role in validRoles) {
            if (userRoles[validRoles[role]]) {
                userRoles['authorized'] = true;
                break;
            }
        }
        return userRoles;
    }).catch(console.log);
};

function authParam(validRoles = []) {
    return (req, res, next) => {
        let netid = req.params.netid;
        return authorizeUser(netid, validRoles).then( authData => {
            if (authData.authorized) {
                next();
                return;
            } else {
                return res.status(401)
                    .send("'"+netid+"' does not have role: " + JSON.stringify(validRoles));
            }
        })
    };
}

function authBody(validRoles = []) {
    return (req, res, next) => {
        let netid = req.body.netid;
        return authorizeUser(netid, validRoles).then( authData => {
            if (authData.authorized) {
                next();
                return;
            } else {
                return res.status(401)
                    .send("'"+netid+"' does not have role: " + JSON.stringify(validRoles));
            }
        })
    };
}

function addUser(netid, name) {
    let sql = `
        insert into admin.users(netid, name, admin, datejoined)
        values (:netid, :name, 0, SYSDATE)
    `;
    return db.queryDB(sql, [netid, name], db.QUERY.INSERT);
}

function getUserPlus(sqlUser, sqlCourses, netid, courses=false, tas=false,
                    professor=false, students=false) {
    let userPromise = db.queryDB(sqlUser, [netid], db.QUERY.SINGLE);
    let coursePromise;
    if (courses) {
        coursePromise = db.queryDB(sqlCourses, [netid], db.QUERY.MULTIPLE);
    } else {
        coursePromise = Promise.resolve(null);
    }
    let userData;
    return Promise.all([userPromise, coursePromise]).then( data => {
        userData = data[0];
        let promise;
        if (courses) {
            let courseIds = data[1];
            for (i in courseIds) { // get actual id of course
                let cid = courseIds[i].ID;
                courseIds[i] = cid;
            }
            promise = courseFuncs.getCourses({
                ids: courseIds,
                tas: tas,
                professor: professor,
                students: students,
            });
        } else {
            promise = Promise.resolve(undefined);
        }
        return promise;
    }).then ( courseData => {
        userData.COURSES = courseData;
        return userData;
    });
}

function getUserTasReq(req) {
    let netid = req.params.netid;
    return getRoles(netid).then( roles => {
        if (roles.STUDENT) {
            return students.getStudentTas(netid);
        } else if (roles.PROFESSOR) {
            return professors.getProfessorTas(netid);
        } else {
            return "'"+netid+"' is not a Student or Professor!";
        }
    });
}

function getUserTas(netid, userFunc) {
    console.log('getting user TAs for ' + netid);
    return userFunc({netid: netid, courses: true, tas: true, professor: true}).then ( data => {
        let tas = [];
        for (i in data.COURSES) {
            let course = data.COURSES[i];
            for (j in course.TAS) {
                let ta = course.TAS[j];
                ta['COURSE_ID'] = course.ID;
                ta['COURSE_NAME'] = course.NAME;
                ta['TYPE'] = 'TA';
                tas.push(ta);
            }
            if (course.PROFESSOR && course.PROFESSOR.NETID) {
                tas.push({...course.PROFESSOR,
                    COURSE_ID: course.ID,
                    COURSE_NAME: course.NAME,
                    TYPE: 'PROF'
                });
            }
        }
        return tas;
    });
}

function getUserCalendarReq(req) {
    netid = req.params.netid;
    return getRoles(netid).then( roles => {
        console.log(roles);
        if (roles.STUDENT) {
            return students.getStudentCalendar(netid);
        } else if (roles.PROFESSOR) {
            return professors.getProfessorCalendar(netid);
        } else {
            return "'"+netid+"' is not a Student or Professor!";
        }
    });
}
