const database = require('./database');
const looping = require('deasync');

function authorize(netid) {
    let sql = `select * from admin.users where netid = :id`;
    let done = false;
    let found = false;
    let result = database.queryDBSync(sql, [netid], (result) => {
        console.log(result);
        if (result.length === 0) {
            console.log(`No user '{netid}' found!`);
        } else {
            console.log(`user '{netid}' found!`);
            found = true;
        }
        done = true;
    });

    while (!done) {
        looping.runLoopOnce();
    }

    return found;
}

module.exports = {
    authorize: authorize
}
