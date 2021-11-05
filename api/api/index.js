const express = require('express')
const router = express.Router();
const passport = require('passport');
const fetch = require('node-fetch');
const config = require("../config.json");
const db = require('../helpers/db');
router.use(passport.authenticate("oauth-bearer", { session: false }));

router.use(
    function setUser(req, res, next){
        fetch('https://graph.microsoft.com/v1.0/me', {
        method: 'get',
        headers: { 'authorization': `Bearer ${req.header('X-Auth')}` },
        })
        .then(response => response.json())
        .then(json => req.uid = json.userPrincipalName.split('@')[0])
        .then(() => next());
    }
);

require('./companies')(router);
require('./items')(router);
require('./orders')(router);
require('./vendors')(router);

router.get('/test', (req, res) => {
    let pass = req.header('X-Auth');
    db(req.uid, pass, "SELECT * FROM vendors")
    .then((rows) =>{
        res.json(rows);
    }).catch((err)=> {
        res.status(500).send(err);
    });
});

router.get('*', function (req, res) {
    res.status(403).send("Unknown request");
});

module.exports = router;