const router = require('express').Router()
const db = require('../database');
const users = require('./users');
const missingKeys = require('../missingKeys')
const api = require('./api');
const users = require('./users');

/* Required fields:
 * netid:   netid of professor teaching course
 * name:   name of course
 * dept:    id of department offering course
 * semester:id of semester course is offered
 */
router.post('/', users.authBody([users.ROLES.PROFESSOR]), (req, res) => {
    if (missingKeys(req.body, ['netid', 'name', 'dept', 'semester'], req, res).length) {
        return;
    }
    let {netid, name, dept, semester} = req.body;
    insertCourse(netid, name, dept, semester).then( result => {
        res.sendStatus(201);
    }, err => {
        console.log(err);
        res.sendStatus(400);
    });
});

router.get('/', api.query(getCoursesReq));

router.get('/:cid', api.query(getSingleCourseReq));

router.post('/enroll', (req, res) => {
    if (missingKeys(req.body, ['netid', 'cid'], req, res).length) {
        return;
    }
    let {netid, cid} = req.body;
    enrollCourse(cid, netid).then( (result) => {
        console.log(result);
        res.sendStatus(201);
    }, (err) => {
        res.status(400).send(err);
    });
});

router.post('/enrollta', (req, res) => {
    if (missingKeys(req.body, ['netid', 'cid'], req, res).length) {
        return;
    }
    let {netid, cid} = req.body;
    return enrollTACourse(cid, netid).then( result => {
        console.log(result);
        res.sendStatus(201);
    }, (err) => {
        res.status(400).send(err);
    });
});

function enrollCourse(cid, netid) {
    let sql = `
        insert into admin.studentfor(netid, course_id)
        values (:netid, :cid)
    `;
    return db.queryDB(sql, [netid, cid], db.QUERY.INSERT);
}

function enrollTACourse(cid, netid) {
    let sql = `
        insert into admin.tafor(netid, course_id, avail_id)
        values (:netid, :cid, 1)
    `;
    return db.queryDB(sql, [netid, cid], db.QUERY.INSERT);
}

/* Optional parameters
 *
 * cid: number of single course to get
 * ids: array of course ids (default to all courses)
 * students: [bool] do include students in course
 * tas:      [bool] do include tas in course
 * professor:[bool] do include professor information
 */
function getCourses({cid=null, ids=null, students=false, tas=false, professor=false}) {
    let sqlSelect = 'SELECT c.course_id AS id, c.course_name AS name, sem.name AS semester';
    let sqlFrom = 'FROM course c JOIN semesterinfo sem ON (c.semester_id = sem.sid)';
    let sqlWhere = 'WHERE 1=1';
    let params = [];
    if (!Array.isArray(ids)) {
        try {
            ids = JSON.parse(ids);
        } catch (err) {}
    }
    let courses = null;
    if (cid) {
        courses = [cid];
    } else if (ids) {
        courses = ids;
    }
    if (courses) {
        if (!Array.isArray(courses)) {
            courses = [courses];
        }
        sqlWhere += ' AND (';
        for (i in courses) {
            let id = courses[i];
            if (i != 0) {
                sqlWhere += ' OR ';
            }
            sqlWhere += 'c.course_id = :id';
            params.push(id);
        }
        sqlWhere += ')';
    }
    let sql = sqlSelect + ' ' + sqlFrom + ' ' + sqlWhere;
    let courseData;
    let extra = [];
    return db.queryDB(sql, params, db.QUERY.MULTIPLE).then( data => {
        courseData = data;
    }).then( () => {
        let promises = [];
        if (students) {
            extra.push('students');
            for (i in courseData) {
                let course = courseData[i];
                let sqlStudents = `
                    SELECT sf.netid, u.name
                    FROM studentfor sf
                        JOIN users u ON (sf.netid = u.netid)
                    WHERE sf.course_id = :cid
                `;
                promises.push(db.queryDB(sqlStudents, [course.ID], db.QUERY.MULTIPLE));
            }
        }
        if (tas) {
            extra.push('tas');
            for (i in courseData) {
                let course = courseData[i];
                let sqlTas = `
                    SELECT taf.netid, u.name, taf.status, avail.avail_desc as availability
                    FROM tafor taf
                        JOIN users u ON (taf.netid = u.netid)
                        JOIN availability avail ON (taf.avail_id = avail.avail_id)
                    WHERE taf.course_id = :cid
                `;
                promises.push(db.queryDB(sqlTas, [course.ID], db.QUERY.MULTIPLE));
            }
        }
        if (professor) {
            extra.push('professor');
            for (i in courseData) {
                let course = courseData[i];
                let sqlTas = `
                    SELECT pf.netid, u.name, prof.office, pf.status, avail.avail_desc as availability
                    FROM proffor pf
                        JOIN professor prof ON (pf.netid = prof.netid)
                        JOIN users u ON (pf.netid = u.netid)
                        JOIN availability avail ON (pf.avail_id = avail.avail_id)
                    WHERE pf.course_id = :cid
                `;
                promises.push(db.queryDB(sqlTas, [course.ID], db.QUERY.MULTIPLE));
            }
        }
        return Promise.all(promises);
    }).then( data => {
        let numcourseData = courseData.length;
        for (i in data) {
            let key = extra[Math.floor(i / numcourseData)];
            let courseIndex = i % numcourseData;
            courseData[courseIndex][key] = data[i];
        }
        return cid ? courseData[0] : courseData;
    });
}

function getCoursesReq(req) {
    return getCourses({...req.query});
}

function getSingleCourseReq(req) {
    return getCourses({cid: req.params.cid, ...req.query});
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

module.exports = {
    router:router,
    getCourses: getCourses
};
