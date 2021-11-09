/*jshint esversion: 6 */
// eslint-disable-next-line no-unused-vars
const db = require('../../helpers/db');

module.exports =
function types_post(app) {
	app.post('/types/:typeid', (req, res) => {
		res.send(`types post: ${req.params.typeid}`);
	});
};