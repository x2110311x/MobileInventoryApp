/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function models_get(app) {
	app.get('/models', (req, res) => {
		// #swagger.summary = 'Get all models'
		let user = req.uid;
		let pass = req.header('X-Auth');
		queries.models.getAll(user, pass, 'SELECT * FROM models')
			.then((rows) =>{
				for(var row of rows){
					row.url = `/models/${row.id}`;
				}
				res.status(200).json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};