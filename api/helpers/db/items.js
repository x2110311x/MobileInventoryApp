/*jshint esversion: 6 */
const connect = require('./connect');

const tinyToBoolean = (column, next) => {
	if (column.type == 'TINY' && column.length === 1) {
		const val = column.int();
		return val === null ? null : val === 1;
	}
	return next();
};

module.exports = {
	getAll:function(user, pass){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM items';
					conn.query({typeCast: tinyToBoolean, sql:query})
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
	getNotReceived:function(user, pass){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM items WHERE received=0 AND checked_out=0';
					conn.query({typeCast: tinyToBoolean, sql:query})
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
	getReceived:function(user, pass){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM items WHERE received=1 AND checked_out=0';
					conn.query({typeCast: tinyToBoolean, sql:query})
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
	getCheckedOut:function(user, pass){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM items WHERE checked_out=1';
					conn.query({typeCast: tinyToBoolean, sql:query})
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
					let query = 'SELECT * FROM items WHERE id = ' + conn.escape(id);
					conn.query({typeCast: tinyToBoolean, sql:query})
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
	update:function(user, pass, id, orderNumber, desc, cost, price, typeID, model, checked_in, received){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL updateItem(' + conn.escape(id) + ',' + conn.escape(orderNumber) + ',' + conn.escape(desc) +
						',' + conn.escape(cost) + ',' + conn.escape(price) + ',' + conn.escape(typeID) + ',' + conn.escape(model) +
						',' + conn.escape(checked_in) + ',' + conn.escape(received) + ')';
					conn.query({typeCast: tinyToBoolean, sql:query})
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
	updateSerial:function(user, pass, id, serial){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'UPDATE items SET serial_number = ' + conn.escape(serial) + ' WHERE id = ' + conn.escape(id);
					conn.query({typeCast: tinyToBoolean, sql:query})
						.then((rows) =>{
							return resolve(rows);
						}).catch((err) => {
							return reject(err);
						});
				}).catch((err)=> {
					return reject(err);
				});
		});
	},
	checkInOut:function(user, pass, id, checkedout){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					checkedout = checkedout == true ? 1 : 0;
					let query = 'UPDATE items SET checked_out = ' + conn.escape(checkedout) + ' WHERE id = ' + conn.escape(id);
					conn.query({typeCast: tinyToBoolean, sql:query})
						.then((rows) =>{
							return resolve(rows);
						}).catch((err) => {
							return reject(err);
						});
				}).catch((err)=> {
					return reject(err);
				});
		});
	},
	receive:function(user, pass, id, received){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					received = received == true ? 1 : 0;
					let query = 'UPDATE items SET received = ' + conn.escape(received) + ' WHERE id = ' + conn.escape(id);
					conn.query({typeCast: tinyToBoolean, sql:query})
						.then((rows) =>{
							return resolve(rows);
						}).catch((err) => {
							return reject(err);
						});
				}).catch((err)=> {
					return reject(err);
				});
		});
	}
};