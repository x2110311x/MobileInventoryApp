/*jshint esversion: 6 */
const getAADGroups = require('../helpers/getGroups');

module.exports = 
function(req, res, next) {
	let token = req.header('X-Auth');
	getAADGroups(token)
		.then((groups) =>{
			req.primaryGroup = groups.topGroup;
			next();
		}).catch((err) =>{
			console.log(err);
			res.sendStatus(500);
			return;
		});
};
