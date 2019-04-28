const oracledb = require('oracledb')

// Database functions go here:

var QUERY = {
    SINGLE: 0,
    MULTIPLE: 1,
    INSERT: 2,
};

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
function queryDB(sqlquery, bindings, type = QUERY.MULTIPLE){
    if (typeof queryDB.count == 'undefined') {
        queryDB.count = 0;
    }
	return new Promise(async function(resolve, reject){
		let conn;
        let returnVal = null;
        let result1 = null;
        queryDB.count++;
        let queryNum = queryDB.count;
        console.log('Running query ['+queryNum+']: ' + sqlquery);
		try {
			// get connection from default pool
			conn = await oracledb.getConnection();
			let options = { outFormat: oracledb.OBJECT, autoCommit: true};
			result1 = await conn.execute(sqlquery, bindings, options);
            if (type === QUERY.SINGLE) {
                if (result1.rows.length === 0) {
                    returnVal = {};
                } else {
                    returnVal = result1.rows[0];
                }
            } else if (type === QUERY.MULTIPLE) {
                returnVal = result1.rows;
            } else if (type === QUERY.INSERT) {
                returnVal = result1.rowsAffected;
            }
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
            console.log('Done running query ['+queryNum+']!');
            if (returnVal !== null && returnVal !== undefined) resolve(returnVal);
            else reject(result1);
		}
	});
}


module.exports = {
    queryDB: queryDB,
    createConnectionPool: createConnectionPool,
    QUERY: QUERY,
}
