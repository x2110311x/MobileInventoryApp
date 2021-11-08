const express = require('express');
const passport = require('passport');
const db = require('../helpers/db');

const router = express.Router();

router.use(require('../helpers/checkHeaders.js'));
router.use(passport.authenticate('oauth-bearer', { session: false }));
router.use(require('../helpers/setUser.js'));

require('./companies')(router);
require('./items')(router);
require('./orders')(router);
require('./vendors')(router);
require('./models')(router);
require('./types')(router);

router.get('/test', (req, res) => {
	let pass = req.header('X-Auth');
	db(req.uid, pass, 'SELECT * FROM vendors')
		.then((rows) =>{
			res.json(rows);
		}).catch((err)=> {
			res.status(500).send(err);
		});
});

router.get('*', function (req, res) {
	res.status(403).send('Unknown request');
});

module.exports = router;