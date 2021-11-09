/*jshint esversion: 6 */
module.exports =
function vendors_postID(app) {
	app.post('/vendors/:vendorid', (req, res) => {
		res.send(`vendorid: ${req.params.vendorid}`);
	});
};