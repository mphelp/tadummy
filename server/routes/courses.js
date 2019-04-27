const router = require('express').Router()
const db = require('../database');
const users = require('./users');
const missingKeys = require('../missingKeys')
const api = require('./api');

/* Required fields:
 * netid:   netid of professor teaching course
 * name:   name of course
 * dept:    id of department offering course
 * semester:id of semester course is offered
 */
router.post('/', (req, res) => {
    if (missingKeys(req.body, ['netid', 'name', 'dept', 'semester'], req, res).length) {
        return;
    }
    let {netid, name, dept, semester} = req.body;
    users.getRoles(netid).then ( roles => {
        if (roles.PROFESSOR) {
            insertCourse(netid, name, dept, semester).then( result => {
                res.sendStatus(201);
            }, err => {
                console.log(err);
                res.sendStatus(400);
            });
        } else {
            res.status(401).send('user ' + netid + ' is not a professor!');
        }
    });
});

/*
module.exports.query = apiQuery;
router.get('/', api.query(getAllCourses));

router.get('/:cid', (req, res) => {
    let cid = req.params.cid;
    return apiQuery(getCourse, cid);
});
*/

function getAllCourses() {
    return db.queryDB("SELECT * FROM admin.course", [], db.QUERY.MULTIPLE);
}

function getCourse(cid) {
    let sql = `
        select *
        from admin.course
        where cid = :cid
    `;
    return db.queryDB(sql, [cid], db.QUERY.SINGLE);
}

function insertCourse(netid, name, dept, semester) {
    let sqlInsert1 = `
        insert into admin.course(course_name, semester_id)
        values (:name, :semester)
    `;
    let sqlQuery = `
        select max(course_id) as cid
        from course
    `;
    let sqlInsert2 = `
        insert into admin.departmentofferscourse(department_id, course_id)
        values (:deptid, :cid)
    `;
    let sqlInsert3 = `
        insert into admin.proffor(netid, course_id, avail_id)
        values (:netid, :cid, 1)
    `;
    let cid;
    return db.queryDB( sqlInsert1, [name, semester], db.QUERY.INSERT)
        .then( () => {
            return db.queryDB( sqlQuery, [], db.QUERY.SINGLE);
        }).then( result => {
            cid = result.CID;
            return db.queryDB( sqlInsert2, [dept, cid], db.QUERY.INSERT);
        }).then( () => {
            return db.queryDB( sqlInsert3, [netid, cid], db.QUERY.INSERT);
        });
}

module.exports = router;
