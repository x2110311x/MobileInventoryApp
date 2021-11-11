/*jshint esversion: 6 */
const queries = require('../../../helpers/db');
const typecheck = require('../../../helpers/typecheck');

module.exports =
function companies_users_put(app) {
	app.put('/companies/:companyid/users', (req, res) => {
		/*
		#swagger.summary = 'Add a new user to a specific company'
		#swagger.parameters['first_name'] = {
			in: 'body',
			description: 'First name of the user',
			required: true,
		}
		#swagger.parameters['last_name'] = {
			in: 'body',
			description: 'Last name of the user',
			required: true,
		} 
		#swagger.parameters['companyid'] = {
			in: 'path',
			description: 'ID of the company to lookup to add the user',
			required: true,
			type: 'integer'
		} 
		*/
		let user = req.uid;
		let pass = req.header('X-Auth');
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		let companyid = typecheck.checkInt(req.params.companyid);
		if(!companyid || companyid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.companies.users.add(user, pass, companyid, first_name, last_name)
			.then(() =>{
				res.sendStatus(200);
			}).catch(err => {
				console.error(err);
				res.sendStatus(500);
			});
	});
};