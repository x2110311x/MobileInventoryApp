// eslint-disable-next-line no-unused-vars
const db = require('../../helpers/db');

module.exports =
function models_post(app) {
	app.post('/models/:modelid', (req, res) => {
		res.send(`Models post: ${req.params.modelid}`);
	});
};