// setup
const express = require('express')
const app = express()
const config = require('./config.js')
const database = require('./database.js')
const oracledb = require('oracledb')
const https = require('https')
const fs = require('fs')

const session = require('express-session')
const CASAutentication = require('cas-authentication')

var casPort;
if (config.https) {
    var options = {
        hostname: 'localhost',
        key: fs.readFileSync(config.https.sslKeyPath),
        cert: fs.readFileSync(config.https.sslCertPath)
    };
    casPort = config.https.port;

    var server = https.createServer(options, app).listen(config.https.port, () => console.log(`Running https server on port ${config.https.port}`));
} else {
    casPort = config.port;
}

app.listen(config.port, () => console.log(`Running http server on port ${config.port}`))

app.use(session({
    secret              : 'super secret key',
    resave              : false,
    saveUninitialized   : true
}));

const cas = new CASAutentication({
    cas_url     : 'https://login-test.cc.nd.edu/cas',
    service_url : 'https://ta.esc.nd.edu:' + casPort,
    cas_version : '3.0',
    session_name: 'cas_user',
    is_dev_mode : (config.casUser != null),
    dev_mode_user: config.casUser,
});

app.get('/', cas.bounce, (req, res) => {
    res.json({cas_user : req.session[cas.session_name]});
})

app.get('/hi', cas.bounce, (req, res) => {
    res.json({
        cas_user : req.session[cas.session_name],
        data: "hi",
    });
})


// Database connection configurations
//let CLASSIP = "34.238.200.26"
//let IP = "localhost"
let IP = "3.210.165.177"
let connectStr = "(DESCRIPTION = \
	(ADDRESS = (PROTOCOL = TCP)(HOST = "+ IP + ")(PORT=1521)) \
	(CONNECT_DATA = (SERVICE_NAME = XE)))"

// SQL queries
let sql1 = `SELECT * FROM cat`


async function processResults(res){
	console.log(res)
}
async function run() {
  try {
		await oracledb.createPool({
			user          : config.dbuser,
			password      : config.dbpass,
			connectString : connectStr
		});

		let result1 = await database.queryDB(sql1, []);
		console.log("Results for this query: " + sql1)
		processResults(result1);
  } catch (err) {
		console.error(err);
  }
}

run();

