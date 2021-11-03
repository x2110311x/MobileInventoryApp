var express = require('express')
var router = express.Router();
var passport = require('passport');

router.use(passport.authenticate("oauth-bearer", { session: false }));

require('./companies')(router);
require('./items')(router);
require('./orders')(router);
require('./vendors')(router);

router.get('*', function (req, res) {
    res.status(403).send("Unknown request");
});

module.exports = router;