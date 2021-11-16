/*jshint esversion: 6 */

module.exports =
function companies_put(app) {
	app.all('/models', (req, res) => {
		res.sendStatus(405);
	});
	app.all('/models/:modelid', (req, res) =>{
		res.sendStatus(405);
	});
};