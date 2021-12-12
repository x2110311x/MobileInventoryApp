/*jshint esversion: 6 */
const getAADGroups = require('../helpers/getGroups');

module.exports = 
function getGroups(app){
	app.get('/getGroups',[
		require('../helpers/checkHeaders'),
		require('../helpers/setAuthHeader')
	], (req, res) => {
		let token = req.auth;
		getAADGroups(token)
			.then((groups) =>{
				res.send(groups);
			}).catch((err) =>{
				if(err instanceof TypeError) res.status(401).send('Invalid token');
				else{
					console.err(err);
					res.sendStatus(500);
				}
			});
	});
};