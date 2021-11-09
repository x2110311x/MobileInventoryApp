/*jshint esversion: 6 */
// eslint-disable-next-line no-unused-vars
const db = require('../../../helpers/db');

module.exports =
function companies_users_put(app) {
	app.put('/companies/:companyid/users', (req, res) => {
		res.send(`Company: ${req.params.companyid}'s Users'`);
	});
};