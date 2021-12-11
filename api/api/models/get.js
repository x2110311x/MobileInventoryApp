/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function models_get(app) {
	app.get('/models', (req, res) => {
		// #swagger.summary = 'Get all models'
		let user = req.uid;
		let pass = req.auth;
		let typeLookup = (req.query.typeid != undefined ? true : false);
		let typeid = typecheck.checkInt(req.query.typeid);
		if (typeLookup) {
			queries.models.getAllByType(user, pass, typeid)
				.then((rows) =>{
					for(var row of rows){
						row.url = `/models/${row.id}`;
					}
					res.status(200).json(rows);
				}).catch((err)=> {
					console.error(err);
					res.status(500).send('Server Error');
				});
		} else {
			queries.models.getAll(user, pass)
				.then((rows) =>{
					for(var row of rows){
						row.url = `/models/${row.id}`;
					}
					res.status(200).json(rows);
				}).catch((err)=> {
					console.error(err);
					res.status(500).send('Server Error');
				});
		}
	});
};