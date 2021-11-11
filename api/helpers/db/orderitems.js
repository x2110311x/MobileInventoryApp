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
	getAll:function(user, pass, orderid){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'SELECT * FROM items WHERE order_number = ' + conn.escape(orderid);
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
	add:function(user, pass, orderNumber, desc, cost, price, typeID, model, checked_in, received){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'CALL addItem(' + conn.escape(orderNumber) + ',' + conn.escape(desc) +
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
	}
};