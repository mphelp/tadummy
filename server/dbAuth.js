const database = require('./database');
const looping = require('deasync');

const USER_ROLES = {
    ADMIN:      'ISADMIN',
    STUDENT:    'isStudent',
    PROFESSOR:  'isProfessor',
    TA:         'isTA',
};

function authorize(netid) {
    let sql = `select netid, isAdmin from admin.users where netid = :id`;
    let done = false;
    let roles = {};
    let result = database.queryDBSync(sql, [netid], (result) => {
        console.log(result);
        if (result.length === 0) {
            console.log(`No user {netid} found!`);
        } else {
            console.log(`user {netid} found!`);
            let user = result[0];
            console.log(user);
            for (index in USER_ROLES) {
                role = USER_ROLES[index];
                roles[index] = user[role];
            }
        }
        done = true;
    });

    while (!done) {
        looping.runLoopOnce();
    }
    return roles;
}

module.exports = {
    authorize: authorize
}
