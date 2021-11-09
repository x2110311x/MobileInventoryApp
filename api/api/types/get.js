/*jshint esversion: 6 */
const db = require('../../helpers/db');

module.exports =
function types_get(app) {
	app.get('/types', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, 'SELECT * FROM itemtypes')
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