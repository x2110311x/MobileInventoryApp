/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function vendors_postID(app) {
	app.post('/vendors/:vendorid', (req, res) => {
		// #swagger.summary = 'Update a vendor'
		let user = req.uid;
		let pass = req.header('X-Auth');
		let name = req.body.name;
		let accNumber = req.body.account_number;
		let vendorid = typecheck(req.params.vendorid);
		queries.vendors.add(user, pass, vendorid, name, accNumber)
			.then(() =>{
				res.sendStatus(200);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});	});
};