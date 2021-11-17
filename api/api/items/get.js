/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function items_get(app) {
	app.get('/items', (req, res) => {
		// #swagger.summary = 'Get all items'
		let user = req.uid;
		let pass = req.auth;
		queries.items.getAll(user, pass)
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