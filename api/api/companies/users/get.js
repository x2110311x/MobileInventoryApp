/*jshint esversion: 6 */
const queries = require('../../../helpers/db');
const typecheck = require('../../../helpers/typecheck');

module.exports =
function companies_user_get(app) {
	app.get('/companies/:companyid/users', (req, res) => {
		/* 
		#swagger.summary = 'Get all users for a specific company'
		#swagger.parameters['companyid'] = {
			in: 'path',
			description: 'ID of the company to lookup users for',
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
		queries.companies.users.getAll(user, pass, companyid)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/companies/${companyid}/users/${row.id}`;
				}
				res.status(200).json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};