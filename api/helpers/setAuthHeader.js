/*jshint esversion: 6 */
module.exports = 
function (req, res, next){
	req.auth = req.header('X-Auth');
	next();
};