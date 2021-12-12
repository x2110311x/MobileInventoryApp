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
	},
	addMultiple: function(user, pass, orderNumber, items){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let count = 0;
					let query = 'INSERT INTO items(order_number,description,cost,price,typeid,model,received,checked_out) VALUES ' ;
					for (var item of items){
						if(count == 0) query += `(${orderNumber},"${item.description}",${item.cost},${item.price},${item.type},${item.model},0,0)`;
						else query += `, (${orderNumber},"${item.description}",${item.cost},${item.price},${item.type},${item.model},0,0)`;
						count+=1;
					}					
					query += `; UPDATE orders SET number_of_items = number_of_items + ${count};`;
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