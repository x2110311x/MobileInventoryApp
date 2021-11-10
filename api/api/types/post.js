/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');


module.exports =
function types_post(app) {
	app.post('/types/:typeid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let typeid = typecheck.checkInt(req.params.typeid);
		let name = req.params.name;
		queries.types.update(user, pass, typeid, name)
			.then(() => {
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});	});
};