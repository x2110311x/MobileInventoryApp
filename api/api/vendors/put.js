/*jshint esversion: 6 */
const queries = require('../../helpers/db');
// eslint-disable-next-line no-unused-vars
const typecheck = require('../../helpers/typecheck');

module.exports =
function vendors_put(app) {
	app.put('/vendors', (req, res) => {
		// #swagger.summary = 'Add a new vendor'
		let user = req.uid;
		let pass = req.auth;
		let name = req.body.name;
		let accNumber = req.body.account_number;
		queries.vendors.add(user, pass, name, accNumber)
			.then(() =>{
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};