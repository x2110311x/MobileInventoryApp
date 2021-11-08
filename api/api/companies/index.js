module.exports =
function companies(app) {
	require('./get')(app);
	require('./getID')(app);
	require('./postID')(app);
	require('./put')(app);
	require('./users')(app);
};