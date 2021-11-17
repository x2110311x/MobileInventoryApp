/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function companies_getID(app) {
	app.get('/companies/:companyid', (req, res) => {
		/*
		#swagger.summary = 'Get a specific company'
		#swagger.parameters['companyid'] = {
			in: 'path',
			description: 'ID of the company to lookup',
			required: true,
			type: 'integer'
		}
		*/
		let user = req.uid;
		let pass = req.auth;
		let companyid = typecheck.checkInt(req.params.companyid);
		if(!companyid || companyid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.companies.getID(user, pass, companyid)
			.then((row) =>{
				if(row === undefined){
					res.status(404).send(`Unknown Company: ${companyid}`);
					return;
				}
				row.url = `/companies/${row.id}`;
				res.status(200).json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};