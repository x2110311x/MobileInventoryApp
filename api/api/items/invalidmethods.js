/*jshint esversion: 6 */

module.exports =
function companies_put(app) {
	app.all('/items', (req, res) => {
		res.sendStatus(405);
	});
	app.all('/items/:itemid', (req, res) =>{
		res.sendStatus(405);
	});
};