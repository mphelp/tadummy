module.exports = {
    //all: `select * from cat`,
    //all:      'select netid, location, starttime, endtime from timeblock tb, taofficehours toh where tb.timeblock_id = toh.timeblock_id',
    all: 'with tohblock as (SELECT starttime \"start\", endtime \"end\", netid || \' at \' || location \"title\" FROM timeblock tb, taofficehours toh WHERE tb.timeblock_id = toh.timeblock_id) SELECT * from tohblock',
    specific: 'select netid, location, starttime, endtime from timeblock tb, taofficehours toh where tb.timeblock_id = toh.timeblock_id and netid=:bv',
}
