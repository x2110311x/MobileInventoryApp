module.exports =
function users(app) {
	require('./get')(app);
	require('./getID')(app);
	require('./postID')(app);
	require('./put')(app);
};