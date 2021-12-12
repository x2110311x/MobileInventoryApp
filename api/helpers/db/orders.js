/*jshint esversion: 6 */
const connect = require('./connect');

module.exports = {
	getAll:function(user, pass){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM orders';
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
					let query = 'SELECT * FROM orders WHERE id = ' + conn.escape(id);
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
	add:function(user, pass, ordernum, vendorid, orderdate, cost){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL addOrder(' + conn.escape(ordernum) + ',' + conn.escape(vendorid) + ',' + conn.escape(orderdate) + 
					',' + conn.escape(cost) + '); SELECT LAST_INSERT_ID();';
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
	update:function(user, pass, orderid, ordernum , vendorid, orderdate, cost){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL updateOrder(' + conn.escape(orderid) + ',' + conn.escape(ordernum) + ',' + conn.escape(vendorid) + ',' + conn.escape(orderdate) + ',' + conn.escape(cost) + ')';
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
	items: require('./orderitems')
};