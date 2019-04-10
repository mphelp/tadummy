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

if (config.https) {
    var options = {
        hostname: 'localhost',
        key: fs.readFileSync(config.https.sslKeyPath),
        cert: fs.readFileSync(config.https.sslCertPath)
    };

    https.createServer(options, app).listen(config.port, () => console.log(`Running https server on port ${config.port}`));
} else {
    app.listen(config.port, () => console.log(`Running http server on port ${config.port}`))
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

app.get('/', cas.bounce, (req, res) => {
    res.json({cas_user : req.session[cas.session_name]});
})

app.get('/hi', cas.bounce, (req, res) => {
    res.json({
        cas_user : req.session[cas.session_name],
        data: "hi",
    });
})

// SQL queries
let sql1 = `SELECT * FROM admin.users`


async function processResults(res){
	console.log(res)
}
async function run() {
  try {
		await oracledb.createPool(config.database);

		let result1 = await database.queryDB(sql1, []);
		console.log("Results for this query: " + sql1)
		processResults(result1);
  } catch (err) {
		console.error(err);
  }
}

run();

