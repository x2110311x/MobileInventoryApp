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
					let query = 'SELECT i.id, i.order_number, i.description, i.received, i.checked_out, ' +
						'i.cost, i.price, t.type_name as type, m.name as model, i.serial_number ' +
						'FROM items as i, itemtypes as t, models as m ' +
						'WHERE i.typeid = t.typeid AND t.typeid = m.typeid AND i.model = m.id AND received=0 AND checked_out=0';
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
					let query = 'SELECT i.id, i.order_number, i.description, i.received, i.checked_out, ' +
						'i.cost, i.price, t.type_name as type, m.name as model, i.serial_number ' +
						'FROM items as i, itemtypes as t, models as m ' +
						'WHERE i.typeid = t.typeid AND i.model = m.id AND m.typeid = t.typeid AND received=1 AND checked_out=0';
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
					let query = 'SELECT i.id, i.order_number, i.description, i.serial_number, t.type_name as type, m.name as model, ' +
					'c.name as company, CONCAT(u.first_name, " ", u.last_name) as user, ui.ticket ' +
					'FROM items as i, useditems as ui, companies as c, companyusers as u, itemtypes as t, models as m ' +
					'WHERE checked_out=1 AND ui.companyid = c.id AND ui.item = i.id AND i.model = m.id AND m.typeid = t.typeid ' + 
					'AND i.typeid = t.typeid AND ui.companyUser = u.id';
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
					let query = 'SELECT i.id, i.order_number, i.description, i.received, i.checked_out, ' +
						'i.cost, i.price, t.type_name as type, m.name as model, i.serial_number ' +
						'FROM items as i, itemtypes as t, models as m ' +
						'WHERE i.typeid = m.typeid AND i.model = m.id AND i.id = ' + conn.escape(id);
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
	checkOut:function(user, pass, id, company, cUser, ticket){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'UPDATE items SET checked_out = 1' + ' WHERE id = ' + conn.escape(id) + '; ' +
						'INSERT INTO useditems(item, companyid, companyUser, ticket) VALUES(' + conn.escape(id) +', ' +
						conn.escape(company) + ', ' + conn.escape(cUser) + ', ' + conn.escape(ticket) + ')' +
						' ON DUPLICATE KEY UPDATE companyid=' + conn.escape(company) + ', companyUser=' + conn.escape(cUser) +
						', ticket =' + conn.escape(ticket) + ';';
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
	checkIn:function(user, pass, id){
		return new Promise((resolve, reject) => {
			connect(user, pass)
				.then(conn => {
					let query = 'UPDATE items SET checked_out = 0' + ' WHERE id = ' + conn.escape(id) + '; ' +
						'DELETE FROM useditems WHERE item = ' + conn.escape(id) + ';';
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
					received = received ? 1 : 0;
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