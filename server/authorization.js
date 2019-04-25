const database = require('./database');

const ROLES = {
    ADMIN:      'ADMIN',
    STUDENT:    'STUDENT',
    PROFESSOR:  'PROFESSOR',
    TA:         'TA',
};

function getRoles(netid) {
    let sql = `select netid, admin, student, professor from admin.userroles where netid = :id`;
    return database.queryDB(sql, [netid], database.QUERY.SINGLE);
}

// This tutorial came in CLUTCH with authorization:
// http://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api
function authorize(netid, validRoles = []) {
    if (typeof validRoles === 'string') {
        validRoles = [validRoles];
    }
    if (!netid) {
        return data;
    }
    return getRoles(netid).then(userRoles => {
        if (Object.keys(userRoles).length === 0) {
            return {authorized: false};
        }
        userRoles['authorized'] = true;
        for (role in validRoles) {
            if (!userRoles[role]) {
                userRoles['authorized'] = false;
                break;
            }
        }
        return userRoles;
    }).catch(console.log);
};

module.exports = {
    authorize: authorize,
    getRoles: getRoles,
    ROLES: ROLES
}
