/*jshint esversion: 6 */
const queries = require('../../../helpers/db');
const typecheck = require('../../../helpers/typecheck');

module.exports =
function orders_items_get(app) {
	app.get('/orders/:orderid/items', (req, res) => {
		// #swagger.summary = 'Get all items for a specific order'
		let user = req.uid;
		let pass = req.header('X-Auth');
		let orderid = typecheck.checkInt(req.params.orderid);
		queries.orders.items.getAll(user, pass, orderid)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/items/${row.id}`;
				}
				res.status(200).json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};