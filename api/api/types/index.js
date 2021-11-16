/*jshint esversion: 6 */
module.exports =
function items(app) {
	require('./get')(app);
	require('./getID')(app);
	require('./put')(app);
	require('./post')(app);
	require('./invalidmethods')(app);
};