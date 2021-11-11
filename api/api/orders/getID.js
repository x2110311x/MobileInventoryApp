/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function orders_getID(app) {
	app.get('/orders/:orderid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
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
				res.json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};