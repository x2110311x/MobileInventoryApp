/*jshint esversion: 6 */
const queries = require('../../../helpers/db');
const typecheck = require('../../../helpers/typecheck');


module.exports =
function companies_user_postID(app) {
	app.post('/companies/:companyid/users/:userid', (req, res) => {
		/*
		#swagger.summary = 'Edit a specific user'
		#swagger.parameters['first_name'] = {
			in: 'body',
			description: 'First name of the user',
			required: false,
		}
		#swagger.parameters['last_name'] = {
			in: 'body',
			description: 'Last name of the user',
			required: false,
		} 
		#swagger.parameters['companyid'] = {
			in: 'path',
			description: 'ID of the company to lookup to update the user',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['userid'] = {
			in: 'path',
			description: 'ID of the user to update',
			required: true,
			type: 'integer'
		} 
		*/
		let user = req.uid;
		let pass = req.auth;
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
		/* */
		let companyid = typecheck.checkInt(req.params.companyid);
		/**/
		if(!companyid || companyid === undefined){
			res.sendStatus(400);
			return;
		}
		let userid = typecheck.checkInt(req.params.userid);
		/* */
		if(!userid || userid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.companies.users.update(user, pass, companyid, userid, first_name, last_name)
			.then(() =>{
				res.sendStatus(200);
			}).catch(err => {
				console.error(err);
				res.sendStatus(500);
			});
	});
};