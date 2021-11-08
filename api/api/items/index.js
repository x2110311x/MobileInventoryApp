module.exports =
function items(app) {
	require('./get')(app);
	require('./getID')(app);
	require('./post')(app);
};