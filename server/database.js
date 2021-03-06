const oracledb = require('oracledb')

// Database functions go here:

var QUERY = {
    SINGLE: 0,
    MULTIPLE: 1,
    INSERT: 2,
    UPDATE: 3,
    DELETE: 4,
};

async function createConnectionPool(dbConfig) {
    oracledb.poolMin = oracledb.poolMax;
    oracledb.poolIncrement = 0;
    oracledb.fetchArraySize = 20;
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
        let startTime = Date.now();
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
            } else if (type === QUERY.UPDATE) {
                returnVal = result1.rowsAffected;
            } else if (type === QUERY.DELETE) {
                returnVal = result1;
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
            let endTime = Date.now();
            let timeTaken = (endTime - startTime) / 1000;
            console.log('Done running query ['+queryNum+'] in '+timeTaken+' seconds!');
            if (returnVal !== null && returnVal !== undefined) resolve(returnVal);
            else reject(result1);
		}
	});
}

function buildConditional(key, values, params) {
    let cond = '(';
    for (i in values) {
        if (i != 0) {
            cond += ' OR ';
        }
        cond += key + ' = :val'
        params.push(values[i]);
    }
    cond += ')';
    return cond;
}


module.exports = {
    queryDB: queryDB,
    createConnectionPool: createConnectionPool,
    QUERY: QUERY,
    buildConditional: buildConditional,
}
