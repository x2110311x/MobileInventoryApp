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
	app.get('/applogin', (req, res) => {
		// #swagger.summary = 'Redirect to OAUTH2.0 sign in for Android
		const authCodeUrlParameters = {
			scopes: ['user.read'],
			redirectUri: REDIRECT_URI,
		};
    
		pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
			res.redirect(response);
		}).catch((error) => console.log(JSON.stringify(error)));
	});
};