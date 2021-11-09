/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function items_get(app) {
	app.get('/items', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		queries.items.getAll(user, pass)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/items/${row.id}`;
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};