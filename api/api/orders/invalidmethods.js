/*jshint esversion: 6 */

module.exports =
function companies_put(app) {
	app.all('/orders', (req, res) => {
		res.sendStatus(405);
	});
	app.all('/orders/:orderid', (req, res) =>{
		res.sendStatus(405);
	});
};