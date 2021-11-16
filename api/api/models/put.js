/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function models_put(app) {
	app.put('/models/', (req, res) => {
		/*
		#swagger.summary = 'Add a new model'
		#swagger.parameters['typeID'] = {
			in: 'body',
			description: 'ID for the type of the model',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['name'] = {
			in: 'body',
			description: 'Name for the model',
			required: true,
			type: 'string'
		}
		*/
		let user = req.uid;
		let pass = req.header('X-Auth');
		let name = req.body.name;
		let typeid = typecheck.checkInt(req.body.typeid);
		queries.models.add(user, pass, name, typeid)
			.then(() =>{
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};