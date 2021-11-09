/*jshint esversion: 6 */
// eslint-disable-next-line no-unused-vars
const queries = require('../../helpers/db');

module.exports =
function companies_postID(app) {
	app.post('/companies/:companyid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let name = req.body.name;
		let connectwiseid = req.body.connectwiseid;
		let companyid = parseInt(req.params.companyid);
		if (isNaN(companyid)){
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