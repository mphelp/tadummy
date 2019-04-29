const router = require('express').Router()
const db = require('../database');
const users = require('./users');
const missingKeys = require('../missingKeys')
const api = require('./api');

/* Required fields:
 * netid:   netid office hour owner
 * cid:     course_id for course
 * times: array of times for office hours with following properties
 *      starttime
 *      endtime
 *      location
 */
router.post('/', (req, res) => {
    if (missingKeys(req.body, ['netid', 'cid', 'starttime', 'endtime', 'location'], req, res).length) {
        return;
    }
    let {netid, cid, starttime, endtime, location} = req.body;
    return addOfficehour(starttime, endtime, location, netid, cid).then ( result => {
        res.sendStatus(201);
    }, err => {
        res.status(400).send(err);
    });
});

router.get('/:netid', api.query(getOfficehoursReq));

router.get('/:netid/courses', api.query(getCoursesReq));

router.put('/status', api.query(setStatusReq));

function addTimeblock(start, end, loc) {
    let sql = `
        insert into timeblock(starttime, endtime, location)
        values (:starttime, :endtime, :loc)
    `;
    let timeblocksql = `
        select ID from (
            select timeblock_id as ID
            from timeblock
            where starttime = :starttime AND endtime = :endtime AND location = :loc
            order by ID desc
        ) where ROWNUM <= 1
    `;
    let starttime = new Date(start);
    let endtime = new Date(end);
    return db.queryDB(sql, [starttime, endtime, loc], db.QUERY.INSERT).then( (data) => {
        return db.queryDB(timeblocksql, [starttime, endtime, loc], db.QUERY.SINGLE);
    }).then ( data => {
        return data.ID;
    });
}

function getType(netid, table='') {
    return users.getRoles(netid).then( roles => {
        if (roles.TA) {
            return 'TA' + table;
        } else if (roles.PROFESSOR) {
            return 'PROF' + table;
        } else {
            return null;
        }
    });
}

function addOfficehour(start, end, loc, netid, cid) {
    let starttime = new Date(start);
    let endtime = new Date(end);
    let promises = [
        addTimeblock(start, end, loc),
        getType(netid, 'OFFICEHOURS')
    ];
    return Promise.all(promises).then( data => {
        let timeblockid = data[0];
        let table = data[1];
        if (!table) {
            return null;
        }
        let sql =  `
            insert into `+table+`(timeblock_id, netid, course_id)
            values (:timeblockid, :netid, :cid)
        `;
        return db.queryDB(sql, [timeblockid, netid, cid], db.QUERY.INSERT);
    });
}

// for courses NETID is TAing / teaching
function getOfficehours(netid, cid=undefined) {
    console.log('Getting office hour time blocks for ' + netid + ' course ' + cid);
    let officeType;
    let tableOH;
    return getType(netid).then(  type => {
        if (!type) {
            return null;
        }
        officeType = type;
        tableOH = type+'OFFICEHOURS';
        let sql = `
            select timeblock_id as ID
            from `+tableOH+`
            where netid = :netid
        `;
        let params = [netid];
        if (cid) {
            sql += ' AND course_id = :cid';
            params.push(cid);
        }
        return db.queryDB(sql, params, db.QUERY.MULTIPLE);
    }).then( ids => {
        let promises = [];
        let sqltime = `
            select tb.timeblock_id AS tid, tb.location, tb.starttime, tb.endtime,
                '`+officeType+`' AS "TYPE", c.course_id AS CID, c.course_name AS CNAME,
                u.name AS TEACHER
            from timeblock tb
                JOIN `+tableOH+` oh ON (tb.timeblock_id = oh.timeblock_id)
                JOIN course c ON (c.course_id = oh.course_id)
                JOIN users u ON (oh.netid = u.netid)
            where tb.timeblock_id = :id
        `;
        for (i in ids) {
            let id = ids[i].ID;
            promises.push(db.queryDB(sqltime, [id], db.QUERY.SINGLE));
        }
        return Promise.all(promises);
    });
}

function getOfficehoursReq(req) {
    return getOfficehours(req.params.netid);
}

function setStatus(netid, cid, avail_id, status) {
    return getType(netid, 'FOR').then( table => {
        let sql = `
            update `+table+`
            set avail_id = :avail_id, status = :status
            where netid = :netid AND course_id = :cid
        `;
        return db.queryDB(sql, [avail_id, status, netid, cid], db.QUERY.UPDATE);
    });
}

function setStatusReq(req) {
    let missing = missingKeys(req.body, ['netid', 'cid', 'avail_id', 'status'], req);
    if (missing.length) {
        return Promise.reject('Missing keys: ' + JSON.stringify(missing));
    }
    let {netid, cid, avail_id, status} = req.body;
    return setStatus(netid, cid, avail_id, status);
}

// get list of courses for specific TA or professor
function getCourses(netid) {
    return getType(netid).then ( type => {
        let tableFor = type+'FOR';
        let tableOH = type+'OFFICEHOURS';
        let sql = `
            select f.course_id AS CID, c.course_name AS CNAME, f.netid, av.avail_id, av.avail_desc, f.status
            from `+tableFor+` f
                JOIN availability av ON (f.avail_id = av.avail_id)
                JOIN course c ON (c.course_id = f.course_id)
            where f.netid = :netid
        `;
        return db.queryDB(sql, [netid], db.QUERY.MULTIPLE);
    });
}

function getCoursesReq(req) {
    return getCourses(req.params.netid);
}

module.exports = {
    router: router,
    getOfficehours: getOfficehours,
    addTimeblock: addTimeblock,
};
