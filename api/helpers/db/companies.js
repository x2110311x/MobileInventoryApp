/*jshint esversion: 6 */
const connect = require('./connect');

module.exports = {
	getAll:function(user, pass){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM companies';
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
	},
	getID:function(user, pass, id){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM companies WHERE id = ' + conn.escape(id);
					conn.query(query)
						.then((rows) =>{
							return resolve(rows[0]);
						}).catch((err)=> {
							return reject(err);
						});
				}).catch((err)=> {
					return reject(err);
				});
		});
	},
	add:function(user, pass, name, id){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL addCompany(' + conn.escape(name) + ',' + conn.escape(id) + ')';
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
	},
	update:function(user, pass, companyid, name, id){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL updateCompany(' + conn.escape(companyid) + ',' + conn.escape(name) + ',' + conn.escape(id) + ')';
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
	},
	users: require('./companyusers')
};