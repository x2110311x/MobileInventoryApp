/*jshint esversion: 6 */
const db = require('../../helpers/db');

module.exports =
function items_getID(app) {
	app.get('/items/:itemid', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, `SELECT * FROM items WHERE id = ${req.params.itemid}`)
			.then((rows) =>{
				let row = rows[0];
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
				res.json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};