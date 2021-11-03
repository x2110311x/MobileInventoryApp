var express = require('express')
var router = express.Router();
var querystring = require('querystring');

require('./login')(router);
require('./tokeninfo')(router);

router.get('*', function (req, res) {
    res.status(404).send("Unknown request");
});

module.exports = router;