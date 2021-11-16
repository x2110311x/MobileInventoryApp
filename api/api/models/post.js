/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function models_post(app) {
	app.post('/models/:modelid', (req, res) => {
		/*
		#swagger.summary = 'Update a specific model'
		#swagger.parameters['model'] = {
			in: 'path',
			description: 'ID of the model to update',
			required: true,
			type: 'integer'
		}
		#swagger.parameters['typeID'] = {
			in: 'body',
			description: 'ID for the type of the model',
			required: false,
			type: 'integer'
		}
		#swagger.parameters['name'] = {
			in: 'body',
			description: 'Name for the model',
			required: false,
			type: 'string'
		}
		*/
		let user = req.uid;
		let pass = req.header('X-Auth');
		let name = req.body.name;
		let typeid = typecheck.checkInt(req.body.typeid);
		let modelid = typecheck.checkInt(req.params.modelid);
		queries.models.update(user, pass, modelid, name, typeid)
			.then(() =>{
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};