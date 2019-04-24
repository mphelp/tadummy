module.exports = {
    //all: `select * from cat`,
    all:      'select netid, location, starttime, endtime from timeblock tb, taofficehours toh where tb.timeblock_id = toh.timeblock_id',
    specific: 'select netid, location, starttime, endtime from timeblock tb, taofficehours toh where tb.timeblock_id = toh.timeblock_id and netid=:bv',
}
