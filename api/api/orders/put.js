/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function orders_put(app) {
	app.put('/orders', (req, res) => {
		// #swagger.summary = 'Add a new order'
		let user = req.uid;
		let pass = req.auth;
		let orderNumber = req.body.orderNumber;
		let vendorID = typecheck.checkInt(req.body.vendorid);
		let orderdate = typecheck.checkInt(req.body.date);
		let cost = typecheck.checkFloat(req.body.costs);
		queries.orders.add(user, pass, orderNumber, vendorID, orderdate, cost)
			.then(() =>{
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};