/*jshint esversion: 6 */
const queries = require('../../helpers/db');
const typecheck = require('../../helpers/typecheck');
const qr = require('qrcode');
const {createCanvas, registerFont} = require('canvas');

module.exports =
function items_getID(app) {
	app.get('/items/:itemid/qrcode', (req, res) => {
		/*
		#swagger.summary = 'Get the QR Code label for a specific item'
		#swagger.parameters['itemid'] = {
			in: 'path',
			description: 'ID of the item to lookup',
			required: true,
			type: 'integer'
		} 
		*/
		let user = req.uid;
		let pass = req.auth;
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
				let code = createQR(row);
				res.writeHead(200, {
					'Content-Type': 'image/png',
					'Content-Length': code.length
				});
				res.end(code);
			}).catch((err)=> {
				console.error(err);
				res.status(500).send('Server Error');
			});
	});
};

function createQR(row){
	let data = JSON.stringify(row);
	var canvas = createCanvas(300, 375);
	var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'white';
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	registerFont('OpenSans-Regular.ttf', { family: 'Open Sans' });
	var qrCanvas = createCanvas(260,260);
	qr.toCanvas(qrCanvas, data);
	ctx.font = '12pt Open Sans';
	var textDetails = `Item ID: ${row.id}\n` +
			`S/N: ${row.serial_number}\n`+
			`Model: ${row.model}`;
	
	ctx.fillStyle = 'black';
	ctx.fillText(textDetails, 15, 300);
	ctx.drawImage(qrCanvas, 0, 0);
	
	return canvas.toBuffer();
}