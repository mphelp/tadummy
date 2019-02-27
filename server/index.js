// setup
const express = require('express')
const app = express()
const dbconfig = require('./dbconfig.js')
const webconfig = require('./webconfig.js')
const { port } = webconfig
const oracledb = require('oracledb')


app.get('/', (req, res) => {
	res.send('Hello there welcome to TAdummy - Ed, Matt, Patrick!')
})

// Database connection configurations
let CLASSIP = "34.238.200.26"
let connectStr = "(DESCRIPTION = \
	(ADDRESS = (PROTOCOL = TCP)(HOST = "+ CLASSIP + ")(PORT=1521)) \
	(CONNECT_DATA = (SERVICE_NAME = XE)))"

// SQL queries
let sql1 = `SELECT * FROM customer`

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
			user          : dbconfig.user,
			password      : dbconfig.password,
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

