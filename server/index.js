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
const cors = require('cors')
const bodyParser = require('body-parser')

const session = require('express-session')
const CASAutentication = require('cas-authentication')

if (config.server.https) {
    var options = {
        hostname: 'localhost',
        key: fs.readFileSync(config.server.https.sslKeyPath),
        cert: fs.readFileSync(config.server.https.sslCertPath)
    };

    https.createServer(options, app).listen(config.server.port, () => {
        database.createConnectionPool(config.server.database);
        console.log(`Running https server on port ${config.server.port}`);
    });
} else {
    app.listen(config.server.port, () => {
        database.createConnectionPool(config.server.database);
        console.log(`Running http server on port ${config.server.port}`);
    });
}
console.log(`Running http client on port ${config.client.port}`);

app.set('view engine', 'pug');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret              : 'super secret key',
    resave              : false,
    saveUninitialized   : true
}));

const cas = new CASAutentication({
    cas_url     : 'https://login-test.cc.nd.edu/cas',
    service_url : 'https://ta.esc.nd.edu:' + config.server.port,
    cas_version : '3.0',
    session_name: 'netid',
    is_dev_mode : (config.netid != null),
    dev_mode_user: config.netid,
});

app.get('/login', cas.bounce, (req, res) => {
    let netid = req.session[cas.session_name];
	res.render('redirection', {port: config.client.port, ip: config.ip, netid: netid});
})

app.post('/authorize', (req, res) => {
    auth.authorize(req.body.netid, req.body.roles).then( letThemIn => {
        if (letThemIn) {
            res.json({authorized: true});
        } else {
            ldap.getInfo(req.body.netid).then( data => {
                data['authorized'] = false;
                res.json(data);
            });
        }
    }).catch( err => {
        res.json({authorized: false});
    });
});

function signup(req, res) {
    let netid = req.session[cas.session_name];
    ldap.getInfo(netid).then(info => {
        res.json(info);
    });
}
