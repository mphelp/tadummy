const router = require('express').Router()
const db = require('../database');
const users = require('./users');
const missingKeys = require('../missingKeys')
const api = require('./api');
const officehours = require('./officehours');

/* Create a new course (with no time blocks)
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
    addCourse(netid, name, dept, semester).then( result => {
        res.sendStatus(201);
    }, err => {
        console.log(err);
        res.sendStatus(400);
    });
});

router.post('/:cid/times', api.query(addCourseTimesReq));

// Get all courses
router.get('/', api.query(getCoursesReq));

// Get single course
router.get('/:cid', api.query(getSingleCourseReq));

router.get('/:cid/times', api.query(getCourseTimesReq));


// STUDENT enroll in a course
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

// TA enroll in a course
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
        if (ids.length === 0) {
            return Promise.resolve([]);
        } else {
            courses = ids;
        }
    }
    if (courses && courses.length) {
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
        let promises = [];
        if (students) {
            extra.push('STUDENTS');
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
            extra.push('TAS');
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
            extra.push('PROFESSOR');
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
                promises.push(db.queryDB(sqlTas, [course.ID], db.QUERY.SINGLE));
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

function addCourse(netid, name, dept, semester) {
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

function addCourseTimes(start, end, loc, cid) {
    return officehours.addTimeblock(start, end, loc).then( tbid => {
        let sqlInsert = `
            insert into coursetime(timeblock_id, course_id)
            values (:tbid, :cid)
        `;
        return db.queryDB(sqlInsert, [tbid, cid], db.QUERY.INSERT);
    });
}

function addCourseTimesReq(req) {
    let missing = missingKeys(req.body, ['starttime', 'endtime', 'location'], req);
    if (missing.length) {
        return Promise.reject('Missing keys: ' + JSON.stringify(missing));
    }
    let {starttime, endtime, location} = req.body;
    let cid = req.params.cid;
    return addCourseTimes(starttime, endtime, location, cid);
}

function getCourseTimes(cid) {
    let sql = `
        select tb.timeblock_id AS tid, tb.location, tb.starttime, tb.endtime,
            'COURSE' AS "TYPE", c.course_id AS CID, c.course_name AS CNAME, u.name AS TEACHER
        from timeblock tb
            JOIN coursetime ct ON (ct.timeblock_id = tb.timeblock_id)
            JOIN course c ON (ct.course_id = c.course_id)
            JOIN proffor pf ON (pf.course_id = c.course_id)
            JOIN users u ON (pf.netid = u.netid)
        where c.course_id = :cid
    `;
    return db.queryDB(sql, [cid], db.QUERY.MULTIPLE);
}

function getCourseTimesReq(req) {
    return getCourseTimes(req.params.cid);
}

module.exports = {
    router:router,
    getCourses: getCourses,
    getCourseTimes: getCourseTimes,
};
