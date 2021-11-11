/*jshint esversion: 6 */
const express = require('express');
const passport = require('passport');
const db = require('../helpers/db');

const router = express.Router();

router.use(passport.authenticate('oauth-bearer', { session: false }));
router.use(require('../helpers/checkHeaders.js'));
router.use(require('../helpers/setUser.js'));

require('./companies')(router);
require('./items')(router);
require('./orders')(router);
require('./vendors')(router);
require('./models')(router);
require('./types')(router);

router.all('*', function (req, res) {
	res.sendStatus(404);
});

module.exports = router;