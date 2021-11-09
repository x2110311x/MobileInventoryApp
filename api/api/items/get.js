/*jshint esversion: 6 */
/* eslint-disable no-undef */
const db = require('../../helpers/db');

module.exports =
function items_get(app) {
	app.get('/items', (req, res) => {
		let pass = req.header('X-Auth');
		db(req.uid, pass, 'SELECT * FROM items')
			.then((rows) =>{
				for(var row in rows){
					rows[row].url = `/items/${rows[row].id}`;
					if (rows[row].received == {'type':'Buffer','data':[49]}){
						rows[row].received = true;
					} else {
						rows[row].received = false;                    
					}
					if (rows[row].checked_out == {'type':'Buffer','data':[49]}){
						rows[row].checked_out = true;
					} else {
						rows[row].checked_out = false;                    
					}
				}
				res.json(rows);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};