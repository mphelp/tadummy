const router = require('express').Router()
const db = require('../database');
const users = require('./users');
const missingKeys = require('../missingKeys')
const api = require('./api');
const courseFuncs = require('./courses');
const momentTime = require('../momentTime');

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

router.get('/:netid/times', api.query(getOfficehoursReq));

router.get('/:netid/courses', api.query(getCoursesReq));

router.put('/status', api.query(setStatusReq));

router.delete('/:netid/:cid', api.delete(deleteOfficehoursReq));

function addTimeblocks(start, end, loc, cid, recur=true) {
    let tids = [];
    let starttime = new Date(start);
    let startH = starttime.getHours();
    let startM = starttime.getMinutes();
    let endtime = new Date(end);
    let endH = endtime.getHours();
    let endM = endtime.getMinutes();
    if (recur) {
        return courseFuncs.getCourseSemester(cid).then ( sem => {
            return momentTime.getWeeklyTimes(start, end, sem);
        }).then ( dates => {
            let promises = [];
            for (i in dates) {
                let blockStart = new Date(dates[i]).setHours(startH, startM);
                let blockEnd = new Date(dates[i]).setHours(endH, endM);
                promises.push(addTimeblock(blockStart, blockEnd, loc));
            }
            return Promise.all(promises);
        });
    } else {
        return addTimeblock(start, end, loc).then ( id => {
            return [id];
        });
    }
}

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
    let promises = [
        addTimeblocks(start, end, loc, cid),
        getType(netid, 'OFFICEHOURS')
    ];
    return Promise.all(promises).then( data => {
        let timeblockids = data[0];
        let table = data[1];
        if (!table) {
            return null;
        }
        let promises = [];
        for (i in timeblockids) {
            let tbid = timeblockids[i];
            let sql =  `
                insert into `+table+`(timeblock_id, netid, course_id)
                values (:tbid, :netid, :cid)
            `;
            promises.push(db.queryDB(sql, [tbid, netid, cid], db.QUERY.INSERT));
        }
        return Promise.all(promises);
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
    let missing = missingKeys(req.body, ['netid', 'cid', 'avail_id'], req);
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

function deleteOfficehours(netid, cid) {
    let table;
    let deletesql;
    let deletesql2;
    return getType(netid, 'OFFICEHOURS').then( tableType => {
        table = tableType;
        let timesql = `
            select timeblock_id as ID
            from `+table+`
            where netid = :netid AND course_id = :cid
        `;
        deletesql = 'delete from '+table;
        deletesql2 = 'delete from timeblock';
        return db.queryDB(timesql, [netid, cid], db.QUERY.MULTIPLE);
    }).then ( data => {
        console.log('tb ids to delete: ' + JSON.stringify(data));
        if (!data.length) {
            return Promise.resolve();
        }
        let ids = [];
        for (i in data) {
            ids.push(data[i].ID);
        }
        let where = ' WHERE ';
        let params = [];
        where += db.buildConditional('timeblock_id', ids, params);
        return Promise.all([
            db.queryDB(deletesql+where, params, db.QUERY.DELETE),
            db.queryDB(deletesql2+where, params, db.QUERY.DELETE),
        ]);
    });
}

function deleteOfficehoursReq(req) {
    let netid = req.params.netid;
    let cid = req.params.cid;
    return deleteOfficehours(netid, cid);
}

module.exports = {
    router: router,
    getOfficehours: getOfficehours,
    addTimeblock: addTimeblock,
    addTimeblocks: addTimeblocks,
    getType: getType,
};
