/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');

module.exports =
function items_post(app) {
	app.post('/items/:itemid', (req, res) => {
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
		let id = typecheck.checkInt(req.params.id);

		for(var param of [orderNumber, cost, price, typeID, model, checked_in, received, id]){
			if(!param || param === undefined){
				res.sendStatus(400);
				return;
			}
		}
		queries.items.update(user, pass, id, orderNumber, desc, cost, price, typeID, model, checked_in, received)
			.then(() =>{
				res.sendStatus(200);
			}).catch(err => {
				console.error(err);
				res.sendStatus(500);
			});
	});
};