/*jshint esversion: 6 */
const fetch = require('node-fetch');
var express = require('express');
var router = express.Router();
var basicAuth = require('express-basic-auth');

router.use(basicAuth( { authorizer: myAuthorizer, authorizeAsync: true } ));

router.get('/', function (req, res){
	// #swagger.summary = 'Validate a token for a specific user. Used for database authentication'
	res.sendStatus(200);
});

function myAuthorizer(username, password, cb) {
	var uid;
	fetch('https://graph.microsoft.com/v1.0/me', {
		method: 'get',
		headers: { 'authorization': `Bearer ${password}` },
	})
		.then(response => response.json())
		.then(json => {
			uid = json.userPrincipalName.split('@')[0];
			return cb(null, basicAuth.safeCompare(username, uid));
		})
		.catch((error) => {
			console.error(error);
			return false;
		});
}

module.exports = router;