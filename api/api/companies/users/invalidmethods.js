/*jshint esversion: 6 */

module.exports =
function companies_put(app) {
	app.all('/companies/:companyid/users', (req, res) => {
		res.sendStatus(405);
	});
	app.all('/companies/:companyid/users/:userid', (req, res) =>{
		res.sendStatus(405);
	});
};