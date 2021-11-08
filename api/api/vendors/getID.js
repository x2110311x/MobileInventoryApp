module.exports =
function vendors_getID(app) {
	app.get('/vendors/:vendorid', (req, res) => {
		res.send(`Vendor: ${req.params.vendorid}`);
	});
};