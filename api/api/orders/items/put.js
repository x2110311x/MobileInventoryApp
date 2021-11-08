module.exports =
function items_get(app) {
	app.put('/items', (req, res) => {
		res.send('Items');
	});
};