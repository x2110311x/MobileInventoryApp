/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function orders_postID(app) {
	app.post('/orders/:orderid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let orderNumber = req.params.orderNumber;
		let orderid = typecheck.checkInt(req.params.orderid);
		let vendorID = typecheck.checkInt(req.body.vendorid);
		let orderdate = typecheck.checkInt(req.body.date);
		let cost = typecheck.checkFloat(req.body.costs);
		queries.orders.update(user, pass, orderid, orderNumber, vendorID, orderdate, cost)
			.then(() =>{
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};