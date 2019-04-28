const router = require('express').Router()
const db = require('../database');
const ldap = require('../ldap');
const missingKeys = require('../missingKeys');
const api = require('./api');

module.exports = {
    router: router,
    addUser: addUser,
    getRoles: getRoles
};

const students = require('./students');

const ROLES = {
    ADMIN:      'ADMIN',
    STUDENT:    'STUDENT',
    PROFESSOR:  'PROFESSOR',
    TA:         'TA',
};

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
        func = insertProfessor;
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

router.get('/courses/:netid', api.query(getUserCoursesReq));

function getRoles(netid) {
    //let sql = `select netid, admin, student, professor, ta from admin.userroles where netid = :id`;
    let sql = `select * from userroles where netid = :id`;
    return db.queryDB(sql, [netid], db.QUERY.SINGLE);
}

function getUser(netid) {
    let sql = `select netid, name, dateJoined from admin.users where netid = :id`;
    return db.queryDB(sql, [netid], db.QUERY.SINGLE);
}

function getUserCoursesReq(req) {
    return getUserCourses(req.params.netid);
}

function getUserCourses(netid) {
    let sqlCourses = `
        SELECT sf.course_id AS id
        FROM studentfor sf
        WHERE netid = :netid
    `;
    let courses = [];
    return db.queryDB(sqlCourses, [netid], db.QUERY.MULTIPLE).then( data => {
        let courseIds = [];
        for (i in data) {
            let cid = data[i].ID;
            courseIds.push(cid);
        }
        return courseIds;
    }).then( courseIds => {
        courses = courseIds;
        return courses;
    });
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

function insertProfessor (netid, data) {
    let missing = missingKeys(data, ['netid', 'office', 'dept']);
    if (missing.length) {
        return Promise.reject(missing);
    }
    let sql = `
        insert into admin.professor(netid, office, department_id)
        values (:netid, :office, :dept)
    `;
    return Promise.all([
        insertUser(netid, data.name),
        db.queryDB(sql, [data.netid, data.office, data.dept], db.QUERY.INSERT)
    ]);
}

function addUser(netid, name) {
    let sql = `
        insert into admin.users(netid, name, admin, datejoined)
        values (:netid, :name, 0, SYSDATE)
    `;
    return db.queryDB(sql, [netid, name], db.QUERY.INSERT);
}
