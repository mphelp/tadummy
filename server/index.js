// setup
const express = require('express')
const app = express()
const config = require('./config.js')
const database = require('./database.js')
const dbAuth = require('./dbAuth.js')
const oracledb = require('oracledb')
const https = require('https')
const fs = require('fs')
const ldap = require('./ldap.js')

const session = require('express-session')
const CASAutentication = require('cas-authentication')

if (config.https) {
    var options = {
        hostname: 'localhost',
        key: fs.readFileSync(config.https.sslKeyPath),
        cert: fs.readFileSync(config.https.sslCertPath)
    };

    https.createServer(options, app).listen(config.port, () => {
        database.createConnectionPool(config.database);
        //database.testQuery();
        console.log(`Running https server on port ${config.port}`);
    });
} else {
    app.listen(config.port, () => {
        database.createConnectionPool(config.database);
        //database.testQuery();
        console.log(`Running http server on port ${config.port}`);
    });
}


app.use(session({
    secret              : 'super secret key',
    resave              : false,
    saveUninitialized   : true
}));

const cas = new CASAutentication({
    cas_url     : 'https://login-test.cc.nd.edu/cas',
    service_url : 'https://ta.esc.nd.edu:' + config.port,
    cas_version : '3.0',
    session_name: 'cas_user',
    is_dev_mode : (config.casUser != null),
    dev_mode_user: config.casUser,
});

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        (req, res, next) => {
            let netid = req.session[cas.session_name];
            let rolePromise = dbAuth.authorize(netid);
            let ldapPromise = ldap.getInfo(netid);
            Promise.all([rolePromise, ldapPromise]).then(values => {
                console.log(values);
                next();
            }).catch(console.log);
        }
    ];
};

app.get('/', cas.bounce, (req, res) => {
    let netid = req.session[cas.session_name];
    let rolePromise = dbAuth.authorize(netid);
    let ldapPromise = ldap.getInfo(netid);
    Promise.all([rolePromise, ldapPromise]).then(values => {
        res.json({
            user: netid,
            roles: values[0],
            ldap: values[1]
        });
    }).catch(console.log);
})

app.get('/hi', cas.bounce, (req, res) => {
    let query = `select * from admin.users`;
    database.queryDBSync(query, [], result => {
        res.json({
            cas_user : req.session[cas.session_name],
            data: result
        });
    });
})
