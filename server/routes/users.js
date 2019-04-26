const router = require('express').Router()
const db = require('../database');
const ldap = require('../ldap');

const ROLES = {
    ADMIN:      'ADMIN',
    STUDENT:    'STUDENT',
    PROFESSOR:  'PROFESSOR',
    TA:         'TA',
};

router.post('/', (req, res) => {
    let netid = req.body.netid;
    let affiliation = req.body.affiliation;
    console.log('netid: '+netid+', aff: ' + affiliation);
    console.log('major: '+req.body.major);
    console.log('dept: '+req.body.department);
    console.log(req.body);

    let func;
    if (affiliation === ROLES.STUDENT) {
        func = insertStudent;
    } else if (affiliation === ROLES.PROFESSOR) {
        func = insertProfessor;
    } else {
        res.status(400).send('invalid affiliation: ' + affiliation);
    }
    func(netid, req.body).then( result => {
        console.log(result);
        res.sendStatus(201);
    }, err => {
        res.sendStatus(400);
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
    try {
        doLdap = JSON.parse(req.query.ldap);
    } catch (err) {
        doLdap = false;
    }
    authorizeUser(netid, validRoles).then( roles => {
        if (doLdap) {
            ldap.getInfo(netid).then( data => {
                roles['ldap'] = data;
                res.json(roles);
            });
        } else {
            res.json(roles);
        }
    }).catch( err => {
        res.json({authorized: false});
    });
});

function getRoles(netid) {
    let sql = `select netid, admin, student, professor, ta from admin.userroles where netid = :id`;
    return db.queryDB(sql, [netid], db.QUERY.SINGLE);
}

// This tutorial came in CLUTCH with authorization:
// http://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api
function authorizeUser(netid, validRoles = []) {
    if (typeof validRoles === 'string') {
        validRoles = [validRoles];
    }
    if (!netid) {
        return data;
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

function insertStudent (netid, data) {
    let sql = `
        insert into admin.student(netid, major, dorm)
        values (:netid, :major, :dorm)
    `;
    return Promise.all([
        insertUser(netid, data.name),
        db.queryDB(sql, [netid, data.major, data.dorm], db.QUERY.INSERT)
    ]);
}

function insertProfessor (netid, data) {
    let sql = `
        insert into admin.professor(netid, office, department_id)
        values (:netid, :office, :dept)
    `;
    return Promise.all([
        insertUser(netid, data.name),
        db.queryDB(sql, [data.netid, data.office, data.dept], db.QUERY.INSERT)
    ]);
}

function insertUser(netid, name) {
    let sql = `
        insert into admin.users(netid, name, admin, datejoined)
        values (:netid, :name, 0, SYSDATE)
    `;
    return db.queryDB(sql, [netid, name], db.QUERY.INSERT);
}

module.exports = router;
