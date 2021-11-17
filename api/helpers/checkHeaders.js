/*jshint esversion: 6 */
const { header } = require('express-validator');

module.exports = 
function checkheaders(req, res, next){
	if (!req.header('X-Auth')){
		res.sendStatus(400);
		return;
	}
	return header('X-Auth').isString().isLength({ min: 1000 }).trim().escape()(res, req, next);
};