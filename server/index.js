// setup
const express = require('express')
const app = express()
const config = require('../config.js').server
const {port} = config
const oracledb = require('oracledb')

app.get('/', (req, res) => {
	res.send('Hello there welcome to TAdummy - Ed, Matt, Patrick!')
	//let data = ldap.search({base: 'uid=eatkins1', scope: LDAP.SUBTREE})
	//res.send(`Data for eatkins1: {data}`)
})

app.listen(port, () => console.log(`Running on port ${port}`))

// Database connection configurations
//let CLASSIP = "34.238.200.26"
let IP = "localhost"
let connectStr = "(DESCRIPTION = \
	(ADDRESS = (PROTOCOL = TCP)(HOST = "+ IP + ")(PORT=1521)) \
	(CONNECT_DATA = (SERVICE_NAME = XE)))"

// SQL queries
let sql1 = `SELECT * FROM cat`

// use connection pool to execute query
function queryDB(){
	return new Promise(async function(resolve, reject){

		let conn;
		try {
			// get connection from default pool
			conn = await oracledb.getConnection();
			let options = { outFormat: oracledb.OBJECT };
			let result1 = await conn.execute(sql1, [], options);

			resolve(result1.rows);
		} catch (err) {
			console.error(err);
		} finally {
			if (conn) {
				try {
					// put connection back in pool
					await conn.close();
				} catch (err) {
					console.error(err);
				}
			}
		}
	});
}
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

		let result1 = await queryDB();
		console.log("Results for this query: " + sql1)
		processResults(result1);
  } catch (err) {
		console.error(err);
  }
}

run();

