/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function items_get(app) {
	app.get('/items', (req, res) => {
		// #swagger.summary = 'Get all items'
		let user = req.uid;
		let pass = req.auth;
		let receiveUndef = req.query.received == undefined;
		let received = (req.query.received != undefined ? typecheck.checkBool(req.query.received) : false);
		let checkedout = (req.query.checkedout != undefined ? typecheck.checkBool(req.query.checkedout) : false);
		if(received && checkedout){
			res.sendStatus(400);
			return;
		}
		if(received){
			queries.items.getReceived(user, pass)
				.then((rows) =>{
					for(var row of rows){
						row.url = `/items/${row.id}`;
					}
					res.status(200).json(rows);
				}).catch((err)=> {
					console.error(err);
					res.status(500).send('Server Error');
				});
		} else if(checkedout){
			queries.items.getCheckedOut(user, pass)
				.then((rows) =>{
					for(var row of rows){
						row.url = `/items/${row.id}`;
					}
					res.status(200).json(rows);
				}).catch((err)=> {
					console.error(err);
					res.status(500).send('Server Error');
				});
		} else if(receiveUndef){
			queries.items.getAll(user, pass)
				.then((rows) =>{
					for(var row of rows){
						row.url = `/items/${row.id}`;
					}
					res.status(200).json(rows);
				}).catch((err)=> {
					console.error(err);
					res.status(500).send('Server Error');
				});
		} else {
			queries.items.getNotReceived(user, pass)
				.then((rows) =>{
					for(var row of rows){
						row.url = `/items/${row.id}`;
					}
					res.status(200).json(rows);
				}).catch((err)=> {
					console.error(err);
					res.status(500).send('Server Error');
				});
		}
	});
};