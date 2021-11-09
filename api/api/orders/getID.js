/*jshint esversion: 6 */
const db = require('../../helpers/db');

module.exports =
function orders_getID(app) {
	app.get('/orders/:orderid', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, `SELECT * FROM orders WHERE id = ${req.params.orderid}`)
			.then((rows) =>{
				let row = rows[0];
				row.url = `/orders/${row.id}`;
				res.json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};