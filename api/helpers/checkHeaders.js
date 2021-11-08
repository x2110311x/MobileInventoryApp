module.exports = 
function checkheaders(req, res, next){
	if (!req.header('X-Auth')){
		res.sendStatus(400);
		return;
	}
	next();
};