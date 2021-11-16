/*jshint esversion: 6 */

module.exports =
function companies_put(app) {
	app.all('/vendors', (req, res) => {
		res.sendStatus(405);
	});
	app.all('/vendors/:vendorid', (req, res) =>{
		res.sendStatus(405);
	});
};