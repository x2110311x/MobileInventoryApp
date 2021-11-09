/*jshint esversion: 6 */
const db = require('../../helpers/db');

module.exports =
function models_getID(app) {
	app.get('/models/:modelid', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, `SELECT * FROM models WHERE id = ${req.params.modelid}`)
			.then((rows) =>{
				let row = rows[0];
				row.url = `/models/${row.id}`;
				res.json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};