/*jshint esversion: 6 */
const mariadb = require('mariadb');
const config = require('../config.json');

module.exports = function query(user, pass, query){
	return new Promise((resolve, reject) => {
		mariadb.createConnection({
			user: user,
			password: pass,
			database: config.db.MYSQL_DB
		})
			.then(conn => {
				conn.query(query)
					.then((rows) =>{
						return resolve(rows);
					}).catch((err)=> {
						return reject(err);
					});
			}).catch((err)=> {
				return reject(err);
			});
	});
};