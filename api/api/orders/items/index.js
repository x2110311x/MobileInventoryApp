/*jshint esversion: 6 */
module.exports =
function items(app) {
	require('./get')(app);
	require('./put')(app);
	require('./invalidmethods')(app);
};