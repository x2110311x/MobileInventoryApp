/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function companies_put(app) {
	app.put('/companies', (req, res) => {
		/*
		#swagger.summary = 'Add a new company'
		#swagger.parameters['name'] = {
			in: 'body',
			description: 'Name of the company',
			required: true,
			type: 'string'
		}
		#swagger.parameters['connectwiseid'] = {
			in: 'body',
			description: 'Connectwise Manage ID of the company',
			required: false,
		} 
		*/
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