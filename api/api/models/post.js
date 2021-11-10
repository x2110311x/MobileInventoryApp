/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function models_post(app) {
	app.post('/models/:modelid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let modelid = typecheck.checkInt(req.params.modelid);
		let typeid = typecheck.checkInt(req.body.typeid);
		let name = req.body.name;
		queries.models.update(user, pass, modelid, name, typeid)
			.then(() =>{
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};