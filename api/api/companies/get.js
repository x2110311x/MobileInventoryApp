/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function companies_get(app) {
	app.get('/companies', (req, res) => {
		// #swagger.summary = 'Get all companies'
		let user = req.uid;
		let pass = req.header('X-Auth');
		queries.companies.getAll(user, pass)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/companies/${row.id}`;
				}
				res.status(200).json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};