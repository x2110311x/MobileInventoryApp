/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function types_get(app) {
	app.get('/types', (req, res) => {
		// #swagger.summary = 'Get all item types'
		let user = req.uid;
		let pass = req.auth;
		queries.types.getAll(user, pass)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/types/${row.typeid}`;
				}
				res.status(200).json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};