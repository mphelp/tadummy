const router = require('express').Router()
const db = require('../database');
const users = require('./users');
const missingKeys = require('../missingKeys')
const api = require('./api');

/* Required fields:
 * netid:   netid office hour owner
 * cid:     course_id for course
 * times: array of times for office hours with following properties
 *      start
 *      end
 *      location
 */
router.post('/', (req, res) => {
    if (missingKeys(req.body, ['netid', 'cid'], req, res).length) {
        return;
    }
    let {netid, cid, starttime, endtime, location} = req.body;
    return addOfficehour(start, end, location, netid, cid).then ( result => {
        res.sendStatus(201);
    }, err => {
        res.status(400).send(err);
    });
});

function addTimeblock(start, end, loc) {
    let sql = `
        insert into timeblock(starttime, endtime, location)
        values (:starttime, :endtime, :loc)
    `;
    let starttime = new Date(start);
    let endtime = new Date(end);
    return db.queryDB(sql, [starttime, endtime, loc], db.QUERY.INSERT);
}

function getType(netid) {
    return users.getRoles(netid).then( roles => {
        if (roles.TA) {
            return 'TA';
        } else if (roles.PROFESSOR) {
            return 'PROF';
        } else {
            return null;
        }
    });
}

function addOfficehour(start, end, loc, netid, cid) {
    let starttime = new Date(start);
    let endtime = new Date(end);
    let timeblocksql = `
        select ID from (
            select timeblock_id as ID
            from timeblock
            where starttime = :starttime AND endtime = :endtime AND location = :loc
            order by ID desc
        ) where ROWNUM <= 1
    `;
    let promises = [
        addTimeblock(start, end, loc),
        db.queryDB(timeblocksql, [starttime, endtime, loc], db.QUERY.SINGLE),
        getType(netid)
    ];
    return Promise.all(promises).then( data => {
        let timeblockid = data[1].ID;
        let table = data[2] + 'OFFICEHOURS';
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
function getOfficehours(netid) {
    console.log('office hours for ' + netid);
    let officeType;
    return getType(netid).then(  type => {
        if (!type) {
            return null;
        }
        officeType = type;
        let table = type+'OFFICEHOURS';
        let sql = `
            select timeblock_id as ID
            from `+table+`
            where netid = :netid
        `;
        return db.queryDB(sql, [netid], db.QUERY.MULTIPLE);
    }).then( ids => {
        let promises = [];
        let sqltime = `
            select timeblock_id AS id, location, starttime, endtime, '`+officeType+`' AS "TYPE"
            from timeblock
            where timeblock_id = :id
        `;
        for (i in ids) {
            let id = ids[i].ID;
            promises.push(db.queryDB(sqltime, [id], db.QUERY.SINGLE));
        }
        return Promise.all(promises);
    });
}

module.exports = {
    router: router,
    getOfficehours: getOfficehours,
};
