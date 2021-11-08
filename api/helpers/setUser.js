const fetch = require('node-fetch');

module.exports = 
function setUser(req, res, next){
	fetch('https://graph.microsoft.com/v1.0/me', {
		method: 'get',
		headers: { 'authorization': `Bearer ${req.header('X-Auth')}` },
	})
		.then(response => response.json())
		.then(json => req.uid = json.userPrincipalName.split('@')[0])
		.then(() => next());
};