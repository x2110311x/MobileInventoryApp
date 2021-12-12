/*jshint esversion: 6 */
module.exports =
function items(app) {
	require('./get')(app);
	require('./getID')(app);
	require('./postID')(app);
	require('./qrCode')(app);
	require('./invalidmethods')(app);
};