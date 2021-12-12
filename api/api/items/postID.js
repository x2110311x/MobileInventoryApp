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
		let received = (req.body.received != undefined ? typecheck.checkBool(req.body.received) : false);
		let checkedout = (req.body.checked_out != undefined ? typecheck.checkBool(req.body.checked_out) : false);
		let serial = typecheck.checkString(req.body.serial_number);
		let user = req.uid;
		let pass = req.auth;

		let itemid = typecheck.checkInt(req.params.itemid);
		
		if(req.body.received != undefined){
			console.log('receive');
			queries.items.receive(user, pass, itemid, received)
				.then(() =>{
					res.sendStatus(200);
				}).catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		} else if(req.body.checked_out != undefined){
			if(checkedout){
				console.log('checkout');
				console.log(req.body);
				let company = typecheck.checkInt(req.body.company);
				let cUser = typecheck.checkInt(req.body.user);
				let ticket = typecheck.checkInt(req.body.ticket);
				if(company == undefined || cUser == undefined) {
					res.sendStatus(400);
					return;
				}
				queries.items.checkOut(user, pass, itemid, company, cUser, ticket)
					.then(() =>{
						res.sendStatus(200);
					}).catch(err => {
						console.error(err);
						res.sendStatus(500);
					});
			} else {
				console.log('checkin');
				queries.items.checkIn(user, pass, itemid)
					.then(() =>{
						res.sendStatus(200);
					}).catch(err => {
						console.error(err);
						res.sendStatus(500);
					});
			}
		} else if (req.body.serial_number != undefined){
			console.log('serial');
			queries.items.updateSerial(user, pass, itemid, serial)
				.then(() =>{
					res.sendStatus(200);
				}).catch(err => {
					console.error(err);
					res.sendStatus(500);
				});
		} else{
			res.sendStatus(400);
		}
	});
};