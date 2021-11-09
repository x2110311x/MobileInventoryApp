/*jshint esversion: 6 */
module.exports =
function orders_postID(app) {
	app.post('/orders/:orderid', (req, res) => {
		res.send(`Order: ${req.params.orderid}`);
	});
};