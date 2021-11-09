/*jshint esversion: 6 */
const queries = require('../../../helpers/db');

module.exports =
function companies_user_getID(app) {
	app.get('/companies/:companyid/users/:userid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let companyid = parseInt(req.params.companyid);
		if (isNaN(companyid)){
			res.sendStatus(400);
			return;
		} 
		let userid = parseInt(req.params.userid);
		if (isNaN(userid)) {
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