/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();

require('./login')(router);
require('./applogin')(router);
require('./loginstatus')(router);
router.use('/tokencheck', require('./tokencheck'));

require('./getGroups.js')(router);

router.all('*', function (req, res) {
	res.status(404).send('Unknown request');
});

module.exports = router;