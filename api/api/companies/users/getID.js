/*jshint esversion: 6 */
const queries = require('../../../helpers/db');
const typecheck = require('../../../helpers/typecheck');

module.exports =
function companies_user_getID(app) {
	app.get('/companies/:companyid/users/:userid', (req, res) => {
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
			.then((rows) =>{
				let row = rows[0];
				row.url = `/companies/${companyid}/users/${userid}`;
				res.json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};