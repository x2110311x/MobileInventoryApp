/*jshint esversion: 6 */
// eslint-disable-next-line no-unused-vars
const db = require('../../../helpers/db');

module.exports =
function companies_user_postID(app) {
	app.post('/companies/:companyid/users/:userid', (req, res) => {
		res.send(`Company: ${req.params.companyid}'s User: ${req.params.userid}`);
	});
};