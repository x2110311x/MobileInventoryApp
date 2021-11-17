/*jshint esversion: 6 */
const getAADGroups = require('../helpers/getGroups');
const { header } = require('express-validator');

module.exports = 
function getGroups(app){
	app.get('/getGroups',[
		header('X-Auth').isString().isLength({ min: 1000 }).trim().escape()
	], (req, res) => {
		let token = req.header('X-Auth');
		console.log(token);
		getAADGroups(token)
			.then((groups) =>{
				res.send(groups);
			}).catch((err) =>{
				if(err instanceof TypeError) res.status(401).send('Invalid token');
				else{
					console.log(err);
					res.sendStatus(500);
				}
			});
	});
};