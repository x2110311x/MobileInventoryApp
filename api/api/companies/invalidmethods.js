/*jshint esversion: 6 */

module.exports =
function companies_put(app) {
	app.all('/companies', (req, res) => {
		res.sendStatus(405);
	});
	app.all('/companies/:companyid', (req, res) =>{
		res.sendStatus(405);
	});
};