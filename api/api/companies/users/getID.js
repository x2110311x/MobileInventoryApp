/*jshint esversion: 6 */
const queries = require('../../../helpers/db');
const typecheck = require('../../../helpers/typecheck');

module.exports =
function companies_user_getID(app) {
	app.get('/companies/:companyid/users/:userid', (req, res) => {
		/*
		#swagger.summary = 'Get a specific user for a specific company'
		#swagger.parameters['companyid'] = {
			in: 'path',
			description: 'ID of the company to lookup the user',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['userid'] = {
			in: 'path',
			description: 'ID of the user to lookup',
			required: true,
			type: 'integer'
		} 
		*/
		let user = req.uid;
		let pass = req.header('X-Auth');
		let companyid = typecheck.checkInt(req.params.companyid);
		if(!companyid || companyid === undefined){
			res.sendStatus(400);
			return;
		}
		let userid = typecheck.checkInt(req.params.userid);
		if(!userid || userid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.companies.users.getID(user, pass, companyid, userid)
			.then((row) =>{
				if(row === undefined){
					res.status(404).send(`Unknown user: ${userid}`);
					return;
				}
				row.url = `/companies/${companyid}/users/${userid}`;
				res.status(200).json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};