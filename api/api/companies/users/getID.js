const db = require('../../../helpers/db');

module.exports =
function companies_user_getID(app) {
	app.get('/companies/:companyid/users/:userid', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, `SELECT * FROM companyusers WHERE companyid = ${req.params.companyid} AND id=${req.params.userid}`)
			.then((rows) =>{
				let row = rows[0];
				row['url'] = `/companies/${req.params.companyid}/users/${row['id']}`;
				res.json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};