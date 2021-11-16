/*jshint esversion: 6 */
module.exports =
function orders(app) {
	require('./get')(app);
	require('./getID')(app);
	require('./postID')(app);
	require('./put')(app);
	require('./items')(app);
	require('./invalidmethods')(app);
};