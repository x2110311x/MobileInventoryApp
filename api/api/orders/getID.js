/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function orders_getID(app) {
	app.get('/orders/:orderid', (req, res) => {
		// #swagger.summary = 'Get a specific order'
		let user = req.uid;
		let pass = req.auth;
		let orderid = typecheck.checkInt(req.params.orderid);
		if(!orderid || orderid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.orders.getID(user, pass, orderid)
			.then((row) =>{
				if(row === undefined){
					res.status(404).send(`Unknown Order: ${orderid}`);
					return;
				}
				row.url = `/orders/${row.id}`;
				res.status(200).json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};