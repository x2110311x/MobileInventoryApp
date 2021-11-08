var express = require('express');
var router = express.Router();

require('./login')(router);
router.use('/tokencheck', require('./tokencheck'));

router.get('*', function (req, res) {
	res.status(404).send('Unknown request');
});

module.exports = router;