/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function companies_postID(app) {
	app.post('/companies/:companyid', (req, res) => {
		/* 
		#swagger.summary = 'Update a specific company'
		#swagger.parameters['companyid'] = {
			in: 'path',
			description: 'ID of the company to update',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['name'] = {
			in: 'body',
			description: 'Name of the company',
			required: true
		}
		#swagger.parameters['connectwiseid'] = {
			in: 'body',
			description: 'Connectwise Manage ID of the company',
			required: false,
		}
		*/
		let user = req.uid;
		let pass = req.auth;
		let name = req.body.name;

		let connectwiseid = req.body.connectwiseid;

		let companyid = typecheck.checkInt(req.params.companyid);

		if(!companyid || companyid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.companies.update(user, pass, companyid, name, connectwiseid)
			.then(() =>{
				res.sendStatus(200);
			}).catch(err => {
				console.error(err);
				res.sendStatus(500);
			});
	});
};