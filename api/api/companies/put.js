/*jshint esversion: 6 */
// eslint-disable-next-line no-unused-vars
const db = require('../../helpers/db');

module.exports =
function companies_put(app) {
	app.put('/companies', (req, res) => {
		res.send('Companies put');
	});
};