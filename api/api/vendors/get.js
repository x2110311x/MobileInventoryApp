/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function vendors_get(app) {
	app.get('/vendors', (req, res) => {
		// #swagger.summary = 'Get all vendors'
		let user = req.uid;
		let pass = req.auth;
		queries.vendors.getAll(user, pass)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/vendors/${row.id}`;
				}
				res.status(200).json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};