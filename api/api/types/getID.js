/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function types_getID(app) {
	app.get('/types/:typeid', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let typeid = typecheck.checkInt(req.params.typeid);
		if(!typeid || typeid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.types.getID(user, pass, typeid)
			.then((row) => {
				if (row === undefined){
					res.status(404).send(`Unknown type: ${typeid}`);
					return;
				}
				row.url = `/types/${typeid}`;
				res.status(200).json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};