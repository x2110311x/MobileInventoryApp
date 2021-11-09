/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function items_getID(app) {
	app.get('/items/:itemid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let itemid = parseInt(req.params.itemid);
		if (isNaN(itemid)){
			res.sendStatus(400);
			return;
		} 		
		queries.items.getAll(user, pass, itemid)
			.then((rows) =>{
				let row = rows[0];
				row.url = `/items/${row.id}`;
				res.json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};