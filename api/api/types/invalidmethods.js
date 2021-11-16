/*jshint esversion: 6 */

module.exports =
function companies_put(app) {
	app.all('/types', (req, res) => {
		res.sendStatus(405);
	});
	app.all('/types/:typeid', (req, res) =>{
		res.sendStatus(405);
	});
};