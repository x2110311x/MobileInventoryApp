const db = require('../../helpers/db');

module.exports =
function companies_get(app) {
	app.get('/companies', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, 'SELECT * FROM companies')
			.then((rows) =>{
				// eslint-disable-next-line no-undef
				for(row in rows){
					// eslint-disable-next-line no-undef
					rows[row]['url'] = `/companies/${rows[row]['id']}`;
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};