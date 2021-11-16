/*jshint esversion: 6 */
const getAADGroups = require('../helpers/getGroups');

module.exports = 
function getGroups(app){
	app.get('/getGroups', (req, res) => {
		let token = req.header('X-Auth');
		getAADGroups(token)
			.then((groups) =>{
				res.send(groups);
			}).catch((err) =>{
				console.log(err);
				res.sendStatus(500);
			});
	});
};