/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function types_put(app) {
	app.put('/types/', (req, res) => {
		// #swagger.summary = 'Add a new item type'
		let user = req.uid;
		let pass = req.header('X-Auth');
		let name = req.body.name;
		queries.types.add(user, pass, name)
			.then(() => {
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});	
	});
};
