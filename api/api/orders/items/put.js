/*jshint esversion: 6 */
const queries = require('../../../helpers/db');
const typecheck = require('../../../helpers/typecheck');

module.exports =
function items_get(app) {
	app.put('/items', (req, res) => {
		let user = req.uid;
		let pass = req.header('X-Auth');
		let orderNumber = req.body.orderNumber;
		let desc = req.body.desc;
		let cost = typecheck.checkFloat(req.body.cost);
		let price = typecheck.checkFloat(req.body.price);
		let typeID = typecheck.checkInt(req.body.typeID);
		let model = typecheck.checkInt(req.body.model);
		let checked_in = + typecheck.checkBool(req.body.checked_in);
		let received = + typecheck.checkBool(req.body.received);

		for(var param of [orderNumber, cost, price, typeID, model, checked_in, received]){
			if(!param || param === undefined){
				res.sendStatus(400);
				return;
			}
		}
		queries.orders.items.add(user, pass, orderNumber, desc, cost, price, typeID, model, checked_in, received)
			.then(() =>{
				res.sendStatus(200);
			}).catch(err => {
				console.error(err);
				res.sendStatus(500);
			});	});
};