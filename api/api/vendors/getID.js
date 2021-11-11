/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function vendors_getID(app) {
	app.get('/vendors/:vendorid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let vendorid = typecheck.checkInt(req.params.vendorid);
		queries.vendors.getID(user, pass, vendorid)
			.then((row) =>{
				row.url = `/vendors/${row.id}`;
				res.json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};