/*jshint esversion: 6 */
const db = require('../../helpers/db');

module.exports =
function vendors_get(app) {
	app.get('/vendors', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, 'SELECT * FROM vendors')
			.then((rows) =>{
				for(var row of rows){
					row.url = `/vendors/${row.id}`;
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};