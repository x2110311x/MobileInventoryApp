/*jshint esversion: 6 */
// eslint-disable-next-line no-unused-vars
const db = require('../../helpers/db');

module.exports =
function companies_postID(app) {
	app.post('/companies/:companyid', (req, res) => {
		res.send(`Company Post: ${req.params.companyid}`);
	});
};