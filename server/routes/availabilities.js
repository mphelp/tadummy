const router = require('express').Router()
const db = require('../database');
const api = require('./api');


router.get('/', api.query(getAvailReq));

router.get('/:id', api.query(getSingleAvailReq));

/* Optional parameters
 *
 * cid: number of single course to get
 * ids: array of course ids (default to all courses)
 * students: [bool] do include students in course
 * tas:      [bool] do include tas in course
 * professor:[bool] do include professor information
 */
function getAvails({id=null}) {
    let sqlSelect = 'SELECT avail_id AS id, avail_desc AS type';
    let sqlFrom = 'FROM availability';
    let sqlWhere = 'WHERE 1=1';
    let params = [];
    if (id) {
        sqlWhere += ' AND avail_id = :id';
        params.push(id);
    }
    let sql = sqlSelect + ' ' + sqlFrom + ' ' + sqlWhere;
    return db.queryDB(sql, params, db.QUERY.MULTIPLE).then( data => {
        return id ? data[0] : data;
    });
}

function getAvailReq(req) {
    return getAvails({...req.query});
}

function getSingleAvailReq(req) {
    return getAvails({id: req.params.cid, ...req.query});
}


module.exports = {
    router:router,
};
