/*jshint esversion: 6 */

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js'];
const config = require('./config.json');

const doc = {
	info: {
		title: 'Inventory App API'
	},
	host: `${config.SERVER_ADDRESS}:${config.SERVER_PORT_HTTPS}`,      // by default: 'localhost:3000'
	basePath: '',  // by default: '/'
	schemes: ['https'],   // by default: ['http']
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
	require('./docUI.js');
});