/*jshint esversion: 6 */
module.exports =
function orders_put(app) {
	app.put('/orders', (req, res) => {
		res.send('Orders');
	});
};