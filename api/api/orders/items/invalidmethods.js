/*jshint esversion: 6 */

module.exports =
function companies_put(app) {
	app.all('/orders/:orderid/items', (req, res) => {
		res.sendStatus(405);
	});
	app.all('/orders/:orderid/items/:itemid', (req, res) =>{
		res.sendStatus(405);
	});
};