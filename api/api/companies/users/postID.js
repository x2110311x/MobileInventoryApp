/*jshint esversion: 6 */
// eslint-disable-next-line no-unused-vars
const queries = require('../../../helpers/db');

module.exports =
function companies_user_postID(app) {
	app.post('/companies/:companyid/users/:userid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let first_name = req.body.first_name;
		let last_name = req.body.last_name;
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
		queries.companies.user.update(user, pass, companyid, userid, first_name, last_name)
			.then(() =>{
				res.sendStatus(200);
			}).catch(err => {
				console.error(err);
				res.sendStatus(500);
			});
	});
};