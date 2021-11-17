/*jshint esversion: 6 */
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { header } = require('express-validator');

router.use(passport.authenticate('oauth-bearer', { session: false }));
router.use(	header('X-Auth').isString().isLength({ min: 1000 }).trim().escape());
router.use(require('../helpers/checkHeaders.js'));
router.use(require('../helpers/setUser.js'));
router.use(require('../helpers/setGroup.js'));

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