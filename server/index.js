// setup
const express = require('express')
const app = express()
const config = require('./config.js')
const database = require('./database.js')
const auth = require('./authorization.js')
const api = require('./api.js')
const oracledb = require('oracledb')
const https = require('https')
const fs = require('fs')
const ldap = require('./ldap.js')

// routes
const tohblock = require('./routes/tohblock.js')

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
    auth.authorize(req.body.netid, req.body.roles).then( roles => {
        if (!roles.authorized && req.body.ldap) {
            ldap.getInfo(req.body.netid).then( data => {
                roles['ldap'] = data;
                res.json(roles);
            });
        } else {
            res.json(roles);
        }
    }).catch( err => {
        res.json({authorized: false});
    });
});

// Routes
app.use('/tohblock', tohblock);

app.post('/registerStudent', (req, res) => {
    console.log('registering student');
    console.log(req.body);
    database.registerStudent(req.body).then( result => {
        console.log(result);
        res.sendStatus(201);
    }, err => {
        res.sendStatus(400);
    });
});

app.post('/registerFaculty', (req, res) => {
    console.log('registering faculty');
    database.registerFaculty(req.body).then( result => {
        console.log(result);
        res.sendStatus(201);
    }, err => {
        res.sendStatus(400);
    });
});


app.get('/api/dorms', api.apiQuery(api.dorms));

app.get('/api/departments', api.apiQuery(api.departments));

app.get('/api/majors', api.apiQuery(api.majors));

