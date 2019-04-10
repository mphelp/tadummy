const oracledb = require('oracledb')

// Database functions go here:

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

module.exports = {
    queryDB: queryDB
}
