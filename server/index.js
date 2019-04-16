// setup
const express = require('express')
const app = express()
const config = require('./config.js')
const database = require('./database.js')
const auth = require('./authorization.js')
const oracledb = require('oracledb')
const https = require('https')
const fs = require('fs')
const ldap = require('./ldap.js')

//const redirection = require('./redirection/index.html')

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

app.all('*', cas.bounce);

app.get('/', auth.authorize([auth.ROLES.ADMIN], cas), (req, res) => {
    //res.json(req.session);
		res.sendfile('redirection/index.html');
})

app.get('/signup', (req, res) => {
    let netid = req.session[cas.session_name];
    auth.getRoles(netid).then(roles => {
        if (roles) {
            res.redirect('/');
            throw new Error(`{netid} is already a registered user`);
        }
    }).then( () => {
        signup(req, res);
    }).catch(() => {});
})

function signup(req, res) {
    let netid = req.session[cas.session_name];
    ldap.getInfo(netid).then(info => {
        res.json(info);
    });
}
