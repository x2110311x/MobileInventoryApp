/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function items_post(app) {
	app.post('/items/:itemid', (req, res) => {
		/*
		#swagger.summary = 'Update a specific item'
		#swagger.parameters['orderNumber'] = {
			in: 'body',
			description: 'Order number for the order where this item was purchased',
			required: false,
			type: 'string'
		}
		#swagger.parameters['desc'] = {
			in: 'body',
			description: 'JSON Description of item',
			required: false,
			type: 'object'
		}
		#swagger.parameters['cost'] = {
			in: 'body',
			description: 'Purchase cost of the item',
			required: false,
			type: 'number'
		}
		#swagger.parameters['price'] = {
			in: 'body',
			description: 'Sell price of the item',
			required: false,
			type: 'number'
		}
		#swagger.parameters['typeID'] = {
			in: 'body',
			description: 'ID for the type of the item',
			required: false,
			type: 'integer'
		}
		#swagger.parameters['model'] = {
			in: 'body',
			description: 'ID for the model of the item',
			required: false,
			type: 'integer'
		}
		#swagger.parameters['checked_out'] = {
			in: 'body',
			description: 'Whether the item is checked out (1 for true, 0 for false)',
			required: false,
			type: 'integer'
		}
		#swagger.parameters['received'] = {
			in: 'body',
			description: 'Whether the item has been received (1 for true, 0 for false)',
			required: false,
			type: 'integer'
		}
		#swagger.parameters['itemid'] = {
			in: 'path',
			description: 'ID of the item to update',
			required: true,
			type: 'integer'
		}
		*/
		let received = (req.query.received != undefined ? typecheck.checkBool(req.query.received) : false);
		let checkedout = (req.query.checkedout != undefined ? typecheck.checkBool(req.query.checkedout) : false);
		let serial = typecheck.checkString(req.body.serial_number);
		let user = req.uid;
		let pass = req.auth;

		let itemid = typecheck.checkInt(req.params.itemid);
		
		if(req.query.received != undefined){
			queries.items.receive(user, pass, itemid, received)
				.then(() =>{
					res.sendStatus(200);
				}).catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		} else if(req.query.checkedout != undefined){
			queries.items.checkInOut(user, pass, itemid, checkedout)
				.then(() =>{
					res.sendStatus(200);
				}).catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		} else if (req.query.serial_number != undefined){
			queries.items.updateSerial(user, pass, itemid, serial)
				.then(() =>{
					res.sendStatus(200);
				}).catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		}

		/*queries.items.update(user, pass, itemid, orderNumber, desc, cost, price, typeID, model, checked_out, received)
			.then(() =>{
				res.sendStatus(200);
			}).catch(err => {
				console.error(err);
				res.sendStatus(500);
			});*/
	});
};