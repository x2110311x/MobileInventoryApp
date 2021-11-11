/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function models_getID(app) {
	app.get('/models/:modelid', (req, res) => {
		// #swagger.summary = 'Get a specfic model'
		let user = req.uid;
		let pass = req.header('X-Auth');
		let modelid = typecheck.checkInt(req.params.modelid);
		if(!modelid || modelid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.models.getID(user, pass, modelid)
			.then((row) =>{
				if(row === undefined){
					res.status(404).send(`Unknown model ${modelid}`);
					return;
				}
				row.url = `/models/${row.id}`;
				res.status(200).json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};