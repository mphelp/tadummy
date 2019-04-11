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
function authorize(validRoles = [], cas) {
    if (typeof validRoles === 'string') {
        validRoles = [validRoles];
    }
    return [
        (req, res, next) => {
            let netid = req.session[cas.session_name];
            if (!netid) {
                return res.status(401).json({
                    message: "Unauthenticated. You must sign in through CAS before accessing this site."
                });
            }
            let rolePromise = getRoles(netid);
            rolePromise.then(userRoles => {
                req.session['user_roles'] = userRoles;
                if (!userRoles) {
                    return res.redirect('/signup');
                } else if (validRoles.length &&
                !validRoles.filter(elm => userRoles.includes(elm)).length) {
                    return res.status(401).json({message: "Unauthorized"});
                }
                next();
            }).catch(console.log);
        }
    ];
};

module.exports = {
    authorize: authorize,
    getRoles: getRoles,
    ROLES: ROLES
}
