/*jshint esversion: 6 */
const connect = require('./connect');

module.exports = {
	getAll:function(user, pass, companyid){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM companyusers WHERE companyid = ' + conn.escape(companyid);
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
	getID:function(user, pass, companyid, id){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM companyusers WHERE companyid = ' + conn.escape(companyid) +  ' AND id = ' + conn.escape(id);
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
	add:function(user, pass, companyid, first_name, last_name){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL AddCompanyUser(' + conn.escape(companyid) + ',' + conn.escape(first_name) + ',' + conn.escape(last_name) + ')';
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
	update:function(user, pass, companyid, id, first_name, last_name){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL UpdateCompanyUser(' + conn.escape(companyid) + ',' + conn.escape(id) + ',' + conn.escape(first_name) + ',' + conn.escape(last_name) + ')';
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
	}
};