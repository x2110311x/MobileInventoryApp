/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function models_put(app) {
	app.put('/models/', (req, res) => {
		// #swagger.summary = 'Add a new model'
		let user = req.uid;
		let pass = req.header('X-Auth');
		let typeid = typecheck.checkInt(req.body.typeid);
		let name = req.body.name;
		queries.models.add(user, pass, name, typeid)
			.then(() =>{
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};