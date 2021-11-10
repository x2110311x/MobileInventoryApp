/*jshint esversion: 6 */
const queries = require('../../helpers/db');

module.exports =
function types_get(app) {
	app.get('/types', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		queries.types.getAll(user, pass)
			.then((rows) =>{
				for(var row of rows){
					row.url = `/types/${row.typeid}`;
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};