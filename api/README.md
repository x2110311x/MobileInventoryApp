This folder contains the source for the web API.

index.js is the starting point for the app.
It can be started by running npm run start (after using npm install to install dependencies)

docUI.js is used to serve the swagger_output.json file for documentation.
It can be run with npm run docs

swagger.js autogenerates the documentation from the source, and serves it as a webpage.
It can be run using npm run swagger-autogen

swagger_output.json contains the swagger definition for API docs
