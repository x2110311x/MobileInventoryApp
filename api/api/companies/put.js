/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function companies_put(app) {
	app.put('/companies', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let name = req.body.name;
		let connectwiseid = req.body.connectwiseid;
		queries.companies.add(user, pass, name, connectwiseid)
			.then(() =>{
				res.sendStatus(200);
			}).catch(err => {
				console.error(err);
				res.sendStatus(500);
			});
	});
};