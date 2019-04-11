const oracledb = require('oracledb')

// Database functions go here:


async function createConnectionPool(dbConfig) {
    try {
        await oracledb.createPool({
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString,
        });
    } catch (err) {
		console.error(err);
    }
}

// SQL queries
let sql1 = `SELECT * FROM admin.users`

async function testQuery() {
    try {
		let result1 = await queryDB(sql1, []);
		console.log("Results for this query: " + sql1)
		processResults(result1);
    } catch (err) {
        console.log(err);
    }
}

async function processResults(res){
	console.log(res)
}

// use connection pool to execute query
function queryDB(sqlquery, bindings){
	return new Promise(async function(resolve, reject){

		let conn;
		try {
			// get connection from default pool
			conn = await oracledb.getConnection();
			let options = { outFormat: oracledb.OBJECT };
			let result1 = await conn.execute(sqlquery, bindings, options);

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

function queryDBSync(sqlquery, bindings, callback) {
    let resultPromise = queryDB(sqlquery, bindings);
    resultPromise.then(result => {
        callback(result);
    }, function(err) {
        console.log(err);
    })
}

module.exports = {
    queryDB: queryDB,
    queryDBSync: queryDBSync,
    createConnectionPool: createConnectionPool,
    testQuery: testQuery
}
