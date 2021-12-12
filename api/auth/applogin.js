/*jshint esversion: 6 */
const msal = require('@azure/msal-node');
const config = require('../config.json');
const REDIRECT_URI = config.auth.appcallbackURL;

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
	app.get('/appcallback', (req, res) => {
		// #swagger.summary = 'Handle Azure AD OAUTH2.0 callback'
		const tokenRequest = {
			code: req.query.code,
			scopes: ['user.read'],
			redirectUri: REDIRECT_URI,
		};
    
		pca.acquireTokenByCode(tokenRequest).then((response) => {
			let url = `${config.auth.appURI}?access=${response.accessToken}&id=${response.idToken}`;
			res.redirect(url);
		}).catch((error) => {
			res.status(500).send(error);
		});
	});
	app.get('/applogin', (req, res) => {
		// #swagger.summary = 'Redirect to OAUTH2.0 sign in for Android
		const authCodeUrlParameters = {
			scopes: ['user.read'],
			redirectUri: REDIRECT_URI,
		};
    
		pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
			res.redirect(response);
		}).catch((error) => console.err(JSON.stringify(error)));
	});
};