/*jshint esversion: 6 */

module.exports = 
function getGroups(app){
	app.get('/loginstatus',[
		require('../helpers/checkHeaders'),
		require('../helpers/setAuthHeader')
	], (req, res) => {
		let token = req.auth;
		fetch('https://graph.microsoft.com/v1.0/me', {
			method: 'get',
			headers: { 'authorization': `Bearer ${token}` },
		})
			.then(response => response.json())
			.then(json => {
				json.userPrincipalName.split('@');
				res.send(true);
			})
			.catch(() => {
				res.send(false);
			});
	});
};