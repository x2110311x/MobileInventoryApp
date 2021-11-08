const msal = require('@azure/msal-node');
const config = require('../config.json');
const REDIRECT_URI = config.auth.callbackURL;

const pconfig = {
	auth: {
		clientId: config.auth.clientID,
		authority: config.auth.authority,
		clientSecret: config.auth.clientSecret
	},
	system:{
		loggerOptions:{
			loggerCallback(loglevel,message){
				console.log(message);
			},
			piiLoggingEnabled: false,
			logLevel:msal.LogLevel.Verbose,
		}
	}
};

const pca = new msal.ConfidentialClientApplication(pconfig);

module.exports =
function login(app) {
	app.get('/callback', (req, res) => {
		const tokenRequest = {
			code: req.query.code,
			scopes: ['user.read'],
			redirectUri: REDIRECT_URI,
		};
    
		pca.acquireTokenByCode(tokenRequest).then((response) => {
			console.log('\nResponse: \n:', response);
			let data = {'accesstoken': response.accessToken, 'idtoken': response.idToken};
			res.status(200).send(data);
		}).catch((error) => {
			console.log(error);
			res.status(500).send(error);
		});
	});
	app.get('/login', (req, res) => {
		const authCodeUrlParameters = {
			scopes: ['user.read'],
			redirectUri: REDIRECT_URI,
		};
    
		pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
			res.redirect(response);
		}).catch((error) => console.log(JSON.stringify(error)));
	});
};