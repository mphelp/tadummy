const database = require('./database');
const looping = require('deasync');

const ROLES = {
    ADMIN:      'ISADMIN',
    STUDENT:    'isStudent',
    PROFESSOR:  'isProfessor',
    TA:         'isTA',
};

function authorize(netid, callback) {
    let sql = `select netid, isAdmin from admin.users where netid = :id`;
    return database.queryDB(sql, [netid]).then(result => {
        if (result.length === 0) {
            console.log(`No user {netid} found!`);
            return false;
        } else {
            let user = result[0];
            let roles = {}
            for (index in ROLES) {
                role = ROLES[index];
                roles[index] = user[role] || 0;
            }
            return roles;
        }
    });
}

module.exports = {
    authorize: authorize,
    ROLES: ROLES
}
