module.exports =
function vendors_put(app) {
	app.put('/vendors', (req, res) => {
		res.send('vendors');
	});
};