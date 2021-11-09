/*jshint esversion: 6 */
const db = require('../../helpers/db');

module.exports =
function orders_get(app) {
	app.get('/orders', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, 'SELECT * FROM orders')
			.then((rows) =>{
				for(var row of rows){
					row.url = `/orders/${row.id}`;
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};