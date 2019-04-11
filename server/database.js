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

async function processResults(res){
	console.log(res)
}

// use connection pool to execute query
function queryDB(sqlquery, bindings){
	return new Promise(async function(resolve, reject){
		let conn;
        let rows = [];
		try {
			// get connection from default pool
			conn = await oracledb.getConnection();
			let options = { outFormat: oracledb.OBJECT };
			let result1 = await conn.execute(sqlquery, bindings, options);

            rows = result1.rows;
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
			resolve(rows);
		}
	});
}

module.exports = {
    queryDB: queryDB,
    createConnectionPool: createConnectionPool,
}
