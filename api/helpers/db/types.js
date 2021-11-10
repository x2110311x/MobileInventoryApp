/*jshint esversion: 6 */
const connect = require('./connect');

module.exports = {
	getAll:function(user, pass){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM itemtypes';
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
					let query = 'SELECT * FROM itemtypes WHERE typeid = ' + conn.escape(id);
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
	add:function(user, pass, name){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL addItemType(' + conn.escape(name)  + ')';
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
	update:function(user, pass, id, name){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL updateItemType(' + conn.escape(id) + ',' + conn.escape(name) + ')';
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