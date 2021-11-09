/*jshint esversion: 6 */
const db = require('../../../helpers/db');
module.exports =
function orders_items_get(app) {
	app.get('/orders/:orderid/items', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, `SELECT * FROM items WHERE order_number = ${req.params.orderid}`)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/items/${row.id}`;
					if (row.received == {'type':'Buffer','data':[49]}){
						row.received = true;
					} else {
						row.received = false;                    
					}
					if (row.checked_out == {'type':'Buffer','data':[49]}){
						row.checked_out = true;
					} else {
						row.checked_out = false;                    
					}
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};