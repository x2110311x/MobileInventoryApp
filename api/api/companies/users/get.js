/*jshint esversion: 6 */
const db = require('../../../helpers/db');

module.exports =
function companies_user_get(app) {
	app.get('/companies/:companyid/users', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, `SELECT * FROM companyusers WHERE companyid = ${req.params.companyid}`)
			.then((rows) =>{
				// eslint-disable-next-line no-undef
				for(var row in rows){
					// eslint-disable-next-line no-undef
					rows[row].url = `/companies/${req.params.companyid}/users/${rows[row].id}`;
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};