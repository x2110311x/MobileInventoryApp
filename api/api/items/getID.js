/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function items_getID(app) {
	app.get('/items/:itemid', (req, res) => {
		/*
		#swagger.summary = 'Get a specific item'
		#swagger.parameters['itemid'] = {
			in: 'path',
			description: 'ID of the item to lookup',
			required: true,
			type: 'integer'
		} 
		*/
		let user = req.uid;
		let pass = req.header('X-Auth');
		let itemid = typecheck.checkInt(req.params.itemid);
		if(!itemid || itemid === undefined){
			res.sendStatus(400);
			return;
		}
		queries.items.getID(user, pass, itemid)
			.then((row) =>{
				if(row === undefined){
					res.status(404).send(`Unknown Item: ${itemid}`);
					return;
				}
				row.url = `/items/${row.id}`;
				res.status(200).json(row);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};