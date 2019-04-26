const database = require('./database');

const ROLES = {
    ADMIN:      'ADMIN',
    STUDENT:    'STUDENT',
    PROFESSOR:  'PROFESSOR',
    TA:         'TA',
};

function getRoles(netid) {
    let sql = `select netid, admin from admin.users where netid = :id`;
    return database.queryDB(sql, [netid]).then(result => {
        if (result.length === 0) {
            return false;
        } else {
            let user = result[0];
            let roles = []
            for (role in ROLES) {
                if (user[role] === 1) {
                    roles.push(role);
                }
            }
            return roles;
        }
    });
}

// This tutorial came in CLUTCH with authorization:
// http://jasonwatmore.com/post/2018/11/28/nodejs-role-based-authorization-tutorial-with-example-api
function authorizeThing(netid, validRoles = []) {
    if (typeof validRoles === 'string') {
        validRoles = [validRoles];
    }
    return (req, res, next) => {
        if (!netid) {
            return res.status(401).json({
                message: "Unauthenticated. You must sign in through CAS before accessing this site."
            });
        }
        let rolePromise = getRoles(netid);
        rolePromise.then(userRoles => {
            if (!userRoles) {
                return [];
            } else if (validRoles.length &&
            !validRoles.filter(elm => userRoles.includes(elm)).length) {
                return res.status(401).json({message: "Unauthorized"});
            }
            next();
        }).catch(console.log);
    }

};

function authorize(netid, validRoles = []) {
    if (typeof validRoles === 'string') {
        validRoles = [validRoles];
    }
    if (!netid) {
        return false;
    }
    return getRoles(netid).then(userRoles => {
        if (!userRoles) {
            return false;
        } else if (validRoles.length &&
        !validRoles.filter(elm => userRoles.includes(elm)).length) {
            return false;
        }
        return true;
    }).catch(console.log);
};

module.exports = {
    authorize: authorize,
    getRoles: getRoles,
    ROLES: ROLES
}
