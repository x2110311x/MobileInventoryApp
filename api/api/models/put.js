/*jshint esversion: 6 */
// eslint-disable-next-line no-unused-vars
const db = require('../../helpers/db');

module.exports =
function models_put(app) {
	app.put('/models/', (req, res) => {
		res.send('Models put');
	});
};