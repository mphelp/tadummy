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
	return new Promise(async function(resolve, reject){
		let conn;
        let returnVal = null;
        let result1 = null;
        console.log('running query: ' + sqlquery);
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
            if (returnVal !== null && returnVal !== undefined) resolve(returnVal);
            else reject(result1);
		}
	});
}

function registerStudent (data) {
    let sql = `
        insert into admin.student(netid, major, dorm)
        values (:netid, :major, :dorm)
    `;
    return Promise.all([
        insertUser(data),
        queryDB(sql, [data.netid, data.major, data.dorm], QUERY.INSERT)
    ]);
}

function registerFaculty (data) {
    let sql = `
        insert into admin.professor(netid, office, department_id)
        values (:netid, :office, :department_id)
    `;
    return Promise.all([
        insertUser(data),
        queryDB(sql, [data.netid, data.office, data.department_id], QUERY.INSERT)
    ]);
}

function insertUser(data) {
    let sql = `
        insert into admin.users(netid, name, admin, datejoined)
        values (:netid, :name, 0, SYSDATE)
    `;
    return queryDB(sql, [data.netid, data.name], QUERY.INSERT);
}

module.exports = {
    queryDB: queryDB,
    createConnectionPool: createConnectionPool,
    registerStudent: registerStudent,
    registerFaculty: registerFaculty,
    QUERY: QUERY,
}
