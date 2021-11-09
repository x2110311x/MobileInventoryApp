/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function companies_get(app) {
	app.get('/companies', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		queries.companies.getAll(user, pass)
			.then((rows) =>{
				for(var row in rows){
					rows[row].url = `/companies/${rows[row].id}`;
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};