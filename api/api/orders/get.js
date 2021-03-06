/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function orders_get(app) {
	app.get('/orders', (req, res) => {
		// #swagger.summary = 'Get all orders'
		let user = req.uid;
		let pass = req.auth;
		queries.orders.getAll(user, pass)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/orders/${row.id}`;
				}
				res.status(200).json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};