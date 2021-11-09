/*jshint esversion: 6 */

const mariadb = require('mariadb');
const config = require('../../config.json');

module.exports = function(user, pass){
	return new Promise((resolve, reject) => {
		mariadb.createConnection({
			user: user,
			password: pass,
			database: config.db.MYSQL_DB
		})
			.then(conn => {
				return resolve(conn);
			}).catch((err)=> {
				return reject(err);
			});
	});
};