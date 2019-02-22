const express = require('express')
const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
	res.send('Hello there welcome to TAdummy - Ed, Matt, Patrick!')
})

// Database connection attempt
let CLASSIP = "34.238.200.26"
let potentialXEConnectString = "Driver=(Oracle in XEClient);dbq=34.238.200.26:1521/XE;Uid=mphelps3;Pwd=mphelps3;"
let connectStr = "(DESCRIPTION = \
	(ADDRESS = (PROTOCOL = TCP)(HOST = "+ CLASSIP + ")(PORT=1521)) \
 	(CONNECT_DATA = (SID = ORCL)))"

let myresults;
const oracledb = require('oracledb')
function getEmployee(empid) {
  return new Promise(async function(resolve, reject) {
    let conn;

    try {
      conn = await oracledb.getConnection({
        user          : "mphelps3",
        password      : "mphelps3",
        connectString : connectStr
      });

      let result = await conn.execute(
        `SELECT * FROM salesperson`,
      );
      resolve(result.rows);

    } catch (err) { // catches errors in getConnection and the query
      reject(err);
    } finally {
      if (conn) {   // the conn assignment worked, must release
        try {
          await conn.release();
        } catch (e) {
          console.error(e);
        }
      }
    }
  });
}

async function run() {
  try {
    let res = await getEmployee(101);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}

run();

