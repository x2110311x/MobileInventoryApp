/*jshint esversion: 6 */
const db = require('../../helpers/db');

module.exports =
function vendors_get(app) {
	app.get('/vendors', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, 'SELECT * FROM vendors')
			.then((rows) =>{
				// eslint-disable-next-line no-undef
				for(var row in rows){
					// eslint-disable-next-line no-undef
					rows[row].url = `/vendors/${rows[row].id}`;
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};